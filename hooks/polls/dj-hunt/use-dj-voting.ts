"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { getVotesAction, submitVotesAction } from "@/actions/dj-hunt"
import { MAX_VOTES_PER_USER } from "@/constants/dj-hunt"
import { decodeJwtPayload } from "@/lib/utils"
import { AuthUser } from "@/types/dj-hunt"

export function useDJVoting() {
  const [user, setUser] = useState<AuthUser | null>(null)
  
  const [selected, setSelected] = useState<number[]>([])
  const [savedVotes, setSavedVotes] = useState<number[]>([])
  
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  // --- 1. GOOGLE ONE TAP HANDLER ---
  const handleToken = useCallback((credential: string) => {
    const payload = decodeJwtPayload(credential)
    if (payload && payload.email) {
      setUser({ email: payload.email, token: credential })
    } else {
      setMessage("Failed to read Google token.")
    }
  }, [])

  // --- 2. FETCH EXISTING VOTES ---
  useEffect(() => {
    async function fetchVotes() {
      if (!user?.token) return
      
      setFetching(true)
      const result = await getVotesAction()
      
      if (result.success && result.votedIds) {
        setSelected(result.votedIds)
        setSavedVotes(result.votedIds)
      } else {
        setMessage(result.error || "Could not load votes")
      }
      setFetching(false)
    }

    fetchVotes()
  }, [user])

  // --- 3. SELECTION HELPERS ---
  const toggle = useCallback((id: number) => {
    setMessage("") 
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      
      if (prev.length >= MAX_VOTES_PER_USER) {
        setMessage(`You can only select up to ${MAX_VOTES_PER_USER} DJs.`)
        return prev
      }
      
      return [...prev, id]
    })
  }, [])

  const isSelected = useCallback((id: number) => selected.includes(id), [selected])

  const hasChanges = useMemo(() => 
    JSON.stringify([...selected].sort()) !== JSON.stringify([...savedVotes].sort()), 
  [selected, savedVotes])

  // --- 5. SUBMISSION LOGIC ---
  const submit = useCallback(async () => {
    setMessage("")
    if (!user) return setMessage("Please sign in first.")
    if (selected.length === 0) return setMessage("Select at least one DJ.")

    setLoading(true)
    try {
      const result = await submitVotesAction(selected)

      if (!result.success) {
        throw new Error(result.error)
      }
      
      setSavedVotes(selected) 
      setMessage(result.message || "Votes updated successfully!")
    } catch (e: any) {
      setMessage(e.message || "Failed to submit votes.")
    } finally {
      setLoading(false)
    }
  }, [user, selected])

  return {
    user, setUser,
    selected, setSelected,
    savedVotes, setSavedVotes,
    message,
    loading,
    fetching,
    toggle,
    isSelected,
    hasChanges,
    submit,
    handleToken
  }
}