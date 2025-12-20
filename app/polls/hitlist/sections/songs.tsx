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
import { googleLogout } from "@react-oauth/google" // Ensure this is installed/imported
import { 
  getHitlistDataAction, 
  submitHitlistVoteAction, 
  loginAction,
  logoutAction
} from "@/app/actions/hitlist"

interface Song {
  id: number
  title: string
  artist: string
  image_url?: string
  spotify_link?: string
  votes?: number
}

export default function SongsSection() {
  // We only need the email now, token is HTTP-only cookie
  const [userEmail, setUserEmail] = useState<string | null>(null) 
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
  const [isRefreshing, setIsRefreshing] = useState(false)

  // --- 1. FETCH DATA (Server Action Checks Cookie) ---
  const fetchStatus = useCallback(async (showSpinner = false) => {
    if (showSpinner) setIsRefreshing(true)

    try {
      // ✅ Correct: No arguments needed. Server checks cookie.
      const result = await getHitlistDataAction()

      if (!result.success) {
        throw new Error(result.error || "Failed to load data")
      }

      // Handle User Session from Server
      if (result.userEmail) {
        setUserEmail(result.userEmail)
      } else {
        setUserEmail(null)
      }

      // Handle "Voting Closed"
      if (result.isOpen === false) {
        setStatus({ isOpen: false, loading: false, message: result.message || "Voting is closed." })
        return
      }

      // Handle "Voting Open"
      setStatus({ isOpen: true, loading: false, message: "" })

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

    } catch (error: any) {
      setStatus((prev) => ({ ...prev, loading: false, message: error.message }))
    } finally {
      if (showSpinner) setIsRefreshing(false)
    }
  }, []) // Removed dependency on 'user' since cookie handles it

  // --- 2. GOOGLE LOGIN (Sets Cookie) ---
  async function handleToken({ credential }: { credential: string }) {
    try {
        // ✅ Correct: Call Server Action to verify & set cookie
        const res = await loginAction(credential)
        
        if (res.success && res.email) {
            setUserEmail(res.email)
            setShowLoginModal(false)
            toast.success(`Signed in as ${res.email}`)
            fetchStatus() // Refresh to check for previous votes
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
    if (hasVoted || !status.isOpen) return
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  const submit = async () => {
     if (!userEmail) { setShowLoginModal(true); return }
     if (selected.length === 0) return toast.error("Select at least one song")
     
     setSubmitting(true)
     try {
       // ✅ Correct: Only pass IDs. Server gets user from cookie.
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

      <div className="max-w-360 mx-auto px-4 md:px-8 py-8 md:py-12">
        
        {/* Pass userEmail and Logout handler */}
        <HitlistHeader 
            user={userEmail ? { email: userEmail } : null}
            onLogout={handleLogout} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr">
          
          {/* CAROUSEL & PLAYER */}
          <div className="lg:col-span-2">
            <CarouselSection 
              songs={songs}
              selected={selected}
              onToggle={toggle}
              onIndexChange={setActiveIndex}
            />
          </div>

          <div className="lg:col-span-1 min-h-100">
            <HitlistPlayer activeSong={activeSong} />
          </div>

          {/* LEADERBOARD & VOTE LIST */}
          <div className="lg:col-span-2">
            <HitlistLeaderboard 
              songs={songs} 
              onRefresh={() => fetchStatus(true)} 
              isRefreshing={isRefreshing}
            />
          </div>

          <div className="lg:col-span-1 relative min-h-100 lg:min-h-0">
             <HitlistVoteList 
               selectedSongs={selectedSongsList}
               onToggle={toggle}
               user={userEmail ? { email: userEmail } : null}
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