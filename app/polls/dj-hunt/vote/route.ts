import { NextResponse } from "next/server"
import { OAuth2Client } from "google-auth-library"
import { supabaseAdmin as supabaseAdminLib } from "@/lib/server/supabaseAdmin"

const googleClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
const supabaseAdmin = supabaseAdminLib

// Helper to verify Google Token
async function getEmailFromToken(token: string) {
  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  })
  return ticket.getPayload()?.email
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization")
    const token = authHeader?.split(" ")[1]

    if (!token) return NextResponse.json({ error: "No token provided" }, { status: 401 })

    const email = await getEmailFromToken(token)
    if (!email) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const { data } = await supabaseAdmin
      .from("DJ Hunt Votes")
      .select("dj_id")
      .eq("email", email)

    const votedIds = data?.map((row) => row.dj_id) || []
    
    return NextResponse.json({ votedIds })

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch votes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userToken, djIds } = body

    if (!userToken || !djIds) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 })
    }

    const email = await getEmailFromToken(userToken)
    if (!email) return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    
    await supabaseAdmin.from("votes").delete().eq("email", email)

    if (djIds.length > 0) {
      const rowsToInsert = djIds.map((id: number) => ({
        email: email,
        dj_id: id,
        created_at: new Date().toISOString(),
      }))

      const { error } = await supabaseAdmin.from("votes").insert(rowsToInsert)
      if (error) throw error
    }

    return NextResponse.json({ message: "Votes updated successfully!" })

  } catch (error: any) {
    console.error("Server Error:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}