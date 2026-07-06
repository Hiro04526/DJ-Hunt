"use client"

import { useState, useEffect } from "react"
import { getFinalistsAction } from "@/actions/dj-hunt"
import { Finalist } from "@/types/dj-hunt"

export function useDJHuntRows() {
  const [finalists, setFinalists] = useState<Finalist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false;

    async function fetchFinalists() {
      setLoading(true)
      
      try {
        const res = await getFinalistsAction()

        if (res?.success && res.data) {
          setFinalists(res.data)
        } else {
          setFinalists([])
        }
      } catch (error) {
        if (ignore) return;
        console.error("Failed to fetch finalists data:", error) 
        setFinalists([])
      } finally {
        if (!ignore) {
          setLoading(false) 
        }
      }
    }

    fetchFinalists()

    return () => {
      ignore = true;
    }
  }, [])

  return {
    finalists,
    loading,
    isEmpty: finalists.length === 0
  }
}