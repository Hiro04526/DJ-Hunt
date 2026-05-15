"use client"

import { memo, useState, useRef, useEffect } from "react"
import * as LucideIcons from "lucide-react"
import { EBMember, OrgMember } from "@/types/about-us"

interface PoolCardProps {
  name: string
  description: string
  iconName: string
  color: string
  members?: OrgMember[]
}

function PoolCardComponent({ 
  name,
  description,
  iconName,
  color,
  members = [],
}: PoolCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const Icon = (LucideIcons as any)[iconName] || LucideIcons.Circle

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaX !== 0) return

      if (e.deltaY !== 0) {
        e.preventDefault()
        
        container.scrollLeft += e.deltaY 
      }
    }

    container.addEventListener("wheel", handleWheel, { passive: false })
    
    return () => {
      container.removeEventListener("wheel", handleWheel)
    }
  }, [isOpen])

  // Helper to identify a member's specific role in THIS pool.
  const getRoleInThisPool = (m: OrgMember) => 
    m.pools?.find(p => p.pool_name.toLowerCase() === name.toLowerCase())?.role || ""

  // Sorting Logic: PD > APD > Core/HR > Other EB / Everyone Else
  const sortedMembers = [...members].sort((a, b) => {
    const roleA = getRoleInThisPool(a).toLowerCase()
    const roleB = getRoleInThisPool(b).toLowerCase()

    const getWeight = (member: OrgMember, poolRole: string) => {
      const roleLower = poolRole.toLowerCase()
      
      // Tier 0: Pool Director
      if (roleLower === "pool director") return 0
      
      // Tier 1: Assistant Pool Director
      if (roleLower.includes("assistant")) return 1
      
      // Tier 2: Core and HR (Strictly based on their role in THIS pool)
      const isPoolCore = /\bcore\b/.test(roleLower)
      const isPoolHR = /\bhr\b/.test(roleLower) || roleLower.includes("human resources")
      
      if (isPoolCore || isPoolHR) return 2
      
      // Tier 3: Everyone else (EB and Regular Members mixed together)
      return 3
    }

    const weightA = getWeight(a, roleA)
    const weightB = getWeight(b, roleB)

    if (weightA !== weightB) return weightA - weightB
    return a.name.localeCompare(b.name)
  })

  const getContextualBadges = (member: any, poolRole: string) => {
    // 1. Start with a fresh, empty array for every card
    let badges: ("TOP 3" | "VPI MGR" | "PD" | "APD" | "CORE" | "HR REP")[] = []
    
    const roleLower = poolRole.toLowerCase()
    
    const positionString = Array.isArray(member.position) 
      ? member.position.join(" ").toLowerCase() 
      : (member.position || "").toLowerCase()

    // We check if they are EB based on their overall 'positions' string
    const isPresident = positionString.includes("president")
    const isVPI = ["human resources", "formations", "training & development"].some(vpiRole => 
      positionString.includes(vpiRole.toLowerCase())
    )

    // 2. Re-apply badges strictly based on context
    if (isPresident) {
      badges.push("TOP 3")
    } else if (isVPI) {
      badges.push("VPI MGR")
    } else if (roleLower === "pool director") {
      badges.push("PD")
    } else if (roleLower.includes("assistant")) {
      badges.push("APD")
    }

    // 3. Independent checks for Core/HR (allows dual-badging)
    const isPoolCore = /\bcore\b/.test(roleLower)
    const isPoolHR = /\bhr\b/.test(roleLower) || roleLower.includes("human resources")

    // Only give Core/HR if they aren't already a PD/APD/EB
    const hasHigherRole = isPresident || isVPI || roleLower === "pool director" || roleLower.includes("assistant")

    if (!hasHigherRole) {
      if (isPoolCore) badges.push("CORE")
      if (isPoolHR) badges.push("HR REP")
    }

    return badges
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollAmount = container.clientWidth * 0.75; 
      
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  }

  const renderBadge = (badgeType?: string) => {
    if (!badgeType) return null
    const styles: Record<string, string> = {
      "TOP 3": "bg-amber-500/10 text-amber-400 border-amber-500/20",
      "VPI MGR": "bg-purple-500/10 text-purple-400 border-purple-500/20",
      "PD": "bg-blue-500/10 text-blue-400 border-blue-500/20",
      "APD": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      "CORE": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      "HR REP": "bg-rose-500/10 text-rose-400 border-rose-500/20",
    }
    const appliedStyle = styles[badgeType] || "bg-zinc-800 text-zinc-400 border-zinc-700"
    return (
      <span className={`text-[8px] font-bold tracking-wider px-1.5 py-0.5 rounded border uppercase ${appliedStyle}`}>
        {badgeType}
      </span>
    )
  }

  return (
    <li className="block rounded-xl bg-[#111] border border-[#222] hover:border-zinc-700 transition-all duration-300 overflow-hidden">
      {/* Clickable Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg bg-zinc-900/50 border border-zinc-800`}>
            <Icon className={`${color} w-5 h-5`} />
          </div>
          <div>
            <h4 className="font-bold text-white tracking-tight">{name}</h4>
            <p className="text-xs text-zinc-500 mt-0.5">{members.length} Members</p>
          </div>
        </div>

        <button
          aria-label="Toggle Carousel"
          className={`w-8 h-8 rounded-full flex items-center justify-center bg-zinc-900 text-zinc-400 border border-zinc-800 transition-all duration-500 ${
            isOpen ? "rotate-180 bg-zinc-800 text-white" : ""
          }`}
        >
          <LucideIcons.ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Closed Description Preview */}
      {!isOpen && (
        <div className="px-5 pb-5">
           <p className="text-xs text-gray-400 line-clamp-1 italic">"{description}"</p>
        </div>
      )}

      {/* Content Section (Accordion) */}
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100 border-t border-zinc-900" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-6 relative group">
            
            {/* Carousel Navigation Buttons */}
            {sortedMembers.length > 3 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); scroll("left"); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/80 border border-zinc-800 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-zinc-800"
                >
                  <LucideIcons.ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); scroll("right"); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/80 border border-zinc-800 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-zinc-800"
                >
                  <LucideIcons.ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Horizontal Scroll Container */}
            <div 
              ref={scrollRef}
              className="flex flex-nowrap gap-4 overflow-x-auto pb-4 snap-x snap-proximity hide-scrollbar touch-pan-x overscroll-x-contain"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch' 
              }}
            >
              {sortedMembers.map((member) => {
                const roleInPool = getRoleInThisPool(member)
                const contextualBadges = getContextualBadges(member, roleInPool)
                
                return (
                  <div key={member.id} className="snap-start shrink-0">
                    <MemberCard 
                      member={member} 
                      badges={contextualBadges} 
                      badgeRenderer={renderBadge} 
                    />
                  </div>
                )
              })}

              {members.length === 0 && (
                <div className="w-full text-center py-4 text-zinc-600 text-sm italic">
                  No active members assigned.
                </div>
              )}
            </div>
          </div>
          
          {/* Detailed Pool Description */}
          <div className="bg-zinc-900/30 p-4 border-t border-zinc-900">
             <p className="text-xs text-zinc-400 leading-relaxed font-medium">
               <span className="text-zinc-500 uppercase text-[10px] font-bold block mb-1">About the Pool</span>
               {description}
             </p>
          </div>
        </div>
      </div>
    </li>
  )
}

