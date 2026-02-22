"use client"

import { motion } from "framer-motion"
import { FaCheckCircle } from "react-icons/fa"
import { ContactSuccessProps } from "@/types/services"

export function ContactSuccess({ onReset }: ContactSuccessProps) {
  return (
    <motion.div
      key="success-state"
      className="text-center py-10"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <FaCheckCircle className="w-20 h-20 mx-auto mb-6 text-[#1DB954] drop-shadow-[0_0_15px_rgba(29,185,84,0.4)]" />
      <h3 className="text-3xl font-bold mb-3 text-white">Message Sent!</h3>
      <p className="text-gray-400 text-lg mb-8">
        Your message has been sent successfully. We'll get back to you soon.
      </p>
      <button 
        onClick={onReset}
        className="text-[#1DB954] hover:text-[#1ed760] font-bold underline underline-offset-4 transition-colors cursor-pointer"
      >
        Send another message
      </button>
    </motion.div>
  )
}