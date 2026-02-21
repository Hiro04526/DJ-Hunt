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

// --- LOGIN MODAL ---
export interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onToken: (token: any) => void
  ready: boolean // Google script ready status
}

// --- SORTABLE SONG ROW ---
export interface SortableSongRowProps {
  song: Song
  handleDelete: (id: number) => void
  index?: number // Optional: Only for Active list if needed
  showVotes?: boolean // Optional: To hide votes on Future list
}