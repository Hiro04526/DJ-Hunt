"use server"

import { supabaseAdmin } from "@/lib/supabase/admin"
import { EBMember, OrgMember } from "@/types/about-us"

export async function getExecutiveBoardAction(): Promise<{ success: boolean, data?: EBMember[], error?: string }> {
  try {
    const { data, error } = await supabaseAdmin
      .from("About Us EB")
      .select("*")
      .order("order", { ascending: true })

    if (error) throw error

    return { success: true, data }
  } catch (error: any) {
    console.error("Failed to fetch EB members:", error)
    return { success: false, error: "Failed to load Executive Board." }
  }
}

export async function getOrgMembersAction(): Promise<{ success: boolean, data?: OrgMember[], error?: string }> {
  try{ 
    const { data, error } = await supabaseAdmin
      .from("About Us Members")
      .select("*")

    if (error) throw error

    return { success: true, data }
  } catch (error: any) {
    console.error("Failed to fetch organization members:", error)
    return { success: false, error: "Failed to load Org Members." }
  }
}