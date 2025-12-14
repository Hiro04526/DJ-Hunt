import { NextResponse } from "next/server"
import { OAuth2Client } from "google-auth-library"
import { createClient } from "@supabase/supabase-js"

const googleClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userToken, djIds } = body

    if (!userToken || !djIds || djIds.length === 0) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 })
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: userToken,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    const email = payload?.email

    if (!email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { data: existingVotes } = await supabaseAdmin
      .from("votes")
      .select("id")
      .eq("email", email)
      .limit(1)

    if (existingVotes && existingVotes.length > 0) {
      return NextResponse.json({ message: "You have already voted!" }, { status: 400 })
    }

    const rowsToInsert = djIds.map((id: number) => ({
      email: email,
      dj_id: id,
      created_at: new Date().toISOString(),
    }))

    const { error: insertError } = await supabaseAdmin
      .from("votes")
      .insert(rowsToInsert)

    if (insertError) {
      console.error("Supabase Error:", insertError)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    return NextResponse.json({ message: "Votes submitted successfully!" })

  } catch (error: any) {
    console.error("Server Error:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}