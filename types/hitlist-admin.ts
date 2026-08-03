import { Song } from "./hitlist"

// --- SORTABLE SONG ROW ---
export interface SortableSongRowProps {
  song: Song
  handleDelete: (id: number) => Promise<void> | void // Flexibile for both sync and async
  index?: number 
  showVotes?: boolean 
}

// --- PAST CSV EXPORTS ---
export interface HitlistExport {
  id: number
  filename: string
  cycle_start: string
  cycle_end: string
  created_at: string
}