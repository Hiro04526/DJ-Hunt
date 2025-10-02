import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/server/supabaseAdmin"

export const dynamic = "force-dynamic"

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("DJs")
    .select("id,name,description,image,details,videoshoot") 
    .order("id", { ascending: true })         

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ data }, { status: 200 })
}