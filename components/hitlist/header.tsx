"use client"

import { memo } from "react"
import { HeaderProps } from "@/types/hitlist"

function HitlistHeaderComponent({ user, onLogout }: HeaderProps) {
  return (
    <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-6xl md:text-8xl text-center lg:text-left font-medium uppercase mb-2">
          Hitlist <span className="text-[#569429]">Voting</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-center lg:text-left font-medium font-secondary text-2xl">
          Curate the sound of <span className="block sm:inline">Green Giant FM.</span>
        </p>
      </div>

      {user && (
      <div className="self-center md:self-auto mx-auto lg:mr-0 lg:ml-auto w-fit flex items-center justify-center gap-2 sm:gap-3 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 px-3 sm:px-4 py-2 rounded-full shadow-sm max-w-full">
        
        {/* Status indicator */}
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
        
        {/* Email Text Container */}
        <span className="min-w-0 text-[10px] sm:text-sm font-secondary font-bold uppercase tracking-wider opacity-70 truncate leading-none">
          <span className="hidden sm:inline">Signed in as </span>
          <strong>{user.email}</strong>
        </span>

        {/* Divider for mobile */}
        <span className="text-[10px] sm:text-sm leading-none text-gray-300 dark:text-gray-700 sm:hidden shrink-0">|</span>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="text-[10px] sm:text-sm font-secondary font-bold text-red-500 hover:underline hover:cursor-pointer shrink-0 leading-none"
        >
          LOGOUT
        </button>

      </div>
      )}
    </header>
  )
}

export const HitlistHeader = memo(HitlistHeaderComponent)