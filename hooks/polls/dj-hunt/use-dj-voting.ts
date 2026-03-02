"use client"

import { useState, useEffect } from "react"
import { getVotesAction, submitVotesAction } from "@/app/actions/dj-hunt"
import { MAX_VOTES_PER_USER } from "@/lib/constants/dj-hunt"
import { decodeJwtPayload } from "@/lib/utils"
import { AuthUser } from "@/types/dj-hunt"

export function useDJVoting() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [ready, setReady] = useState(false)
  
  const [selected, setSelected] = useState<number[]>([])
  const [savedVotes, setSavedVotes] = useState<number[]>([])
  
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  // --- 1. GOOGLE ONE TAP HANDLER ---
  function handleToken({ credential }: { credential: string }) {
    const payload = decodeJwtPayload(credential)
    if (payload && payload.email) {
      setUser({ email: payload.email, token: credential })
    } else {
      setMessage("Failed to read Google token.")
    }
  }

  // --- 2. FETCH EXISTING VOTES ---
  useEffect(() => {
    async function fetchVotes() {
      if (!user?.token) return
      
      setFetching(true)
      const result = await getVotesAction(user.token)
      
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

  // --- 3. INITIALIZE GOOGLE AUTH ---
  useEffect(() => {
    if (ready && !user) {
      // @ts-ignore
      window.google?.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleToken,
      })
      // @ts-ignore
      window.google?.accounts.id.renderButton(document.getElementById("gbtn"), {
        theme: "outline",
        size: "large",
        shape: "pill",
      })
    }
  }, [ready, user])

  // --- 4. SELECTION HELPERS ---
  const toggle = (id: number) => {
    setMessage("") 
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      
      // Using the extracted business rule here
      if (prev.length >= MAX_VOTES_PER_USER) {
        setMessage(`You can only select up to ${MAX_VOTES_PER_USER} DJs.`)
        return prev
      }
      
      return [...prev, id]
    })
  }

  const isSelected = (id: number) => selected.includes(id)

  const hasChanges = JSON.stringify([...selected].sort()) !== JSON.stringify([...savedVotes].sort())

  // --- 5. SUBMISSION LOGIC ---
  const submit = async () => {
    setMessage("")
    if (!user) return setMessage("Please sign in first.")
    if (selected.length === 0) return setMessage("Select at least one DJ.")

    setLoading(true)
    try {
      const result = await submitVotesAction(user.token, selected)

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
  }

  return {
    user, setUser,
    setReady,
    selected, setSelected,
    savedVotes, setSavedVotes,
    message,
    loading,
    fetching,
    toggle,
    isSelected,
    hasChanges,
    submit
  }
}