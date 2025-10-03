"use client"

import Image from "next/image"
import { FaFacebookF, FaTwitter, FaYoutube, FaSpotify, FaInstagram, FaLinkedinIn, FaEnvelope } from "react-icons/fa"

export function Footer() {
  return (
    <footer className="w-full">
      {/* TOP SECTION */}
      <div className="bg-white text-[#111111]">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
          <h2
            className="text-3xl sm:text-5xl md:text-6xl font-medium mb-4 sm:mb-6 leading-tight text-center"
          >
            Keep it locked with us!
          </h2>

          {/* Social Media Icons */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
            {/* Each icon is a button-sized link for better tap targets */}
            <a
              href="#"
              aria-label="Twitter"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full text-[#569429] hover:opacity-90 transition"
            >
              <FaTwitter className="text-2xl sm:text-4xl md:text-5xl" />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full text-[#569429] hover:opacity-90 transition"
            >
              <FaFacebookF className="text-2xl sm:text-4xl md:text-5xl" />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full text-[#569429] hover:opacity-90 transition"
            >
              <FaYoutube className="text-2xl sm:text-4xl md:text-5xl" />
            </a>
            <a
              href="#"
              aria-label="Spotify"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full text-[#569429] hover:opacity-90 transition"
            >
              <FaSpotify className="text-2xl sm:text-4xl md:text-5xl" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full text-[#569429] hover:opacity-90 transition"
            >
              <FaInstagram className="text-2xl sm:text-4xl md:text-5xl" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full text-[#569429] hover:opacity-90 transition"
            >
              <FaLinkedinIn className="text-2xl sm:text-4xl md:text-5xl" />
            </a>
            <a
              href="mailto:publicrelations.ggfm@gmail.com"
              aria-label="Email"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full text-[#569429] hover:opacity-90 transition"
            >
              <FaEnvelope className="text-2xl sm:text-4xl md:text-5xl" />
            </a>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="bg-[#2E2E2E] text-white px-8 md:px-16 py-10 grid md:grid-cols-3 gap-8 items-start">
        {/* Left: GGFM Logo */}
        <div className="flex justify-center">
          <Image
            src="/assets/GGFM Logo_White.png"
            alt="DLSU Radio: Green Giant FM"
            width={200}
            height={120}
            className="object-contain"
          />
        </div>

        {/* Center: Address */}
        <div className="text-center md:text-left">
          <h2
            className="font-medium mb-2 text-2xl underline underline-offset-4"
          >
            ADDRESS
          </h2>
          <p
            className="text-base leading-relaxed font-secondary"
          >
            Br. Bloemen Hall, De La Salle University, 2401 Taft Ave., Malate, Manila, 1004 Metro Manila
          </p>
        </div>

        {/* Right: Contact + Accreditation */}
        <div className="text-center space-y-2">
          <p className="text-base font-secondary">
            Contact us at{" "}
            <a href="mailto:publicrelations.ggfm@gmail.com" className="underline">
              publicrelations.ggfm@gmail.com
            </a>
          </p>
          <p className="text-base font-secondary">Accredited by the Student Media Office</p>

          <div className="flex justify-center space-x-4 mt-3">
            <Image
              src="/assets/dlsu-smo-white.png"
              alt="DLSU Seal"
              width={200}
              height={200}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}