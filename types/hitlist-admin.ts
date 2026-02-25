import { Song } from "./hitlist"

// --- SORTABLE SONG ROW ---
export interface SortableSongRowProps {
  song: Song
  handleDelete: (id: number) => void
  index?: number // Optional: Only for Active list if needed
  showVotes?: boolean // Optional: To hide votes on Future list
}