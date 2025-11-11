import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service key (server-side only)
)

export async function POST(request: Request) {
  try {
    const { email, djIds } = await request.json()
    if (!email || !Array.isArray(djIds) || djIds.length === 0)
      return NextResponse.json({ error: "Select at least one DJ" }, { status: 400 })

    const votes = djIds.map((dj_id: number) => ({ email, dj_id }))
    const { error } = await supabase.from("votes").upsert(votes)

    if (error) {
      console.error("Insert error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Votes submitted successfully!" })
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}