"use client"

import Link from "next/link"
import { useEffect, useRef, useMemo } from "react"
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { useRadioTalentCarousel } from "@/hooks/_home-sections/use-radio-talent-carousel"

export function RadioTalentSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { talents, loading, isEmpty } = useRadioTalentCarousel();

  // 1. Triple the array for seamless infinite scrolling
  const infiniteTalents = useMemo(() => {
    if (!talents || talents.length === 0) return [];
    return [...talents, ...talents, ...talents];
  }, [talents]);

  // 2. Initialize position to the middle block instantly on load
  useEffect(() => {
    if (loading || isEmpty || !scrollerRef.current) return;
    const el = scrollerRef.current;
    
    el.style.scrollSnapType = "none"; 
    
    // Grab the exact computed padding so our initial jump lands perfectly symmetrical
    const computedPadding = parseFloat(window.getComputedStyle(el).scrollPaddingLeft) || 0;
    el.scrollLeft = (el.scrollWidth / 3) - computedPadding;
    
    const timeoutId = setTimeout(() => {
      el.style.scrollSnapType = "x mandatory"; 
    }, 50);
    
    return () => clearTimeout(timeoutId);
  }, [loading, isEmpty, infiniteTalents]);

  // 3. Smart Scroll & Seamless Loop Handler
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || loading || isEmpty) return;

    let isScrolling: NodeJS.Timeout;

    const handleScroll = () => {
      const oneThird = el.scrollWidth / 3;

      // Invisible teleportation when hitting the boundaries
      if (el.scrollLeft <= 100) {
        el.scrollLeft += oneThird;
      } else if (el.scrollLeft >= (oneThird * 2) - 100) {
        el.scrollLeft -= oneThird;
      }

      el.style.scrollSnapType = "none";
      
      clearTimeout(isScrolling);
      isScrolling = setTimeout(() => {
        el.style.scrollSnapType = "x mandatory";
      }, 150); 
    };

    // 4. Momentum-based wheel scrolling.
    // The previous version called el.scrollBy({ behavior: "smooth" }) on every
    // wheel event. Wheel events fire many times a second, and each new
    // smooth-scroll call cancels the browser's in-flight animation from the
    // previous call before it finishes easing out — that's what read as
    // stutter rather than one continuous glide. This replaces it with a
    // single velocity value that every wheel event adds to, decayed by
    // friction once per animation frame, so there's only ever one animation
    // running and nothing ever interrupts itself.
    let velocity = 0;
    let rafId: number | null = null;
    const friction = 0.9; // closer to 1 = glides longer after you stop scrolling

    const tick = () => {
      if (Math.abs(velocity) < 0.5) {
        velocity = 0;
        rafId = null;
        return;
      }
      el.scrollLeft += velocity;
      velocity *= friction;
      rafId = requestAnimationFrame(tick);
    };

    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;

      // Intercept vertical scroll to convert to horizontal
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();

        const isTrackpad = Math.abs(e.deltaY) < 40;
        // Trackpads already send small, frequent deltas that add up to
        // natural motion on their own. A mouse sends one large delta per
        // notch, so it's scaled down here and left to the friction above to
        // turn it into a glide instead of one hard jump.
        velocity += isTrackpad ? e.deltaY : e.deltaY * 0.4;

        if (rafId === null) {
          rafId = requestAnimationFrame(tick);
        }
      }
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: false });
    
    return () => {
      el.removeEventListener("scroll", handleScroll);
      el.removeEventListener("wheel", onWheel);
      clearTimeout(isScrolling);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [loading, isEmpty, infiniteTalents]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.style.scrollSnapType = "x mandatory";
    el.scrollBy({ left: direction * (el.clientWidth / 2), behavior: "smooth" });
  };

  return (
    <section id="talent" className="bg-[#191919] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
      <style>{`
        @keyframes ggfm-float-a {
          0%, 100% { transform: translateY(-8px); }
          50% { transform: translateY(8px); }
        }
        @keyframes ggfm-float-b {
          0%, 100% { transform: translateY(16px); }
          50% { transform: translateY(32px); }
        }
      `}</style>

      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div>
            <span className="font-raleway text-xs font-semibold uppercase tracking-[0.25em] text-[#569429]">
              Radio Talent
            </span>
            <h2 className="mt-4 font-kenyan text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
              Find Your <span className="text-[#569429]">Flavor.</span>
            </h2>
          </div>
          <p className="max-w-sm font-raleway text-base text-[#a8a8a8]">
            Every voice on air brings something different. Meet the DJs behind your favorite segments.
          </p>
        </div>

        <div className="relative mt-14">
          
          {loading && (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-[#363636] bg-[#252525]/50">
              <Loader2 className="h-8 w-8 animate-spin text-[#569429]" />
            </div>
          )}

          {!loading && isEmpty && (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-[#363636] bg-[#252525]/50">
              <p className="font-raleway text-[#a8a8a8]">No featured DJs available at the moment.</p>
            </div>
          )}

          {!loading && !isEmpty && (
            <>
              <div
                ref={scrollerRef}
                role="region"
                aria-label="Featured Green Giant FM DJs — scroll to browse"
                tabIndex={0}
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-[calc(50%-96px)] pt-6 pb-12 sm:gap-6 sm:scroll-pl-[calc(50%-360px)] lg:scroll-pl-[calc(50%-548px)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent 0, black 32px, black calc(100% - 32px), transparent 100%)",
                  maskImage:
                    "linear-gradient(to right, transparent 0, black 32px, black calc(100% - 32px), transparent 100%)",
                }}
              >
                {infiniteTalents.map((dj, i) => {
                  const isStaggered = i % 3 === 1;
                  const duration = (3.6 + (i % 3) * 0.4).toFixed(1);
                  return (
                    <div
                      key={`${dj.id}-${i}`}
                      className="group relative aspect-4/5 w-48 shrink-0 snap-start overflow-hidden rounded-2xl border-2 border-transparent transition-colors duration-300 hover:border-[#569429] hover:shadow-[0_0_30px_-8px_#569429] sm:w-56 lg:w-64"
                      style={{
                        animationName: isStaggered ? "ggfm-float-b" : "ggfm-float-a",
                        animationDuration: `${duration}s`,
                        animationTimingFunction: "ease-in-out",
                        animationIterationCount: "infinite",
                        animationDelay: `${i * 0.25}s`,
                      }}
                    >
                      <img
                        src={dj.image_url} 
                        alt={dj.name}
                        className="h-full w-full object-cover transition-all duration-500 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/10 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="font-kenyan text-lg font-bold uppercase tracking-wide text-white">
                          {dj.name}
                        </p>
                        <p className="font-raleway text-[0.7rem] text-[#D8CEAE] duration-300">
                          {dj.current_show || "No show this term"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                aria-label="Scroll to previous DJs"
                className="absolute left-0 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-[#363636] bg-[#191919]/90 p-2 text-white backdrop-blur transition-colors hover:border-[#569429] hover:text-[#569429] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#569429] sm:flex"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                aria-label="Scroll to next DJs"
                className="absolute right-0 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-[#363636] bg-[#191919]/90 p-2 text-white backdrop-blur transition-colors hover:border-[#569429] hover:text-[#569429] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#569429] sm:flex"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/radio-talent"
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-[#646464] px-8 py-4 font-raleway text-sm font-bold uppercase tracking-wide text-white transition-all duration-300 hover:border-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#569429] focus-visible:ring-offset-2 focus-visible:ring-offset-[#191919]"
          >
            Meet The DJs
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}