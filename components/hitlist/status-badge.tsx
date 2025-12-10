"use client"

import React, { useEffect, useState } from "react"

export default function StatusBadge() {
  const [online, setOnline] = useState(false)

  useEffect(() => {
    setOnline(true)
  }, [])

  return (
    <div
      className={[
        "inline-flex items-center justify-center",
        "px-4 md:px-6",
        "h-[45px] md:h-[60px]",
        "rounded-full text-xl md:text-3xl font-medium",
        "transition-all duration-300",
        "backdrop-blur-md border bg-white dark:bg-black",
        online
          ? "text-green-400 border-green-500/60 shadow-[0_0_40px_rgba(0,200,0,0.55),_0_0_60px_rgba(0,200,0,0.35)]"
          : "text-red-500 border-red-500/60 shadow-[0_0_40px_rgba(200,0,0,0.55),_0_0_60px_rgba(200,0,0,0.35)]"
      ].join(" ")}
    >
      {online ? "Currently online" : "Currently offline"}
    </div>
  )
}