"use client"

import { useEffect, useState } from "react"
import { Music2, XCircle, CheckCircle2 } from "lucide-react"

// --- TYPES ---
interface Song {
  id: number
  title: string
  artist: string
  image_url?: string
  spotify_link?: string
}

// --- COMPONENT 1: SPOTIFY PLAYER ---
export function HitlistPlayer({ activeSong }: { activeSong?: Song }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkDark = () => document.documentElement.classList.contains("dark")
    setIsDark(checkDark())
    const observer = new MutationObserver(() => setIsDark(checkDark()))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  const getTrackId = (link: string) => {
    try {
      const parts = link.split("/");
      const lastPart = parts[parts.length - 1];
      return lastPart.split("?")[0];
    } catch (e) {
      return "";
    }
  }

  const spotifyTheme = isDark ? "1" : "0"
  const trackId = activeSong?.spotify_link ? getTrackId(activeSong.spotify_link) : ""

  return (
    <div className="h-full w-full bg-white dark:bg-[#111] rounded-3xl shadow-sm border border-gray-100 dark:border-white/10 flex flex-col justify-center relative overflow-hidden">
      
      {activeSong?.image_url && (
        <div 
          className="absolute inset-0 opacity-20 blur-3xl scale-150 z-0"
          style={{ backgroundImage: `url(${activeSong.image_url})`, backgroundSize: 'cover' }}
        />
      )}

      <div className="relative z-10 h-full w-full">
        {activeSong?.spotify_link && trackId ? (
          <iframe
            key={trackId + isDark}
            style={{ border: "none" }}
            src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=${spotifyTheme}`}
            width="100%"
            height="100%"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="" 
          />
        ) : (
          <div className="aspect-square w-full max-w-75 mx-auto bg-gray-100 dark:bg-white/5 rounded-2xl flex flex-col items-center justify-center text-gray-400 gap-4">
            <Music2 size={48} />
            <span className="font-bold">Select a song to preview</span>
          </div>
        )}
      </div>
    </div>
  )
}

// --- COMPONENT 2: VOTE LIST (Updated) ---
interface VoteListProps {
  selectedSongs: Song[]
  onToggle: (id: number) => void
  user: { email: string } | null
  hasVoted: boolean
  submitting: boolean
  onSubmit: () => void
}

export function HitlistVoteList({
  selectedSongs,
  onToggle,
  user,
  hasVoted,
  submitting,
  onSubmit,
}: VoteListProps) {
  return (
    <div className="h-full bg-white dark:bg-[#111] rounded-3xl shadow-sm border border-gray-100 dark:border-white/10 flex flex-col justify-center relative overflow-hidden">
      
      {/* HEADER */}
      <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 shrink-0">
        <h3 className="font-bold text-lg flex items-center justify-between">
          Your Hitlist
          <span className={`text-xs px-2 py-1 rounded-full text-white ${hasVoted ? "bg-gray-500" : "bg-[#569429]"}`}>
            {selectedSongs.length} {hasVoted ? "Locked" : "Selected"}
          </span>
        </h3>
      </div>

      {/* SONG LIST */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        {selectedSongs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center opacity-60 p-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-3">
              <Music2 size={20} />
            </div>
            <p className="font-bold text-sm">No songs selected</p>
            {!hasVoted && <p className="text-xs">Tap (+) to add songs</p>}
          </div>
        ) : (
          selectedSongs.map((song) => (
            <div
              key={`list-${song.id}`}
              className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 dark:bg-white/5 group transition-colors border border-transparent shrink-0"
            >
              <img
                src={song.image_url}
                className="w-10 h-10 rounded-lg object-cover shadow-sm"
                alt=""
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate text-gray-900 dark:text-gray-100">{song.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{song.artist}</p>
              </div>

              {/* HIDE REMOVE BUTTON IF VOTED */}
              {!hasVoted && (
                <button
                  onClick={() => onToggle(song.id)}
                  className="text-gray-300 hover:text-red-500 p-2 transition-colors hover:cursor-pointer"
                  title="Remove song"
                >
                  <XCircle size={18} />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* FOOTER ACTION AREA */}
      <div className="p-4 bg-white dark:bg-[#111] border-t border-gray-100 dark:border-white/5 shrink-0">
        {!hasVoted ? (
          <button
            onClick={onSubmit}
            disabled={submitting}
            className={`
              w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wide shadow-lg transition-all
              ${selectedSongs.length === 0
                ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                : "bg-[#569429] hover:bg-[#467a21] text-white shadow-[#569429]/30 hover:shadow-[#569429]/50 hover:-translate-y-0.5"
              }
            `}
          >
            {submitting ? "Processing..." : user ? "Submit Votes" : "Sign in to Vote"}
          </button>
        ) : (
          <div className="w-full py-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl flex items-center justify-center gap-2 font-bold text-sm border border-green-200 dark:border-green-800">
            <CheckCircle2 size={18} />
            Votes Submitted
          </div>
        )}
      </div>
    </div>
  )
}