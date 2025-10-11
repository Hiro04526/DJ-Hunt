"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import Image from "next/image"
import { FaFacebookF, FaYoutube, FaSpotify, FaInstagram, FaLinkedinIn } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { SiGmail } from "react-icons/si"

const navItems = [
  { name: "ABOUT US", path: "/about-us" },
  { name: "RADIO TALENT", path: "/radio-talent" },
]

const postsMenu = [{ label: "PR", href: "/posts/pr" }]

const pollsMenu = [
  { label: "HITLIST", href: "/polls/hitlist" },
  { label: "DJ HUNT", href: "/polls/dj-hunt" },
]

export function Footer() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const linkActive = (p: string) => pathname === p || pathname.startsWith(p + "/")

  return (
    <footer className="w-full">
      {/* TOP SECTION */}
      <div className="bg-white text-black dark:bg-[#191919] dark:text-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10 text-center">
          <h2 className="text-4xl md:text-6xl font-medium mb-6 leading-tight">
            Keep it locked with us!
          </h2>

          {/* Social Icons */}
          <div className="flex justify-center gap-4 md:gap-6">
            {[FaXTwitter, FaFacebookF, FaYoutube, FaSpotify, FaInstagram, FaLinkedinIn].map(
              (Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full text-[#569429] hover:opacity-90 transition"
                >
                  <Icon className="text-4xl md:text-5xl" />
                </a>
              )
            )}
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=publicrelations.ggfm@gmail.com"
              target="_blank"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full text-[#569429] hover:opacity-90 transition"
            >
              <SiGmail className="text-4xl md:text-5xl" />
            </a>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="bg-[#363636] dark:bg-[#E5E0D1] text-white dark:text-black px-8 py-10 grid md:grid-cols-2 gap-8">
        {/* Left: Logo + Info */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-center">
            <Image
              src={theme === "dark" ? "/assets/GGFM Logo_Black.png" : "/assets/GGFM Logo_White.png"}
              alt="DLSU Radio: Green Giant FM"
              width={200}
              height={120}
              className="object-contain"
            />
          </div>

          <div>
            <h2 className="flex justify-center font-medium mb-2 text-2xl underline text-white dark:text-black underline-offset-4">
              ADDRESS
            </h2>
            <p className="flex justify-center text-base leading-relaxed text-white dark:text-black font-secondary">
              Br. Bloemen Hall, De La Salle University, 2401 Taft Ave., Malate, Manila, 1004 Metro Manila
            </p>
          </div>

          <div className="flex justify-center space-y-2">
            <p className="text-base text-white dark:text-black font-secondary">
              Contact us at {" "}
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=publicrelations.ggfm@gmail.com"
                target="_blank"
                className="underline hover:text-[#569429]"
              >
                publicrelations.ggfm@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* Right: Navigation Links */}
        <div className="flex flex-col items-center gap-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "relative text-3xl font-medium transition-colors hover:text-primary",
                pathname === item.path
                  ? "text-primary"
                  : "hover:text-primary dark:hover:text-primary"
              )}
            >
              {item.name}
              {linkActive(item.path) && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#569429]"
                />
              )}
            </Link>
          ))}

          {postsMenu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative text-3xl font-medium transition-colors hover:text-[#569429]",
                linkActive(item.href) && "text-[#569429]"
              )}
            >
              {item.label}
            </Link>
          ))}

          {pollsMenu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative text-3xl font-medium transition-colors hover:text-[#569429]",
                linkActive(item.href) && "text-[#569429]"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}