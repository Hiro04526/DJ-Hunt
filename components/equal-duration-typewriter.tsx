"use client";
import { useEffect, useState } from "react";

type Props = {
  lines: string[];
  typeMs?: number;      // total time to fully type a line
  holdMs?: number;      // time to keep full line on screen
  backspaceMs?: number; // total time to fully delete a line
  className?: string;
  showCursor?: boolean;
};

export default function EqualDurationTypewriter({
  lines,
  typeMs = 2000,
  holdMs = 1000,
  backspaceMs = 1000,
  className,
  showCursor = true,
}: Props) {
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">("typing");
  const [chars, setChars] = useState(0);

  const line = lines[i] ?? "";
  const typeDelay = Math.max(1, Math.floor(typeMs / Math.max(1, line.length)));
  const deleteDelay = Math.max(1, Math.floor(backspaceMs / Math.max(1, line.length)));

  useEffect(() => {
    if (!line) return;

    let t: ReturnType<typeof setTimeout> | undefined;

    if (phase === "typing") {
      if (chars >= line.length) {
        setPhase("holding");
      } else {
        t = setTimeout(() => setChars((c) => c + 1), typeDelay);
      }
    } else if (phase === "holding") {
      t = setTimeout(() => setPhase("deleting"), holdMs);
    } else if (phase === "deleting") {
      if (chars <= 0) {
        setPhase("typing");
        setI((idx) => (idx + 1) % lines.length);
      } else {
        t = setTimeout(() => setChars((c) => c - 1), deleteDelay);
      }
    }

    return () => {
      if (t) clearTimeout(t);
    };
  }, [phase, line, chars, typeDelay, deleteDelay, holdMs, lines.length]);

  return (
    <span className={className}>
      {line.slice(0, chars)}
      {showCursor && <span className="animate-pulse">|</span>}
    </span>
  );
}