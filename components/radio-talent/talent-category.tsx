"use client"

import { ArrowRight } from "lucide-react"
import { TalentCategoryProps } from "@/types/radio-talent"

export function TalentCategory({ title, members, onSelect }: TalentCategoryProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black text-white uppercase tracking-tighter border-l-4 border-[#569429] pl-4">
        {title}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {members.map((member) => (
          <div 
            key={member.id}
            onClick={() => onSelect(member)} 
            className="group cursor-pointer relative aspect-3/4 bg-neutral-900 rounded-xl overflow-hidden border border-white/10 hover:border-[#569429] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#569429]/20"
          >
            {/* Image Layer */}
            <div className="absolute inset-0">
               <img 
                 src={member.image_url} 
                 alt={member.name}
                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
               />
               {/* Base Gradient for readability */}
               <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent opacity-80" />
               
               {/* [NEW] Blur Overlay on Hover */}
               <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </div>

            {/* [NEW] Centered View Profile Button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
              <span className="flex items-center gap-2 px-5 py-2.5 bg-[#569429] rounded-full text-black font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-[#6abd35] transition-colors">
                View Profile <ArrowRight size={14} />
              </span>
            </div>

            {/* Name Overlay (Simplified) */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-bold text-lg leading-tight uppercase group-hover:text-[#569429] transition-colors duration-300">
                {member.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}