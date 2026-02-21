"use client"

import { useEffect, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight, CheckCircle2, Lock } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { CarouselSectionProps } from "@/types/hitlist"

export function CarouselSection({ 
  songs, 
  selected, 
  onToggle, 
  onIndexChange,
  hasVoted 
}: CarouselSectionProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [activeIndex, setActiveIndex] = useState(0)

  // --- SCALE LOGIC (Unchanged) ---
  const updateScales = useCallback((emblaApi: CarouselApi) => {
    if (!emblaApi) return
    const slides = emblaApi.slideNodes()
    const viewportCenter = emblaApi.rootNode().getBoundingClientRect().width / 2

    slides.forEach((slide) => {
      const rect = slide.getBoundingClientRect()
      const slideCenter = rect.left + rect.width / 2
      const distanceFromCenter = Math.abs(viewportCenter - slideCenter)

      const scale = Math.max(0.85, 1 - distanceFromCenter / 1000)
      const opacity = Math.max(0.4, 1 - distanceFromCenter / 600)

      const innerCard = slide.querySelector(".card-inner") as HTMLElement
      if (innerCard) {
        innerCard.style.transform = `scale(${scale})`
        innerCard.style.opacity = `${opacity}`
        innerCard.style.zIndex = scale > 0.98 ? "10" : "0"
      }
    })
  }, [])

  useEffect(() => {
    if (!api) return
    updateScales(api)
    api.on("scroll", () => updateScales(api))
    api.on("reInit", () => updateScales(api))
    api.on("select", () => {
      const index = api.selectedScrollSnap()
      setActiveIndex(index)
      onIndexChange(index)
    })
  }, [api, updateScales, onIndexChange])

  return (
    <div className="relative flex flex-col h-125 lg:h-full bg-white dark:bg-[#111] rounded-3xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
      
      {/* Counter */}
      <div className="absolute top-6 left-6 z-20 bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest border border-white/10">
        {songs.length > 0 ? activeIndex + 1 : 0} / {songs.length}
      </div>

      {/* Carousel */}
      <div className="flex-1 w-full flex items-center justify-center">
        {songs.length > 0 ? (
          <Carousel
            setApi={setApi}
            opts={{ align: "center", loop: true, dragFree: false }}
            className="w-full max-w-full"
          >
            <CarouselContent className="-ml-4 h-112.5 items-center">
              {songs.map((song) => {
                const isSelected = selected.includes(song.id)
                return (
                  <CarouselItem key={song.id} className="pl-4 basis-75 md:basis-90">
                    <div
                      // Only allow toggle if NOT voted
                      onClick={() => !hasVoted && onToggle(song.id)}
                      className={`card-inner relative overflow-hidden rounded-2xl shadow-xl group w-full ${
                        isSelected ? "ring-4 ring-[#569429]" : ""
                      } ${hasVoted ? "cursor-default" : "cursor-pointer"}`} 
                      style={{
                        aspectRatio: "1 / 1",
                        transition: "box-shadow 0.3s, border-color 0.3s",
                        transformOrigin: "center center",
                      }}
                    >
                      <img
                        src={song.image_url || "/images/default-music.png"}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                      
                      <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-90" />
                      
                      <div className="absolute bottom-0 left-0 w-full p-6">
                        <h2 className="text-3xl font-black text-white mb-1 leading-none drop-shadow-lg truncate">
                          {song.title}
                        </h2>
                        <p className="text-lg text-[#569429] font-bold tracking-wide drop-shadow-md truncate">
                          {song.artist}
                        </p>
                      </div>

                      {/* SELECTED OVERLAY */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#569429]/20 flex items-center justify-center backdrop-blur-[2px]">
                          <div className={`
                             text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2
                             ${hasVoted ? "bg-gray-800" : "bg-[#569429]"}
                          `}>
                            {hasVoted ? (
                                <> <Lock size={16} /> VOTED </>
                            ) : (
                                <> <CheckCircle2 size={16} /> SELECTED </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
          </Carousel>
        ) : (
           <div className="text-gray-400">Loading songs...</div>
        )}
      </div>

      {/* Nav Buttons */}
      <div className="absolute bottom-6 right-6 flex gap-2 z-20">
        <button
          onClick={() => api?.scrollPrev()}
          className="p-3 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white border border-white/10 transition-all hover:scale-110 active:scale-95 hover:cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => api?.scrollNext()}
          className="p-3 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white border border-white/10 transition-all hover:scale-110 active:scale-95 hover:cursor-pointer"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}