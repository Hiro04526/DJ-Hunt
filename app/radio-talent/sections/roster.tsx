"use client"

import { useEffect, useState, useRef, useCallback, memo } from "react"
import { ChevronDown, Check, Loader2, Mic2, X } from "lucide-react"
import { RadioTalentMember } from "@/types/radio-talent"
import { TalentCategory } from "@/components/radio-talent/talent-category"
import { TalentModal } from "@/components/radio-talent/talent-modal"
import { useRoster } from "@/hooks/radio-talent/use-roster"

function RosterSectionComponent() {
  const { years, activeYear, setActiveYear, seniors, trainees, loading, isEmpty } = useRoster()
  const [selectedTalent, setSelectedTalent] = useState<RadioTalentMember | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev)
  }, [])

  const handleYearSelect = useCallback((year: string) => {
    setActiveYear(year)
    setIsDropdownOpen(false)
  }, [setActiveYear])

  const closeModal = useCallback(() => {
    setSelectedTalent(null)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (selectedTalent) {
      const scrollY = window.scrollY
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = "0"
      document.body.style.right = "0"
      document.body.style.width = "100%"

      return () => {
        const savedScrollY = document.body.style.top
        document.body.style.position = ""
        document.body.style.top = ""
        document.body.style.left = ""
        document.body.style.right = ""
        document.body.style.width = ""
        window.scrollTo(0, parseInt(savedScrollY || "0", 10) * -1)
      }
    }
  }, [selectedTalent])

  useEffect(() => {
    // Check if the URL has a hash (e.g., #john-doe)
    if (window.location.hash) {
      const id = window.location.hash.substring(1); // remove the '#'
      const element = document.getElementById(id);
      
      if (element) {
        // Small timeout ensures the content has rendered before scrolling
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, []);

  return (
    <>
      {/* --- DROPDOWN SELECTOR --- */}
      <div className="container mx-auto px-4 my-16 relative">
        <div className="w-full md:w-80 mx-auto relative" ref={dropdownRef}>
          <label className="block text-center font-secondary text-xs uppercase font-semibold tracking-widest text-[#a8a8a8] mb-3">
            View Roster For
          </label>
          <button
            onClick={toggleDropdown}
            aria-expanded={isDropdownOpen}
            className={`w-full flex items-center justify-between px-6 py-4 bg-[#252525] border border-[#363636] rounded-2xl font-secondary text-white font-bold text-lg tracking-wide hover:border-[#569429]/50 hover:bg-[#2a2a2a] transition-all shadow-lg shadow-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#569429] focus-visible:ring-offset-2 focus-visible:ring-offset-[#191919] ${
              isDropdownOpen ? "border-[#569429] ring-2 ring-[#569429]/20" : ""
            }`}
          >
            <span>{activeYear || "Select Year"}</span>
            <ChevronDown className={`text-[#569429] transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          <div className={`absolute top-full left-0 right-0 mt-2 bg-[#252525] border border-[#363636] rounded-2xl shadow-2xl overflow-x-hidden overflow-y-auto custom-scrollbar origin-top transition-all duration-200 ease-out z-10 ${
              isDropdownOpen ? "opacity-100 scale-100 max-h-80 visible" : "opacity-0 scale-95 max-h-0 invisible"
            }`}
          >
            {years.map((year) => (
              <button
                key={year}
                onClick={() => handleYearSelect(year)}
                className={`w-full text-left px-6 py-4 font-secondary text-sm font-medium transition-colors flex items-center justify-between border-b border-[#363636] last:border-0 focus-visible:outline-none focus-visible:bg-white/5 focus-visible:text-white ${
                  activeYear === year ? "bg-[#569429]/10 text-[#569429]" : "text-[#a8a8a8] hover:bg-white/5 hover:text-white"
                }`}
              >
                {year}
                {activeYear === year && <Check size={18} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- ROSTER GRID --- */}
      <div className="container mx-auto px-4 min-h-100">
        {loading ? (
          <div className="flex h-64 items-center justify-center text-[#569429]">
            <Loader2 className="animate-spin" size={48} />
          </div>
        ) : isEmpty ? (
          <div className="text-center py-20 opacity-70">
            <Mic2 className="mx-auto mb-4 h-12 w-12 text-[#646464]" />
            <h3 className="font-kenyan text-xl font-bold uppercase tracking-tight text-white">No Records Found</h3>
            <p className="mt-2 font-secondary text-sm text-[#a8a8a8]">We haven&apos;t uploaded the roster for {activeYear} yet.</p>
          </div>
        ) : (
          <div className="space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {seniors.length > 0 && (
              <TalentCategory 
                title="Senior DJs" 
                members={seniors} 
                onSelect={setSelectedTalent} 
              />
            )}
            
            {trainees.length > 0 && (
              <TalentCategory 
                title="DJ Trainees" 
                members={trainees} 
                onSelect={setSelectedTalent}
              />
            )}
          </div>
        )}
      </div>

      {/* --- MODAL --- */}
      {selectedTalent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative flex w-full max-w-4xl max-h-[90vh] flex-col overflow-hidden rounded-2xl border border-[#363636] bg-[#191919] shadow-2xl shadow-black">
            <button
              onClick={closeModal}
              aria-label="Close"
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/50 hover:bg-white/20 text-white transition backdrop-blur-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X size={24} />
            </button>

            <div className="min-h-0 overflow-y-auto overflow-x-hidden">
              <TalentModal talent={selectedTalent} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export const RosterSection = memo(RosterSectionComponent)