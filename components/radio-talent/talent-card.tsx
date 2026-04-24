import Image from "next/image"
import { memo } from "react"
import { RadioTalentMember } from "@/types/radio-talent"

function TalentCardComponent({ member }: { member: RadioTalentMember }) {
  return (
    <div className="group relative flex flex-col items-center w-48 md:w-56">
      {/* Image Container */}
      <div className="relative w-44 h-44 md:w-52 md:h-52 mb-6 rounded-3xl overflow-hidden bg-white/5 border border-white/10 transition-all duration-500 group-hover:border-[#569429] group-hover:shadow-[0_0_30px_rgba(86,148,41,0.2)] group-hover:-translate-y-2">
        <Image
          src={member.image_url || "/images/default-avatar.png"}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 176px, 208px"
        />
        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-[#569429]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Name Label */}
      <div className="text-center relative z-10 w-full px-2">
        <h3 className="text-xl font-bold text-white group-hover:text-[#569429] transition-colors duration-300 truncate">
          {member.name}
        </h3>
      </div>
    </div>
  )
}

export const TalentCard = memo(TalentCardComponent)