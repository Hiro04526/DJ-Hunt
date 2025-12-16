"use client"

import Script from "next/script"
import { useEffect, useState, useRef } from "react"
import { toast } from "sonner" 

interface Song {
  id: number
  title: string
  artist: string
  image_url?: string
  spotify_id?: string
}

export default function SongsSection() {
  const [user, setUser] = useState<{ email: string; token: string } | null>(null)
  const [ready, setReady] = useState(false)
  
  // We use this Ref to target the div inside the Modal
  const googleBtnRef = useRef<HTMLDivElement>(null)
  
  const [songs, setSongs] = useState<Song[]>([]) 
  const [selected, setSelected] = useState<number[]>([])
  const [hasVoted, setHasVoted] = useState(false)
  const [status, setStatus] = useState({ 
    isOpen: true, 
    loading: true, 
    message: "" 
  })
  const [submitting, setSubmitting] = useState(false)
  
  // New State: Controls the visibility of the login popup
  const [showLoginModal, setShowLoginModal] = useState(false)

  // --- 1. Google Auth ---
  function handleToken({ credential }: { credential: string }) {
    try {
      const payload = JSON.parse(
        atob(credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
      )
      setUser({ email: payload.email, token: credential })
      setShowLoginModal(false) // Close modal on success
      toast.success(`Signed in as ${payload.email}`)
    } catch {
      toast.error("Failed to sign in")
    }
  }

  // Effect: Render Google Button ONLY when the Modal is open
  useEffect(() => {
    if (ready && !user && showLoginModal && googleBtnRef.current) {
      try {
        // Clear previous buttons if any to prevent duplicates
        googleBtnRef.current.innerHTML = ""
        
        // @ts-ignore
        window.google?.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleToken,
        })
        // @ts-ignore
        window.google?.accounts.id.renderButton(googleBtnRef.current, {
          theme: "outline", size: "large", shape: "pill",
        })
      } catch (e) {
        console.error("GSI Error:", e)
      }
    }
  }, [ready, user, showLoginModal]) // Re-run when modal opens

  // --- 2. Fetch Data ---
  useEffect(() => {
    async function fetchStatus() {
      try {
        const headers: any = {}
        if (user?.token) headers.Authorization = `Bearer ${user.token}`

        const res = await fetch("/polls/hitlist/vote", { headers })
        const contentType = res.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
           throw new Error("API error")
        }

        const data = await res.json()

        if (data.isOpen === false) {
          setStatus({ isOpen: false, loading: false, message: data.message })
          return
        }

        setStatus({ isOpen: true, loading: false, message: "" })
        if (data.songs) setSongs(data.songs)
        if (data.votedIds && data.votedIds.length > 0) {
          setSelected(data.votedIds)
          setHasVoted(true)
        }
      } catch (error: any) {
        setStatus(prev => ({ ...prev, loading: false, message: error.message || "Connection failed" }))
      }
    }
    fetchStatus()
  }, [user])

  // --- 3. Actions ---
  const toggle = (id: number) => {
    if (hasVoted || !status.isOpen) return
    setSelected((prev) => 
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const submit = async () => {
    // 1. If not logged in, trigger the Modal
    if (!user) {
        setShowLoginModal(true)
        return
    }

    if (selected.length === 0) return toast.error("Select at least one song")

    setSubmitting(true)
    try {
      const res = await fetch("/polls/hitlist/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userToken: user.token,
          targetIds: selected,
        }),
      })
      
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Submission failed")
      
      setHasVoted(true)
      toast.success("Votes submitted successfully!") 
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  // --- 4. Render Helper ---
  const renderSongCard = (song: Song, index: number) => {
    const isSelected = selected.includes(song.id)
    const isDisabled = hasVoted 

    return (
      <div 
        key={song.id} 
        className={`
          relative bg-[#2d3748] rounded-2xl p-6 text-center
          shadow-[0_10px_25px_rgba(0,0,0,0.3)] transition-all duration-300 border-2 border-transparent
          ${!isDisabled ? 'hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:border-[#68d391]' : ''}
        `}
      >
        <div className="bg-[#68d391] text-[#1a202c] px-6 py-3 rounded-full font-bold text-lg inline-block mb-6">
          #{index + 1}
        </div>

        {song.spotify_id ? (
          <div className="mb-4">
            <iframe
              src={`https://open.spotify.com/embed/track/${song.spotify_id}?utm_source=generator&theme=0`}
              width="100%" height="152" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy" title={song.title} className="rounded-lg border-0"
            />
          </div>
        ) : (
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-100 mb-1">{song.title}</h3>
            <p className="text-[#68d391] font-medium">{song.artist}</p>
          </div>
        )}

        <div className="flex justify-center mt-2">
          <button
            onClick={() => toggle(song.id)}
            disabled={isDisabled}
            className={`
              flex items-center justify-center gap-2 py-2 px-6 min-w-[120px]
              border-2 rounded-lg text-sm font-semibold transition-all duration-300
              ${isSelected ? 'bg-[#68d391] border-[#68d391] text-[#1a202c]' : 'bg-white border-gray-200 text-gray-800 hover:bg-[#68d391] hover:text-[#1a202c] hover:border-[#68d391] hover:-translate-y-0.5'}
              ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {isSelected ? (
              <><span>Selected</span><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></>
            ) : 'Vote'}
          </button>
        </div>
      </div>
    )
  }

  // --- 5. Loading State ---
  if (status.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a202c] to-[#2d3748] p-8 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-50 mb-2 drop-shadow-md text-center">Green Giant FM Hitlist</h1>
        <p className="text-xl text-[#68d391] animate-pulse">Loading songs...</p>
      </div>
    )
  }

  if (status.message && !status.isOpen && !hasVoted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a202c] to-[#2d3748] p-8 flex flex-col items-center">
         <div className="mt-8 bg-red-900/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-xl">{status.message}</div>
      </div>
    )
  }

  const leftColumnSongs = songs.filter((_, index) => index % 2 === 0)
  const rightColumnSongs = songs.filter((_, index) => index % 2 === 1)

  // --- 6. Main Render ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a202c] to-[#2d3748] p-4 pb-20 relative z-10">
      <Script src="https://accounts.google.com/gsi/client" async defer onReady={() => setReady(true)} />
      
      {/* Login Modal Overlay */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-[#2d3748] border border-gray-600 p-8 rounded-2xl shadow-2xl max-w-sm w-full relative">
              <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                ✕
              </button>
              
              <div className="text-center">
                 <h2 className="text-2xl font-bold text-white mb-2">Almost there!</h2>
                 <p className="text-gray-300 mb-6">Sign in with your DLSU Email to submit your votes.</p>
                 
                 {/* Google Button Target */}
                 <div className="flex justify-center min-h-[50px]">
                    <div ref={googleBtnRef} />
                 </div>
              </div>
           </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-50 mb-3 drop-shadow-lg">Green Giant FM Hitlist</h1>
          <p className="text-xl text-[#68d391] font-medium">{hasVoted ? "Thanks for voting!" : "Vote for your favorites!"}</p>
        </div>

        {/* Note: Top Auth Section Removed per request */}

        {user && (
          <div className="text-center mb-8">
            <button 
              onClick={() => { setUser(null); setSelected([]); setHasVoted(false); }}
              className="text-sm text-gray-400 hover:text-white underline transition-colors"
            >
              Sign out {user.email}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="flex flex-col gap-6">{leftColumnSongs.map((song, index) => renderSongCard(song, index * 2))}</div>
            <div className="flex flex-col gap-6">{rightColumnSongs.map((song, index) => renderSongCard(song, (index * 2) + 1))}</div>
        </div>

        {!hasVoted && selected.length > 0 && (
          <div className="flex flex-col items-center justify-center pt-8 border-t border-gray-600/50">
             <div className="text-lg font-medium text-gray-200 mb-4">{selected.length} Song{selected.length !== 1 && 's'} Selected</div>
             <button
                onClick={submit}
                disabled={submitting}
                className={`
                  px-10 py-3 rounded-full font-bold text-lg text-white shadow-xl transition-all transform hover:-translate-y-1
                  ${selected.length === 0 ? "bg-gray-600 opacity-50 cursor-not-allowed" : "bg-[#68d391] hover:bg-[#5bc184] text-[#1a202c] shadow-[0_4px_14px_0_rgba(104,211,145,0.39)]"}
                `}
             >
                {submitting ? "Submitting..." : (user ? "Submit Votes" : "Sign In to Submit")}
             </button>
          </div>
        )}

        {hasVoted && (
           <div className="text-center pt-8 border-t border-gray-600/50">
              <div className="inline-block bg-[#68d391]/20 text-[#68d391] border border-[#68d391]/50 px-8 py-4 rounded-xl text-lg font-semibold">
                 Votes Submitted Successfully!
              </div>
           </div>
        )}
      </div>
    </div>
  )
}