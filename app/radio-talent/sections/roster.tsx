"use client"

import { useEffect, useState, useRef } from "react"
import { ChevronDown, Check, Loader2, Mic2, X } from "lucide-react"
import { getRadioTalentByYear, getAvailableYears, type RadioTalentMember } from "@/app/actions/radio-talent"
import { TalentCategory } from "@/components/radio-talent/talent-category"
import { TalentModal } from "@/components/radio-talent/talent-modal"

export function RosterSection() {
  const [years, setYears] = useState<string[]>([])
  const [activeYear, setActiveYear] = useState("")
  const [talents, setTalents] = useState<RadioTalentMember[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTalent, setSelectedTalent] = useState<RadioTalentMember | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 1. Init: Fetch Available Years
  useEffect(() => {
    async function init() {
      try {
        const fetchedYears = await getAvailableYears()
        if (fetchedYears && fetchedYears.length > 0) {
          setYears(fetchedYears)
          setActiveYear(fetchedYears[0]) // Default to latest
        } else {
          // Fallback if DB is empty to prevent UI from breaking
          console.warn("No years found, using default.")
          const defaultYear = "A.Y. 2025-2026"
          setYears([defaultYear])
          setActiveYear(defaultYear)
        }
      } catch (error) {
        console.error("Failed to init roster:", error)
        const defaultYear = "A.Y. 2025-2026"
        setYears([defaultYear])
        setActiveYear(defaultYear)
      }
    }
    init()
  }, [])

  // 2. Fetch Data when Year changes
  useEffect(() => {
    if (!activeYear) return
    
    async function fetchData() {
      setLoading(true)
      const res = await getRadioTalentByYear(activeYear)
      if (res.success && res.data) {
        setTalents(res.data)
      } else {
        setTalents([])
      }
      setLoading(false)
    }
    fetchData()
  }, [activeYear])

  // 3. Click Outside Handler for Dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getByRank = (rank: RadioTalentMember['rank']) => talents.filter((t) => t.rank === rank)
  const seniors = getByRank('Senior DJ')
  const trainees = getByRank('DJ Trainee')

  return (
    <>
      {/* --- DROPDOWN SELECTOR --- */}
      <div className="container mx-auto px-4 mb-16 relative">
        <div className="w-full md:w-80 mx-auto relative" ref={dropdownRef}>
          <label className="block text-center text-gray-500 text-xs uppercase font-bold tracking-widest mb-3">
            View Roster For
          </label>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full flex items-center justify-between px-6 py-4 bg-[#1a1a1a] border border-white/10 rounded-2xl text-white font-bold text-lg tracking-wide hover:border-[#569429]/50 hover:bg-[#222] transition-all shadow-lg shadow-black/20 ${
              isDropdownOpen ? "border-[#569429] ring-2 ring-[#569429]/20" : ""
            }`}
          >
            <span>{activeYear || "Select Year"}</span>
            <ChevronDown className={`text-[#569429] transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          <div className={`absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden overflow-y-auto custom-scrollbar origin-top transition-all duration-200 ease-out z-10 ${
              isDropdownOpen ? "opacity-100 scale-100 max-h-80 visible" : "opacity-0 scale-95 max-h-0 invisible"
            }`}
          >
            {years.map((year) => (
              <button
                key={year}
                onClick={() => {
                  setActiveYear(year)
                  setIsDropdownOpen(false)
                }}
                className={`w-full text-left px-6 py-4 text-sm font-medium transition-colors flex items-center justify-between border-b border-white/5 last:border-0 ${
                  activeYear === year ? "bg-[#569429]/10 text-[#569429]" : "text-gray-400 hover:bg-white/5 hover:text-white"
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
        ) : talents.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <Mic2 className="mx-auto mb-4 w-12 h-12 text-gray-600" />
            <h3 className="text-xl font-bold">No Records Found</h3>
            <p className="text-sm">We haven't uploaded the roster for {activeYear} yet.</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
           <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-4xl rounded-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto shadow-2xl shadow-black">
              
              <button 
                onClick={() => setSelectedTalent(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-white/20 text-white transition backdrop-blur-md"
              >
                <X size={24} />
              </button>

              {/* Modal Content passing the specific talent data */}
              <TalentModal talent={selectedTalent} />
           </div>
        </div>
      )}
    </>
  )
}