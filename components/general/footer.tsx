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
    <footer>
      <div>
        <p>{FOOTER_INFO.address}</p>
        <a href={FOOTER_INFO.emailHref}>{FOOTER_INFO.email}</a>
      </div>

      <div className="flex gap-4">
        {SOCIAL_LINKS.map((link) => {
          const IconComponent = ICON_MAP[link.icon];
          
          return (
            <a 
              key={link.label} 
              href={link.href} 
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
            >
              {/* Render the icon here! */}
              <IconComponent className="w-6 h-6 text-gray-400 hover:text-white" />
              <span className="sr-only">{link.label}</span>
            </a>
          );
        })}
      </div>
    </footer>
  )
}