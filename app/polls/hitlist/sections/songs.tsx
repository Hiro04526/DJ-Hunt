"use client"

import Script from "next/script"
import { useEffect, useState } from "react"
import { toast } from "sonner" 

// Interface matching your DB structure
interface Song {
  id: number
  title: string
  artist: string
  image_url?: string // Optional
}

export default function SongsSection() {
  const [user, setUser] = useState<{ email: string; token: string } | null>(null)
  const [ready, setReady] = useState(false)
  
  // State
  const [songs, setSongs] = useState<Song[]>([]) // Stores fetched songs
  const [selected, setSelected] = useState<number[]>([])
  const [hasVoted, setHasVoted] = useState(false)
  const [status, setStatus] = useState({ 
    isOpen: true, 
    loading: true, 
    message: "" 
  })
  const [submitting, setSubmitting] = useState(false)

  // 1. Google Auth Logic
  function handleToken({ credential }: { credential: string }) {
    try {
      const payload = JSON.parse(
        atob(credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
      )
      setUser({ email: payload.email, token: credential })
    } catch {
      toast.error("Failed to sign in")
    }
  }

  useEffect(() => {
    if (ready && !user) {
      // @ts-ignore
      window.google?.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleToken,
      })
      // @ts-ignore
      window.google?.accounts.id.renderButton(document.getElementById("gbtn"), {
        theme: "outline", size: "large", shape: "pill",
      })
    }
  }, [ready, user])

  // 2. Fetch Status, Songs & Votes
  useEffect(() => {
    async function fetchStatus() {
      try {
        const headers: any = {}
        if (user?.token) headers.Authorization = `Bearer ${user.token}`

        const res = await fetch("/api/hitlist", { headers })
        const data = await res.json()

        // Handle Closed State
        if (data.isOpen === false) {
          setStatus({ 
            isOpen: false, 
            loading: false, 
            message: data.message 
          })
          return
        }

        // Handle Open State: Set Songs and Vote Status
        setStatus({ isOpen: true, loading: false, message: "" })
        
        if (data.songs) {
          setSongs(data.songs)
        }

        if (data.votedIds && data.votedIds.length > 0) {
          setSelected(data.votedIds)
          setHasVoted(true)
        }
      } catch (error) {
        console.error(error)
        setStatus(prev => ({ ...prev, loading: false }))
      }
    }

    fetchStatus()
  }, [user])

  // 3. Toggle Selection
  const toggle = (id: number) => {
    if (hasVoted || !status.isOpen) return
    setSelected((prev) => 
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  // 4. Submit Votes
  const submit = async () => {
    if (!user) return toast.error("Please sign in first")
    if (selected.length === 0) return toast.error("Select at least one song")

    setSubmitting(true)
    try {
      const res = await fetch("/api/hitlist", {
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

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <Script
        src="https://accounts.google.com/gsi/client"
        async defer
        onReady={() => setReady(true)}
      />

      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">The Hitlist Vote</h1>
        
        {!status.loading && !status.isOpen ? (
           <div className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full font-medium text-sm">
             {status.message}
           </div>
        ) : (
           <p className="text-gray-600">
             {hasVoted ? "Voting Closed. Thanks for participating!" : "Select your favorites for the week."}
           </p>
        )}
      </div>

      {/* Loading State */}
      {status.loading && (
        <div className="py-20 text-center text-gray-400 animate-pulse">Checking schedule...</div>
      )}

      {/* CLOSED State */}
      {!status.loading && !status.isOpen && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
           <p className="text-gray-500">Please check back during the voting window.</p>
        </div>
      )}

      {/* OPEN State */}
      {!status.loading && status.isOpen && (
        <>
          {/* Auth Section */}
          {!user ? (
            <div className="flex flex-col items-center justify-center py-8 mb-8 bg-gray-50 rounded-xl border border-gray-200">
              <div id="gbtn" className="min-h-[40px]" />
              <p className="mt-4 text-sm text-gray-500">Sign in to cast your vote</p>
            </div>
          ) : (
             <div className="flex justify-between items-center mb-6 px-4 py-3 bg-green-50 text-green-800 rounded-lg">
                <span className="text-sm">Voting as <strong>{user.email}</strong></span>
                <button 
                  onClick={() => { setUser(null); setSelected([]); setHasVoted(false); }}
                  className="text-sm underline hover:no-underline opacity-80"
                >
                  Sign out
                </button>
             </div>
          )}

          {/* Song Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-24">
            {songs.map((song) => {
              const active = selected.includes(song.id)
              const locked = hasVoted || !user
              
              return (
                <button
                  key={song.id}
                  onClick={() => user && toggle(song.id)}
                  disabled={locked}
                  className={`
                    relative p-4 rounded-xl border text-left transition-all flex items-start gap-3
                    ${locked ? "cursor-default opacity-80" : "hover:shadow-md cursor-pointer group"}
                    ${active 
                      ? "border-green-500 bg-green-50/50 ring-1 ring-green-500" 
                      : "border-gray-200 bg-white"
                    }
                  `}
                >
                  <div className={`
                    flex-shrink-0 w-6 h-6 mt-1 rounded border flex items-center justify-center transition-colors
                    ${active ? "bg-green-500 border-green-500" : "border-gray-300 group-hover:border-green-400"}
                  `}>
                    {active && <span className="text-white text-xs">✓</span>}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 leading-tight">{song.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{song.artist}</p>
                  </div>
                </button>
              )
            })}
            
            {/* Fallback if no songs returned */}
            {songs.length === 0 && (
               <div className="col-span-full text-center py-12 text-gray-400">
                  No songs found in database.
               </div>
            )}
          </div>

          {/* Sticky Footer */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg z-20">
             <div className="max-w-5xl mx-auto flex justify-between items-center">
                <div className="text-sm font-medium text-gray-600">
                    {selected.length} Selected
                </div>
                
                {!user ? (
                   <span className="text-sm text-gray-400">Sign in above to submit</span>
                ) : (
                   <button
                      onClick={submit}
                      disabled={submitting || hasVoted || selected.length === 0}
                      className={`
                          px-8 py-2.5 rounded-full font-semibold text-white transition-all
                          ${hasVoted 
                              ? "bg-gray-400 cursor-not-allowed" 
                              : "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-900/20"
                          }
                          disabled:opacity-70
                      `}
                   >
                      {submitting ? "Submitting..." : hasVoted ? "Votes Submitted" : "Submit Votes"}
                   </button>
                )}
             </div>
          </div>
        </>
      )}
    </div>
  )
}