"use client"

import { useEffect, useRef } from "react"

export function useLoginModal(
  ready: boolean | undefined, 
  isOpen: boolean, 
  onToken: (response: any) => void
) {
  const googleBtnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ready && isOpen && googleBtnRef.current) {
      try {
        googleBtnRef.current.innerHTML = ""
        // @ts-ignore
        window.google?.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: onToken,
        })
        // @ts-ignore
        window.google?.accounts.id.renderButton(googleBtnRef.current, {
          theme: "outline",
          size: "large",
          shape: "pill",
        })
      } catch (e) {
        console.error("Failed to render Google Sign-In button:", e)
      }
    }
  }, [ready, isOpen, onToken])

  return { googleBtnRef }
}