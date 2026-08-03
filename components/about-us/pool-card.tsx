"use client"

import { memo, useState, useRef, useEffect } from "react"
import * as LucideIcons from "lucide-react"
import { OrgMember } from "@/types/about-us"

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
      if (container.scrollWidth <= container.clientWidth) return

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

  const getRoleInThisPool = (m: OrgMember) =>
    m.pools?.find(p => p.pool_name.toLowerCase() === name.toLowerCase())?.role || ""

  // Sorting Logic: PD > APD > Core/HR > Other EB / Everyone Else
  const sortedMembers = [...members].sort((a, b) => {
    const roleA = getRoleInThisPool(a).toLowerCase()
    const roleB = getRoleInThisPool(b).toLowerCase()

    const getWeight = (member: OrgMember, poolRole: string) => {
      const roleLower = poolRole.toLowerCase()

      if (roleLower === "pool director") return 0
      if (roleLower.includes("assistant")) return 1

      const isPoolCore = /\bcore\b/.test(roleLower)
      const isPoolHR = /\bhr\b/.test(roleLower) || roleLower.includes("human resources")

      if (isPoolCore || isPoolHR) return 2

      return 3
    }

    const weightA = getWeight(a, roleA)
    const weightB = getWeight(b, roleB)

    if (weightA !== weightB) return weightA - weightB
    return a.name.localeCompare(b.name)
  })

  const getContextualBadges = (member: any, poolRole: string) => {
    let badges: ("TOP 3" | "VPI MGR" | "PD" | "APD" | "CORE" | "HR REP")[] = []

    const roleLower = poolRole.toLowerCase()

    const positionString = Array.isArray(member.position)
      ? member.position.join(" ").toLowerCase()
      : (member.position || "").toLowerCase()

    const isPresident = positionString.includes("president")
    const isVPI = ["human resources", "formations", "training & development"].some(vpiRole =>
      positionString.includes(vpiRole.toLowerCase())
    )

    if (isPresident) {
      badges.push("TOP 3")
    } else if (isVPI) {
      badges.push("VPI MGR")
    } else if (roleLower === "pool director") {
      badges.push("PD")
    } else if (roleLower.includes("assistant")) {
      badges.push("APD")
    }

    const isPoolCore = /\bcore\b/.test(roleLower)
    const isPoolHR = /\bhr\b/.test(roleLower) || roleLower.includes("human resources")

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
    const appliedStyle = styles[badgeType] || "bg-[#363636]/40 text-[#a8a8a8] border-[#646464]/40"
    return (
      <span className={`font-secondary text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded border uppercase ${appliedStyle}`}>
        {badgeType}
      </span>
    )
  }

  return (
    <li className="block rounded-2xl bg-[#252525] border border-[#363636] hover:border-[#646464] transition-all duration-300 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full p-5 flex items-center justify-between cursor-pointer select-none text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#569429] focus-visible:ring-inset"
      >
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-[#191919]/60 border border-[#363636]">
            <Icon className={`${color} w-6 h-6`} />
          </div>
          <div>
            <h4 className="font-kenyan text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">{name}</h4>
            <p className="font-secondary text-sm text-[#646464] mt-0.5">{members.length} Members</p>
          </div>
        </div>

        <span
          aria-hidden="true"
          className={`w-8 h-8 rounded-full flex items-center justify-center bg-[#191919] text-[#a8a8a8] border border-[#363636] transition-all duration-500 ${
            isOpen ? "rotate-180 bg-[#363636] text-white" : ""
          }`}
        >
          <LucideIcons.ChevronDown className="w-4 h-4" />
        </span>
      </button>

      {/* Closed Description Preview */}
      {!isOpen && (
        <div className="px-5 pb-5">
          <p className="font-secondary text-sm text-[#a8a8a8] line-clamp-1 lg:line-clamp-2 italic">{description}</p>
        </div>
      )}

      {/* Content Section (Accordion) */}
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100 border-t border-[#363636]" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-6 relative group">
            {sortedMembers.length > 3 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); scroll("left"); }}
                  aria-label="Scroll members left"
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#191919]/90 border border-[#363636] text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-[#363636] focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#569429]"
                >
                  <LucideIcons.ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); scroll("right"); }}
                  aria-label="Scroll members right"
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#191919]/90 border border-[#363636] text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-[#363636] focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#569429]"
                >
                  <LucideIcons.ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

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
                <div className="w-full text-center py-4 font-secondary text-[#646464] text-sm italic">
                  No active members assigned.
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#191919]/40 p-4 border-t border-[#363636]">
            <p className="font-secondary text-sm text-[#a8a8a8] leading-relaxed font-medium">
              <span className="text-[#646464] uppercase text-xs font-bold block mb-1">About the Pool</span>
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
  badges,
  badgeRenderer,
}: {
  member: OrgMember
  badges: string[]
  badgeRenderer: (b: string) => React.ReactNode
}) {
  const content = (
    <>
      <div className="relative w-24 h-24 mb-3">
        <div className={`absolute inset-0 rounded-full border-2 border-[#569429]/10 transition-colors ${member.rt_link ? 'group-hover:border-[#569429]/40' : ''}`} />

        <div className="absolute inset-1 rounded-full overflow-hidden bg-black flex items-center justify-center border border-[#363636]">
          {member.image ? (
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <LucideIcons.User className="w-9 h-9 text-[#a8a8a8]" />
          )}
        </div>

        {member.rt_link && (
          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#569429] text-black flex items-center justify-center border-2 border-[#252525]">
            <LucideIcons.ArrowUpRight className="w-3.5 h-3.5" strokeWidth={3} />
          </div>
        )}
      </div>

      <h5 className="font-secondary text-sm font-bold text-[#e5e5e5] line-clamp-1 mb-1.5 group-hover:text-white transition-colors">
        {member.name}
      </h5>

      <div className="flex flex-wrap justify-center gap-1 min-h-4">
        {badges.slice(0, 2).map((badgeStr, index) => (
          <span key={index}>{badgeRenderer(badgeStr)}</span>
        ))}
      </div>
    </>
  )

  const sharedClassName = "flex flex-col items-center text-center w-40 p-4 rounded-xl bg-[#191919]/60 border border-[#363636]/60 transition-all group"

  if (member.rt_link) {
    return (
      <a
        href={`/radio-talent#${member.rt_link}`}
        className={`${sharedClassName} hover:bg-[#2a2a2a] hover:border-[#646464] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#569429]`}
      >
        {content}
      </a>
    )
  }

  return <div className={`${sharedClassName} cursor-default`}>{content}</div>
}

export default memo(PoolCardComponent)