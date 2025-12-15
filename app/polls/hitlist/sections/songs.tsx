"use client"

import Script from "next/script"
import { useEffect, useState, useRef } from "react" // Added useRef
import { toast } from "sonner" 

interface Song {
  id: number
  title: string
  artist: string
  image_url?: string
}

export default function SongsSection() {
  const [user, setUser] = useState<{ email: string; token: string } | null>(null)
  const [ready, setReady] = useState(false)
  
  // Use a Ref for the button instead of getElementById (Fixes GSI Error)
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

  // FIXED: Safer Google Button Initialization
  useEffect(() => {
    // Only run if script is ready, user is NOT logged in, and the div exists
    if (ready && !user && googleBtnRef.current) {
      try {
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
  }, [ready, user])

  // 2. Fetch Status
  useEffect(() => {
    async function fetchStatus() {
      try {
        const headers: any = {}
        if (user?.token) headers.Authorization = `Bearer ${user.token}`

        const res = await fetch("/polls/hitlist/vote", { headers })
        
        // FIXED: Handle 404 or Non-JSON errors gracefully
        const contentType = res.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
           throw new Error("API not found. Check file path: app/polls/hitlist/vote/route.ts")
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
        console.error(error)
        setStatus(prev => ({ 
           ...prev, 
           loading: false, 
           // Show the actual error on screen so you know what's wrong
           message: error.message || "Connection failed" 
        }))
      }
    }

    fetchStatus()
  }, [user])

  const toggle = (id: number) => {
    if (hasVoted || !status.isOpen) return
    setSelected((prev) => 
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

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

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">The Hitlist Vote</h1>
        
        {!status.loading && (
           <div className={`inline-block px-4 py-2 rounded-full font-medium text-sm ${!status.isOpen ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>
             {status.message || (hasVoted ? "Voting Closed. Thanks for participating!" : "Select your favorites.")}
           </div>
        )}
      </div>

      {status.loading && (
        <div className="py-20 text-center text-gray-400 animate-pulse">Checking schedule...</div>
      )}

      {/* ERROR State (e.g. API 404) */}
      {!status.loading && status.message.includes("API not found") && (
         <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">
            <strong>Configuration Error:</strong> {status.message}
         </div>
      )}

      {/* CLOSED State */}
      {!status.loading && !status.isOpen && !status.message.includes("API not found") && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
           <p className="text-gray-500">Please check back during the voting window.</p>
        </div>
      )}

      {/* OPEN State */}
      {!status.loading && status.isOpen && (
        <>
          {!user ? (
            <div className="flex flex-col items-center justify-center py-8 mb-8 bg-gray-50 rounded-xl border border-gray-200">
              {/* FIXED: Using Ref */}
              <div ref={googleBtnRef} className="min-h-[40px]" />
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
             {songs.length === 0 && (
               <div className="col-span-full text-center py-12 text-gray-400">
                  {status.message || "No songs found."}
               </div>
            )}
          </div>

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