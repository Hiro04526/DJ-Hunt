"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, LayoutGroup, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronDown, Menu, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"

const navItems = [
  { name: "ABOUT US", path: "#" },
  { name: "RADIO TALENT", path: "#" },
]

const postsMenu = [{ label: "PR", href: "/posts/pr" }]

const pollsMenu = [
  { label: "HITLIST", href: "#" },
  { label: "DJ HUNT", href: "#" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [openMenu, setOpenMenu] = useState<null | "posts" | "polls">(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const openTimer = useRef<NodeJS.Timeout | null>(null);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  function openWithDelay(name: "posts" | "polls") {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (openTimer.current) clearTimeout(openTimer.current);
    openTimer.current = setTimeout(() => setOpenMenu(name), 90);
  }

  function closeWithDelay() {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 160);
  }

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setOpenMenu(null)
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!dropdownRef.current) return
      if (!dropdownRef.current.contains(e.target as Node)) setOpenMenu(null)
    }
    if (openMenu) document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [openMenu])

  const linkActive = (p: string) => pathname === p || pathname.startsWith(p + "/")
  const groupActive = (menu: { href: string }[]) => menu.some((i) => linkActive(i.href))

  const StaticNavbar = () => (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        "bg-white text-black",
        "dark:bg-[#111111] dark:text-white"
      )}
    >
      <div className="w-full px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="w-32 h-32 relative">
            <Image
              src="/assets/GGFM Logo_Black.png"
              alt="DLSU Radio: Green Giant FM"
              fill
              priority
              className="object-contain block dark:hidden"
            />
            <Image
              src="/assets/GGFM Logo_White.png"
              alt="DLSU Radio: Green Giant FM"
              fill
              priority
              className="object-contain hidden dark:block"
            />
          </Link>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "relative text-2xl font-medium transition-colors hover:text-primary",
                    linkActive(item.path) ? "text-primary" : "hover:text-primary dark:hover:text-primary"
                  )}
                >
                  {item.name}
                </Link>
              ))}

              <span className="text-2xl font-medium opacity-80 select-none">POSTS</span>
              <span className="text-2xl font-medium opacity-80 select-none">POLLS</span>
            </div>

            <Button variant="ghost" size="icon" aria-label="Toggle theme" disabled>
              <Sun className="h-6 w-6 hidden dark:block" />
              <Moon className="h-6 w-6 block dark:hidden" />
            </Button>

            <Button variant="ghost" size="icon" className="md:hidden" disabled>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )

  if (!mounted) return <StaticNavbar />

  return (
    <LayoutGroup>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300",
          "bg-white text-black",
          "dark:bg-[#111111] dark:text-white"
        )}
      >
        <div className="w-full px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="w-32 h-32 relative hover:scale-105">
              <Image
                src="/assets/GGFM Logo_Black.png"
                alt="DLSU Radio: Green Giant FM"
                fill
                priority
                className="object-contain block dark:hidden"
              />
              <Image
                src="/assets/GGFM Logo_White.png"
                alt="DLSU Radio: Green Giant FM"
                fill
                priority
                className="object-contain hidden dark:block"
              />
            </Link>

            {/* Desktop nav */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-8" ref={dropdownRef}>
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "relative text-2xl font-medium transition-colors hover:scale-105 hover:text-primary",
                      pathname === item.path ? "text-primary" : "hover:text-primary dark:hover:text-primary"
                    )}
                  >
                    {item.name}
                    {pathname === item.path && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                      />
                    )}
                  </Link>
                ))}

                {/* POSTS (dropdown) */}
                <div
                  className="relative group"
                  onMouseEnter={() => openWithDelay("posts")}
                  onMouseLeave={closeWithDelay}
                >
                  <button
                    type="button"
                    className={cn(
                      "inline-flex items-center gap-1 text-2xl font-medium transition-colors group-hover:scale-105",
                      (openMenu === "posts" || groupActive(postsMenu))
                        ? "text-primary"
                        : "hover:text-primary dark:hover:text-primary"
                    )}
                    aria-haspopup="menu"
                    aria-expanded={openMenu === "posts"}
                    onClick={() => setOpenMenu(v => (v === "posts" ? null : "posts"))}
                  >
                    POSTS <ChevronDown className="h-6 w-6" />
                  </button>

                  <div className="absolute left-0 right-0 top-full h-2" aria-hidden />

                  <AnimatePresence>
                    {openMenu === "posts" && (
                      <motion.div
                        key="posts-menu"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.12 }}
                        className="absolute left-1/2 top-full mt-2 w-28 -translate-x-1/2 rounded-md border 
                                   bg-white dark:bg-[#222222] shadow-lg overflow-hidden"
                        role="menu"
                        onMouseEnter={() => openWithDelay("posts")}
                        onMouseLeave={closeWithDelay}
                      >
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                          {postsMenu.map(it => (
                            <li key={it.href}>
                              <Link
                                href={it.href}
                                className={cn(
                                  "block px-4 py-2 text-center text-2xl transition hover:scale-105",
                                  "bg-white hover:bg-gray-100 text-black",
                                  "dark:bg-[#1a1a1a] dark:hover:bg-[#2a2a2a] dark:text-white",
                                  linkActive(it.href) && "text-primary"
                                )}
                              >
                                {it.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* POLLS (dropdown) */}
                <div
                  className="relative group"
                  onMouseEnter={() => openWithDelay("polls")}
                  onMouseLeave={closeWithDelay}
                >
                  <button
                    type="button"
                    className={cn(
                      "inline-flex items-center gap-1 text-2xl font-medium transition-colors group-hover:scale-105",
                      (openMenu === "polls" || groupActive(pollsMenu))
                        ? "text-primary"
                        : "hover:text-primary dark:hover:text-primary"
                    )}
                    aria-haspopup="menu"
                    aria-expanded={openMenu === "polls"}
                    onClick={() => setOpenMenu(v => (v === "polls" ? null : "polls"))}
                  >
                    POLLS <ChevronDown className="h-6 w-6" />
                  </button>

                  <div className="absolute left-0 right-0 top-full h-2" aria-hidden />

                  <AnimatePresence>
                    {openMenu === "polls" && (
                      <motion.div
                        key="polls-menu"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.12 }}
                        className="absolute left-1/2 top-full mt-2 w-28 -translate-x-1/2 rounded-md border 
                                   bg-white dark:bg-[#222222] shadow-lg overflow-hidden"
                        role="menu"
                        onMouseEnter={() => openWithDelay("polls")}
                        onMouseLeave={closeWithDelay}
                      >
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                          {pollsMenu.map(it => (
                            <li key={it.href}>
                              <Link
                                href={it.href}
                                className={cn(
                                  "block px-4 py-2 text-center text-2xl transition hover:scale-105",
                                  "bg-white hover:bg-gray-100 text-black",
                                  "dark:bg-[#1a1a1a] dark:hover:bg-[#2a2a2a] dark:text-white",
                                  linkActive(it.href) && "text-primary"
                                )}
                              >
                                {it.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Controls */}
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hover:scale-105"
              >
                {theme === "dark" ? (
                  <Sun className="h-6 w-6" />
                ) : (
                  <Moon className="h-6 w-6" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence initial={false}>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden border-t backdrop-blur-md shadow-lg 
                         bg-white dark:bg-[#111111]"
            >
              <div className="container mx-auto px-4 py-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm transition",
                      "hover:bg-gray-200 dark:hover:bg-[#222222]",
                      linkActive(item.path) ? "text-primary" : "text-black dark:text-white"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {postsMenu.map((it) => (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm transition",
                      "hover:bg-gray-200 dark:hover:bg-[#222222]",
                      linkActive(it.href) ? "text-primary" : "text-black dark:text-white"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {it.label}
                  </Link>
                ))}

                {pollsMenu.map((it) => (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm transition",
                      "hover:bg-gray-200 dark:hover:bg-[#222222]",
                      linkActive(it.href) ? "text-primary" : "text-black dark:text-white"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {it.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </LayoutGroup>
  )
}