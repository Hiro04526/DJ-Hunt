"use server"

import { revalidatePath } from "next/cache"
import { OAuth2Client } from "google-auth-library"
import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase/admin"

// --- CONFIGURATION ---
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

const TABLE_SONGS = "Hitlist Songs"
const TABLE_VOTES = "Hitlist Votes"
const ID_COLUMN = "target_id"
// Anchor: Jan 10, 2026, 8:00 AM
const REFERENCE_MONDAY = new Date("2026-01-10T08:00:00+08:00")
const COOKIE_NAME = "hitlist_session"

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID)

// ==========================================
//              HELPER: SPOTIFY
// ==========================================

async function getSpotifyToken() {
  const auth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")
  
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  const data = await response.json()
  return data.access_token
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
    
    // 1. Fetch Songs
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
//              ADMIN ACTIONS (NEW)
// ==========================================

// 1. Search Spotify
export async function searchSongsAction(query: string) {
  try {
    const token = await getSpotifyToken()
    if (!token) throw new Error("Failed to get Spotify token")

    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    const data = await res.json()
    const tracks = data.tracks?.items.map((t: any) => ({
      title: t.name,
      artist: t.artists.map((a: any) => a.name).join(", "),
      image_url: t.album.images[0]?.url,
      spotify_link: t.external_urls.spotify,
      votes: 0 // Default for new songs
    }))

    return { success: true, tracks }
  } catch (error: any) {
    console.error("Search Error:", error)
    return { success: false, error: "Failed to search Spotify" }
  }
}

// 2. Add Song to DB
export async function addSongServerAction(song: any) {
  try {
    // Basic validation to prevent empty inserts
    if (!song.title || !song.artist) {
        return { success: false, error: "Invalid song data" }
    }

    // Remove temporary ID if passed from optimistic UI
    const { id, ...songData } = song 

    const { error } = await supabaseAdmin
      .from(TABLE_SONGS)
      .insert([songData])
    
    if (error) throw error

    revalidatePath("/admin/hitlist")
    revalidatePath("/polls/hitlist") // Update public page too
    return { success: true }
  } catch (error: any) {
    console.error("Add Song Error:", error)
    return { success: false, error: error.message }
  }
}

// 3. Get All Songs (Admin View)
export async function getHitlistSongsAction() {
    try {
        const { data: songs, error } = await supabaseAdmin
            .from(TABLE_SONGS)
            .select("*")
            .order("id", { ascending: false }) // Admin usually likes newest first
        
        if (error) throw error
        return { success: true, songs }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

// 4. Delete Song
export async function deleteSongAction(id: number) {
    try {
        const { error } = await supabaseAdmin
            .from(TABLE_SONGS)
            .delete()
            .eq("id", id)

        if (error) throw error

        revalidatePath("/admin/hitlist")
        revalidatePath("/polls/hitlist")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}