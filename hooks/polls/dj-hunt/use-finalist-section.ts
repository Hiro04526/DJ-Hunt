"use client"

import { useState, useEffect, useMemo } from "react"
import { getFinalistsAction } from "@/actions/dj-hunt"
import { Finalist } from "@/types/dj-hunt"
import { VOTING_START, VOTING_END } from "@/constants/dj-hunt"
import { buildDriveEmbedSrc } from "@/lib/utils"

export function useFinalistSection() {
  // --- Data State ---
  const [Finalists, setFinalists] = useState<Finalist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // --- UI State ---
  const [selectedFinalist, setSelectedFinalist] = useState<Finalist | null>(null)
  const [isVotingOpen, setIsVotingOpen] = useState(false)
  
  // --- Timer State ---
  const [now, setNow] = useState<number | null>(null)

  // 1. TIME TRACKING EFFECT
  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(id)
  }, [])

  const isWithinVotingWindow = useMemo(() => 
    now !== null && now >= VOTING_START && now <= VOTING_END, 
  [now])

  // 2. FETCH DATA EFFECT
  useEffect(() => {
    async function fetchFinalists() {
      try {
        const result = await getFinalistsAction()

        if (result.success && result.data) {
          setFinalists(result.data as Finalist[])
        } else {
          setError(result.error || "Failed to load Finalists")
        }
      } catch (err) {
        console.error(err)
        setError("Something went wrong while fetching Finalists")
      } finally {
        setLoading(false)
      }
    }
    fetchFinalists()
  }, [])

  return {
    Finalists,
    loading,
    error,
    selectedFinalist, 
    setSelectedFinalist,
    isVotingOpen, 
    setIsVotingOpen,
    isWithinVotingWindow,
    buildDriveEmbedSrc
  }
}