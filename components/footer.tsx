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
      <div className="bg-white text-black dark:bg-[#191919] dark:text-white px-8 py-10 grid md:grid-cols-2 gap-4">
        {/* Left: Logo + Info */}
        <div className="flex flex-col gap-4">
          <div className="relative h-[60px] w-auto">
            <Image
              src={theme === "dark" ? "/assets/GGFM Logo_White.png" : "/assets/GGFM Logo_Black.png"}
              alt="DLSU Radio: Green Giant FM"
              fill
              className="object-contain"
            />
          </div>

          <div>
            <h2 className="flex justify-center font-medium mb-2 text-2xl underline text-black dark:text-white underline-offset-4">
              ADDRESS
            </h2>
            <p className="flex justify-center text-base leading-relaxed text-black dark:text-white font-secondary">
              Br. Bloemen Hall, De La Salle University, 2401 Taft Ave., Malate, Manila, 1004 Metro Manila
            </p>
          </div>
        </div>

        {/* Right: Social Links */}
        <div className="flex flex-col gap-4">
          <h2 className="flex justify-center text-4xl md:text-6xl font-medium leading-tight">
            Keep it locked with us!
          </h2>

          {/* Social Icons */}
          <div className="flex justify-center gap-4 md:gap-6">
            {[FaXTwitter, FaFacebookF, FaYoutube, FaSpotify, FaInstagram, FaLinkedinIn].map(
              (Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="inline-flex h-[66px] w-[66px] items-center justify-center rounded-full text-[#569429] hover:opacity-90 transition"
                >
                  <Icon className="text-4xl md:text-[66px]" />
                </a>
              )
            )}
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=publicrelations.ggfm@gmail.com"
              target="_blank"
              className="inline-flex h-16 w-16 items-center justify-center rounded-full text-[#569429] hover:opacity-90 transition"
            >
              <SiGmail className="text-4xl md:text-[66px]" />
            </a>
          </div>
        </div>

        <div className="md:col-span-2 flex justify-center">
          <p className="text-base text-black dark:text-white font-secondary">
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
    </footer>
  )
}