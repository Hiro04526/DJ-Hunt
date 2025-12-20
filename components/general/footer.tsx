"use client"

import Image from "next/image"
import { FaFacebookF, FaSpotify, FaInstagram, FaLinkedinIn } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { SiGmail } from "react-icons/si"

export function Footer() {
  const socials = [
    { Icon: FaXTwitter, label: "X", href: "https://x.com/GreenGiantFM" },
    { Icon: FaFacebookF, label: "Facebook", href: "https://www.facebook.com/GreenGiantFM" },
    { Icon: FaSpotify, label: "Spotify", href: "https://open.spotify.com/user/u3c7kostw3e3t4ijbckvs7b8c?si=e680d0001e5f4cae" },
    { Icon: FaInstagram, label: "Instagram", href: "https://www.instagram.com/greengiant.fm/" },
    { Icon: FaLinkedinIn, label: "LinkedIn", href: "https://www.linkedin.com/company/green-giant-fm" },
    {
      Icon: SiGmail,
      label: "Email",
      href: "https://mail.google.com/mail/?view=cm&fs=1&to=publicrelations.ggfm@gmail.com",
      external: true,
    },
  ]

  return (
    <footer className="w-full">
      <div className="bg-white text-black dark:bg-[#191919] dark:text-white">
        {/* Container */}
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 sm:py-10 space-y-4">

          {/* Title */}
          <h2 className="text-center text-3xl sm:text-4xl md:text-6xl font-medium leading-tight">
            Keep it locked with us!
          </h2>

          {/* Social Icons */}
          <div
            className="
              mx-auto flex flex-wrap justify-center
              gap-x-4 gap-y-3 md:gap-x-6 md:gap-y-4
              max-w-3xl
            "
          >
            {socials.map(({ Icon, label, href, external }, i) => (
              <a
                key={i}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                aria-label={label}
                className="
                  inline-flex items-center justify-center hover:scale-105
                  rounded-full text-[#569429] hover:opacity-90 transition
                  h-12 w-12 md:h-16 md:w-16
                  basis-1/5 md:basis-auto
                "
              >
                <Icon className="text-3xl md:text-5xl" />
              </a>
            ))}
          </div>

          {/* Address */}
          <div className="max-w-fit mx-auto text-center">
            <h3 className="font-medium mb-2 text-2xl underline underline-offset-4">
              ADDRESS
            </h3>
            <p className="text-base leading-relaxed font-secondary">
              Br. Bloemen Hall, De La Salle University, 2401 Taft Ave., Malate, Manila, 1004 Metro Manila
            </p>
          </div>

          {/* Contact */}
          <div className="flex justify-center">
            <p className="text-base font-secondary text-center">
              Contact us at{" "}
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=publicrelations.ggfm@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#569429]"
              >
                publicrelations.ggfm@gmail.com
              </a>
            </p>
          </div>

          {/* Logo */}
          <div className="mx-auto h-18 w-50 relative">
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
          </div>

        </div>
      </div>
    </footer>
  )
}