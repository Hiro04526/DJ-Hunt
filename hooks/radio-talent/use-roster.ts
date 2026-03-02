import { useState, useEffect } from "react"
import { getRadioTalentByYear, getAvailableYears } from "@/app/actions/radio-talent"
import { RadioTalentMember } from "@/types/radio-talent"
import { DEFAULT_ROSTER_YEAR, TALENT_RANKS } from "@/lib/constants/radio-talent"

export function useRoster() {
  const [years, setYears] = useState<string[]>([])
  const [activeYear, setActiveYear] = useState("")
  const [talents, setTalents] = useState<RadioTalentMember[]>([])
  const [loading, setLoading] = useState(true)

  // 1. Init: Fetch Available Years
  useEffect(() => {
    async function init() {
      try {
        const fetchedYears = await getAvailableYears()
        if (fetchedYears && fetchedYears.length > 0) {
          setYears(fetchedYears)
          setActiveYear(fetchedYears[0]) // Default to latest
        } else {
          console.warn("No years found, using default.")
          setYears([DEFAULT_ROSTER_YEAR])
          setActiveYear(DEFAULT_ROSTER_YEAR)
        }
      } catch (error) {
        console.error("Failed to init roster:", error)
        setYears([DEFAULT_ROSTER_YEAR])
        setActiveYear(DEFAULT_ROSTER_YEAR)
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

  // Group the data
  const seniors = talents.filter((t) => t.rank === TALENT_RANKS.SENIOR)
  const trainees = talents.filter((t) => t.rank === TALENT_RANKS.TRAINEE)
  const isEmpty = talents.length === 0

  return {
    years,
    activeYear,
    setActiveYear,
    seniors,
    trainees,
    loading,
    isEmpty
  }
}