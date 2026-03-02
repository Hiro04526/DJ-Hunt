"use client"

import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase/client"
import { googleLogout } from "@react-oauth/google"
import { getHitlistDataAction, submitHitlistVoteAction, loginAction, logoutAction } from "@/app/actions/hitlist"
import { Song, StatusState } from "@/types/hitlist"
import { HITLIST_DB } from "@/lib/constants/hitlist"

export function useHitlist() {
  // Cookie/User State
  const [userEmail, setUserEmail] = useState<string | null>(null) 
  const [ready, setReady] = useState(false) // For Google Script
  
  // Data State
  const [songs, setSongs] = useState<Song[]>([]) 
  const [selected, setSelected] = useState<number[]>([])
  
  // UI State
  const [hasVoted, setHasVoted] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  
  const [status, setStatus] = useState<StatusState>({ 
      isOpen: true, 
      loading: true, 
      message: "",
      nextOpeningTime: null 
  })
  
  const [submitting, setSubmitting] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // --- 1. FETCH DATA ---
  const fetchStatus = useCallback(async (showSpinner = false) => {
    if (showSpinner) setIsRefreshing(true)

    try {
      const result = await getHitlistDataAction()

      if (!result.success) {
        throw new Error(result.error || "Failed to load data")
      }

      if (result.userEmail) setUserEmail(result.userEmail)
      else setUserEmail(null)

      if (result.songs) {
        setSongs(result.songs.map((s: any) => ({ ...s, votes: s.votes })))
      }

      if (result.votedIds && result.votedIds.length > 0) {
        setSelected(result.votedIds)
        setHasVoted(true)
      }

      setStatus({ 
          isOpen: result.isOpen ?? false, 
          loading: false, 
          message: result.message || "",
          nextOpeningTime: result.nextOpeningTime
      })

    } catch (error: any) {
      setStatus((prev) => ({ ...prev, loading: false, message: error.message }))
    } finally {
      if (showSpinner) setIsRefreshing(false)
    }
  }, [])

  // --- 2. GOOGLE LOGIN ---
  async function handleToken({ credential }: { credential: string }) {
    try {
        const res = await loginAction(credential)
        
        if (res.success && res.email) {
            setUserEmail(res.email)
            setShowLoginModal(false)
            toast.success(`Signed in as ${res.email}`)
            fetchStatus()
        } else {
            toast.error("Login verification failed")
        }
    } catch { 
        toast.error("Failed to sign in") 
    }
  }

  // --- 3. LOGOUT ---
  const handleLogout = async () => {
      await logoutAction() 
      googleLogout() 
      setUserEmail(null)
      setSelected([])
      setHasVoted(false)
      toast.success("Logged out")
  }

  // --- EFFECT: INITIAL LOAD & REALTIME ---
  useEffect(() => {
    fetchStatus()

    const channel = supabase
      .channel(HITLIST_DB.CHANNEL_NAME) 
      .on(
        'postgres_changes', 
        { 
          event: 'INSERT', 
          schema: HITLIST_DB.SCHEMA, 
          table: HITLIST_DB.TABLE_NAME 
        },
        () => {
          console.log("⚡ Live vote detected!")
          fetchStatus(false)
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchStatus])

  // --- TOGGLE & SUBMIT ---
  const toggle = (id: number) => {
    if (hasVoted || !status.isOpen) return
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  const submit = async () => {
     if (!status.isOpen) return toast.error("Voting is currently closed.") 
     if (!userEmail) { setShowLoginModal(true); return }
     if (selected.length === 0) return toast.error("Select at least one song")
     
     setSubmitting(true)
     try {
       const result = await submitHitlistVoteAction(selected)

       if (!result.success) throw new Error(result.error || "Submission failed")
       
       setHasVoted(true)
       toast.success(result.message || "Votes submitted!")
       fetchStatus(true) 

     } catch (e: any) { 
        toast.error(e.message) 
     } finally { 
        setSubmitting(false) 
     }
  }

  const activeSong = songs[activeIndex] || songs[0]
  const selectedSongsList = songs.filter((s) => selected.includes(s.id))

  return {
    userEmail,
    ready, setReady,
    songs, activeSong, selected, selectedSongsList,
    hasVoted, activeIndex, setActiveIndex,
    status, submitting, showLoginModal, setShowLoginModal, isRefreshing,
    fetchStatus, handleToken, handleLogout, toggle, submit
  }
}