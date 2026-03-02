"use client"

import { useEffect, useState } from "react"
import { Music2 } from "lucide-react"
import { Song } from "@/types/hitlist"

export function HitlistPlayer({ activeSong }: { activeSong?: Song }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkDark = () => document.documentElement.classList.contains("dark")
    setIsDark(checkDark())
    const observer = new MutationObserver(() => setIsDark(checkDark()))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  const spotifyTheme = isDark ? "1" : "0"

  const getTrackId = (url: string) => {
    try {
      const parts = url.split("/")
      const lastPart = parts[parts.length - 1]
      return lastPart.split("?")[0]
    } catch (e) {
      return ""
    }
  }

  const trackId = activeSong?.spotify_link ? getTrackId(activeSong.spotify_link) : ""

  return (
    <div className="h-full w-full relative overflow-hidden rounded-3xl shadow-sm border border-gray-100 dark:border-white/10 flex flex-col items-center justify-center bg-black">
      {activeSong?.image_url && (
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-black/40 z-10" />
           <div 
             className="absolute inset-0 blur-xs scale-125 opacity-80"
             style={{ 
               backgroundImage: `url(${activeSong.image_url})`, 
               backgroundSize: 'cover',
               backgroundPosition: 'center',
             }} 
           />
        </div>
      )}

      <div className="relative z-20 w-full max-w-md px-4"> 
        {activeSong?.spotify_link && trackId ? (
          <iframe
            key={trackId + spotifyTheme}
            style={{ border: "none" }}
            src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=${spotifyTheme}`}
            width="100%" 
            height="352"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="shadow-2xl rounded-xl mx-auto w-70.5 lg:w-88" 
          />
        ) : (
          <div className="aspect-square w-full max-w-75 mx-auto bg-white/10 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-white/50 gap-4 border border-white/5">
            <Music2 size={48} />
            <span className="font-bold">Select a song to preview</span>
          </div>
        )}
      </div>
    </div>
  )
}