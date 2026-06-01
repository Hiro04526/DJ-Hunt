import { Metadata } from "next"
import TitleSection from "./sections/title"
import dynamic from "next/dynamic"

// 1. Lazy load the heavy section
const SongsSection = dynamic(() => import("./sections/songs"), {
  loading: () => (
    <div className="min-h-[50vh] w-full flex items-center justify-center bg-black text-white">
      <p className="animate-pulse">Loading the hitlist...</p>
    </div>
  )
})

export const metadata: Metadata = {
  title: 'Hitlist',
  description: "Voting polls for this week's Top 20 songs!",
  referrer: "strict-origin-when-cross-origin",
}

export default function Hitlist() {
  return (
    <div className="flex flex-col">
        <div className="relative w-full flex flex-col justify-center items-center text-white bg-black">
          <TitleSection />
          <SongsSection />
        </div>
    </div>
  );
}