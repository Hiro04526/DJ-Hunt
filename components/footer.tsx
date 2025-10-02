"use client"

import Image from "next/image"
import { FaFacebookF, FaTwitter, FaYoutube, FaSpotify, FaInstagram, FaLinkedinIn, FaEnvelope } from "react-icons/fa"

export function Footer() {
  return (
    <footer className="w-full">
      {/* TOP SECTION */}
      <div className="bg-white text-[#111111] text-center py-10">
        <h2
          className="text-6xl md:text-6xl font-medium mb-6"
        >
          Keep it locked with us!
        </h2>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-6 md:space-x-10 text-[#569429] text-5xl">
          <a href="#" aria-label="Twitter"><FaTwitter /></a>
          <a href="#" aria-label="Facebook"><FaFacebookF /></a>
          <a href="#" aria-label="YouTube"><FaYoutube /></a>
          <a href="#" aria-label="Spotify"><FaSpotify /></a>
          <a href="#" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
          <a href="mailto:publicrelations.ggfm@gmail.com" aria-label="Email"><FaEnvelope /></a>
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