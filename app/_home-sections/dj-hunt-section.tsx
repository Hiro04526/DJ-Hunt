"use client"

import Link from "next/link"
import { ArrowRight, Radio, Star, Sparkles } from "lucide-react"
import { useDJHuntRows } from "@/hooks/_home-sections/use-dj-hunt-rows"

export function DjHuntSection() {
  const { finalists, loading, isEmpty } = useDJHuntRows();

  const rowOne = finalists.slice(0, 8);
  const rowTwo = finalists.slice(8);

  return (
    <section
      id="dj-hunt"
      className="relative overflow-hidden bg-[#569429] px-6 py-16 sm:px-10 lg:px-16 lg:py-20"
    >
      <style>{`
        @keyframes ggfm-pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.35); }
          100% { box-shadow: 0 0 0 14px rgba(255, 255, 255, 0); }
        }
        @keyframes ggfm-marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes ggfm-marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        /* animation-play-state is intentionally left out of the inline style
           on these rows below, so this class can control it on hover without
           an inline/class specificity conflict. */
        .ggfm-marquee-row {
          width: max-content;
        }
        .ggfm-marquee-row:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .ggfm-marquee-row {
            animation: none !important;
          }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.06,
          backgroundImage:
            "repeating-linear-gradient(45deg, #191919 0, #191919 2px, transparent 2px, transparent 14px)",
        }}
      />

      {/* Colorful nods to the real /dj-hunt page's retro scrapbook energy —
          reusing the brand's own pool-color palette (from the Chapter 2
          branding sheet) so this stays on-brand rather than random, and gives
          the wide top/bottom margins something to do instead of sitting empty. */}
      <Star
        aria-hidden="true"
        className="pointer-events-none absolute left-[5%] top-8 hidden h-12 w-12 sm:block lg:left-[9%] lg:top-10 lg:h-16 lg:w-16"
        style={{ color: "#ffcf00", transform: "rotate(-18deg)" }}
        fill="currentColor"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[6%] top-12 hidden rounded-2xl px-4 py-2 sm:block"
        style={{ backgroundColor: "#f750a3", transform: "rotate(8deg)" }}
      >
        <span className="font-kenyan text-xs uppercase tracking-wide text-white">Good Luck!</span>
      </div>
      <Sparkles
        aria-hidden="true"
        className="pointer-events-none absolute left-[18%] top-20 hidden h-8 w-8 lg:block"
        style={{ color: "#2173ff", transform: "rotate(-10deg)" }}
      />
      <Star
        aria-hidden="true"
        className="pointer-events-none absolute bottom-16 left-[6%] hidden h-10 w-10 sm:block"
        style={{ color: "#964de0", transform: "rotate(15deg)" }}
        fill="currentColor"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 right-[8%] hidden rounded-full px-4 py-2 sm:block lg:right-[13%]"
        style={{ backgroundColor: "#ff8c13", transform: "rotate(-6deg)" }}
      >
        <span className="font-kenyan text-xs uppercase tracking-wide text-white">You Got This!</span>
      </div>
      <Sparkles
        aria-hidden="true"
        className="pointer-events-none absolute right-[16%] bottom-24 hidden h-7 w-7 lg:block"
        style={{ color: "#0a9068", transform: "rotate(12deg)" }}
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#191919] px-4 py-1.5 font-raleway text-xs font-bold uppercase tracking-[0.2em] text-white">
          <Radio className="h-3.5 w-3.5" />
          DJ Hunt
        </span>

        <h2 className="max-w-3xl font-kenyan text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl">
          The Next Voices of Green Giant FM.
        </h2>

        <p className="max-w-xl font-raleway text-base font-medium leading-relaxed text-[#191919] sm:text-lg">
          16 finalists are in the running for a spot as our newest DJ Trainees. Show your support and help decide who joins the roster.
        </p>

        {/* Every finalist, shown equally — two rows drifting in opposite
            directions, hover to pause either one. */}
        <div
          className="relative w-full max-w-3xl overflow-hidden"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0, black 48px, black calc(100% - 48px), transparent 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0, black 48px, black calc(100% - 48px), transparent 100%)",
          }}
        >
          <div
            className="ggfm-marquee-row flex gap-4"
            style={{
              animationName: "ggfm-marquee-left",
              animationDuration: "32s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
            }}
          >
            {[...rowOne, ...rowOne].map((finalist, i) => (
              <img
                key={`${finalist.id}-${i}`}
                src={finalist.image}
                alt={finalist.name}
                title={finalist.name}
                className="h-14 w-14 shrink-0 rounded-full border-2 border-white object-cover"
              />
            ))}
          </div>
          <div
            className="ggfm-marquee-row mt-4 flex gap-4"
            style={{
              animationName: "ggfm-marquee-right",
              animationDuration: "32s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
            }}
          >
            {[...rowTwo, ...rowTwo].map((finalist, i) => (
              <img
                key={`${finalist.id}-${i}`}
                src={finalist.image}
                alt={finalist.name}
                title={finalist.name}
                className="h-14 w-14 shrink-0 rounded-full border-2 border-white object-cover"
              />
            ))}
          </div>
        </div>

        <Link
          href="/dj-hunt"
          className="group mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#191919] px-8 py-4 font-raleway text-sm font-bold uppercase tracking-wide text-white transition-all duration-300 hover:bg-white hover:text-[#191919] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#569429]"
          style={{ animation: "ggfm-pulse-ring 2.4s ease-out infinite" }}
        >
          Support Your Finalist
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}