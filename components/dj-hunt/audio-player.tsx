"use client"

import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa"
import { useAudioPlayer } from "@/hooks/polls/dj-hunt/use-audio-player"

export interface AudioPlayerProps {
  src: string | null | undefined
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  const {
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
    formatTime,
  } = useAudioPlayer()

  return (
    <div className="w-full max-w-2xl rounded-xl flex items-center gap-4 bg-white text-[#111111] dark:bg-[#111111] dark:text-white transition-colors">
      <audio
        ref={audioRef}
        src={src || undefined}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
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
        <div className="flex items-center justify-center text-sm">
          <p>{formatTime(currentTime)}</p>

          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="mx-1.5 w-full accent-[#569429]"
            aria-label="Seek"
            disabled={!src}
          />

          <p>{formatTime(duration)}</p>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 w-32 relative group">
        <div onClick={toggleMute} className="cursor-pointer">
          {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
        </div>

        {/* Volume Slider */}
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-full accent-[#569429]"
          aria-label="Volume"
          disabled={!src}
        />
      </div>
    </div>
  )
}