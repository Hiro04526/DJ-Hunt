// lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAudioTime(t: number): string {
  if (!isFinite(t)) return "0:00"
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function buildDriveEmbedSrc(raw: string): string {
  const m = raw.match(/\/file\/d\/([a-zA-Z0-9_-]{10,})/)
  return m ? `https://drive.google.com/file/d/${m[1]}/preview` : raw
}

export function decodeJwtPayload(token: string) {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    return JSON.parse(atob(base64))
  } catch (error) {
    return null
  }
}