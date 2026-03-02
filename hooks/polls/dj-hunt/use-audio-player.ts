"use client"

import { useRef, useState } from "react"
// If you still want the hook to provide the formatter, import it:
import { formatAudioTime } from "@/lib/utils"

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)

  // --- 1. PLAYBACK CONTROLS ---
  const togglePlay = async () => {
    const el = audioRef.current
    if (!el) return
    
    if (isPlaying) {
      el.pause()
      setIsPlaying(false)
    } else {
      el.play().then(() => {
        setIsPlaying(true)
      }).catch((err) => {
        console.warn("Autoplay blocked until user interaction:", err)
      })
    }
  }

  const toggleMute = () => {
    const el = audioRef.current
    if (!el) return
    setIsMuted(!isMuted)
    if (isMuted) {
      el.volume = volume
    } else {
      el.volume = 0
    }
  }

  // --- 2. INPUT HANDLERS ---
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = Number(e.target.value)
    if (audioRef.current) audioRef.current.currentTime = t
    setCurrentTime(t)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value)
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
    if (v === 0) setIsMuted(true)
    else setIsMuted(false)
  }

  // --- 3. AUDIO ELEMENT EVENT HANDLERS ---
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current?.currentTime ?? 0)
  }

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current?.duration ?? 0)
  }

  const handleEnded = () => {
    setIsPlaying(false)
  }

  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    toggleMute,
    handleSeek,
    handleVolumeChange,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    formatTime: formatAudioTime, 
  }
}