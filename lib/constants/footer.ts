import { SocialLink, FooterInfo } from "@/types/footer"

export const SOCIAL_LINKS: SocialLink[] = [
  { icon: "twitter", label: "X", href: "https://x.com/GreenGiantFM", external: true },
  { icon: "facebook", label: "Facebook", href: "https://www.facebook.com/GreenGiantFM", external: true },
  { icon: "spotify", label: "Spotify", href: "https://open.spotify.com/user/u3c7kostw3e3t4ijbckvs7b8c?si=e680d0001e5f4cae", external: true },
  { icon: "instagram", label: "Instagram", href: "https://www.instagram.com/greengiant.fm/", external: true },
  { icon: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/green-giant-fm", external: true },
  { icon: "gmail", label: "Email", href: "https://mail.google.com/mail/?view=cm&fs=1&to=publicrelations.ggfm@gmail.com", external: true },
]

export const FOOTER_INFO: FooterInfo = {
  address: "Br. Bloemen Hall, De La Salle University, 2401 Taft Ave., Malate, Manila, 1004 Metro Manila",
  email: "publicrelations.ggfm@gmail.com",
  emailHref: "https://mail.google.com/mail/?view=cm&fs=1&to=publicrelations.ggfm@gmail.com"
}