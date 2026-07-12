"use client"

import Link from "next/link"
import { ArrowRight, Radio, Star, Sparkles } from "lucide-react"
import { useDJHuntRows } from "@/hooks/_home-sections/use-dj-hunt-rows"

export function DjHuntSection() {
  const { finalists } = useDJHuntRows();

  return (
    <section
      id="dj-hunt"
      className="relative overflow-hidden bg-[#569429] px-6 py-16 sm:px-10 lg:px-16 lg:py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.06,
          backgroundImage:
            "repeating-linear-gradient(45deg, #191919 0, #191919 2px, transparent 2px, transparent 14px)",
        }}
      />

      {/* Stickers */}
      {/* Top Left Yellow Star */}
      <Star
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-4 h-8 w-8 sm:-left-1 sm:-top-1 sm:h-12 sm:w-12 lg:left-4 lg:top-5 lg:h-16 lg:w-16"
        style={{
          color: "#ffcf00",
          transform: "rotate(-18deg)",
          filter:
            "drop-shadow(2px 0 0 #fff) drop-shadow(-2px 0 0 #fff) drop-shadow(0 2px 0 #fff) drop-shadow(0 -2px 0 #fff) drop-shadow(1.4px 1.4px 0 #fff) drop-shadow(-1.4px 1.4px 0 #fff) drop-shadow(1.4px -1.4px 0 #fff) drop-shadow(2px 4px 3px rgba(0,0,0,0.35))",
        }}
        fill="currentColor"
      />
      
      {/* Bottom Left Purple Star */}
      <Star
        aria-hidden="true"
        className="pointer-events-none absolute bottom-4 left-4 h-8 w-8 sm:-bottom-1 sm:-left-1 sm:h-11 sm:w-11 lg:bottom-5 lg:left-4 lg:h-14 lg:w-14"
        style={{
          color: "#964de0",
          transform: "rotate(15deg)",
          filter:
            "drop-shadow(2px 0 0 #fff) drop-shadow(-2px 0 0 #fff) drop-shadow(0 2px 0 #fff) drop-shadow(0 -2px 0 #fff) drop-shadow(1.4px 1.4px 0 #fff) drop-shadow(-1.4px 1.4px 0 #fff) drop-shadow(1.4px -1.4px 0 #fff) drop-shadow(2px 4px 3px rgba(0,0,0,0.35))",
        }}
        fill="currentColor"
      />

      {/* Top Right "Good Luck!" Badge - Unhidden, sized down slightly for tiny viewports */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-4 block rounded-2xl px-2.5 py-1 sm:right-2 sm:top-3 sm:px-3 sm:py-1.5 lg:right-5 lg:top-6 lg:px-4 lg:py-2"
        style={{
          backgroundColor: "#f750a3",
          backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.3), transparent 55%)",
          border: "3px solid white",
          boxShadow: "2px 5px 10px rgba(0,0,0,0.3)",
          transform: "rotate(8deg)",
        }}
      >
        <span className="font-kenyan text-[0.6rem] uppercase tracking-wide text-white xs:text-[0.65rem] lg:text-xs">Good Luck!</span>
      </div>

      {/* Bottom Right "You Got This!" Badge - Unhidden */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-4 right-4 block rounded-full px-2.5 py-1 sm:bottom-3 sm:right-2 sm:px-3 sm:py-1.5 lg:bottom-6 lg:right-5 lg:px-4 lg:py-2"
        style={{
          backgroundColor: "#ff8c13",
          backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.3), transparent 55%)",
          border: "3px solid white",
          boxShadow: "2px 5px 10px rgba(0,0,0,0.3)",
          transform: "rotate(-6deg)",
        }}
      >
        <span className="font-kenyan text-[0.6rem] uppercase tracking-wide text-white xs:text-[0.65rem] lg:text-xs">You Got This!</span>
      </div>

      {/* Sparkles - Optional decorative accents: Unhidden on small screens, scale gracefully */}
      <Sparkles
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-20 block h-5 w-5 sm:right-8 sm:top-16 sm:h-6 sm:w-6 lg:h-8 lg:w-8 xl:right-16"
        style={{
          color: "#e50101",
          transform: "rotate(-10deg)",
          filter:
            "drop-shadow(1.5px 0 0 #fff) drop-shadow(-1.5px 0 0 #fff) drop-shadow(0 1.5px 0 #fff) drop-shadow(0 -1.5px 0 #fff) drop-shadow(2px 3px 3px rgba(0,0,0,0.3))",
        }}
      />
      <Sparkles
        aria-hidden="true"
        className="pointer-events-none absolute left-4 bottom-24 block h-5 w-5 sm:left-8 sm:bottom-20 sm:h-6 sm:w-6 lg:h-7 lg:w-7 xl:left-16"
        style={{
          color: "#2173ff",
          transform: "rotate(12deg)",
          filter:
            "drop-shadow(1.5px 0 0 #fff) drop-shadow(-1.5px 0 0 #fff) drop-shadow(0 1.5px 0 #fff) drop-shadow(0 -1.5px 0 #fff) drop-shadow(2px 3px 3px rgba(0,0,0,0.3))",
        }}
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#191919] px-4 py-1.5 font-secondary text-xs font-bold uppercase tracking-[0.2em] text-white">
          <Radio className="h-3.5 w-3.5" />
          DJ Hunt
        </span>

        <h2 className="max-w-3xl font-kenyan text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl">
          The Next Voices of Green Giant FM.
        </h2>

        <p className="max-w-2xl font-secondary text-base font-medium leading-relaxed text-[#191919] sm:text-lg">
          16 finalists are in the running for a chance to be one of our newest DJ Trainees. Show your support and help decide who joins the roster.
        </p>

        {/* Every finalist, shown equally — two rows drifting in opposite
            directions, hover to pause either one. */}
        <div
          className="relative w-full max-w-6xl overflow-hidden"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0, black 48px, black calc(100% - 48px), transparent 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0, black 48px, black calc(100% - 48px), transparent 100%)",
          }}
        >
          <div
            className="ggfm-marquee-row mt-4 flex gap-4"
            style={{
              animationName: "ggfm-marquee-right",
              animationDuration: "32s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
            }}
          >
            {finalists.map((finalist) => (
              <img
                key={finalist.id}
                src={finalist.image}
                alt={finalist.name}
                title={finalist.name}
                className="h-28 w-28 shrink-0 rounded-full border-2 border-white object-cover"
              />
            ))}
          </div>
        </div>

        <Link
          href="/dj-hunt"
          className="group mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#191919] px-8 py-4 font-secondary text-sm font-bold uppercase tracking-wide text-white transition-all duration-300 hover:bg-white hover:text-[#191919] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#569429]"
          style={{ animation: "ggfm-pulse-ring 2.4s ease-out infinite" }}
        >
          Support Your Finalist
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}