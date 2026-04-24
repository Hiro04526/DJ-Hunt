"use client"

import { memo } from "react"
import { useEqualDurationTypewriter } from "@/hooks/polls/dj-hunt/use-typewriter"

export interface TypeWriterProps {
  lines: string[];
  typeMs?: number;      // total time to fully type a line
  holdMs?: number;      // time to keep full line on screen
  backspaceMs?: number; // total time to fully delete a line
  className?: string;
  showCursor?: boolean;
}

function EqualDurationTypewriterComponent({
  lines,
  typeMs = 2000,
  holdMs = 1000,
  backspaceMs = 1000,
  className,
  showCursor = true,
}: TypeWriterProps) {
  const { displayText } = useEqualDurationTypewriter(
    lines, 
    typeMs, 
    holdMs, 
    backspaceMs
  )

  return (
    <span className={className}>
      {displayText}
      {showCursor && <span className="animate-pulse">|</span>}
    </span>
  )
}

export default memo(EqualDurationTypewriterComponent)