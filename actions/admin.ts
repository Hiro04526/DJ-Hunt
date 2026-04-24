"use server"

import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "@/lib/supabase/admin"

// --- CONFIGURATION ---
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

const TABLE_SONGS = "Hitlist Songs"
const FUTURE_SONGS = "Future Hitlist Songs"
const TABLE_VOTES = "Hitlist Votes"
const TABLE_METADATA = "system_metadata"

const REFERENCE_MONDAY = new Date("2026-02-02T08:00:00+08:00")

type ListType = 'active' | 'future'

const resolveTable = (type: ListType) => {
  return type === 'future' ? FUTURE_SONGS : TABLE_SONGS
}

// ==========================================
//              HELPER: SPOTIFY
// ==========================================
async function getSpotifyToken() {
  try {
    const auth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64");
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.access_token;
  } catch (err) {
    console.error("Spotify Fetch Network Error:", err);
    return null;
  }
}

// ==========================================
//              ADMIN ACTIONS
// ==========================================

export async function searchSongsAction(query: string) {
  try {
    const token = await getSpotifyToken()
    if (!token) throw new Error("Failed to get Spotify token")

    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    const data = await res.json()
    if (!data.tracks) return { success: true, tracks: [] }

    const tracks = data.tracks.items.map((t: any) => ({
      title: t.name,
      artist: t.artists.map((a: any) => a.name).join(", "),
      image_url: t.album.images[0]?.url,
      spotify_link: t.external_urls.spotify,
      votes: 0
    }))

    return { success: true, tracks }
  } catch (error: any) {
    return { success: false, error: "Failed to search Spotify" }
  }
}

export async function addSongServerAction(song: any, type: ListType = 'active') {
  try {
    const tableName = resolveTable(type)
    if (!song.title || !song.artist) return { success: false, error: "Invalid song data" }

    const { id, sort_order, ...songData } = song 
    if (songData.votes === undefined) songData.votes = 0

    const { data: maxItems } = await supabaseAdmin
        .from(tableName)
        .select("sort_order")
        .not("sort_order", "is", null) 
        .order("sort_order", { ascending: false })
        .limit(1)

    const currentMax = maxItems?.[0]?.sort_order ?? 0
    const nextOrder = Number(currentMax) + 1

    const finalPayload = { ...songData, sort_order: nextOrder }

    const { error } = await supabaseAdmin.from(tableName).insert([finalPayload])
    if (error) throw error

    revalidatePath("/admin/hitlist")
    if (type === 'active') revalidatePath("/polls/hitlist")
      
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getHitlistSongsAction(type: ListType = 'active') {
    try {
        const tableName = resolveTable(type)
        const { data: songs, error } = await supabaseAdmin
            .from(tableName)
            .select("*")
            .order("sort_order", { ascending: true }) 
        
        if (error) throw error
        return { success: true, songs }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function deleteSongAction(id: number, type: ListType = 'active') {
    try {
        const tableName = resolveTable(type)
        const { error } = await supabaseAdmin.from(tableName).delete().eq("id", id)
        if (error) throw error

        revalidatePath("/admin/hitlist")
        if (type === 'active') revalidatePath("/polls/hitlist")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function deleteAllSongsAction(type: ListType = 'active') {
  try {
    const tableName = resolveTable(type)
    const { error } = await supabaseAdmin.from(tableName).delete().gt("id", 0);
    if (error) throw error;

    revalidatePath("/admin/hitlist");
    if (type === 'active') revalidatePath("/polls/hitlist");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateSongOrderAction(items: { id: number }[], type: ListType = 'active') {
    try {
        const tableName = resolveTable(type)
        const updates = items.map((item, index) => {
            return supabaseAdmin.from(tableName).update({ sort_order: index }).eq('id', item.id)
        })
        await Promise.all(updates)
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function exportHitlistToCSV() {
  try {
    const { data, error } = await supabaseAdmin
      .from(TABLE_SONGS)
      .select("title, artist, votes")
      .order("votes", { ascending: false })
      .order("sort_order", { ascending: true })
      .limit(20)

    if (error) throw error

    const headers = ["Title", "Artist", "Votes"]
    const csvRows = [headers.join(",")]

    for (const row of data) {
      const title = `"${row.title?.replace(/"/g, '""') || ''}"`
      const artist = `"${row.artist?.replace(/"/g, '""') || ''}"`
      csvRows.push(`${title},${artist},${row.votes}`)
    }

    return { success: true, csv: csvRows.join("\n") }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function startNewHitlistCycle() {
  try {
    console.log("🔄 STARTING NEW HITLIST CYCLE...")

    const { error: voteError } = await supabaseAdmin.from(TABLE_VOTES).delete().neq('id', 0)
    if (voteError) throw new Error(`Failed to clear votes: ${voteError.message}`)

    const { error: clearActiveError } = await supabaseAdmin.from(TABLE_SONGS).delete().neq('id', 0)
    if (clearActiveError) throw new Error(`Failed to clear active hitlist: ${clearActiveError.message}`)

    const { data: futureSongs, error: fetchFutureError } = await supabaseAdmin.from(FUTURE_SONGS).select('title, artist, image_url, spotify_link, sort_order') 
    if (fetchFutureError) throw new Error(`Failed to fetch future songs: ${fetchFutureError.message}`)
    
    if (futureSongs && futureSongs.length > 0) {
      const songsToInsert = futureSongs.map(s => ({ ...s, votes: 0 }))
      const { error: insertError } = await supabaseAdmin.from(TABLE_SONGS).insert(songsToInsert) 
      if (insertError) throw new Error(`Failed to move songs to active: ${insertError.message}`)
    }

    const { error: clearFutureError } = await supabaseAdmin.from(FUTURE_SONGS).delete().neq('id', 0)
    if (clearFutureError) throw new Error(`Failed to clear future table: ${clearFutureError.message}`)

    const now = new Date();
    const TWO_WEEK_CYCLE_MS = 14 * 24 * 60 * 60 * 1000;
    const diff = now.getTime() - REFERENCE_MONDAY.getTime();
    const currentCycleIndex = Math.floor(diff / TWO_WEEK_CYCLE_MS);
    const nextResetDate = new Date(REFERENCE_MONDAY.getTime() + ((currentCycleIndex + 1) * TWO_WEEK_CYCLE_MS));

    await supabaseAdmin.from(TABLE_METADATA).upsert({ key: "next_reset_date", value: nextResetDate.toISOString() });
      
    revalidatePath('/')
    revalidatePath('/polls/hitlist')
    revalidatePath('/admin/hitlist')
    
    return { success: true, message: "Cycle reset successfully! Future songs are now Active." }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}