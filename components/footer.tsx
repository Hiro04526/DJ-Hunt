'use client'

import { Linkedin } from 'lucide-react'
import { siFacebook, siGithub, siInstagram, siGmail } from "simple-icons/icons";
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
import Image from 'next/image'

const SimpleIcon = ({ icon, className = "", style }: { icon: any; className?: string; style?: React.CSSProperties }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-5 h-5 fill-current ${className}`}
    style={style}
  >
    <title>{icon.title}</title>
    <path d={icon.path} />
  </svg>
);

const SocialIcon = ({ icon, className, style }: { icon: any; className?: string; style?: React.CSSProperties }) => {
  if (icon?.path) {
    return <SimpleIcon icon={icon} className={className} style={style}/>
  }
  const LucideIcon = icon;
  return <LucideIcon className={`w-5 h-5 ${className}`} style={style}/>;
};

interface Contributor {
  name: string
  link: string
  image: string
}

function RotatingImage({ glow }: { glow: string }) {
  const [rotation, setRotation] = useState(0)
  const requestRef = useRef<number>()
  const lastTimeRef = useRef<number | null>(null)

  const animate = (time: number) => {
    if (lastTimeRef.current !== null) {
      const delta = time - lastTimeRef.current
      if (delta > 100) {
        setRotation((prev) => (prev > 1e6 ? 0 : prev + 5))
        lastTimeRef.current = time
      }
    } else {
      lastTimeRef.current = time
    }
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current!)
  }, [])

  return (
    <div className="mb-4 relative group">
      <Image
        src="/assets/myimage.JPG"
        alt="Hiro Ishikawa"
        width={100}
        height={100}
        loading="lazy"
        quality={70}
        className="rounded-full border-4 border-primary shadow-lg transition-all duration-300 hover:scale-110 group-hover:shadow-primary/50"
        style={{ transform: `rotate(${rotation}deg)` }}
      />
      <div className={`absolute -inset-2 rounded-full opacity-25 animate-pulse bg-gradient-to-r ${glow} blur-md transition-all duration-1000`}></div>
      <div className="absolute -inset-2 rounded-full opacity-25 animate-ping bg-gradient-to-r from-primary via-secondary to-primary"></div>
    </div>
  )
}


export function Footer() {
  const [profileGlow, setProfileGlow] = useState(0)
  const [contributorScales, setContributorScales] = useState([1, 1, 1])
  const contributors: Contributor[] = [
    {
      name: "Daniella Limbag",
      link: "https://daniellalimbag.github.io/",
      image: "/assets/contributor1.png"
    },
    {
      name: "Jan Murillo",
      link: "https://janfolio.webflow.io/",
      image: "/assets/contributor2.jpg"
    }
  ]

  useEffect(() => {
    const glowInterval = setInterval(() => {
      setProfileGlow(prev => (prev + 1) % 6)
    }, 1000)

    const scaleInterval = setInterval(() => {
      setContributorScales(prev => [
        1 + Math.sin(Date.now() / 1000) * 0.2,
        1 + Math.sin(Date.now() / 800) * 0.2,
        1 + Math.sin(Date.now() / 600) * 0.2,
      ])
    }, 50)

    return () => {
      clearInterval(glowInterval)
      clearInterval(scaleInterval)
    }
  }, [])

  const glowColors = [
    'from-blue-400 via-green-400 to-purple-400',
    'from-red-400 via-yellow-400 to-green-400',
    'from-pink-400 via-purple-400 to-indigo-400',
    'from-yellow-400 via-red-400 to-pink-400',
    'from-green-400 via-blue-400 to-indigo-400',
    'from-purple-400 via-pink-400 to-red-400',
  ]

  return (
    <footer className="w-full border-t bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between space-y-8 md:flex-row md:space-y-0">
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <RotatingImage glow={glowColors[profileGlow]} />
            {[ "Phone: +639770349859", "Email: 21hiro44@gmail.com" ].map((text, index) => (
              <p
                key={index}
                className={`mt-1 text-sm font-medium text-purple-500 hover:scale-105 transform transition-colors duration-300`}
              >
                {text.startsWith('Phone:') ? (
                  <>Phone: <a href="tel:+639770349859" className="hover:underline hover:text-purple-500">+639770349859</a></>
                ) : text.startsWith('Email:') ? (
                  <>Email: <a href="mailto:21hiro44@gmail.com" className="hover:underline hover:text-purple-500">21hiro44@gmail.com</a></>
                ) : text}
              </p>
            ))}
          </div>

          <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-4">
              {[
                { icon: siGithub, href: "https://github.com/Hiro04526", color: "#8250DF" },       // purple-500
                { icon: siFacebook, href: "https://www.facebook.com/Hiro04526/", color: "#1877F2" }, // Facebook Blue
                { icon: siInstagram, href: "https://www.instagram.com/hir0__0/", color: "#E1306C" }, // Instagram Pink
                { icon: Linkedin, href: "https://linkedin.com/in/hiro-ishikawa", color: "#0A66C2" }, // LinkedIn Blue
                { icon: siGmail, href: "https://mail.google.com/mail/?view=cm&fs=1&to=21hiro44@gmail.com", color: "#EA4335" } // Gmail Red
              ].map((social, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="group transition-all duration-300 transform hover:scale-110 hover:rotate-6"
                >
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative"
                  >
                    <SocialIcon icon={social.icon} className="w-5 h-5" style={{ color: social.color }}/>
                    <span 
                      className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"
                      style={{ backgroundColor: social.color }}
                    >
                    </span>
                    <span 
                      className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-25 transition-opacity duration-300 blur-sm" 
                      style={{ backgroundColor: social.color }}
                    >
                    </span>
                  </a>
                </Button>
              ))}
            </div>
            <div id="contributors" className="text-center">
              <h3 className="text-lg font-semibold mb-2 text-primary animate-bounce">Contributors</h3>
              <div className="flex justify-center space-x-4">
                {contributors.map((contributor: Contributor, index: number) => (
                  <a key={contributor.name} href={contributor.link} target="_blank" rel="noopener noreferrer">
                    <div className="relative group cursor-pointer">
                      <Image
                        src={contributor.image}
                        alt={contributor.name}
                        width={80}
                        height={80}
                        loading="lazy"
                        quality={70}
                        className="rounded-full border-2 border-primary transition-all duration-300 hover:border-4"
                        style={{
                          transform: `scale(${contributorScales[index]})`,
                          animation: `float${index + 1} ${3 + index}s ease-in-out infinite`
                        }}
                      />
                      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-primary text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                        {contributor.name}
                      </div>
                      <div
                        className={`absolute -inset-2 rounded-full opacity-25 animate-pulse bg-gradient-to-r ${glowColors[profileGlow]} blur-md transition-all duration-1000`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      ></div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
      `}</style>
    </footer>
  )
}
