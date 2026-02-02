"use server"

import { revalidatePath } from "next/cache"
import { OAuth2Client } from "google-auth-library"
import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase/admin"

// --- CONFIGURATION ---
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

const TABLE_SONGS = "Hitlist Songs"         // Active DB Table
const FUTURE_SONGS = "Future Hitlist Songs" // Future DB Table
const TABLE_VOTES = "Hitlist Votes"
const ID_COLUMN = "target_id"

// Anchor: Feb 2, 2026, 8:00 AM
const REFERENCE_MONDAY = new Date("2026-02-02T08:00:00+08:00")
const COOKIE_NAME = "hitlist_session"

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID)

// Type definition for cleaner switching
type ListType = 'active' | 'future'

// Helper: Selects the correct table based on the type
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

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Spotify Auth Error Details:", errorBody);
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (err) {
    console.error("Spotify Fetch Network Error:", err);
    return null;
  }
}

// ==========================================
//              HELPER: VOTING SCHEDULE
// ==========================================

export async function getVotingStatus() {
  const now = new Date()
  const diff = now.getTime() - REFERENCE_MONDAY.getTime()

  // Time Constants
  const ONE_DAY_MS = 24 * 60 * 60 * 1000
  const TWO_WEEK_CYCLE_MS = 14 * ONE_DAY_MS 
  
  // Voting Window: Monday 8:00 AM -> Saturday 8:00 PM (5.5 Days)
  const VOTING_OPEN_DURATION = 5.5 * ONE_DAY_MS

  const timeIntoCycle = diff % TWO_WEEK_CYCLE_MS
  
  // Calculate Current Cycle Start
  const currentCycleIndex = Math.floor(diff / TWO_WEEK_CYCLE_MS)
  const startOfCurrentCycle = new Date(
    REFERENCE_MONDAY.getTime() + (currentCycleIndex * TWO_WEEK_CYCLE_MS)
  )

  const isOpen = diff >= 0 && timeIntoCycle < VOTING_OPEN_DURATION

  const nextOpeningTime = new Date(
    startOfCurrentCycle.getTime() + TWO_WEEK_CYCLE_MS
  )

  let message = "Voting Open"
  if (!isOpen) {
    if (diff < 0) message = "Season starts soon"
    else message = "Voting Closed (Results Tallying)"
  }

  return { isOpen, message, startOfCurrentCycle, nextOpeningTime }
}

async function getEmailFromSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    })
    return ticket.getPayload()?.email
  } catch (error) {
    return null
  }
}

// ==========================================
//              PUBLIC VOTING ACTIONS
// ==========================================

export async function getHitlistDataAction() {
  try {
    const { isOpen, message, startOfCurrentCycle, nextOpeningTime } = await getVotingStatus()
    
    // 1. Fetch Songs (ALWAYS from Active Table for public view)
    // We sort by 'votes' descending for the public leaderboard
    const { data: songs, error: songsError } = await supabaseAdmin
        .from(TABLE_SONGS)
        .select("*")
        .order("votes", { ascending: false }) 

    if (songsError) throw songsError

    // 2. Check Session
    const email = await getEmailFromSession()
    let votedIds: number[] = []

    // 3. Fetch User's Past Votes
    if (email) {
        const { data: voteData } = await supabaseAdmin
          .from(TABLE_VOTES)
          .select(ID_COLUMN)
          .eq("email", email)
          .gte("created_at", startOfCurrentCycle.toISOString())

        if (voteData) {
          votedIds = voteData.map((row: any) => row[ID_COLUMN])
        }
    }

    return { 
      success: true, 
      isOpen, 
      message, 
      nextOpeningTime: nextOpeningTime.toISOString(),
      songs, 
      votedIds, 
      userEmail: email 
    }
  } catch (error: any) {
    console.error("Data Error:", error)
    return { success: false, error: "Failed to load Hitlist data" }
  }
}

export async function submitHitlistVoteAction(targetIds: number[]) {
  try {
    const { isOpen, startOfCurrentCycle } = await getVotingStatus()
    
    if (!isOpen) {
      return { success: false, error: "Voting is currently closed." }
    }

    const email = await getEmailFromSession()
    if (!email) return { success: false, error: "Please log in to vote" }

    const { count } = await supabaseAdmin
      .from(TABLE_VOTES)
      .select("*", { count: 'exact', head: true })
      .eq("email", email)
      .gte("created_at", startOfCurrentCycle.toISOString())

    if (count !== null && count > 0) {
      return { success: false, error: "You have already voted this cycle." }
    }

    if (targetIds.length > 0) {
      const rowsToInsert = targetIds.map((id) => ({
        email: email,
        [ID_COLUMN]: id, 
        created_at: new Date().toISOString(),
      }))

      const { error } = await supabaseAdmin.from(TABLE_VOTES).insert(rowsToInsert)
      if (error) throw error
    }

    revalidatePath("/polls/hitlist")
    return { success: true, message: "Votes cast successfully!" }

  } catch (error: any) {
    return { success: false, error: error.message || "Server Error" }
  }
}

