"use client"

import { useState, useEffect } from "react"
import { 
  ChevronDown, CheckCircle2, Mail, FileText, X, Play, 
  Megaphone, Share2, Mic2, Users, Camera 
} from "lucide-react"
import { ServiceCardProps } from "@/types/services"

// --- 1. ICON MAP ---
const ICON_MAP: Record<string, React.ElementType> = {
  megaphone: Megaphone,
  share: Share2,
  mic: Mic2,
  users: Users,
  camera: Camera,
}

export function ServiceCard({ service, isExpanded, onToggle, onInquireClick }: ServiceCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  // --- 2. FIX: SIDE EFFECTS IN USE-EFFECT ---
  // Safely handle body scroll locking without interrupting the render cycle
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    
    // Cleanup function ensures we don't accidentally leave the body locked
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isModalOpen])

  // Get the dynamically mapped icon, fallback to Megaphone if not found
  const IconComponent = ICON_MAP[service.icon] || Megaphone

  return (
    <>
      <div 
        className={`bg-[#111] border border-[#222] rounded-2xl overflow-hidden transition-all duration-300 relative z-10 ${
          isExpanded ? "ring-2 ring-[#569429]" : "hover:border-gray-700"
        }`}
      >
        {/* Clickable Header */}
        <button 
          onClick={onToggle}
          className="w-full flex items-center justify-between p-6 md:p-8 text-left cursor-pointer group"
        >
          <div className="flex items-center gap-6">
            <div className={`p-4 rounded-xl bg-linear-to-br ${service.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
              {/* Render the dynamically mapped icon here */}
              <IconComponent className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white group-hover:text-[#569429] transition-colors">
                {service.title}
              </h2>
              <p className="text-gray-400 mt-1 line-clamp-1 md:line-clamp-none font-secondary">
                {service.description}
              </p>
            </div>
          </div>
          <ChevronDown 
            className={`w-6 h-6 text-gray-500 transition-transform duration-300 shrink-0 ${
              isExpanded ? "rotate-180 text-[#569429]" : ""
            }`} 
          />
        </button>

        {/* Expandable Content */}
        <div 
          className={`transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-250 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-6 md:p-8 pt-0 border-t border-[#222]">
            <h3 className="text-sm font-bold text-gray-500 tracking-wider uppercase mb-4 mt-4 md:mt-0">
              Included Sub-Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {service.subServices.map((sub, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-[#1a1a1a] p-4 rounded-lg border border-[#333]">
                  <CheckCircle2 className="w-5 h-5 text-[#569429]" />
                  <span className="font-medium text-white">{sub}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (onInquireClick) {
                    onInquireClick(`Inquiry: ${service.title}`);
                  }
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-[#569429] hover:bg-[#55B233] text-black font-bold py-3 px-6 rounded-full transition-colors cursor-pointer"
              >
                <Mail className="w-5 h-5" />
                Inquire via Email
              </button>
              
              {/* EXIT BUTTON */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-[#222] hover:bg-[#333] text-white font-bold py-3 px-6 rounded-full transition-colors border border-[#444] cursor-pointer"
              >
                <FileText className="w-5 h-5" />
                Primer & Samples
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FULL SCREEN MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/80 backdrop-blur-sm">
          {/* Modal Container */}
          <div className="relative w-full max-w-7xl h-full max-h-[90vh] bg-[#0a0a0a] border border-[#333] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#222]">
              <h2 className="text-2xl font-bold text-white">{service.title} - Primer & Samples</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-[#222] rounded-full transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body (3 Columns) */}
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              
              {/* COLUMN 1: PDF Primer */}
              <div className="col-span-1 h-full flex flex-col bg-[#111] border border-[#222] rounded-xl overflow-hidden">
                <div className="p-4 border-b border-[#222] bg-[#1a1a1a]">
                  <h3 className="font-bold text-white">Service Primer</h3>
                </div>
                {service.primerUrl ? (
                  <iframe 
                    src={`${service.primerUrl}#view=FitH`} 
                    className="w-full flex-1"
                    title={`${service.title} Primer`}
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500 p-6 text-center">
                    PDF Primer loading or unavailable...
                  </div>
                )}
              </div>

              {/* COLUMNS 2 & 3: Tabs & Media Carousel */}
              <div className="col-span-1 lg:col-span-2 h-full flex flex-col">
                
                {/* Tab System */}
                <div className="flex overflow-x-auto gap-2 pb-4 mb-4 border-b border-[#222] scrollbar-hide">
                  {/* FIX: Removed inline 'any' by relying on inferred types from your strictly typed ServiceItem */}
                  {service.sampleTabs?.map((tab, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTab(index)}
                      className={`whitespace-nowrap px-6 py-2.5 rounded-full font-medium transition-all ${
                        activeTab === index 
                          ? "bg-[#569429] text-black" 
                          : "bg-[#111] text-gray-400 hover:text-white hover:bg-[#222] border border-[#333] cursor-pointer"
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                  {!service.sampleTabs && (
                    <span className="text-gray-500 italic px-2">Media tabs not configured yet.</span>
                  )}
                </div>

                {/* Media Carousel Area */}
                <div className="flex-1 overflow-y-auto pr-2">
                  {service.sampleTabs && service.sampleTabs[activeTab]?.media ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-max">
                      {/* FIX: Removed inline 'any' */}
                      {service.sampleTabs[activeTab].media.map((mediaItem, i) => (
                        <div 
                          key={i} 
                          className={`bg-[#111] border border-[#222] rounded-xl overflow-hidden group relative flex items-center justify-center ${
                            mediaItem.orientation === 'horizontal' ? "sm:col-span-2 aspect-video" : "aspect-3/4"
                          }`}
                        >
                          {mediaItem.type === 'video' ? (
                            <>
                              <video 
                                src={mediaItem.url} 
                                className="w-full h-full object-contain"
                                controls
                                preload="metadata"
                              />
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50 group-hover:opacity-0 transition-opacity">
                                <Play className="w-12 h-12 text-white" />
                              </div>
                            </>
                          ) : (
                            <img 
                              src={mediaItem.url} 
                              alt={`${service.title} sample`}
                              className="w-full h-full object-contain"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center border-2 border-dashed border-[#333] rounded-xl text-gray-500">
                      No media available for this category.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}