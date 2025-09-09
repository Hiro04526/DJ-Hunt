"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, LayoutGroup } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import Image from 'next/image'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!mounted) return null

  return (
    <LayoutGroup>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300 bg-transparent backdrop-blur-sm"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="w-8 h-8 relative transition-opacity">
              <Image
                src="/assets/favicon.ico"
                alt="Logo"
                fill
                loading="lazy"
                quality={70}
                className="object-contain"
              />
            </div>
            {/* Right Controls */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: isMobileMenuOpen ? 1 : 0,
            y: isMobileMenuOpen ? 0 : -20,
          }}
          className={cn(
            "absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-md shadow-lg md:hidden",
            !isMobileMenuOpen && "hidden"
          )}
        >
        </motion.div>
      </motion.nav>
    </LayoutGroup>
  )
}