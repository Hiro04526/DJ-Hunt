import Image from "next/image"
import { FaFacebookF, FaSpotify, FaInstagram, FaLinkedinIn } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { SiGmail } from "react-icons/si"
import { SOCIAL_LINKS, FOOTER_INFO } from "@/lib/constants/footer"

const ICON_MAP: Record<string, React.ElementType> = {
  twitter: FaXTwitter,
  facebook: FaFacebookF,
  spotify: FaSpotify,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  gmail: SiGmail,
}

export function Footer() {
  return (
    <footer className="w-full">
      <div className="bg-[#F5F2E9] text-black dark:bg-[#191919] dark:text-white">
        {/* Container */}
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 sm:py-10 space-y-8">

          {/* Title */}
          <h2 className="text-center text-3xl sm:text-4xl md:text-6xl font-medium leading-tight">
            Keep it locked with us!
          </h2>

          {/* Social Icons using ICON_MAP */}
          <div className="mx-auto flex flex-wrap justify-center gap-x-4 gap-y-3 md:gap-x-6 md:gap-y-4 max-w-3xl">
            {SOCIAL_LINKS.map((link) => {
              const IconComponent = ICON_MAP[link.icon]

              if (!IconComponent) {
                console.warn(`Missing icon mapping for: ${link.icon}`)
                return null; 
              }
              
              return (
                <a 
                  key={link.label} 
                  href={link.href} 
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  aria-label={link.label}
                  className="inline-flex items-center justify-center hover:scale-105 rounded-full text-[#569429] hover:opacity-90 transition h-12 w-12 md:h-16 md:w-16 basis-1/5 md:basis-auto"
                >
                  {/* Removed w-6 h-6 to use your custom text-3xl md:text-5xl sizing */}
                  <IconComponent className="text-3xl md:text-5xl" />
                </a>
              );
            })}
          </div>

          {/* Address */}
          <div className="max-w-fit mx-auto text-center">
            <h3 className="font-medium mb-2 text-2xl underline underline-offset-4">
              ADDRESS
            </h3>
            <p className="text-base leading-relaxed font-secondary">
              {FOOTER_INFO.address}
            </p>
          </div>

          {/* Contact */}
          <div className="flex justify-center">
            <p className="text-base font-secondary text-center">
              Contact us at{" "}
              <a
                href={FOOTER_INFO.emailHref}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#569429]"
              >
                {FOOTER_INFO.email}
              </a>
            </p>
          </div>

          {/* Logo Container - With fixed sizing so it doesn't disappear */}
          <div className="mx-auto h-18 w-50 relative mt-8">
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