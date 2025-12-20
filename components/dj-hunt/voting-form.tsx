"use client"

import Script from "next/script"
import { useEffect, useState } from "react"
import { getVotesAction, submitVotesAction } from "@/app/actions/dj-hunt"

type DJ = {
  id: number
  name: string
  image: string
}

export function DJVotingForm({ djs }: { djs: DJ[] }) {
  const [user, setUser] = useState<{ email: string; token: string } | null>(null)
  const [ready, setReady] = useState(false)
  const [selected, setSelected] = useState<number[]>([])
  const [savedVotes, setSavedVotes] = useState<number[]>([])
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  // ----- Google One Tap handlers -----
  function handleToken({ credential }: { credential: string }) {
    try {
      const payload = JSON.parse(
        atob(credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
      )
      setUser({ email: payload.email, token: credential })
    } catch {
      setMessage("Failed to read Google token.")
    }
  }

  // ----- Fetch Existing Votes on Login (Updated) -----
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

  // ----- Selection Helpers -----
  const toggle = (id: number) => {
    setMessage("") 
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

  const hasChanges =
    JSON.stringify([...selected].sort()) !== JSON.stringify([...savedVotes].sort())

  // ----- Submit -----
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
          <div className="mb-6 flex w-full flex-row items-center justify-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <span className="text-sm">
              Voting as <strong>{user.email}</strong>
            </span>
            <button
              onClick={() => {
                setUser(null)
                setSelected([])
                setSavedVotes([])
              }}
              className="text-sm underline hover:no-underline opacity-80"
            >
              [Sign out]
            </button>
          </div>

          {fetching ? (
            <div className="py-20 text-center text-neutral-500 animate-pulse">
              Loading your votes...
            </div>
          ) : (
            <>
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
                      {/* Green vignette */}
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

                      <div className="flex-none relative w-32">
                        <img
                          src={dj.image}
                          alt={dj.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex flex-col justify-center grow px-4 py-3">
                        <p className="text-xl font-medium truncate">Finalist {dj.name}</p>
                      </div>

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
                disabled={loading || !hasChanges || selected.length === 0}
                className={[
                  "mt-5 w-full rounded-full py-2 text-white transition-all",
                  !hasChanges && savedVotes.length > 0
                    ? "bg-neutral-400 cursor-default" // Locked (Saved)
                    : "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-900/20", // Active (Changes made)
                  "disabled:opacity-60 disabled:cursor-not-allowed"
                ].join(" ")}
              >
                {loading
                  ? "Saving..."
                  : !hasChanges && savedVotes.length > 0
                  ? "Votes Saved"
                  : selected.length > 0 
                    ? `Submit ${selected.length} Vote${selected.length !== 1 ? "s" : ""}`
                    : "Select a DJ"}
              </button>

              {message && <p className="mt-2 text-center text-sm">{message}</p>}
            </>
          )}
        </div>
      )}
    </>
  )
}