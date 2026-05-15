"use client"

import { useState, useRef, useEffect, memo, useMemo } from "react"
import { Play, Pause, VolumeX } from "lucide-react"

interface EBMemberCardClientProps {
  name: string
  role: string | null
  image: string | null
  path?: string | null
  title?: string | null
  pools: any
}

function EBMemberCardClient({ 
  name, 
  role, 
  image, 
  path,
  title,
  pools
}: EBMemberCardClientProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 1. SAFE ARRAY CHECK: This prevents the "is not a function" crash
  const isPD = useMemo(() => {
    if (!pools) return false
    
    // If it's a proper array, use .some()
    if (Array.isArray(pools)) {
      return pools.some(p => p?.role?.toLowerCase() === "pool director")
    }
    
    // If it's a single object (fallback for inconsistent DB entries)
    if (typeof pools === 'object') {
      return pools.role?.toLowerCase() === "pool director"
    }
    
    return false
  }, [pools])

  // 2. SAFE POOL NAME: Show the first pool if multiple, or the only pool if one
  const primaryPoolName = useMemo(() => {
    if (!pools) return ""
    if (Array.isArray(pools)) return pools[0]?.pool_name || ""
    if (typeof pools === 'object') return pools.pool_name || ""
    return ""
  }, [pools])

  // 1. Listen for other cards playing to stop this one
  useEffect(() => {
    const handleStopOthers = (e: Event) => {
      const customEvent = e as CustomEvent
      // If the path broadcasted doesn't match this card's path, PAUSE
      if (customEvent.detail !== path) {
        if (audioRef.current) {
          audioRef.current.pause()
          // Reset currentTime so it starts from the beginning next time
          audioRef.current.currentTime = 0;
        }
        setIsPlaying(false)
      }
    }

    window.addEventListener("ebPlayAudio", handleStopOthers)

    // Cleanup on unmount
    return () => {
      window.removeEventListener("ebPlayAudio", handleStopOthers)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [path])

  const handleTogglePlay = async () => {
    if (!path) return;

    try {
      if (!audioRef.current) {
        console.log("Initializing audio for:", path)
        audioRef.current = new Audio(path)
        audioRef.current.volume = 0.4
        
        audioRef.current.onended = () => setIsPlaying(false)
        
        audioRef.current.onerror = (e) => {
          console.error("Audio failed to load. Check your file path!", e)
          setIsPlaying(false)
        };
      }

      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        // 2. Pass this card's unique path in the 'detail' property
        window.dispatchEvent(new CustomEvent("ebPlayAudio", { detail: path }));

        // 3. Force reload source if cached/stuck
        if (audioRef.current.src !== window.location.origin + path) {
          audioRef.current.src = path;
          audioRef.current.load();
        }

        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Playback blocked or failed:", err);
      setIsPlaying(false);
    }
  };

  const hasAudio = Boolean(path)

  return (
    <div className={`flex flex-col items-center text-center p-5 bg-[#111] rounded-2xl border border-[#222] transition-all duration-300 ${hasAudio ? 'hover:border-[#569429]/40 hover:shadow-[0_0_30px_rgba(86,148,41,0.1)]' : ''} group`}>
      
      <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
        {/* Vinyl Record */}
        <div className={`absolute inset-0 rounded-full bg-black shadow-2xl transition-transform duration-[3s] linear ${isPlaying ? 'animate-spin' : ''}`}>
          {/* Groove Rings */}
          <div className="absolute inset-px rounded-full ring-1 ring-white/15 ring-inset" />
          <div className="absolute inset-4 rounded-full ring-1 ring-white/10 ring-inset" />
          <div className="absolute inset-8 rounded-full ring-1 ring-white/5 ring-inset" />
          
          {/* SHINY REFLECTION BIT */}
          <div className="absolute inset-0 rounded-full bg-linear-to-tr from-transparent via-white/10 to-transparent opacity-40 pointer-events-none" />
          <div className="absolute inset-0 rounded-full bg-linear-to-bl from-transparent via-white/5 to-transparent opacity-30 pointer-events-none" />
        </div>

        {/* Picture */}
        <button 
          onClick={handleTogglePlay}
          disabled={!hasAudio}
          className={`absolute inset-[28%] rounded-full bg-[#222] border-4 border-black transition-all overflow-hidden z-10 ${hasAudio ? 'group-hover:border-[#569429] cursor-pointer' : 'cursor-default grayscale opacity-60'}`}
          style={image ? { backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
          {/* Pause/Play Overlay */}
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            {!hasAudio ? (
              <VolumeX className="w-6 h-6 text-gray-600" />
            ) : isPlaying ? (
              <Pause className="w-8 h-8 text-[#569429]" fill="#569429" />
            ) : (
              <Play className="w-8 h-8 text-[#569429] ml-1" fill="#569429" />
            )}
          </div>
        </button>
      </div>

      <h4 className="text-white font-medium tracking-tight text-xl mb-1">{name}</h4>
      <p className="text-sm font-secondary max-w-48 text-[#569429] uppercase tracking-wide">
        {isPlaying ? (
          <span className="animate-pulse">{title}</span>
        ) : isPD ? (
          primaryPoolName
        ) : (
          role
        )}
      </p>
    </div>
  )
}

export default memo(EBMemberCardClient)