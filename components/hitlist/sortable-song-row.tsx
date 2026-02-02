"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Trash2, Trophy } from "lucide-react"

interface Song {
  id: number
  title: string
  artist: string
  image_url: string
  votes: number
}

interface SortableSongRowProps {
  song: Song
  handleDelete: (id: number) => void
  index?: number // Optional: Only for Active list if needed
  showVotes?: boolean // Optional: To hide votes on Future list
}

export function SortableSongRow({ song, handleDelete, index, showVotes = false }: SortableSongRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: song.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  }

  // Calculate Rank Color (Gold/Silver/Bronze for top 3)
  const getRankColor = (i: number) => {
    if (i === 0) return "text-yellow-400" // Gold
    if (i === 1) return "text-gray-300"   // Silver
    if (i === 2) return "text-amber-600"  // Bronze
    return "text-gray-500"
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-[#181818] p-3 hover:bg-[#222] group relative"
    >
      {/* Drag Handle */}
      <div {...attributes} {...listeners} className="cursor-grab touch-none text-gray-600 hover:text-white">
        <GripVertical size={20} />
      </div>

      {/* RANKING BADGE (Only shows if index is provided) */}
      {index !== undefined && (
        <div className={`font-bold w-8 text-center text-lg ${getRankColor(index)}`}>
          #{index + 1}
        </div>
      )}

      {/* Song Image */}
      <img 
        src={song.image_url} 
        alt={song.title} 
        className="w-10 h-10 rounded bg-[#333] object-cover" 
      />

      {/* Title & Artist */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-white truncate">{song.title}</p>
        <p className="text-xs text-gray-400 truncate">{song.artist}</p>
      </div>

      {/* VOTE COUNT (Only shows if showVotes is true) */}
      {showVotes && (
        <div className="flex flex-col items-end mr-4 min-w-15">
           <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Votes</span>
           <span className="text-sm font-mono text-[#1DB954] font-bold">{song.votes || 0}</span>
        </div>
      )}

      {/* Delete Button */}
      <button
        onClick={() => handleDelete(song.id)}
        className="text-gray-600 hover:text-red-500 transition-colors p-2 cursor-pointer"
        title="Delete song"
      >
        <Trash2 size={18} />
      </button>
    </div>
  )
}