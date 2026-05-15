"use client"

import { TitleSection } from "./sections/title"
import { RosterSection } from "./sections/roster"
import { Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"

function ScrollManager() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const hash = window.location.hash.replace("#", "")
    if (!hash) return

    let retryCount = 0
    const maxRetries = 20

    const scrollInterval = setInterval(() => {
      const element = document.getElementById(hash)

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
        clearInterval(scrollInterval)
      } else if (retryCount >= maxRetries) {
        clearInterval(scrollInterval)
      }
      
      retryCount++
    }, 100)

    return () => clearInterval(scrollInterval)
  }, [searchParams])

  return null // It doesn't render anything visually
}

export default function RadioTalentPage() {
  return (
    <main className="min-h-screen bg-[#111] text-white mt-12 pb-16 font-sans">
      <Suspense fallback={null}>
        <ScrollManager />
      </Suspense>
      <TitleSection />
      <RosterSection />
    </main>
  )
}