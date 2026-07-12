"use client"

import { memo } from "react"
import { RadioTalentMember } from "@/types/radio-talent"
import { PlayCircle } from "lucide-react"

function TalentModalComponent({ talent }: { talent: RadioTalentMember }) {
  return (
    <div className="flex w-full flex-col md:flex-row">
      <div className="relative aspect-4/5 w-full shrink-0 md:aspect-auto md:w-2/5">
        <img
          src={talent.image_url}
          alt={talent.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="w-full bg-[#1a1a1a] p-6 md:w-3/5 md:p-10">
        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-[#569429]/20 text-[#569429] rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            {talent.rank}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-1">
            {talent.name}
          </h2>
        </div>

        {/* Bio */}
        {talent.bio && (
          <div className="mb-8 text-gray-300 leading-relaxed text-sm md:text-base border-l-2 border-white/10 pl-4">
            {talent.bio}
          </div>
        )}

        {/* Audio Samples Section */}
        {talent.stingers && talent.stingers.length > 0 && (
          <div className="mb-8">
            <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-4 flex items-center">
              <PlayCircle size={16} className="mr-2 text-[#569429]" />
              Audio Demos
            </h3>
            <div className="space-y-3">
              {talent.stingers.map((url, idx) => (
                <a 
                  key={idx} 
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 p-3 rounded-lg flex items-center justify-between group hover:bg-white/10 transition cursor-pointer"
                >
                  <span className="text-sm text-gray-300 font-medium group-hover:text-white">
                    Stinger {idx + 1}
                  </span>
                  <PlayCircle size={20} className="text-gray-500 group-hover:text-[#569429]" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Gallery / Event Photos */}
        {talent.event_hosting_images && talent.event_hosting_images.length > 0 && (
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-4">
              Hosting Highlights
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {talent.event_hosting_images.map((img, idx) => (
                <div key={idx} className="aspect-square rounded-md overflow-hidden bg-black">
                  <img 
                    src={img} 
                    alt="Event" 
                    loading="lazy"
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition" 
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export const TalentModal = memo(TalentModalComponent)