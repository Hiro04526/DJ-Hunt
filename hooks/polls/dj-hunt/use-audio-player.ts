"use client"

import { useRef, useState, useCallback } from "react"
import { formatAudioTime } from "@/lib/utils"

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)

  // --- 1. PLAYBACK CONTROLS ---
  const togglePlay = useCallback(async () => {
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
  }, [isPlaying])

  const toggleMute = useCallback(() => {
    const el = audioRef.current
    if (!el) return
    setIsMuted(prev => !prev)
    if (!isMuted) { 
      el.volume = 0
    } else {
      el.volume = volume
    }
  }, [isMuted, volume])

  // --- 2. INPUT HANDLERS ---
  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const t = Number(e.target.value)
    if (audioRef.current) audioRef.current.currentTime = t
    setCurrentTime(t)
  }, [])

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value)
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
    setIsMuted(v === 0)
  }, [])

  // --- 3. AUDIO ELEMENT EVENT HANDLERS ---
  const handleTimeUpdate = useCallback(() => {
    setCurrentTime(audioRef.current?.currentTime ?? 0)
  }, [])

  const handleLoadedMetadata = useCallback(() => {
    setDuration(audioRef.current?.duration ?? 0)
  }, [])

  const handleEnded = useCallback(() => {
    setIsPlaying(false)
  }, [])

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