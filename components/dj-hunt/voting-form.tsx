"use client"

import Script from "next/script"
import { useEffect, useState } from "react"

type DJ = {
  id: number
  name: string
  image: string
}

export function DJVotingForm({ djs }: { djs: DJ[] }) {
  // Logic: Keep the new secure user object (email + token)
  const [user, setUser] = useState<{ email: string; token: string } | null>(null)
  const [ready, setReady] = useState(false)
  const [selected, setSelected] = useState<number[]>([])
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  // ----- Google One Tap handlers -----
  function handleToken({ credential }: { credential: string }) {
    try {
      const payload = JSON.parse(
        atob(credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
      )
      // Save secure token
      setUser({ email: payload.email, token: credential })
    } catch {
      setMessage("Failed to read Google token.")
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
        theme: "outline",
        size: "large",
        shape: "pill",
      })
    }
  }, [ready, user])

  // ----- selection helpers -----
  const toggle = (id: number) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 3) {
        setMessage("You can only select up to 3 DJs.")
        return prev
      }
      return [...prev, id]
    })
  }

  const isSelected = (id: number) => selected.includes(id)

  // ----- submit -----
  const submit = async () => {
    setMessage("")
    if (!user) return setMessage("Please sign in first.")
    if (selected.length === 0) return setMessage("Select at least one DJ.")

    setLoading(true)
    try {
      const res = await fetch("/dj-hunt/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            userToken: user.token, 
            djIds: selected 
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Something went wrong.")
      setMessage(json.message || "Votes submitted successfully!")
    } catch (e: any) {
      setMessage(e.message || "Failed to submit votes.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        async
        defer
        onReady={() => setReady(true)}
      />

      {/* Auth State: Not Signed In */}
      {!user && (
        <div className="mb-4 grid place-items-center">
          <div id="gbtn" />
          <p className="mt-4 text-sm opacity-70">Sign in with Google to vote.</p>
        </div>
      )}

      {/* Auth State: Signed In */}
      {user && (
        <div className="mx-auto w-full max-w-3xl max-h-[80vh] overflow-y-scroll scrollbar-hide">
          
          {/* Green Banner: Single Line, Centered */}
          <div className="mb-6 flex w-full flex-row items-center justify-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-green-800 dark:bg-green-900/30 dark:text-green-300">
             <span className="text-sm">
               Voting as <strong>{user.email}</strong>
             </span>
             <button 
               onClick={() => setUser(null)}
               className="text-sm underline hover:no-underline opacity-80"
             >
               [Sign out]
             </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {djs.map((dj) => {
              const selectedState = isSelected(dj.id)
              return (
                <button
                  key={dj.id}
                  type="button"
                  onClick={() => toggle(dj.id)}
                  aria-pressed={selectedState}
                  className={[
                    "relative h-40 w-full rounded-xl border overflow-hidden text-left transition",
                    "flex items-stretch",
                    selectedState
                      ? "border-green-500 ring-2 ring-green-500/40"
                      : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600",
                    "bg-white dark:bg-neutral-900",
                  ].join(" ")}
                >
                  {/* Green vignette overlay when selected */}
                  {selectedState && (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-xl"
                      style={{
                        boxShadow:
                          "inset 0 0 0 2px rgba(86,148,41,.45), inset 0 0 40px rgba(86,148,41,.30)",
                      }}
                    />
                  )}

                  {/* Image pinned to left */}
                  <div className="flex-none relative w-32">
                    <img
                      src={dj.image}
                      alt={dj.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>

                  {/* Text area */}
                  <div className="flex flex-col justify-center flex-grow px-4 py-3">
                    <p className="text-xl font-medium truncate">Finalist {dj.name}</p>
                  </div>

                  {/* Check circle indicator */}
                  <div className="flex items-center pr-4">
                    <div
                      className={`h-5 w-5 rounded-full border flex items-center justify-center text-xs ${
                        selectedState
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-neutral-300 dark:border-neutral-600"
                      }`}
                    >
                      {selectedState ? "✓" : ""}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className="mt-5 w-full rounded-full bg-green-600 py-2 text-white hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Submitting…" : "Submit Votes"}
          </button>

          {message && <p className="mt-2 text-center text-sm">{message}</p>}
        </div>
      )}
    </>
  )
}