"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import StatusBadge from "@/components/hitlist/status-badge"
import Playlist from "@/components/hitlist/playlist"

export default function TitleSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <section
        id="hitlist"
        className="relative mt-16 w-full min-h-screen bg-black"
      />
    )
  }

  return (
    <motion.section
      id="hitlist"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full bg-black pt-16"
    >
      {/* CARD CONTAINER */}
      <div className="relative w-full bg-neutral-100 dark:bg-white overflow-hidden">
        
        {/* Background Patterns */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="vinyl-rings opacity-100 pointer-events-none" />
          <div className="vinyl-image opacity-0 lg:opacity-100 pointer-events-none" />
          <div className="vinyl-center opacity-0 lg:opacity-100 pointer-events-none" />
        </div>

        <div className="max-w-360 relative mx-auto px-4 md:px-8 py-12 lg:py-20 z-10 h-full">
          
          {/* Grid Content */}
          <div className="w-full flex flex-col lg:grid lg:grid-cols-[1fr_auto_1fr] items-center gap-0 lg:gap-8">
            
            {/* --- 1. TEXT SECTION --- */}
            <div className="flex flex-col items-center lg:items-start justify-start w-full order-1">
              
              <div className="px-2 flex flex-col items-center lg:items-start text-center lg:text-left w-88 lg:max-w-xl gap-6">
                
                {/* Header & Status */}
                <div className="flex items-center justify-between w-88 lg:w-full">
                  <h2 className="pl-0 lg:pl-1 text-4xl sm:text-5xl lg:text-6xl font-medium leading-none text-[#111111]">
                    THE
                  </h2>
                  <StatusBadge />
                </div>

                {/* "Hitlist" Title */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-88 lg:w-full"
                >
                  <div className="px-2 flex justify-between text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-medium leading-[0.8] text-[#111111]">
                    {"HITLIST".split("").map((char, index) => (
                      <span key={index}>{char}</span>
                    ))}
                  </div>
                </motion.div>

                {/* Description */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="pl-0 lg:pl-1 w-88 lg:w-full text-xl sm:text-2xl lg:text-3xl leading-snug text-[#111111]"
                >
                  Love music? This is your chance!
                  <br />
                  Vote for your favorite songs now!
                </motion.p>
              </div>
            </div>

            {/* --- 2. DINOSAUR GRAPHIC SECTION --- */}
            <div className="relative order-2 flex items-center justify-center w-full h-full opacity-0 lg:opacity-100 lg:w-80 lg:h-125">
               {/* Spacer for the background graphic */}
            </div>

            {/* --- 3. PLAYLIST SECTION --- */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="flex justify-center lg:justify-end w-full order-3"
            >
              <div className="relative pt-6 lg:pt-0 w-88 lg:max-w-xl h-116 lg:h-[70vh] bg-transparent">
                <Playlist />
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </motion.section>
  )
}