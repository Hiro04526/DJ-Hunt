"use server"

import { unstable_cache } from "next/cache"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { RadioTalentMember } from "@/types/radio-talent"

async function fetchYearsFromDB() {
  const { data, error } = await supabaseAdmin
    .from('Radio Talent') 
    .select('academic_year')
      
  if (error) {
    console.error("Supabase Error (Years):", error.message)
    return []
  }
    
  if (!data) return []

  const years = Array.from(new Set(data.map((d: { academic_year: string }) => d.academic_year))).sort().reverse()
  return years
}

async function fetchTalentFromDB(year: string) {
  const { data, error } = await supabaseAdmin
    .from('Radio Talent')
    .select('*')
    .eq('academic_year', year)
    .order('name', { ascending: true })

  if (error) {
    console.error("Supabase Error (Roster):", error.message)
    return null
  }

  return data as RadioTalentMember[]
}

// --- EXPORTED SERVER ACTIONS ---

// 1. Get Available Years (Cached for 1 hour)
const getCachedAvailableYears = unstable_cache(
  async () => {
    return await fetchYearsFromDB()
  },
  ['available-roster-years'],
  { revalidate: 3600 }
)

export async function getAvailableYears() {
  try {
    return await getCachedAvailableYears()
  } catch (error) {
    console.error("Server Action Failed (Years):", error)
    return []
  }
}

// 2. Get Talent By Year (With Dynamic Cache Keys)
export async function getRadioTalentByYear(year: string) {
  try {
    const getCachedRadioTalent = unstable_cache(
      async (targetYear: string) => fetchTalentFromDB(targetYear),
      ['radio-talent-roster', year], 
      { revalidate: 3600 }
    )

    const data = await getCachedRadioTalent(year);

    if (!data) {
       return { success: false, error: "Failed to load roster" };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Server Error:", error)
    return { success: false, error: "Internal Server Error" }
  }
}