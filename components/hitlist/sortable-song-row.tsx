"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Trash2, ExternalLink } from "lucide-react"

interface SortableSongRowProps {
  song: any
  handleDelete: (id: number) => void
}

export function SortableSongRow({ song, handleDelete }: SortableSongRowProps) {
  // 1. Setup the sortable hooks
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: song.id })

  // 2. Define the styles for the moving item
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto", // Keeps dragged item on top
    opacity: isDragging ? 0.8 : 1,
    position: "relative" as "relative",
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group flex items-center gap-3 p-3 border-b border-[#222] bg-[#111] transition-colors
        ${isDragging ? "bg-[#1a1a1a] border-[#1DB954]" : "hover:bg-[#1a1a1a]"}
      `}
    >
      {/* DRAG HANDLE: The user grabs this icon to move the row */}
      <div 
        {...attributes} 
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-600 hover:text-white p-1 rounded transition-colors touch-none"
      >
        <GripVertical size={20} />
      </div>

      {/* Song Image */}
      <div className="w-10 h-10 relative shrink-0">
        <img 
          src={song.image_url || "/placeholder.png"} 
          alt={song.title} 
          className="w-full h-full rounded object-cover select-none pointer-events-none" 
        />
      </div>

      {/* Song Info */}
      <div className="flex-1 min-w-0 select-none">
        <p className="font-medium text-sm truncate text-white">
          {song.title}
        </p>
        <p className="text-xs text-gray-400 truncate">
          {song.artist}
        </p>
      </div>

      {/* Action Buttons (Visible on Hover) */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <a 
          href={song.spotify_link} 
          target="_blank" 
          rel="noreferrer"
          className="p-2 text-gray-500 hover:text-[#1DB954] transition-colors"
        >
          <ExternalLink size={14} />
        </a>
        <button 
          onPointerDown={(e) => e.stopPropagation()} // Prevents drag from starting when clicking delete
          onClick={() => handleDelete(song.id)}
          className="p-2 text-gray-500 hover:text-red-500 transition-colors hover:cursor-pointer"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}