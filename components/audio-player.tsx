"use client"

import { useRef, useState } from "react"
import { FaPlay, FaPause, FaVolumeUp } from "react-icons/fa"

type Props = {
  src: string | null | undefined
}

export default function AudioPlayer({ src }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)

  const togglePlay = async () => {
    const el = audioRef.current
    if (!el) return
    if (isPlaying) {
      el.pause()
      setIsPlaying(false)
    } else {
      try {
        await el.play()
        setIsPlaying(true)
      } catch {
        console.warn("Autoplay blocked until user interaction.")
      }
    }
  }

  const format = (t: number) => {
    if (!isFinite(t)) return "0:00"
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  return (
    <div
      className="w-full max-w-2xl p-4 rounded-xl shadow-md flex items-center gap-4 
                 bg-white text-[#111111] dark:bg-[#111111] dark:text-white transition-colors"
    >
      <audio
        ref={audioRef}
        src={src || undefined}
        preload="metadata"
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Play / Pause Button */}
      <button
        onClick={togglePlay}
        className="p-3 rounded-full bg-[#569429] text-white hover:bg-[#457a21] transition disabled:opacity-50"
        disabled={!src}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>

      {/* Progress and Time */}
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>{format(currentTime)}</span>
          <span>{format(duration)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={(e) => {
            const t = Number(e.target.value)
            if (audioRef.current) audioRef.current.currentTime = t
            setCurrentTime(t)
          }}
          className="w-full accent-[#569429] dark:accent-[#81c75b]"
          aria-label="Seek"
          disabled={!src}
        />
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 w-32">
        <FaVolumeUp className="text-gray-700 dark:text-gray-300" aria-hidden />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => {
            const v = Number(e.target.value)
            setVolume(v)
            if (audioRef.current) audioRef.current.volume = v
          }}
          className="w-full accent-[#569429] dark:accent-[#81c75b]"
          aria-label="Volume"
          disabled={!src}
        />
      </div>
    </div>
  )
}