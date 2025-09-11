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
  { name: "ABOUT US", path: "/About" },
  { name: "RADIO TALENT", path: "/Radio-Talent" },
]

const postsMenu = [
  { label: "PR", href: "/Posts/PR" },
]

const pollsMenu = [
  { label: "HITLIST", href: "/Polls/Hitlist"},
  { label: "DJ HUNT", href: "/Polls/DJ-Hunt"},
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [openMenu, setOpenMenu] = useState<null | "posts" | "polls">(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // close menus on route change and when mobile nav toggles
  useEffect(() => {
    setOpenMenu(null)
    setIsMobileMenuOpen(false)
  }, [pathname])

  // click outside closes desktop dropdowns
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!dropdownRef.current) return
      if (!dropdownRef.current.contains(e.target as Node)) setOpenMenu(null)
    }
    if (openMenu) document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [openMenu])

  if (!mounted) return null

  const linkActive = (p: string) =>
    pathname === p || pathname.startsWith(p + "/")

  const groupActive = (menu: { href: string }[]) =>
    menu.some((i) => linkActive(i.href))

  return (
    <LayoutGroup>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300 bg-[#191919]"
        )}
      >
        <div className="w-full px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="w-32 h-32 relative">
              <Image
                src="/assets/GGFM Logo_White.png"
                alt="Logo"
                fill
                loading="lazy"
                quality={70}
                className="object-contain"
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
                      "relative text-3xl font-medium transition-colors hover:text-primary",
                      pathname === item.path
                        ? "text-primary"
                        : "text-muted-foreground"
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

                {/* POSTS (dropdown under trigger) */}
                <div className="relative" onMouseLeave={() => setOpenMenu(null)}>
                  <button
                    type="button"
                    className={cn(
                      "inline-flex items-center gap-1 text-3xl font-medium transition-colors",
                      (openMenu === "posts" || groupActive(postsMenu))
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    )}
                    aria-haspopup="menu"
                    aria-expanded={openMenu === "posts"}
                    onClick={() => setOpenMenu(v => v === "posts" ? null : "posts")}
                    onMouseEnter={() => setOpenMenu("posts")}
                  >
                    POSTS <ChevronDown className="h-6 w-6" />
                  </button>

                  <AnimatePresence>
                    {openMenu === "posts" && (
                      <motion.div
                        key="posts-menu"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.12 }}
                        className="absolute left-0 top-full mt-2 w-28 rounded-md border bg-background shadow-lg overflow-hidden"
                        role="menu"
                      >
                        <ul className="divide-y">
                          {postsMenu.map(it => (
                            <li key={it.href}>
                              <Link
                                href={it.href}
                                className={cn(
                                  "block px-4 py-2 text-center text-3xl bg-[#363636] hover:bg-accent transition",
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

                {/* POLLS (dropdown under trigger) */}
                <div className="relative" onMouseLeave={() => setOpenMenu(null)}>
                  <button
                    type="button"
                    className={cn(
                      "inline-flex items-center gap-1 text-3xl font-medium transition-colors",
                      (openMenu === "polls" || groupActive(pollsMenu))
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    )}
                    aria-haspopup="menu"
                    aria-expanded={openMenu === "polls"}
                    onClick={() => setOpenMenu(v => v === "polls" ? null : "polls")}
                    onMouseEnter={() => setOpenMenu("polls")}
                  >
                    POLLS <ChevronDown className="h-6 w-6" />
                  </button>

                  <AnimatePresence>
                    {openMenu === "polls" && (
                      <motion.div
                        key="polls-menu"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.12 }}
                        className="absolute left-0 top-full mt-2 w-28 rounded-md border bg-background shadow-lg overflow-hidden"
                        role="menu"
                      >
                        <ul className="divide-y">
                          {pollsMenu.map(it => (
                            <li key={it.href}>
                              <Link
                                href={it.href}
                                className={cn(
                                  "block px-4 py-2 text-center text-3xl bg-[#191919] hover:bg-accent transition",
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
              >
                {theme === "dark" ? (
                  <Sun className="h-7 w-7" />
                ) : (
                  <Moon className="h-7 w-7" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-7 w-7" />
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
              className="md:hidden border-t bg-background/95 backdrop-blur-md shadow-lg"
            >
              <div className="container mx-auto px-4 py-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm transition hover:bg-accent",
                      linkActive(item.path) && "text-primary"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* POSTS collapsible (subpages only) */}
                <details className="rounded-md border p-2">
                  <summary className="flex cursor-pointer items-center justify-between px-1 py-1 text-sm font-medium">
                    POSTS <ChevronDown className="h-4 w-4" />
                  </summary>
                  <div className="mt-2 space-y-1 pl-2">
                    {postsMenu.map((it) => (
                      <Link
                        key={it.href}
                        href={it.href}
                        className={cn(
                          "block rounded-md px-3 py-2 text-sm transition hover:bg-accent",
                          linkActive(it.href) && "text-primary"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {it.label}
                      </Link>
                    ))}
                  </div>
                </details>

                {/* POLLS collapsible (subpages only) */}
                <details className="rounded-md border p-2">
                  <summary className="flex cursor-pointer items-center justify-between px-1 py-1 text-sm font-medium">
                    POLLS <ChevronDown className="h-4 w-4" />
                  </summary>
                  <div className="mt-2 space-y-1 pl-2">
                    {pollsMenu.map((it) => (
                      <Link
                        key={it.href}
                        href={it.href}
                        className={cn(
                          "block rounded-md px-3 py-2 text-sm transition hover:bg-accent",
                          linkActive(it.href) && "text-primary"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {it.label}
                      </Link>
                    ))}
                  </div>
                </details>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </LayoutGroup>
  )
}
