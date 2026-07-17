"use client"

import Link from "next/link"
import { Play, ArrowRight, ChevronDown } from "lucide-react"

const eyebrowBars = [0.5, 1, 0.65, 0.85];
const heroEchoBars = [0.25, 0.45, 0.65, 0.85, 0.55, 0.35, 0.7, 0.95, 0.6, 0.4, 0.8, 0.5, 0.3];

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[#191919] px-6 pb-12 pt-28 sm:px-10 lg:px-16"
    >
      <div className="pointer-events-none absolute -top-24 right-[-8%] h-96 w-96 rounded-full bg-[#569429]/10 blur-[100px]" />

      <div className="relative mx-auto flex max-w-7xl flex-col-reverse items-center gap-16 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        <div className="max-w-2xl text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#363636] bg-[#252525] px-5 py-2.5">
            <div className="flex h-4 items-end gap-0.75" aria-hidden="true">
              {eyebrowBars.map((h, i) => (
                <span
                  key={i}
                  className="w-0.75 origin-bottom rounded-full bg-[#569429]"
                  style={{
                    height: `${h * 100}%`,
                    animationName: "ggfm-equalizer",
                    animationDuration: "1s",
                    animationTimingFunction: "ease-in-out",
                    animationIterationCount: "infinite",
                    animationDelay: `${i * 0.12}s`,
                  }}
                />
              ))}
            </div>
            <span className="font-secondary text-xs font-semibold uppercase tracking-[0.2em] text-[#D8CEAE]">
              On Air Now
            </span>
          </div>

          <div className="flex flex-col w-fit mx-auto lg:mx-0">
            <h1 className="font-kenyan font-bold text-center lg:text-justify lg:[text-align-last:justify] uppercase lg:pl-0.5 tracking-tight w-full text-white text-[2.145rem] lg:text-[2.575rem]">
              The Official Sound of <span className="text-[#569429]">DLSU</span>
            </h1>
          
            <h1 className="font-kenyan font-bold text-center lg:text-justify lg:[text-align-last:justify] uppercase leading-[0.95] tracking-tight w-full text-white text-[3.755rem] lg:text-7xl">
              Green Giant <span className="text-[#569429]">FM</span>
            </h1> 
          </div>

          <p className="mx-auto mt-6 max-w-lg font-secondary text-base leading-relaxed text-[#a8a8a8] sm:text-lg lg:mx-0">
            Broadcasting from De La Salle University since 2008 —{" "}
            <span className="text-[#D8CEAE]">25+ student DJs</span>, live around the clock, one campus frequency.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/listen"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#569429] px-8 py-4 font-secondary text-sm font-bold uppercase tracking-wide text-black transition-all duration-300 hover:bg-[#63a92f] hover:shadow-[0_0_35px_-5px_#569429] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#569429] focus-visible:ring-offset-2 focus-visible:ring-offset-[#191919] sm:w-auto"
            >
              <Play className="h-4 w-4 fill-black transition-transform duration-300 group-hover:scale-110" />
              Listen Live
            </Link>
            <Link
              href="/services"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#646464] px-8 py-4 font-secondary text-sm font-bold uppercase tracking-wide text-white transition-all duration-300 hover:border-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#569429] focus-visible:ring-offset-2 focus-visible:ring-offset-[#191919] sm:w-auto"
            >
              Partner With Us
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="relative flex h-56 w-56 shrink-0 items-center justify-center sm:h-80 sm:w-80 lg:h-112 lg:w-md">
          <div
            aria-hidden="true"
            className="absolute -inset-3 rounded-full sm:-inset-4"
            style={{
              border: "2px dashed rgba(86,148,41,0.35)",
              animationName: "ggfm-rotate-slow",
              animationDuration: "30s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
            }}
          />
          <div className="absolute inset-0 rounded-full bg-[#569429]/25 blur-3xl" />
          <div className="absolute inset-4 rounded-full border border-[#363636] bg-linear-to-br from-[#252525] to-[#191919] sm:inset-6" />
          <div
            className="absolute inset-10 flex items-center justify-between opacity-20 sm:inset-12 lg:inset-16"
            aria-hidden="true"
          >
            {heroEchoBars.map((h, i) => (
              <span
                key={i}
                className="w-2 rounded-full bg-[#569429] sm:w-2.5 lg:w-3"
                style={{
                  height: `${h * 100}%`,
                  animationName: "ggfm-equalizer",
                  animationDuration: "1.4s",
                  animationTimingFunction: "ease-in-out",
                  animationIterationCount: "infinite",
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
          <img
            src="/assets/Raffy.png"
            alt="Raffy, the Green Giant FM mascot"
            className="relative h-40 w-40 object-contain drop-shadow-[0_0_40px_rgba(86,148,41,0.5)] sm:h-64 sm:w-64 lg:h-80 lg:w-80"
          />
        </div>
      </div>
    </section>
  );
}