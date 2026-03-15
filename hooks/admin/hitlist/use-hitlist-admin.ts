import { useState, useEffect } from "react"
import { toast } from "sonner"
import { arrayMove } from "@dnd-kit/sortable"
import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { 
  addSongServerAction, searchSongsAction, getHitlistSongsAction, 
  deleteSongAction, deleteAllSongsAction, updateSongOrderAction, exportHitlistToCSV 
} from "@/actions/admin"

export function useHitlistAdmin() {
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [activeSongs, setActiveSongs] = useState<any[]>([]) 
  const [futureSongs, setFutureSongs] = useState<any[]>([])
  const [showRankings, setShowRankings] = useState(false)
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // 1. Fetch BOTH lists on load
  useEffect(() => {
    fetchAllSongs()
  }, [])

  const fetchAllSongs = async () => {
    setIsRefreshing(true)
    
    // Fetch Active Table
    const resActive = await getHitlistSongsAction('active')
    if (resActive.success && resActive.songs) {
      // Respect the current toggle state when refreshing
      const songs = resActive.songs
      if (showRankings) {
        songs.sort((a: any, b: any) => (b.votes || 0) - (a.votes || 0))
      } else {
        songs.sort((a: any, b: any) => a.sort_order - b.sort_order)
      }
      setActiveSongs(songs)
    } else {
      toast.error("Failed to load active songs")
    }

    // Fetch Future Table
    const resFuture = await getHitlistSongsAction('future')
    if (resFuture.success && resFuture.songs) {
      setFutureSongs(resFuture.songs)
    } else {
      toast.error("Failed to load future songs")
    }

    setIsRefreshing(false)
  }

  // 2. TOGGLE RANKING HANDLER
  const toggleRankings = () => {
    const nextState = !showRankings
    setShowRankings(nextState)

    const sorted = [...activeSongs]
    if (nextState === true) {
      sorted.sort((a, b) => (b.votes || 0) - (a.votes || 0))
      toast.success("Sorted by Votes")
    } else {
      sorted.sort((a, b) => a.sort_order - b.sort_order)
    }
    setActiveSongs(sorted)
  }

  // 3. Search Debounce
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([])
      setLoadingSearch(false)
      return
    }
    const delayDebounceFn = setTimeout(async () => {
      setLoadingSearch(true)
      try {
        const result = await searchSongsAction(query)
        if (result.success && result.tracks) setSearchResults(result.tracks)
        else setSearchResults([])
      } catch (err) {
        toast.error("Search failed")
      } finally {
        setLoadingSearch(false)
      }
    }, 500)
    return () => clearTimeout(delayDebounceFn)
  }, [query])

  // 4. Add to ACTIVE
  const addSongToActive = async (track: any) => {
    if (activeSongs.some(s => s.spotify_link === track.spotify_link)) return
    const tempId = Date.now()
    const newSong = { ...track, id: tempId, votes: track.votes || 0 }
    
    const updatedList = [...activeSongs, newSong]
    if (showRankings) updatedList.sort((a, b) => (b.votes || 0) - (a.votes || 0))
    
    setActiveSongs(updatedList)
    toast.loading("Adding to Active...", { id: "add-active" })
    const result = await addSongServerAction(track, 'active')
    if (result.success) {
      toast.success("Added to Active DB!", { id: "add-active" })
      fetchAllSongs() 
    } else {
      setActiveSongs(current => current.filter(s => s.id !== tempId))
      toast.error(result.error, { id: "add-active" })
    }
  }

  // 5. Add to FUTURE
  const addSongToFuture = async (track: any) => {
    if (futureSongs.some(s => s.spotify_link === track.spotify_link)) return
    const tempId = Date.now()
    const newSong = { ...track, id: tempId, votes: track.votes || 0 }
    setFutureSongs([...futureSongs, newSong])
    toast.loading("Adding to Future...", { id: "add-future" })
    const result = await addSongServerAction(track, 'future')
    if (result.success) {
      toast.success("Added to Future DB!", { id: "add-future" })
      const res = await getHitlistSongsAction('future')
      if (res.success && res.songs) setFutureSongs(res.songs)
    } else {
      setFutureSongs(current => current.filter(s => s.id !== tempId))
      toast.error(result.error, { id: "add-future" })
    }
  }

  // 6. Single Delete
  const handleDelete = async (id: number, type: 'active' | 'future') => {
    if (!confirm(`Remove this song from ${type === 'active' ? 'Active' : 'Future'} list?`)) return
    if (type === 'active') {
      const prev = [...activeSongs]
      setActiveSongs(current => current.filter(s => s.id !== id))
      const res = await deleteSongAction(id, 'active')
      if (!res.success) {
        setActiveSongs(prev)
        toast.error(res.error)
      } else toast.success("Removed from Active")
    } else {
      const prev = [...futureSongs]
      setFutureSongs(current => current.filter(s => s.id !== id))
      const res = await deleteSongAction(id, 'future')
      if (!res.success) {
        setFutureSongs(prev)
        toast.error(res.error)
      } else toast.success("Removed from Future")
    }
  }

  // 7. Clear All
  const handleClearAll = async (type: 'active' | 'future') => {
    if (!confirm(`⚠️ WARNING: This will delete ALL songs in the ${type.toUpperCase()} list. Are you sure?`)) return;
    if (type === 'active') {
      const prev = [...activeSongs]
      setActiveSongs([])
      const result = await deleteAllSongsAction('active')
      if (!result.success) {
        setActiveSongs(prev)
        toast.error(result.error)
      } else toast.success("Active list cleared")
    } else {
      const prev = [...futureSongs]
      setFutureSongs([])
      const result = await deleteAllSongsAction('future')
      if (!result.success) {
        setFutureSongs(prev)
        toast.error(result.error)
      } else toast.success("Future list cleared")
    }
  }

  // 8. Drag and Drop Setup
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const handleDragEndActive = async (event: any) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = activeSongs.findIndex((i) => i.id === active.id)
    const newIndex = activeSongs.findIndex((i) => i.id === over.id)
    const newOrder = arrayMove(activeSongs, oldIndex, newIndex)
    
    setActiveSongs(newOrder) 

    if (!showRankings) {
      const result = await updateSongOrderAction(newOrder, 'active')
      if (!result.success) toast.error("Failed to save Active order")
    } else {
      toast("Visual reorder only (Vote view active)", {
        description: "Switch off vote view to save permanent order."
      })
    }
  }

  const handleDragEndFuture = async (event: any) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = futureSongs.findIndex((i) => i.id === active.id)
    const newIndex = futureSongs.findIndex((i) => i.id === over.id)
    const newOrder = arrayMove(futureSongs, oldIndex, newIndex)
    setFutureSongs(newOrder) 
    const result = await updateSongOrderAction(newOrder, 'future') 
    if (!result.success) toast.error("Failed to save Future order")
  }

  // 9. Handle Export
  const handleExport = async () => {
    setIsExporting(true)
    try {
      const result = await exportHitlistToCSV()

      if (result.success && result.csv) {
        const blob = new Blob([result.csv], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        
        const date = new Date().toISOString().split('T')[0]
        a.href = url
        a.download = `hitlist-top20-${date}.csv`
        
        document.body.appendChild(a)
        a.click()
        
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success("Export successful")
      } else {
        toast.error("Export failed: " + result.error)
      }
    } catch (e) {
      toast.error("Export encountered an error")
    } finally {
      setIsExporting(false)
    }
  }

  // Return everything the UI needs
  return {
    query, setQuery,
    searchResults, activeSongs, futureSongs,
    showRankings, loadingSearch, isRefreshing, isExporting,
    fetchAllSongs, toggleRankings, addSongToActive, addSongToFuture,
    handleDelete, handleClearAll, handleDragEndActive, handleDragEndFuture, handleExport
  }
}