function MemberCard({
  member,
  badges, // <-- Receive the new prop
  badgeRenderer,
}: {
  member: OrgMember
  badges: string[] // <-- Type it as an array of strings
  badgeRenderer: (b: string) => React.ReactNode
}) {
  return (
    <a
      href={member.rt_link ? `/radio-talent#${member.rt_link}` : undefined}
      className={`flex flex-col items-center text-center w-32 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/50 transition-all group ${
        member.rt_link ? 'hover:bg-zinc-800 hover:border-zinc-700 cursor-pointer' : 'cursor-default'
      }`}
    >
      <div className="relative w-16 h-16 mb-3">
        {/* Glow effect on hover if they have a link */}
        <div className={`absolute inset-0 rounded-full border-2 border-[#569429]/10 transition-colors ${member.rt_link ? 'group-hover:border-[#569429]/40' : ''}`} />
        
        <div className="absolute inset-1 rounded-full overflow-hidden bg-black flex items-center justify-center border border-zinc-800">
          {member.image ? (
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <LucideIcons.User className="w-6 h-6 text-zinc-700" />
          )}
        </div>

        {/* RT Member Indicator */}
        {member.rt_link && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#569429] text-black flex items-center justify-center border-2 border-[#111]">
            <LucideIcons.ArrowUpRight className="w-3 h-3" strokeWidth={3} />
          </div>
        )}
      </div>

      <h5 className="text-[11px] font-bold text-zinc-200 line-clamp-1 mb-1.5 group-hover:text-white transition-colors">
        {member.name}
      </h5>

      {/* Badges Container */}
      <div className="flex flex-wrap justify-center gap-1 min-h-4">
        {badges.slice(0, 2).map((badgeStr, index) => (
          <span key={index}>{badgeRenderer(badgeStr)}</span>
        ))}
      </div>
    </a>
  )
}

export default memo(PoolCardComponent)