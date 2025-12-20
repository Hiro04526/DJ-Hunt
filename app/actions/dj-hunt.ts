"use server"

import { OAuth2Client } from "google-auth-library"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { cookies } from "next/headers"

// --- CONFIGURATION ---
const googleClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)

// --- HELPER: Verify Google Token ---
async function getEmailFromToken(token: string) {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    })
    return ticket.getPayload()?.email
  } catch (error) {
    return null
  }
}

// --- ACTION: Get All DJs (Public) ---
export async function getDJsAction() {
  try {
    const { data, error } = await supabaseAdmin
      .from("DJs")
      .select("id,name,description,image,videoshoot,stinger,segue,voiceover")
      .order("id", { ascending: true })

    if (error) throw error

    return { success: true, data }
  } catch (error: any) {
    console.error("Fetch DJs Error:", error)
    return { success: false, error: error.message }
  }
}

// --- ACTION: Update DJ (Admin Only) ---
export async function updateDJAction(id: number, updates: any) {
  // FIX: cookies() is now async in Next.js 15
  const cookieStore = await cookies() 
  const adminCookie = cookieStore.get("admin")
  
  if (adminCookie?.value !== "1") {
    return { success: false, error: "Unauthorized: Admin access required" }
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("DJs")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error: any) {
    console.error("Update DJ Error:", error)
    return { success: false, error: error.message }
  }
}

// --- ACTION: Get User Votes ---
export async function getVotesAction(token: string) {
  try {
    const email = await getEmailFromToken(token)
    if (!email) return { success: false, error: "Invalid or expired session" }

    const { data, error } = await supabaseAdmin
      .from("DJ Hunt Votes")
      .select("dj_id")
      .eq("email", email)

    if (error) throw error

    const votedIds = data?.map((row) => row.dj_id) || []
    return { success: true, votedIds }

  } catch (error) {
    console.error("Fetch Votes Error:", error)
    return { success: false, error: "Failed to fetch previous votes" }
  }
}

// --- ACTION: Submit User Votes ---
export async function submitVotesAction(token: string, djIds: number[]) {
  try {
    const email = await getEmailFromToken(token)
    if (!email) return { success: false, error: "Invalid or expired session" }

    // 1. Delete old votes
    const { error: deleteError } = await supabaseAdmin
      .from("DJ Hunt Votes")
      .delete()
      .eq("email", email)

    if (deleteError) throw deleteError

    // 2. Insert new votes (if any)
    if (djIds.length > 0) {
      const rowsToInsert = djIds.map((id) => ({
        email: email,
        dj_id: id,
        created_at: new Date().toISOString(),
      }))

      const { error: insertError } = await supabaseAdmin
        .from("DJ Hunt Votes")
        .insert(rowsToInsert)

      if (insertError) throw insertError
    }

    return { success: true, message: "Votes updated successfully!" }

  } catch (error: any) {
    console.error("Submit Votes Error:", error)
    return { success: false, error: error.message || "Internal Server Error" }
  }
}