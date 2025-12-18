"use client"

import Script from "next/script"
import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient"
import { HitlistHeader } from "@/components/hitlist/header"
import { LoginModal } from "@/components/hitlist/login-modal"
import { CarouselSection } from "@/components/hitlist/carousel-section"
import { HitlistPlayer, HitlistVoteList } from "@/components/hitlist/sidebar"
import { HitlistLeaderboard } from "@/components/hitlist/leaderboard"

interface Song {
  id: number
  title: string
  artist: string
  image_url?: string
  spotify_link?: string
  votes?: number
}

export default function SongsSection() {
  const [user, setUser] = useState<{ email: string; token: string } | null>(null)
  const [ready, setReady] = useState(false)
  
  // Data State
  const [songs, setSongs] = useState<Song[]>([]) 
  const [selected, setSelected] = useState<number[]>([])
  
  // UI State
  const [hasVoted, setHasVoted] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [status, setStatus] = useState({ isOpen: true, loading: true, message: "" })
  const [submitting, setSubmitting] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false) // <--- New State for Spinner

  // --- GOOGLE AUTH ---
  function handleToken({ credential }: { credential: string }) {
    try {
        const payload = JSON.parse(atob(credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")))
        setUser({ email: payload.email, token: credential })
        setShowLoginModal(false)
        toast.success(`Signed in as ${payload.email}`)
    } catch { toast.error("Failed to sign in") }
  }

  // --- FETCH DATA (Reusable Function) ---
  const fetchStatus = useCallback(async (showSpinner = false) => {
    if (showSpinner) setIsRefreshing(true)
    
    try {
      const headers: any = {}
      if (user?.token) headers.Authorization = `Bearer ${user.token}`
      
      const res = await fetch("/polls/hitlist/vote", { headers })
      const data = await res.json()

      if (data.isOpen === false) {
        setStatus({ isOpen: false, loading: false, message: data.message })
        return
      }
      
      setStatus({ isOpen: true, loading: false, message: "" })
      
      if (data.songs) {
        // Map backend data to frontend interface
        setSongs(data.songs.map((s: any) => ({
          ...s,
          votes: s.votes // Ensure your API returns 'votes' (from the RPC function)
        })))
      }
      
      if (data.votedIds?.length > 0) {
        setSelected(data.votedIds)
        setHasVoted(true)
      }

    } catch (error: any) {
      setStatus((prev) => ({ ...prev, loading: false, message: error.message }))
    } finally {
      if (showSpinner) setIsRefreshing(false)
    }
  }, [user]) // Re-create if user changes (to get their specific votes)

  // --- EFFECT: INITIAL LOAD & REALTIME SUBSCRIPTION ---
  useEffect(() => {
    // 1. Initial Fetch
    fetchStatus()

    // 2. Set up Realtime Listener
    const channel = supabase
      .channel('hitlist-live-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',           // Listen for new votes
          schema: 'public',
          table: 'Hitlist Votes',    // MUST MATCH DB TABLE NAME EXACTLY
        },
        () => {
          // When a new vote happens, re-fetch data quietly (no spinner)
          console.log("⚡ Live vote detected! Updating leaderboard...")
          fetchStatus(false)
        }
      )
      .subscribe()

    // 3. Cleanup
    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchStatus])

  // --- TOGGLE & SUBMIT ---
  const toggle = (id: number) => {
    if (hasVoted || !status.isOpen) return
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  const submit = async () => {
     if (!user) { setShowLoginModal(true); return }
     if (selected.length === 0) return toast.error("Select at least one song")
     
     setSubmitting(true)
     try {
       const res = await fetch("/polls/hitlist/vote", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ userToken: user.token, targetIds: selected }),
       })
       const json = await res.json()
       if (!res.ok) throw new Error(json.error || "Submission failed")
       
       setHasVoted(true)
       toast.success("Votes submitted successfully!")
       
       // Update immediate UI
       fetchStatus(true) 

     } catch (e: any) { toast.error(e.message) } 
     finally { setSubmitting(false) }
  }

  const activeSong = songs[activeIndex] || songs[0]
  const selectedSongsList = songs.filter((s) => selected.includes(s.id))

  if (status.message && !status.isOpen && !hasVoted) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">{status.message}</div>
  }

  return (
    <div className="w-full min-h-screen relative transition-colors duration-500 bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 selection:bg-green-500 selection:text-white pb-20">
      
      <Script src="https://accounts.google.com/gsi/client" async defer onReady={() => setReady(true)} />

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onToken={handleToken}
        ready={ready}
      />

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12">
        
        <HitlistHeader user={user} onLogout={() => { /*...*/ }} />

        {/* --- NEW LAYOUT: 3-Column Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr">
          
          {/* === ROW 1: CAROUSEL + PLAYER === */}
          
          {/* Carousel (Takes 2 columns) */}
          <div className="lg:col-span-2">
            <CarouselSection 
              songs={songs}
              selected={selected}
              onToggle={toggle}
              onIndexChange={setActiveIndex}
            />
          </div>

          {/* Player (Takes 1 column - Height matches Carousel automatically via grid) */}
          <div className="lg:col-span-1 min-h-[400px]">
            <HitlistPlayer activeSong={activeSong} />
          </div>


          {/* === ROW 2: LEADERBOARD + VOTE LIST === */}

          {/* Leaderboard (Takes 2 columns) */}
          <div className="lg:col-span-2">
            <HitlistLeaderboard 
              songs={songs} 
              onRefresh={() => fetchStatus(true)} 
              isRefreshing={isRefreshing}
            />
          </div>

          {/* Vote List (Takes 1 column - Height matches Leaderboard automatically) */}
          <div className="lg:col-span-1 relative min-h-[400px] lg:min-h-0">
             <HitlistVoteList 
                selectedSongs={selectedSongsList}
                onToggle={toggle}
                user={user}
                hasVoted={hasVoted}
                submitting={submitting}
                onSubmit={submit}
              />
          </div>
          
        </div>
      </div>
    </div>
  )
}