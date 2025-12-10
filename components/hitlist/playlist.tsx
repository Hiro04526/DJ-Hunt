"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function Playlist() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const isDark = theme === "dark"
  const spotifyTheme = isDark ? "0" : "1"

  return (
    <iframe
      src={`https://open.spotify.com/embed/playlist/2ov85DmRexbvr1KXR8IsSf?utm_source=generator&theme=${spotifyTheme}`}
      width="100%"
      height="100%"
      style={{ borderRadius: "12px" }}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    ></iframe>
  )
}