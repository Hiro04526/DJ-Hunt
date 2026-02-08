"use server"

import { supabaseAdmin } from "@/lib/supabase/admin"

export interface RadioTalentMember {
  id: number;
  name: string;
  image_url: string; 
  academic_year: string;
  rank: 'Senior DJ' | 'DJ Trainee';
  bio?: string;
  event_hosting_images?: string[]; 
  stingers?: string[]; 
}

// 1. Get Available Years (Robust Error Handling)
export async function getAvailableYears() {
  try {
    const { data, error } = await supabaseAdmin
      .from('Radio Talent') 
      .select('academic_year')
      
    if (error) {
      console.error("Supabase Error (Years):", error.message)
      return []
    }
    
    if (!data) return []

    const years = Array.from(new Set(data.map((d: any) => d.academic_year))).sort().reverse()
    return years as string[]
  } catch (error) {
    console.error("Server Action Failed:", error)
    return []
  }
}

// 2. Get Talent By Year
export async function getRadioTalentByYear(year: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('Radio Talent')
      .select('*')
      .eq('academic_year', year)
      .order('name', { ascending: true });

    if (error) {
      console.error("Supabase Error (Roster):", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as RadioTalentMember[] };
  } catch (error: any) {
    console.error("Server Error:", error);
    return { success: false, error: "Internal Server Error" };
  }
}