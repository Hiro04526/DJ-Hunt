"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { TypeAnimation } from "react-type-animation"

export function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      id="home"
      className="relative mt-16 min-h-fit flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-white" />
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="text-center">
          <motion.h1
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-6xl md:text-8xl font-bold mt-4 mb-6 text-[#191919]"
          >
            DJ HUNT
          </motion.h1>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xl md:text-2xl font-secondary text-[#191919] mb-6"
          >
            <TypeAnimation
              sequence={[
                "Building beautiful web experiences",
                1000,
                "Crafting intuitive interfaces",
                1000,
                "Creating engaging animations",
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}