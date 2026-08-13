"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase/client"
import { googleLogout } from "@react-oauth/google"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getUserDataAction, submitHitlistVoteAction, getVoteCountAction } from "@/actions/hitlist"
import { loginAction, logoutAction } from "@/actions/auth"
import { Song, StatusState } from "@/types/hitlist"
import { HITLIST_DB } from "@/constants/hitlist"

export function useHitlist() {
  const queryClient = useQueryClient()

  // --- LOCAL UI STATE ---
  const [selected, setSelected] = useState<number[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [showLoginModal, setShowLoginModal] = useState(false)

  // --- 1. FETCH DATA (React Query) ---
  const { 
    data, 
    isLoading, 
    isRefetching: isRefreshing,
    refetch: fetchStatus 
  } = useQuery({
    queryKey: ["hitlist-data"],
    queryFn: async () => {
      const result = await getUserDataAction()
      if (!result.success) throw new Error(result.error || "Failed to load data")
      return result
    }
  })

  // Fetch the tally dictionary for each song
  const { data: voteCounts = {} } = useQuery({
    queryKey: ["hitlist-vote-counts"],
    queryFn: async () => {
      const result = await getVoteCountAction()
      if (!result.success) throw new Error(result.error || "Failed to load counts")
      return result.counts || {}
    }
  })

  // Sync initial voted state once the data loads
  useEffect(() => {
    if (data?.votedIds && data.votedIds.length > 0 && selected.length === 0) {
      setSelected(data.votedIds)
    }
  }, [data?.votedIds, selected.length])

  // Merge the live vote counts directly into the songs array
  const songs: Song[] = useMemo(() => {
    return data?.songs?.map((s: any) => ({ 
      ...s, 
      // Overwrite static votes with the live tally (fallback to 0)
      votes: voteCounts[s.id] ?? s.votes ?? 0 
    })) || []
  }, [data?.songs, voteCounts])

  const userEmail = data?.userEmail || null
  const hasVoted = !!(data?.votedIds && data.votedIds.length > 0)
  
  const status: StatusState = useMemo(() => ({
    isOpen: data?.isOpen ?? false,
    loading: isLoading,
    message: data?.message || (isLoading ? "" : "Failed to load status"),
    nextOpeningTime: data?.nextOpeningTime || null
  }), [data?.isOpen, data?.message, data?.nextOpeningTime, isLoading])

  // --- 2. GOOGLE LOGIN ---
  const handleToken = useCallback(async ({ credential }: { credential: string }) => {
    try {
        const res = await loginAction(credential)
        if (res.success && res.email) {
            setShowLoginModal(false)
            toast.success(`Signed in as ${res.email}`)
            queryClient.invalidateQueries({ queryKey: ["hitlist-data"] }) 
        } else {
            toast.error("Login verification failed")
        }
    } catch { 
        toast.error("Failed to sign in") 
    }
  }, [queryClient])

  // --- 3. LOGOUT ---
  const handleLogout = useCallback(async () => {
      await logoutAction() 
      googleLogout() 
      setSelected([])
      toast.success("Logged out")
      queryClient.invalidateQueries({ queryKey: ["hitlist-data"] })
  }, [queryClient])

  // --- 4. SUBMIT MUTATION (Optimistic UI) ---
  const voteMutation = useMutation({
    mutationFn: async (votes: number[]) => {
      const result = await submitHitlistVoteAction(votes)
      if (!result.success) throw new Error(result.error || "Submission failed")
      return result
    },
    onMutate: async (newVotes) => {
      await queryClient.cancelQueries({ queryKey: ["hitlist-data"] })
      const previousData = queryClient.getQueryData(["hitlist-data"])
      
      queryClient.setQueryData(["hitlist-data"], (old: any) => ({
         ...old,
         votedIds: newVotes
      }))
      
      return { previousData }
    },
    onError: (err: any, _newVotes, context) => {
      queryClient.setQueryData(["hitlist-data"], context?.previousData)
      toast.error(err.message)
    },
    onSuccess: (res) => {
      toast.success(res.message || "Votes submitted!")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["hitlist-data"] })
      queryClient.invalidateQueries({ queryKey: ["hitlist-vote-counts"] })
    }
  })

  // --- EFFECT: REALTIME UPDATES ---
  useEffect(() => {
    const channel = supabase
      .channel(HITLIST_DB.CHANNEL_NAME) 
      .on(
        'postgres_changes', 
        { 
          event: 'INSERT', 
          schema: HITLIST_DB.SCHEMA, 
          table: HITLIST_DB.TABLE_NAME 
        },
        () => {
          console.log("⚡ Live vote detected!")
          queryClient.invalidateQueries({ queryKey: ["hitlist-data"] })
          queryClient.invalidateQueries({ queryKey: ["hitlist-vote-counts"] })
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [queryClient])

  // --- TOGGLE & SUBMIT HANDLERS ---
  const toggle = useCallback((id: number) => {
    if (hasVoted || !status.isOpen) return
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }, [hasVoted, status.isOpen])

  const submit = useCallback(() => {
     if (!status.isOpen) return toast.error("Voting is currently closed.") 
     if (!userEmail) { setShowLoginModal(true); return }
     if (selected.length === 0) return toast.error("Select at least one song")
     
     voteMutation.mutate(selected)
  }, [status.isOpen, userEmail, selected, voteMutation])

  const activeSong = useMemo(() => songs[activeIndex] || songs[0], [songs, activeIndex])
  const selectedSongsList = useMemo(() => songs.filter((s) => selected.includes(s.id)), [songs, selected])

  return {
    userEmail,
    songs, 
    activeSong, 
    selected, 
    selectedSongsList,
    hasVoted, 
    activeIndex, 
    setActiveIndex,
    status, 
    submitting: voteMutation.isPending,
    showLoginModal, 
    setShowLoginModal, 
    isRefreshing, 
    fetchStatus, 
    handleToken, 
    handleLogout, 
    toggle, 
    submit
  }
}