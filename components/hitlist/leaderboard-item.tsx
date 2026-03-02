import { cn } from "@/lib/utils"
import { LeaderboardItemProps } from "@/types/hitlist" 

export function LeaderboardItem({ song, index, maxVotes }: LeaderboardItemProps) {
  const voteCount = song.votes || 0
  const percentage = Math.round((voteCount / maxVotes) * 100)
  
  return (
    <div className="group relative">
      <div className="flex items-center gap-4 relative z-10">
        
        {/* Rank Number */}
        <div 
          className={cn(
            "w-8 text-left font-black text-lg",
            // Updated to use the custom 'brand' color from tailwind.config.ts
            index === 0 ? "text-brand text-2xl" : "text-gray-400" 
          )}
        >
          #{index + 1}
        </div>

        <img 
          src={song.image_url} 
          alt={song.title}
          loading="lazy"
          className="w-12 h-12 rounded-lg object-cover shadow-sm"
        />

        {/* Song Details & Progress Bar */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline mb-1">
            <h4 className="font-bold truncate text-gray-900 dark:text-gray-100">
              {song.title}
            </h4>
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
              {voteCount.toLocaleString()} votes
            </span>
          </div>
          
          <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-1000 ease-out",
                index === 0 ? "bg-brand" : "bg-gray-400 dark:bg-gray-600" 
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1 truncate">{song.artist}</p>
        </div>

      </div>
    </div>
  )
}