import { NextResponse } from "next/server"
import { OAuth2Client } from "google-auth-library"
import { supabaseAdmin as supabaseAdminLib } from "@/lib/server/supabaseAdmin"

// --- CONFIGURATION ---
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

// DB Table Names
const TABLE_VOTES = "Hitlist Votes"
const TABLE_SONGS = "Hitlist Songs"
const ID_COLUMN = "target_id" 

// ANCHOR: A specific Monday that starts a "Voting Week" (Week 1).
// This date acts as the mathematical anchor for the alternating schedule.
// PH Time: Monday, Dec 15, 2025, 8:00 AM (Start of voting)
const REFERENCE_MONDAY = new Date("2025-12-15T08:00:00+08:00") 

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID)
const supabaseAdmin = supabaseAdminLib

// --- HELPER: Schedule Logic ---
function getVotingStatus() {
  const now = new Date()
  
  const MS_PER_HOUR = 1000 * 60 * 60
  const MS_PER_DAY = MS_PER_HOUR * 24
  const MS_PER_WEEK = MS_PER_DAY * 7

  // 1. Calculate time passed since the Reference Anchor
  // We use the timestamp of the Reference Date's midnight (00:00) for cleaner week math
  const referenceMidnight = new Date(REFERENCE_MONDAY)
  referenceMidnight.setHours(0,0,0,0) // Normalize to midnight
  
  const diffInMs = now.getTime() - referenceMidnight.getTime()
  
  // 2. Identify Week Number (0 = Week 1/Voting, 1 = Week 2/Processing, etc.)
  const weeksPassed = Math.floor(diffInMs / MS_PER_WEEK)
  const isVotingWeek = weeksPassed % 2 === 0

  // 3. Define the precise Voting Window (relative to Monday 00:00)
  // Window: Monday 08:00 AM -> Saturday 09:00 PM
  const startOffset = 8 * MS_PER_HOUR  // Mon 8:00 AM
  const endOffset = (5 * MS_PER_DAY) + (21 * MS_PER_HOUR) // Sat 9:00 PM

  // 4. Check if currently inside the window
  const timeIntoCurrentWeek = diffInMs % MS_PER_WEEK
  const isWithinHours = timeIntoCurrentWeek >= startOffset && timeIntoCurrentWeek < endOffset

  const isOpen = isVotingWeek && isWithinHours

  // 5. Generate Status Message
  let message = ""
  if (!isOpen) {
    if (!isVotingWeek) {
      message = "Voting is closed this week for results processing."
    } else if (timeIntoCurrentWeek < startOffset) {
      message = "Voting opens Monday at 8:00 AM."
    } else {
      message = "Voting closes Saturday at 9:00 PM."
    }
  }

  // 6. Calculate Cycle Start (for clearing old votes)
  // We want to see votes from the *Start of Week 1*.
  const cycleIndex = isVotingWeek ? weeksPassed : weeksPassed - 1
  const startOfCurrentCycle = new Date(referenceMidnight.getTime() + (cycleIndex * MS_PER_WEEK))

  return { isOpen, message, startOfCurrentCycle }
}

// --- HELPER: Google Auth ---
async function getEmailFromToken(token: string) {
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

// --- API: GET (Fetch Status, Songs, & User Votes) ---
export async function GET(request: Request) {
  try {
    const { isOpen, message, startOfCurrentCycle } = getVotingStatus()

    // 1. If Closed, return early (no need to fetch songs or check auth)
    // Note: If you want users to see the song list even when closed, move this check later.
    if (!isOpen) {
      return NextResponse.json({ isOpen: false, message })
    }

    // 2. Auth Check
    const authHeader = request.headers.get("Authorization")
    const token = authHeader?.split(" ")[1]
    if (!token) return NextResponse.json({ error: "No token" }, { status: 401 })

    const email = await getEmailFromToken(token)
    if (!email) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    // 3. Fetch Songs (Dynamic from DB)
    const { data: songsData, error: songsError } = await supabaseAdmin
      .from(TABLE_SONGS)
      .select("*")
      .order("id", { ascending: true }) // Ensure order 1-40
    
    if (songsError) throw songsError

    // 4. Fetch User's Votes (Scoped to Current Cycle)
    const { data: voteData, error: voteError } = await supabaseAdmin
      .from(TABLE_VOTES)
      .select(ID_COLUMN)
      .eq("email", email)
      .gte("created_at", startOfCurrentCycle.toISOString())

    if (voteError) throw voteError

    const votedIds = voteData?.map((row: any) => row[ID_COLUMN]) || []
    
    return NextResponse.json({ 
      isOpen: true, 
      votedIds,
      songs: songsData 
    })

  } catch (error) {
    console.error("GET Error:", error)
    return NextResponse.json({ error: "Server Error" }, { status: 500 })
  }
}

// --- API: POST (Submit Votes) ---
export async function POST(request: Request) {
  try {
    const { isOpen, startOfCurrentCycle } = getVotingStatus()
    
    // 1. Strict Schedule Check
    if (!isOpen) {
      return NextResponse.json({ error: "Voting is currently closed." }, { status: 403 })
    }

    const body = await request.json()
    const { userToken, targetIds } = body

    if (!userToken || !targetIds || !Array.isArray(targetIds)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    const email = await getEmailFromToken(userToken)
    if (!email) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    // 2. Check for Duplicate Votes (Current Cycle)
    const { count, error: countError } = await supabaseAdmin
      .from(TABLE_VOTES)
      .select("*", { count: 'exact', head: true })
      .eq("email", email)
      .gte("created_at", startOfCurrentCycle.toISOString())

    if (countError) throw countError

    if (count !== null && count > 0) {
      return NextResponse.json({ error: "You have already voted this cycle." }, { status: 403 })
    }

    // 3. Insert Votes
    if (targetIds.length > 0) {
      // Basic range check
      const isValid = targetIds.every(id => Number.isInteger(id) && id >= 1 && id <= 40)
      if (!isValid) return NextResponse.json({ error: "Invalid song selection." }, { status: 400 })

      const rowsToInsert = targetIds.map((id: number) => ({
        email: email,
        [ID_COLUMN]: id, // target_id
        created_at: new Date().toISOString(),
      }))

      const { error } = await supabaseAdmin.from(TABLE_VOTES).insert(rowsToInsert)
      if (error) throw error
    }

    return NextResponse.json({ message: "Votes cast successfully!" })

  } catch (error: any) {
    console.error("POST Error:", error)
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 })
  }
}