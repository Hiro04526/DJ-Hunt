"use server"

import { revalidatePath } from "next/cache"
import { OAuth2Client } from "google-auth-library"
import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { startNewHitlistCycle } from "./admin" //

// --- CONFIGURATION ---
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
const TABLE_SONGS = "Hitlist Songs"
const TABLE_VOTES = "Hitlist Votes"
const TABLE_METADATA = "system_metadata"
const ID_COLUMN = "target_id"

const REFERENCE_MONDAY = new Date("2026-02-02T08:00:00+08:00")
const COOKIE_NAME = "hitlist_session"
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID)

// ==========================================
//              HELPERS
// ==========================================

async function checkAndTriggerLazyReset() {
  const KEY_NAME = "next_reset_date"
  const { data: metaRow, error } = await supabaseAdmin.from(TABLE_METADATA).select("value").eq("key", KEY_NAME).single()

  let targetResetDate: Date
  if (error || !metaRow || !metaRow.value) {
    const now = new Date()
    const TWO_WEEK_CYCLE_MS = 14 * 24 * 60 * 60 * 1000
    const diff = now.getTime() - REFERENCE_MONDAY.getTime()
    const currentCycleIndex = Math.floor(diff / TWO_WEEK_CYCLE_MS)
    targetResetDate = new Date(REFERENCE_MONDAY.getTime() + ((currentCycleIndex + 1) * TWO_WEEK_CYCLE_MS))
  } else {
    targetResetDate = new Date(metaRow.value)
  }

  const now = new Date()
  if (now >= targetResetDate) {
    await startNewHitlistCycle() // Triggered from admin logic
  }
}

export async function getVotingStatus() {
  const now = new Date()
  const diff = now.getTime() - REFERENCE_MONDAY.getTime()
  const ONE_DAY_MS = 24 * 60 * 60 * 1000
  const TWO_WEEK_CYCLE_MS = 14 * ONE_DAY_MS 
  const VOTING_OPEN_DURATION = 5.5 * ONE_DAY_MS

  const timeIntoCycle = diff % TWO_WEEK_CYCLE_MS
  const currentCycleIndex = Math.floor(diff / TWO_WEEK_CYCLE_MS)
  const startOfCurrentCycle = new Date(REFERENCE_MONDAY.getTime() + (currentCycleIndex * TWO_WEEK_CYCLE_MS))

  const isOpen = diff >= 0 && timeIntoCycle < VOTING_OPEN_DURATION
  const nextOpeningTime = new Date(startOfCurrentCycle.getTime() + TWO_WEEK_CYCLE_MS)

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
    const ticket = await googleClient.verifyIdToken({ idToken: token, audience: GOOGLE_CLIENT_ID })
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
    await checkAndTriggerLazyReset()

    const { isOpen, message, startOfCurrentCycle, nextOpeningTime } = await getVotingStatus()
    
    const { data: songs, error: songsError } = await supabaseAdmin
        .from(TABLE_SONGS)
        .select("*")
        .order("sort_order", { ascending: true }) 

    if (songsError) throw songsError

    const email = await getEmailFromSession()
    let votedIds: number[] = []

    if (email) {
        const { data: voteData } = await supabaseAdmin
          .from(TABLE_VOTES)
          .select(ID_COLUMN)
          .eq("email", email)
          .gte("created_at", startOfCurrentCycle.toISOString())

        if (voteData) votedIds = voteData.map((row: any) => row[ID_COLUMN])
    }

    return { success: true, isOpen, message, nextOpeningTime: nextOpeningTime.toISOString(), songs, votedIds, userEmail: email }
  } catch (error: any) {
    return { success: false, error: "Failed to load Hitlist data" }
  }
}

export async function submitHitlistVoteAction(targetIds: number[]) {
  try {
    const { isOpen, startOfCurrentCycle } = await getVotingStatus()
    if (!isOpen) return { success: false, error: "Voting is currently closed." }

    const email = await getEmailFromSession()
    if (!email) return { success: false, error: "Please log in to vote" }

    const { count } = await supabaseAdmin
      .from(TABLE_VOTES)
      .select("*", { count: 'exact', head: true })
      .eq("email", email)
      .gte("created_at", startOfCurrentCycle.toISOString())

    if (count !== null && count > 0) return { success: false, error: "You have already voted this cycle." }

    if (targetIds.length > 0) {
      const rowsToInsert = targetIds.map((id) => ({ email: email, [ID_COLUMN]: id, created_at: new Date().toISOString() }))
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
    const ticket = await googleClient.verifyIdToken({ idToken: token, audience: GOOGLE_CLIENT_ID })
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