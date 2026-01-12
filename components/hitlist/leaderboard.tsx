"use client"

import { Trophy, RefreshCw } from "lucide-react"

interface Song {
  id: number
  title: string
  artist: string
  image_url?: string
  votes?: number
}

interface LeaderboardProps {
  songs: Song[]
  onRefresh: () => void
  isRefreshing: boolean
}

export function HitlistLeaderboard({ songs, onRefresh, isRefreshing }: LeaderboardProps) {
  // 1. Sort by votes (highest first) and take Top 5
  const sortedSongs = [...songs]
    .sort((a, b) => (b.votes || 0) - (a.votes || 0))
    .slice(0, 5)

  const maxVotes = sortedSongs[0]?.votes || 1

  if (sortedSongs.length === 0) return null

  return (
    <div className="relative flex flex-col h-100 lg:h-full bg-white dark:bg-[#111] rounded-3xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
        
        {/* Header Left */}
        <h3 className="font-bold text-xl flex items-center gap-2">
          <Trophy className="text-[#569429]" size={20} />
          Current Standings
        </h3>

        {/* Header Right (Live Tag + Refresh Button) */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex text-sm font-bold uppercase tracking-wider text-red-500 items-center gap-1 animate-pulse">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            Live
          </span>
          
          <button 
            onClick={onRefresh}
            disabled={isRefreshing}
            className="rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 transition-colors hover:cursor-pointer"
            title="Refresh Leaderboard"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin text-[#569429]" : ""} />
          </button>
        </div>
      </div>

      {/* List Content */}
      <div className="p-6 flex flex-col gap-4">
        {sortedSongs.map((song, index) => {
          const voteCount = song.votes || 0
          const percentage = Math.round((voteCount / maxVotes) * 100)
          
          return (
            <div key={`leaderboard-${song.id}`} className="group relative">
              <div className="flex items-center gap-4 relative z-10">
                <div className={`
                  w-8 text-left font-black text-lg 
                  ${index === 0 ? "text-[#569429] text-2xl" : "text-gray-400"}
                `}>
                  #{index + 1}
                </div>

                <img 
                  src={song.image_url} 
                  alt={song.title}
                  className="w-12 h-12 rounded-lg object-cover shadow-sm"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold truncate text-gray-900 dark:text-gray-100">
                      {song.title}
                    </h4>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                      {voteCount.toLocaleString()} votes
                    </span>
                  </div>
                  
                  <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        index === 0 ? "bg-[#569429]" : "bg-gray-400 dark:bg-gray-600"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1 truncate">{song.artist}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}