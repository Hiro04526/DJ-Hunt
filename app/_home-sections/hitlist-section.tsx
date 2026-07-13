"use client"

import Link from "next/link"
import { HitlistLeaderboard } from "@/components/hitlist/leaderboard"
import { useHitlist } from "@/hooks/polls/hitlist/use-hitlist-regular"
import {
  ArrowRight,
  Music,
} from "lucide-react"

export function HitlistSection() {
  const { songs, isRefreshing, fetchStatus } = useHitlist()

  return (
    <section id="hitlist" className="bg-[#252525] px-6 py-8 sm:px-10 lg:px-16 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-secondary text-xs font-semibold uppercase tracking-[0.25em] text-[#569429]">
            The Hitlist
          </span>
          <h2 className="mt-4 font-kenyan text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
            Curate the <span className="text-[#569429]">Airwaves</span>
          </h2>
          <p className="mt-4 font-secondary text-base text-[#a8a8a8] sm:text-lg">
            Every track in rotation is chosen by you. Vote for your favorites and help shape what Green Giant FM plays next.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 max-h-100">
            <HitlistLeaderboard 
              songs={songs} 
              onRefresh={() => fetchStatus()} 
              isRefreshing={isRefreshing}
              limit={3}
            />
          </div>

          {/* CTA card */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#569429]/30 bg-linear-to-br from-[#569429]/10 to-transparent p-8 lg:col-span-2">
            <div>
              <Music className="h-8 w-8 text-[#569429]" />
              <h3 className="mt-4 font-kenyan text-2xl font-bold uppercase leading-tight text-white">
                Your favorite track could be #1.
              </h3>
              <p className="mt-3 font-secondary text-sm text-[#a8a8a8]">
                Voting takes ten seconds. Cast yours and watch the leaderboard shift in real time.
              </p>
            </div>
            <Link
              href="/polls"
              className="group mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#569429] px-8 py-4 font-secondary text-sm font-bold uppercase tracking-wide text-black transition-all duration-300 hover:bg-[#63a92f] hover:shadow-[0_0_35px_-5px_#569429] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#569429] focus-visible:ring-offset-2 focus-visible:ring-offset-[#191919]"
              >
              Cast Your Vote
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}