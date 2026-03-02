"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"

export function useNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [openMenu, setOpenMenu] = useState<null | "polls">(null)
  
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const openTimer = useRef<NodeJS.Timeout | null>(null)
  const closeTimer = useRef<NodeJS.Timeout | null>(null)

  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  // --- 1. DROPDOWN DELAY HANDLERS ---
  function openWithDelay(name: "polls") {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    if (openTimer.current) clearTimeout(openTimer.current)
    openTimer.current = setTimeout(() => setOpenMenu(name), 90)
  }

  function closeWithDelay() {
    if (openTimer.current) clearTimeout(openTimer.current)
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpenMenu(null), 160)
  }

  // --- 2. MOUNT & SCROLL LISTENERS ---
  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // --- 3. ROUTE CHANGE LISTENER ---
  useEffect(() => {
    setOpenMenu(null)
    setIsMobileMenuOpen(false)
  }, [pathname])

  // --- 4. OUTSIDE CLICK LISTENER ---
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!dropdownRef.current) return
      if (!dropdownRef.current.contains(e.target as Node)) setOpenMenu(null)
    }
    if (openMenu) document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [openMenu])

  // --- 5. ACTIVE ROUTE HELPERS ---
  const linkActive = (p: string) => pathname === p || pathname.startsWith(p + "/")
  const groupActive = (menu: { href: string }[]) => menu.some((i) => linkActive(i.href))

  return {
    isScrolled,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    mounted,
    openMenu,
    setOpenMenu,
    dropdownRef,
    pathname,
    theme,
    setTheme,
    openWithDelay,
    closeWithDelay,
    linkActive,
    groupActive
  }
}