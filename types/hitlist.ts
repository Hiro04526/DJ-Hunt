// --- BASE ENTITIES ---
export interface User {
  email: string
}

export interface Song {
  id: number
  title: string
  artist: string
  image_url?: string
  votes?: number
  spotify_link?: string
}

// --- STATE INTERFACES --- 
export interface StatusState {
  isOpen: boolean
  loading: boolean
  message: string
  nextOpeningTime?: string | null
}


// --- COMPONENT PROPS ---
export interface CarouselSectionProps {
  songs: Song[]
  selected: number[]
  onToggle: (id: number) => void
  onIndexChange: (index: number) => void
  hasVoted: boolean
}

export interface HeaderProps {
  user: User | null
  onLogout: () => void
}

export interface LeaderboardProps {
  songs: Song[]
  onRefresh: () => void
  isRefreshing: boolean
}

export interface LeaderboardItemProps {
  song: Song
  index: number
  maxVotes: number 
}

export interface VoteListProps {
  selectedSongs: Song[]
  onToggle: (id: number) => void
  user: User | null
  hasVoted: boolean
  submitting: boolean
  onSubmit: () => void
}