"use client"

import { useMemo } from "react"
import { LeaderboardProps } from "@/types/hitlist" 
import { MAX_LEADERBOARD_ITEMS } from "@/lib/constants/hitlist"

export function useLeaderboard(songs: LeaderboardProps["songs"]) {
  const { sortedSongs, maxVotes } = useMemo(() => {
    const sorted = [...songs]
      .sort((a, b) => (b.votes || 0) - (a.votes || 0))
      .slice(0, MAX_LEADERBOARD_ITEMS) // Using the shared constant here

    // Fallback to 1 to prevent division by zero in the progress bar
    const max = sorted[0]?.votes || 1

    return { sortedSongs: sorted, maxVotes: max }
  }, [songs])

  return {
    sortedSongs,
    maxVotes,
    isEmpty: sortedSongs.length === 0
  }
}