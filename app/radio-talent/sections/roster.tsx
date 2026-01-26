"use client"

import { useEffect, useState, useRef } from "react"
import { ChevronDown, Check, Loader2, Mic2 } from "lucide-react"
import { getRadioTalentByYear, type RadioTalentMember } from "@/app/actions/radio-talent"
import { TalentCategory } from "@/components/radio-talent/talent-category"

const ACADEMIC_YEARS = [
    "A.Y. 2025-2026",
    "A.Y. 2024-2025",
    "A.Y. 2023-2024",
    "A.Y. 2022-2023",
    "A.Y. 2021-2022",
    "A.Y. 2020-2021",
    "A.Y. 2019-2020",
    "A.Y. 2018-2019",
    "A.Y. 2017-2018",
    "A.Y. 2016-2017",
    "A.Y. 2015-2016",
    "A.Y. 2014-2015",
    "A.Y. 2013-2014",
    "A.Y. 2012-2013",
    "A.Y. 2011-2012",
    "A.Y. 2010-2011",
]

export function RosterSection() {
  const [activeYear, setActiveYear] = useState(ACADEMIC_YEARS[0])
  const [talents, setTalents] = useState<RadioTalentMember[]>([])
  const [loading, setLoading] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
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

  const getByRank = (rank: RadioTalentMember['rank']) => talents.filter((t) => t.rank === rank)
  const directors = getByRank('Radio Talent Director')
  const seniors = getByRank('Senior DJ')
  const trainees = getByRank('DJ Trainee')

  return (
    <>
      {/* Dropdown Selector */}
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
            <span>{activeYear}</span>
            <ChevronDown className={`text-[#569429] transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          <div className={`absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden overflow-y-auto custom-scrollbar origin-top transition-all duration-200 ease-out z-10 ${
              isDropdownOpen ? "opacity-100 scale-100 max-h-80 visible" : "opacity-0 scale-95 max-h-0 invisible"
            }`}
          >
            {ACADEMIC_YEARS.map((year) => (
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

      {/* Roster Grid */}
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
            {directors.length > 0 && <TalentCategory title="Radio Talent Director" members={directors} />}
            {seniors.length > 0 && <TalentCategory title="Senior DJs" members={seniors} />}
            {trainees.length > 0 && <TalentCategory title="DJTrainees" members={trainees} />}
          </div>
        )}
      </div>
    </>
  )
}