"use server"

import { supabaseAdmin } from "@/lib/supabase/admin"

export type DJRank = 'Radio Talent Director' | 'Senior DJ' | 'DJ Trainee';

export interface RadioTalentMember {
  id: number;
  name: string;
  image_url: string;
  academic_year: string;
  rank: DJRank;
}

export async function getRadioTalentByYear(year: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('Radio Talent')
      .select('*')
      .eq('academic_year', year)
      .order('name', { ascending: true });

    if (error) {
      console.error("Supabase Error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as RadioTalentMember[] };
  } catch (error: any) {
    console.error("Server Error:", error);
    return { success: false, error: "Internal Server Error" };
  }
}