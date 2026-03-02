"use client"

import { RadioTalentMember } from "@/types/radio-talent"
import { PlayCircle } from "lucide-react"

export function TalentModal({ talent }: { talent: RadioTalentMember }) {
  return (
    <div className="flex flex-col md:flex-row h-full max-h-[80vh]">
      {/* LEFT: Image Side */}
      <div className="w-full md:w-2/5 relative min-h-81.75 md:min-h-0">
        <img
          src={talent.image_url}
          alt={talent.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#1a1a1a] md:bg-linear-to-r md:from-transparent md:to-[#1a1a1a]" />
      </div>

      {/* RIGHT: Content Side */}
      <div className="w-full md:w-3/5 p-8 md:p-10 overflow-y-auto custom-scrollbar bg-[#1a1a1a]">
        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-[#569429]/20 text-[#569429] rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            {talent.rank}
          </span>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-1">
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
                  <img src={img} alt="Event" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}