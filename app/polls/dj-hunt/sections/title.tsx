"use client"

import { motion } from "framer-motion"
import EqualDurationTypewriter from "@/components/dj-hunt/equal-duration-typewriter"

export function TitleSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      id="home"
      className="relative flex items-center justify-center overflow-hidden bg-[#191919] px-4 pt-28 pb-12 sm:px-10 lg:px-16"
    >

      <div className="container relative z-10 mx-auto text-center">
        <h1 className="font-kenyan text-6xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-7xl md:text-8xl">
          DJ <span className="text-[#569429]">Hunt</span>
        </h1>

        <div className="mt-4 font-secondary text-lg text-[#a8a8a8] md:text-2xl">
          <EqualDurationTypewriter
            lines={[
              "Reaching you from across the airwaves",
              "Shining from the heart of the metro",
              "Serving up the hottest college radio",
            ]}
            typeMs={2000}
            holdMs={1000}
            backspaceMs={1000}
          />
        </div>
      </div>
    </motion.section>
  )
}