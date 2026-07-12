"use client"

import { useState, useRef, useEffect, memo, useMemo } from "react"
import { Play, Pause, VolumeX, User } from "lucide-react"

interface EBMemberCardClientProps {
  name: string
  position: string | null
  image: string | null
  path?: string | null
  title?: string | null
  pools: any
}

function EBMemberCardClient({
  name,
  position,
  image,
  path,
  title,
  pools
}: EBMemberCardClientProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Array-safety checks unchanged — pools can arrive as an array, a single
  // object, or null/undefined depending on the query shape, so these guards
  // are load-bearing, not defensive fluff.
  const isPD = useMemo(() => {
    if (!pools) return false
    if (Array.isArray(pools)) {
      return pools.some(p => p?.role?.toLowerCase() === "pool director")
    }
    if (typeof pools === 'object') {
      return pools.role?.toLowerCase() === "pool director"
    }
    return false
  }, [pools])

  const primaryPoolName = useMemo(() => {
    if (!pools) return ""
    if (Array.isArray(pools)) return pools[0]?.pool_name || ""
    if (typeof pools === 'object') return pools.pool_name || ""
    return ""
  }, [pools])

  // Listen for other cards playing, so only one stinger plays at a time
  // across the whole page.
  useEffect(() => {
    const handleStopOthers = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail !== path) {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0;
        }
        setIsPlaying(false)
      }
    }

    window.addEventListener("ebPlayAudio", handleStopOthers)

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
        window.dispatchEvent(new CustomEvent("ebPlayAudio", { detail: path }));

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
    // basis-[264px] + min-w-0 together fix uneven/single-column card sizing
    // in the flex-wrap "wrap" layout:
    //  - Without an explicit basis, each card's flex-basis defaults to
    //    "auto" (its own content's natural size). Different position-label
    //    text lengths could then nudge different cards to slightly
    //    different widths — hence basis-[264px] (224px vinyl cap + 40px
    //    padding), an identical starting size for every card.
    //  - But a flex item's min-width ALSO defaults to "auto," which
    //    resolves to that same content-derived natural size — a SEPARATE
    //    constraint that can silently override flex-basis as an
    //    unshrinkable floor. Once basis became an explicit, smaller value
    //    than that floor, cards couldn't shrink enough to fit more than one
    //    per line, forcing every card onto its own row. min-w-0 removes
    //    that floor so flex-shrink can actually do its job.
    // Neither has any effect in the "wide" grid layout — both are
    // flex-item-only properties, and grid ignores them for its children.
    <div className={`flex min-w-0 flex-col items-center text-center p-5 bg-[#252525] rounded-2xl border border-[#363636] transition-all duration-300 basis-66 ${hasAudio ? 'hover:border-[#569429]/40 hover:shadow-[0_0_30px_rgba(86,148,41,0.1)]' : ''} group`}>

      {/* w-full + max-w-56 (instead of a hard-fixed w-56) so this shrinks
          gracefully when its grid column is narrower than 224px — needed for
          the new 4-column Pool Directors layout below, where 4 fixed-224px
          cards genuinely don't fit the page's container width. In any wider
          layout (Top 3, VPI) this still renders at the full 224px cap, so
          nothing changes there. */}
      <div className="relative w-full max-w-56 aspect-square mb-6 flex items-center justify-center">
        {/* Vinyl Record */}
        <div className={`absolute inset-0 rounded-full bg-black shadow-2xl transition-transform duration-[3s] linear ${isPlaying ? 'animate-spin' : ''}`}>
          {/* inset-4 / inset-8 were fixed pixel values, which stopped scaling
              proportionally once the vinyl became fluid — swapped to the
              equivalent percentages (16px/32px of 224px) so the grooves stay
              in the same relative position at any size. */}
          <div className="absolute inset-px rounded-full ring-1 ring-white/15 ring-inset" />
          <div className="absolute inset-[7%] rounded-full ring-1 ring-white/10 ring-inset" />
          <div className="absolute inset-[14%] rounded-full ring-1 ring-white/5 ring-inset" />

          <div className="absolute inset-0 rounded-full bg-linear-to-tr from-transparent via-white/10 to-transparent opacity-40 pointer-events-none" />
          <div className="absolute inset-0 rounded-full bg-linear-to-bl from-transparent via-white/5 to-transparent opacity-30 pointer-events-none" />
        </div>

        {/* Picture — inset reduced from 28% to 24% so the visible photo
            circle is noticeably bigger (was too small to make out a face). */}
        <button
          onClick={handleTogglePlay}
          disabled={!hasAudio}
          aria-label={hasAudio ? (isPlaying ? `Pause ${name}'s stinger` : `Play ${name}'s stinger`) : undefined}
          className={`absolute inset-[24%] rounded-full border-4 border-black transition-all overflow-hidden z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#569429] ${image ? '' : 'bg-[#363636]'} ${hasAudio ? 'group-hover:border-[#569429] cursor-pointer' : 'cursor-default grayscale opacity-60'}`}
          style={image ? { backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
          {!image && (
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="w-12 h-12 text-[#a8a8a8]" />
            </div>
          )}
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            {!hasAudio ? (
              <VolumeX className="w-7 h-7 text-[#646464]" />
            ) : isPlaying ? (
              <Pause className="w-10 h-10 text-[#569429]" fill="#569429" />
            ) : (
              <Play className="w-10 h-10 text-[#569429] ml-1" fill="#569429" />
            )}
          </div>
        </button>
      </div>

      {/* font-kenyan here to match the same "name-on-a-card" convention
          already established for DJ names on the Home page's Radio Talent
          carousel, rather than introducing a second treatment for names. */}
      <h4 className="font-kenyan text-2xl font-bold uppercase tracking-tight text-white mb-1">{name}</h4>
      <p className="font-secondary text-sm font-semibold max-w-48 text-[#569429] uppercase tracking-wide">
        {isPlaying ? (
          <span className="animate-pulse">{title}</span>
        ) : isPD ? (
          primaryPoolName
        ) : (
          position
        )}
      </p>
    </div>
  )
}

export default memo(EBMemberCardClient)