"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import StatusBadge from "@/components/hitlist/status-badge"
import Playlist from "@/components/hitlist/playlist"

export function TitleSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <section
        id="hitlist"
        className="relative mt-16 w-full flex items-center justify-center overflow-hidden bg-black"
      />
    )
  }

  return (
    <motion.section
      id="hitlist"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative mt-14 w-full h-[92.5vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 transition-colors duration-500 bg-black dark:bg-white" />

        {/* Vinyl Background Elements */}
        <div className="vinyl-rings pointer-events-none" />
        <div className="vinyl-image pointer-events-none" />
        <div className="vinyl-center pointer-events-none" />
      </div>

      {/* Content */}
      <div className="w-full px-4 z-10">
        <div className="w-full min-h-[70vh] grid grid-cols-[1fr_auto_1fr] items-center gap-8 lg:gap-16">
          {/* LEFT SIDE */}
          <div className="flex justify-center">
            <div className="flex flex-col items-start text-left h-min w-[365px] gap-6">
              
              {/* Row for "The" + StatusBadge */}
              <div className="flex items-center justify-between w-full">
                <h2 className="pl-1.5 text-fluid-the font-medium leading-none text-white dark:text-[#111111]">
                  The
                </h2>

                <StatusBadge />
              </div>

              {/* Justified letters "Hitlist" */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <div className="flex justify-between text-fluid-hitlist font-medium leading-[0.8] text-white dark:text-[#111111]">
                  {"Hitlist".split("").map((char, index) => (
                    <span key={index}>{char}</span>
                  ))}
                </div>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="pl-1.5 w-[365px] text-2xl md:text-3xl leading-snug text-white dark:text-[#111111]"
              >
                Love music? This is your chance!
                <br />
                Vote for your favorite songs now!
              </motion.p>

            </div>
          </div>

          {/* MIDDLE COLUMN */}
          <div className="relative h-8 w-8 pointer-events-none">
          </div>

          {/* RIGHT SIDE */}
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="flex justify-center bg-transparent"
          >
            <div className="flex items-center justify-center 
                            w-[90vw] max-w-[400px] 
                            h-[350px] md:h-[400px] lg:h-[600px] rounded-xl bg-transparent">
              <Playlist />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default TitleSection