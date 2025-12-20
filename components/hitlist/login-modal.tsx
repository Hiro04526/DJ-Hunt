"use client"

import { useEffect, useRef } from "react"
import { XCircle } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onToken: (token: any) => void
  ready: boolean // Google script ready status
}

export function LoginModal({ isOpen, onClose, onToken, ready }: LoginModalProps) {
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
        console.error(e)
      }
    }
  }, [ready, isOpen, onToken])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#111] border dark:border-white/10 p-8 rounded-3xl shadow-2xl max-w-sm w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
        >
          <XCircle size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-2 text-center">Sign In</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-center text-sm">
          Use your DLSU Email to vote.
        </p>
        <div className="flex justify-center min-h-12.5">
          <div ref={googleBtnRef} />
        </div>
      </div>
    </div>
  )
}