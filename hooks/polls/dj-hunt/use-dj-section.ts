"use client"

import { useState, useEffect } from "react"
import { getDJsAction } from "@/actions/dj-hunt"
import { DJ } from "@/types/dj-hunt"
import { VOTING_START, VOTING_END } from "@/constants/dj-hunt"
import { buildDriveEmbedSrc } from "@/lib/utils"

export function useDJSection() {
  // --- Data State ---
  const [DJs, setDJs] = useState<DJ[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // --- UI State ---
  const [selectedDJ, setSelectedDJ] = useState<DJ | null>(null)
  const [isVotingOpen, setIsVotingOpen] = useState(false)
  
  // --- Timer State ---
  const [now, setNow] = useState<number | null>(null)

  // 1. TIME TRACKING EFFECT
  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(id)
  }, [])

  const isWithinVotingWindow = now !== null && now >= VOTING_START && now <= VOTING_END

  // 2. FETCH DATA EFFECT
  useEffect(() => {
    async function fetchDJs() {
      try {
        const result = await getDJsAction()

        if (result.success && result.data) {
          setDJs(result.data as DJ[])
        } else {
          setError(result.error || "Failed to load DJs")
        }
      } catch (err) {
        console.error(err)
        setError("Something went wrong while fetching DJs")
      } finally {
        setLoading(false)
      }
    }
    fetchDJs()
  }, [])

  return {
    DJs,
    loading,
    error,
    selectedDJ, 
    setSelectedDJ,
    isVotingOpen, 
    setIsVotingOpen,
    isWithinVotingWindow,
    buildDriveEmbedSrc
  }
}