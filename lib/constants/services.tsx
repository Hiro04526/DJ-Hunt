import { Megaphone, Share2, Mic2, Users, Camera } from "lucide-react"
import { ServiceItem } from "@/types/services"

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "aob",
    title: "Advertising & Onboarding",
    icon: <Megaphone className="w-8 h-8" />,
    description: "Amplify your brand's reach with our targeted advertising and seamless onboarding campaigns.",
    subServices: ["Ad Placements", "Brand Integration", "Onboarding Campaigns"],
    color: "from-green-500 to-green-700",
    primerUrl: "/primers/advertising-primer.pdf", // Ensure you put a dummy PDF in public/primers/
    sampleTabs: [
      {
        name: "Ad Placements",
        media: [
          { type: "image", url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop", orientation: "horizontal" },
          { type: "image", url: "https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=1000&auto=format&fit=crop", orientation: "vertical" }
        ]
      },
      {
        name: "Brand Integration",
        media: [
          { type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4", orientation: "horizontal" }
        ]
      }
    ]
  },
  {
    id: "social",
    title: "Social Media Services",
    icon: <Share2 className="w-8 h-8" />,
    description: "Engage your target demographic through our established digital presence and creative content.",
    subServices: ["Social Media Marketing", "Content Creation", "Digital Campaigns"],
    color: "from-blue-500 to-blue-700",
    primerUrl: "/primers/social-media-primer.pdf",
    sampleTabs: [
      {
        name: "Content Creation",
        media: [
          { type: "image", url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop", orientation: "vertical" },
          { type: "image", url: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=1000&auto=format&fit=crop", orientation: "vertical" }
        ]
      },
      {
        name: "Digital Campaigns",
        media: [
          { type: "image", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop", orientation: "horizontal" }
        ]
      }
    ]
  },
  {
    id: "guesting",
    title: "Show Guesting",
    icon: <Mic2 className="w-8 h-8" />,
    description: "Feature on our premium radio shows and podcasts to share your story with our listeners.",
    subServices: ["Radio Interviews", "Podcast Features", "Live Q&A Sessions"],
    color: "from-purple-500 to-purple-700",
    primerUrl: "/primers/guesting-primer.pdf",
    sampleTabs: [
      {
        name: "Podcast Features",
        media: [
          { type: "image", url: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000&auto=format&fit=crop", orientation: "horizontal" },
          { type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4", orientation: "horizontal" }
        ]
      },
      {
        name: "Radio Interviews",
        media: [
          { type: "image", url: "https://images.unsplash.com/photo-1516280440502-a22237d0486c?q=80&w=1000&auto=format&fit=crop", orientation: "horizontal" }
        ]
      }
    ]
  },
  {
    id: "talent",
    title: "Talent Provision",
    icon: <Users className="w-8 h-8" />,
    description: "Professional voices and dynamic hosts for your events and digital content.",
    subServices: ["Hosting", "Voiceovers", "Event Emceeing"],
    color: "from-orange-500 to-orange-700",
    primerUrl: "/primers/talent-primer.pdf",
    sampleTabs: [
      {
        name: "Hosting & Emceeing",
        media: [
          { type: "image", url: "https://images.unsplash.com/photo-1478147424036-cb1c4962cc53?q=80&w=1000&auto=format&fit=crop", orientation: "horizontal" },
          { type: "image", url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop", orientation: "vertical" }
        ]
      },
      {
        name: "Voiceovers",
        media: [
          { type: "image", url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop", orientation: "horizontal" }
        ]
      }
    ]
  },
  {
    id: "media",
    title: "Media Coverage",
    icon: <Camera className="w-8 h-8" />,
    description: "Comprehensive documentation of your events through high-quality visual and written media.",
    subServices: ["Live Instagram Coverage", "Photo Coverage", "Writeups"],
    color: "from-pink-500 to-pink-700",
    primerUrl: "/primers/media-primer.pdf",
    sampleTabs: [
      {
        name: "Photo Coverage",
        media: [
          { type: "image", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop", orientation: "horizontal" },
          { type: "image", url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop", orientation: "vertical" },
          { type: "image", url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop", orientation: "vertical" }
        ]
      },
      {
        name: "Live IG Coverage",
        media: [
          { type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4", orientation: "vertical" }
        ]
      }
    ]
  }
]

export const NAME_TITLES = ["Mr.", "Ms.", "Mrs.", "Dr.", "Mx."] as const

export const DEFAULT_CONTACT_SUBJECT = "General Service Inquiry"

export const ANIMATION_VARIANTS = {
  form: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    exit: { opacity: 0, y: -20 }
  },
  child: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }
}

