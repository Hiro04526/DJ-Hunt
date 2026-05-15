"use client"

import { Metadata } from "next"
import { TitleSection } from "./sections/title"
import { RosterSection } from "./sections/roster"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

const metadata: Metadata = {
  title: 'Radio Talent',
  description: 'The faces and voices of Green Giant FM.',
}

export default function RadioTalentPage() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const hash = window.location.hash.replace("#", "")
    
    if (!hash) return

    let retryCount = 0
    const maxRetries = 30 // Stop trying after 3 seconds

    const scrollInterval = setInterval(() => {
      const element = document.getElementById(hash)

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
        clearInterval(scrollInterval)
      } else if (retryCount >= maxRetries) {
        clearInterval(scrollInterval)
      }
      
      retryCount++
    }, 100) // Check every 100ms

    return () => clearInterval(scrollInterval)
  }, [searchParams]) // Re-run if the URL changes

  return (
    <main className="min-h-screen bg-[#111] text-white mt-12 pb-16 font-sans">
      <TitleSection />
      <RosterSection />
    </main>
  )
}