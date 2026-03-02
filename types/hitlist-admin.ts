import { Song } from "./hitlist"

// --- SORTABLE SONG ROW ---
export interface SortableSongRowProps {
  song: Song
  handleDelete: (id: number) => Promise<void> | void // Flexibile for both sync and async
  index?: number 
  showVotes?: boolean 
}