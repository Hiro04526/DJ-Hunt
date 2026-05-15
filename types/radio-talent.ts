import { TalentRank } from "@/constants/radio-talent"

// --- RADIO TALENT MEMBER PROP ---
export interface RadioTalentMember {
  id: number
  name: string
  image_url: string
  academic_year: string
  rank: TalentRank
  bio?: string
  event_hosting_images?: string[]
  stingers?: string[]
  rt_link?: string
}

// --- RADIO TALENT MEMBER CATEGORY ---
export interface TalentCategoryProps {
  title: string
  members: RadioTalentMember[]
  onSelect: (member: RadioTalentMember) => void
}