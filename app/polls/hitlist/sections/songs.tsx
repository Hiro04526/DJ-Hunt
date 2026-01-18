"use client"

import Script from "next/script"
import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase/client"
import { HitlistHeader } from "@/components/hitlist/header"
import { LoginModal } from "@/components/hitlist/login-modal"
import { CarouselSection } from "@/components/hitlist/carousel-section"
import { HitlistPlayer, HitlistVoteList } from "@/components/hitlist/sidebar"
import { HitlistLeaderboard } from "@/components/hitlist/leaderboard"
import { googleLogout } from "@react-oauth/google"
import { getHitlistDataAction, submitHitlistVoteAction, loginAction, logoutAction } from "@/app/actions/hitlist"

interface Song {
  id: number
  title: string
  artist: string
  image_url?: string
  spotify_link?: string
  votes?: number
}

interface StatusState {
    isOpen: boolean
    loading: boolean
    message: string
    nextOpeningTime?: string | null
}

export default function SongsSection() {
  // Cookie/User State
  const [userEmail, setUserEmail] = useState<string | null>(null) 
  const [ready, setReady] = useState(false)
  
  // Data State
  const [songs, setSongs] = useState<Song[]>([]) 
  const [selected, setSelected] = useState<number[]>([])
  
  // UI State
  const [hasVoted, setHasVoted] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  
  // Updated Status State to include nextOpeningTime
  const [status, setStatus] = useState<StatusState>({ 
      isOpen: true, 
      loading: true, 
      message: "",
      nextOpeningTime: null 
  })
  
  const [submitting, setSubmitting] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // --- 1. FETCH DATA (Server Action Checks Cookie) ---
  const fetchStatus = useCallback(async (showSpinner = false) => {
    if (showSpinner) setIsRefreshing(true)

    try {
      const result = await getHitlistDataAction()

      if (!result.success) {
        throw new Error(result.error || "Failed to load data")
      }

      // 1. ALWAYS Set Data (Songs & User) - Even if closed
      if (result.userEmail) setUserEmail(result.userEmail)
      else setUserEmail(null)

      if (result.songs) {
        setSongs(result.songs.map((s: any) => ({
          ...s,
          votes: s.votes 
        })))
      }

      if (result.votedIds && result.votedIds.length > 0) {
        setSelected(result.votedIds)
        setHasVoted(true)
      }

      // 2. Set Status (Open vs Closed)
      // We no longer return early here, allowing the UI to render
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

  // --- 2. GOOGLE LOGIN (Sets Cookie) ---
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

  // --- 3. LOGOUT (Removes Cookie) ---
  const handleLogout = async () => {
      await logoutAction() // Clear server cookie
      googleLogout()       // Clear Google client session
      setUserEmail(null)
      setSelected([])
      setHasVoted(false)
      toast.success("Logged out")
  }

  // --- EFFECT: INITIAL LOAD & REALTIME ---
  useEffect(() => {
    fetchStatus()

    const channel = supabase
      .channel('hitlist-live-updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Hitlist Votes' },
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
    // Prevent toggling if voted OR if voting is closed
    if (hasVoted || !status.isOpen) return
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  const submit = async () => {
     if (!status.isOpen) return toast.error("Voting is currently closed.") // Extra check
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

  // REMOVED: The blocking "if (!status.isOpen) return ..." code block.
  // Now we render the UI regardless of status.

  return (
    <div className="w-full min-h-screen relative transition-colors duration-500 bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 selection:bg-green-500 selection:text-white">
      
      <Script src="https://accounts.google.com/gsi/client" async defer onReady={() => setReady(true)} />

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onToken={handleToken}
        ready={ready}
      />

      <div className="max-w-360 mx-auto px-4 md:px-8 py-8 md:py-12">
        
        {/* HEADER */}
        <HitlistHeader 
            user={userEmail ? { email: userEmail } : null}
            onLogout={handleLogout} 
        />

        {/* --- STATUS BANNER (If Closed) --- */}
        {!status.isOpen && !status.loading && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-center font-medium animate-in fade-in slide-in-from-top-4">
                <p>{status.message}</p>
                {status.nextOpeningTime && (
                    <p className="text-sm opacity-80 mt-1">
                        Next voting cycle begins: {new Date(status.nextOpeningTime).toLocaleString(undefined, { 
                            weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                        })}
                    </p>
                )}
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr">
          
          {/* CAROUSEL & PLAYER */}
          <div className="lg:col-span-2 min-h-100">
            <CarouselSection 
              songs={songs}
              selected={selected}
              onToggle={toggle}
              onIndexChange={setActiveIndex}
              hasVoted={hasVoted || !status.isOpen} 
            />
          </div>

          <div className="lg:col-span-1 min-h-100">
            <HitlistPlayer activeSong={activeSong} />
          </div>

          {/* LEADERBOARD & VOTE LIST */}
          <div className="lg:col-span-2 min-h-100">
            <HitlistLeaderboard 
              songs={songs} 
              onRefresh={() => fetchStatus(true)} 
              isRefreshing={isRefreshing}
            />
          </div>

          <div className="lg:col-span-1 min-h-100">
             <HitlistVoteList 
               selectedSongs={selectedSongsList}
               onToggle={toggle}
               user={userEmail ? { email: userEmail } : null}
               // Disable the submit area if voted OR closed
               hasVoted={hasVoted || !status.isOpen}
               submitting={submitting}
               onSubmit={submit}
             />
          </div>
        </div>
      </div>
    </div>
  )
}