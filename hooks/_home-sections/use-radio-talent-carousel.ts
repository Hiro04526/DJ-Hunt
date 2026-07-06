"use client"

import { useState, useEffect } from "react"
import { getRadioTalentByYear, getAvailableYears } from "@/actions/radio-talent"
import { RadioTalentMember } from "@/types/radio-talent"
import { DEFAULT_ROSTER_YEAR } from "@/constants/radio-talent"

export function useRadioTalentCarousel() {
  const [talents, setTalents] = useState<RadioTalentMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false;

    async function fetchLatestRoster() {
      setLoading(true)
      
      try {
        // 1. Fetch available years to determine the latest year
        const fetchedYears = await getAvailableYears()
        const latestYear = (fetchedYears && fetchedYears.length > 0) 
          ? fetchedYears[0] 
          : DEFAULT_ROSTER_YEAR

        if (ignore) return; 

        // 2. Fetch the roster for that latest year
        const res = await getRadioTalentByYear(latestYear)
        
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

    fetchLatestRoster()

    return () => {
      ignore = true;
    }
  }, [])

  return {
    talents,
    loading,
    isEmpty: talents.length === 0
  }
}