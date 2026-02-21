// --- RADIO TALENT MEMBER PROP ---
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

// --- RADIO TALENT MEMBER CATEGORY ---
export interface TalentCategoryProps {
  title: string
  members: RadioTalentMember[]
  onSelect: (member: RadioTalentMember) => void
}