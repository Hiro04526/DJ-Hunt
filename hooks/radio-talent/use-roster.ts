"use client"

import { useState, useEffect, useMemo } from "react"
import { getRadioTalentByYear, getAvailableYears } from "@/actions/radio-talent"
import { RadioTalentMember } from "@/types/radio-talent"
import { DEFAULT_ROSTER_YEAR, TALENT_RANKS } from "@/constants/radio-talent"

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
    if (!activeYear) return;
    
    let ignore = false; 

    async function fetchData() {
      setLoading(true)

      try {
        const res = await getRadioTalentByYear(activeYear)
        
        if (ignore) return; 

        if (res?.success && res.data) {
          setTalents(res.data)
        } else {
          setTalents([])
        }
      } catch (error) {
        if (ignore) return;
        console.error("Failed to fetch talent data:", error) 
        setTalents([])
      } finally {
        if (!ignore) {
          setLoading(false) 
        }
      }
    }

    fetchData()

    return () => {
      ignore = true;
    }
  }, [activeYear])

  const seniors = useMemo(() => talents.filter((t) => t.rank === TALENT_RANKS.SENIOR), [talents])
  const trainees = useMemo(() => talents.filter((t) => t.rank === TALENT_RANKS.TRAINEE), [talents])
  
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