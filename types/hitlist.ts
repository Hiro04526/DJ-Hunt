// --- REUSABLE SONG INTERFACE ---
export interface Song {
  id: number
  title: string
  artist: string
  image_url?: string
  votes?: number
  spotify_link?: string
}

// --- CAROUSEL SECTION ---
export interface CarouselSectionProps {
  songs: Song[]
  selected: number[]
  onToggle: (id: number) => void
  onIndexChange: (index: number) => void
  hasVoted: boolean
}

// --- HEADER ---
export interface HeaderProps {
  user: { email: string } | null; 
  onLogout: () => void;
}

// --- LEADERBOARD ---
export interface LeaderboardProps {
  songs: Song[]
  onRefresh: () => void
  isRefreshing: boolean
}