export async function loginAction(token: string) {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    })
    const email = ticket.getPayload()?.email
    if (!email) throw new Error("Invalid Token")

    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, 
      path: "/",
    })

    return { success: true, email }
  } catch (e) {
    return { success: false, error: "Login failed" }
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
  return { success: true }
}

// ==========================================
//              ADMIN ACTIONS
// ==========================================

// 1. Search Spotify (Shared)
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
      votes: 0 // Default
    }))

    return { success: true, tracks }
  } catch (error: any) {
    console.error("Search Error:", error)
    return { success: false, error: "Failed to search Spotify" }
  }
}

// 2. Add Song (Supports 'active' or 'future')
// app/actions/hitlist.ts

export async function addSongServerAction(song: any, type: ListType = 'active') {
  try {
    const tableName = resolveTable(type)

    if (!song.title || !song.artist) {
        return { success: false, error: "Invalid song data" }
    }

    // 1. Clean the input
    // Remove ID (let DB generate it) and any existing sort_order from the client
    const { id, sort_order, ...songData } = song 
    
    // 2. Fix Defaults
    if (songData.votes === undefined) songData.votes = 0

    // 3. CALCULATE NEXT SORT ORDER
    // We strictly filter OUT nulls to find the actual highest number
    const { data: maxItems } = await supabaseAdmin
        .from(tableName)
        .select("sort_order")
        .not("sort_order", "is", null) // <--- CRITICAL FIX: Ignore existing NULL rows
        .order("sort_order", { ascending: false })
        .limit(1)

    // If no numbered rows exist (or all are null), start at 0
    const currentMax = maxItems?.[0]?.sort_order ?? 0
    const nextOrder = Number(currentMax) + 1

    console.log(`[Adding to ${type}] Calculated sort_order:`, nextOrder)

    // 4. Insert with calculated order
    const finalPayload = {
        ...songData,
        sort_order: nextOrder
    }

    const { error } = await supabaseAdmin
      .from(tableName)
      .insert([finalPayload])
    
    if (error) {
        console.error("Insert Error:", error)
        throw error
    }

    revalidatePath("/admin/hitlist")
    if (type === 'active') revalidatePath("/polls/hitlist")
      
    return { success: true }
  } catch (error: any) {
    console.error("Add Song Error:", error)
    return { success: false, error: error.message }
  }
}

// 3. Get Songs (Supports 'active' or 'future')
export async function getHitlistSongsAction(type: ListType = 'active') {
    try {
        const tableName = resolveTable(type)

        // For Admin view, we sort by 'sort_order' to maintain custom ordering
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

// 4. Delete Song (Supports 'active' or 'future')
export async function deleteSongAction(id: number, type: ListType = 'active') {
    try {
        const tableName = resolveTable(type)

        const { error } = await supabaseAdmin
            .from(tableName)
            .delete()
            .eq("id", id)

        if (error) throw error

        revalidatePath("/admin/hitlist")
        if (type === 'active') revalidatePath("/polls/hitlist")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

// 5. Delete All (Supports 'active' or 'future')
export async function deleteAllSongsAction(type: ListType = 'active') {
  try {
    const tableName = resolveTable(type)

    const { error } = await supabaseAdmin
      .from(tableName)
      .delete()
      .gt("id", 0);

    if (error) throw error;

    revalidatePath("/admin/hitlist");
    if (type === 'active') revalidatePath("/polls/hitlist");
    return { success: true };
  } catch (error: any) {
    console.error("Delete All Error:", error);
    return { success: false, error: error.message };
  }
}

// 6. Reorder (Supports 'active' or 'future')
export async function updateSongOrderAction(items: { id: number }[], type: ListType = 'active') {
    try {
        const tableName = resolveTable(type)

        // Parallel updates for speed
        const updates = items.map((item, index) => {
            return supabaseAdmin
                .from(tableName)
                .update({ sort_order: index })
                .eq('id', item.id)
        })

        await Promise.all(updates)

        return { success: true }
    } catch (error: any) {
        console.error("Reorder failed:", error)
        return { success: false, error: error.message }
    }
}