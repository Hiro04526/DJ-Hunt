"use server"

import { revalidatePath } from "next/cache"
import { OAuth2Client } from "google-auth-library"
import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase/admin"

// --- CONFIGURATION ---
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
const TABLE_SONGS = "Hitlist Songs"
const TABLE_VOTES = "Hitlist Votes"
const ID_COLUMN = "target_id"
const REFERENCE_MONDAY = new Date("2026-01-10T08:00:00+08:00")
const COOKIE_NAME = "hitlist_session"

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID)

// --- HELPER: Spotify Token ---
async function getSpotifyToken() {
  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    })
    const data = await res.json()
    return data.access_token
  } catch (e) {
    console.error("Spotify Token Error", e)
    return null
  }
}

// --- HELPER: Google Auth & Session ---
async function getEmailFromSession() {
  const cookieStore = await cookies() // <--- ADD await
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

// --- HELPER: Schedule Logic ---
export async function getVotingStatus() {
  const now = new Date()
  
  // 1. Calculate time passed since the anchor date
  const diff = now.getTime() - REFERENCE_MONDAY.getTime()

  // 2. Define Time Constants
  const ONE_DAY_MS = 24 * 60 * 60 * 1000
  const ONE_WEEK_MS = 7 * ONE_DAY_MS
  const TWO_WEEK_CYCLE_MS = 14 * ONE_DAY_MS // The full 14-day loop

  // 3. Define the "Voting Window" (Monday 8AM to Saturday 8PM)
  // Mon 8am -> Sat 8am = 5.0 days
  // Sat 8am -> Sat 8pm = 0.5 days (12 hours)
  // Total Open Time = 5.5 days
  const VOTING_OPEN_DURATION = 5.5 * ONE_DAY_MS

  // 4. Determine position in the 14-day cycle
  const timeIntoCycle = diff % TWO_WEEK_CYCLE_MS

  // Safety check for dates before the reference
  if (diff < 0) {
      return { 
        isOpen: false, 
        message: "Season has not started", 
        startOfCurrentCycle: REFERENCE_MONDAY 
      }
  }

  // 5. Check Status
  // If we are within the first 5.5 days (Mon -> Sat 8pm), it's OPEN.
  // Any time after that (Sat night -> Next Monday week), it's CLOSED.
  const isOpen = timeIntoCycle < VOTING_OPEN_DURATION

  // 6. Calculate Cycle Start Date (Used for filtering DB votes)
  const currentCycleIndex = Math.floor(diff / TWO_WEEK_CYCLE_MS)
  const startOfCurrentCycle = new Date(
    REFERENCE_MONDAY.getTime() + (currentCycleIndex * TWO_WEEK_CYCLE_MS)
  )

  let message = ""
  if (isOpen) {
      message = "Voting Open"
  } else {
      // Logic to distinguish between the immediate weekend buffer and the Week 2 break
      // This is purely for UI messaging; functionally both are "Closed"
      if (timeIntoCycle < ONE_WEEK_MS) {
          message = "Voting Closed (Weekend Buffer)"
      } else {
          message = "Voting Closed (Week 2 Break)"
      }
  }

  return { 
    isOpen, 
    message, 
    startOfCurrentCycle 
  }
}

// ==========================================
//              SESSION ACTIONS
// ==========================================

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

export async function getHitlistSongsAction() {
  try {
    const { data, error } = await supabaseAdmin
      .from(TABLE_SONGS)
      .select("*")

    if (error) throw error
    return { success: true, songs: data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function addSongServerAction(songData: any) {
  try {
    const { data: existing } = await supabaseAdmin
      .from(TABLE_SONGS)
      .select("id")
      .eq("spotify_link", songData.spotify_link)
      .single()

    if (existing) return { success: false, error: "Song already exists" }

    const { error } = await supabaseAdmin.from(TABLE_SONGS).insert([{
        title: songData.title,
        artist: songData.artist,
        image_url: songData.image_url, 
        spotify_link: songData.spotify_link,
        votes: 0 
      }])

    if (error) throw error
    revalidatePath("/admin/hitlist")
    return { success: true, message: "Song added!" }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteSongAction(id: number) {
  try {
    const { error } = await supabaseAdmin.from(TABLE_SONGS).delete().eq("id", id)
    if (error) throw error
    revalidatePath("/admin/hitlist")
    return { success: true, message: "Song deleted" }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function searchSongsAction(query: string) {
  if (!query) return { success: false, error: "Missing query" }
  try {
    const token = await getSpotifyToken()
    if (!token) throw new Error("Could not get Spotify token")

    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const data = await res.json()
    if (!data.tracks) return { success: false, error: "No tracks found" }

    const tracks = data.tracks.items.map((t: any) => ({
      title: t.name,
      artist: t.artists.map((a: any) => a.name).join(", "),
      image_url: t.album.images[0]?.url,
      spotify_link: t.external_urls.spotify,
      spotify_id: t.id
    }))

    return { success: true, tracks }
  } catch (error: any) {
    return { success: false, error: "Failed to search Spotify" }
  }
}


// ==========================================
//              PUBLIC/VOTING ACTIONS
// ==========================================

export async function getHitlistDataAction() {
  try {
    const { isOpen, message, startOfCurrentCycle } = await getVotingStatus()
    
    // 1. Fetch Songs
    const { data: songs, error: songsError } = await supabaseAdmin
        .from(TABLE_SONGS)
        .select("*")
        .order("votes", { ascending: false }) // ensure column name matches DB

    if (songsError) throw songsError

    // 2. Check User Session via Cookie
    const email = await getEmailFromSession()
    let votedIds: number[] = []

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

    return { success: true, isOpen, message, songs, votedIds, userEmail: email }
  } catch (error: any) {
    console.error("Data Error:", error)
    return { success: false, error: "Failed to load Hitlist data" }
  }
}

export async function submitHitlistVoteAction(targetIds: number[]) {
  try {
    const { isOpen, startOfCurrentCycle } = await getVotingStatus()
    if (!isOpen) return { success: false, error: "Voting is closed." }

    // 1. Get User from Cookie
    const email = await getEmailFromSession()
    if (!email) return { success: false, error: "Please log in to vote" }

    // 2. Check Duplicates
    const { count } = await supabaseAdmin
      .from(TABLE_VOTES)
      .select("*", { count: 'exact', head: true })
      .eq("email", email)
      .gte("created_at", startOfCurrentCycle.toISOString())

    if (count !== null && count > 0) {
      return { success: false, error: "You have already voted this cycle." }
    }

    // 3. Insert Votes
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
    console.error("Submit Vote Error:", error)
    return { success: false, error: error.message || "Server Error" }
  }
}