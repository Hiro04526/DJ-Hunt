import { useEffect, useCallback, useReducer } from "react"
import { toast } from "sonner"
import { arrayMove } from "@dnd-kit/sortable"
import { 
  addSongServerAction, searchSongsAction, getHitlistSongsAction, 
  deleteSongAction, deleteAllSongsAction, updateSongOrderAction, exportHitlistToCSV 
} from "@/actions/admin"
import { Song } from "@/types/hitlist"

interface HitlistState {
  query: string;
  searchResults: Song[];
  activeSongs: Song[];
  futureSongs: Song[];
  showRankings: boolean;
  loadingSearch: boolean;
  isRefreshing: boolean;
  isExporting: boolean;
}

// 1. Apply the type to the Initial State
const initialState: HitlistState = {
  query: "",
  searchResults: [],
  activeSongs: [],
  futureSongs: [],
  showRankings: false,
  loadingSearch: false,
  isRefreshing: false,
  isExporting: false,
}

// 2. The Reducer
function hitlistReducer(state: HitlistState, action: any): HitlistState {
  switch (action.type) {
    case "SET_QUERY":
      return { ...state, query: action.payload, searchResults: action.payload ? state.searchResults : [], loadingSearch: false }
    case "SEARCH_START":
      return { ...state, loadingSearch: true }
    case "SEARCH_SUCCESS":
      return { ...state, loadingSearch: false, searchResults: action.payload }
    case "SEARCH_FAIL":
      return { ...state, loadingSearch: false, searchResults: [] }
    case "FETCH_ALL_START":
      return { ...state, isRefreshing: true }
    case "FETCH_ALL_SUCCESS":
      return { ...state, isRefreshing: false, activeSongs: action.payload.active, futureSongs: action.payload.future }
    case "FETCH_ALL_FAIL":
      return { ...state, isRefreshing: false }
    case "TOGGLE_RANKINGS":
      return { ...state, showRankings: action.payload.showRankings, activeSongs: action.payload.activeSongs }
    case "SET_ACTIVE_SONGS":
      return { ...state, activeSongs: action.payload }
    case "SET_FUTURE_SONGS":
      return { ...state, futureSongs: action.payload }
    case "EXPORT_START":
      return { ...state, isExporting: true }
    case "EXPORT_FINISH":
      return { ...state, isExporting: false }
    default:
      return state
  }
}

export function useHitlistAdmin() {
  const [state, dispatch] = useReducer(hitlistReducer, initialState)

  const { query, searchResults, activeSongs, futureSongs, showRankings, loadingSearch, isRefreshing, isExporting } = state

  const setQuery = useCallback((newQuery: string) => {
    dispatch({ type: "SET_QUERY", payload: newQuery })
  }, [])

  const fetchAllSongs = useCallback(async () => {
    dispatch({ type: "FETCH_ALL_START" })
    
    const resActive = await getHitlistSongsAction('active')
    const resFuture = await getHitlistSongsAction('future')

    if (!resActive.success) toast.error("Failed to load active songs")
    if (!resFuture.success) toast.error("Failed to load future songs")

    if (resActive.success && resFuture.success) {
      const active: Song[] = resActive.songs || []
      const future: Song[] = resFuture.songs || []

      if (showRankings) {
        active.sort((a, b) => (b.votes || 0) - (a.votes || 0))
      } else {
        active.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      }

      dispatch({ type: "FETCH_ALL_SUCCESS", payload: { active, future } })
    } else {
      dispatch({ type: "FETCH_ALL_FAIL" })
    }
  }, [showRankings])

  useEffect(() => {
    fetchAllSongs()
  }, [fetchAllSongs])

  const toggleRankings = useCallback(() => {
    const nextState = !showRankings
    const sorted = [...activeSongs]
    
    if (nextState === true) {
      sorted.sort((a, b) => (b.votes || 0) - (a.votes || 0))
      toast.success("Sorted by Votes")
    } else {
      sorted.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    }
    
    dispatch({ type: "TOGGLE_RANKINGS", payload: { showRankings: nextState, activeSongs: sorted } })
  }, [showRankings, activeSongs])

  useEffect(() => {
    if (!query.trim()) return

    const delayDebounceFn = setTimeout(async () => {
      dispatch({ type: "SEARCH_START" })
      try {
        const result = await searchSongsAction(query)
        if (result.success && result.tracks) {
          dispatch({ type: "SEARCH_SUCCESS", payload: result.tracks as Song[] })
        } else {
          dispatch({ type: "SEARCH_FAIL" })
        }
      } catch (err) {
        toast.error("Search failed")
        dispatch({ type: "SEARCH_FAIL" })
      }
    }, 500)
    
    return () => clearTimeout(delayDebounceFn)
  }, [query])

  const addSongToActive = useCallback(async (track: any) => {
    if (activeSongs.some((s: Song) => s.spotify_link === track.spotify_link)) return
    const tempId = Date.now()
    const newSong: Song = { ...track, id: tempId, votes: track.votes || 0 }
    
    const updatedList = [...activeSongs, newSong]
    if (showRankings) updatedList.sort((a, b) => (b.votes || 0) - (a.votes || 0))
    
    dispatch({ type: "SET_ACTIVE_SONGS", payload: updatedList })
    toast.loading("Adding to Active...", { id: "add-active" })
    
    const result = await addSongServerAction(track, 'active')
    if (result.success) {
      toast.success("Added to Active DB!", { id: "add-active" })
      fetchAllSongs() 
    } else {
      dispatch({ type: "SET_ACTIVE_SONGS", payload: activeSongs })
      toast.error(result.error, { id: "add-active" })
    }
  }, [activeSongs, showRankings, fetchAllSongs])

  const addSongToFuture = useCallback(async (track: any) => {
    if (futureSongs.some((s: Song) => s.spotify_link === track.spotify_link)) return
    const tempId = Date.now()
    const newSong: Song = { ...track, id: tempId, votes: track.votes || 0 }
    
    dispatch({ type: "SET_FUTURE_SONGS", payload: [...futureSongs, newSong] })
    toast.loading("Adding to Future...", { id: "add-future" })
    
    const result = await addSongServerAction(track, 'future')
    if (result.success) {
      toast.success("Added to Future DB!", { id: "add-future" })
      const res = await getHitlistSongsAction('future')
      if (res.success && res.songs) {
        dispatch({ type: "SET_FUTURE_SONGS", payload: res.songs as Song[] })
      }
    } else {
      dispatch({ type: "SET_FUTURE_SONGS", payload: futureSongs })
      toast.error(result.error, { id: "add-future" })
    }
  }, [futureSongs])

  const handleDelete = useCallback(async (id: number, type: 'active' | 'future') => {
    if (!confirm(`Remove this song from ${type === 'active' ? 'Active' : 'Future'} list?`)) return
    
    if (type === 'active') {
      const prev = [...activeSongs]
      dispatch({ type: "SET_ACTIVE_SONGS", payload: activeSongs.filter((s: Song) => s.id !== id) })
      
      const res = await deleteSongAction(id, 'active')
      if (!res.success) {
        dispatch({ type: "SET_ACTIVE_SONGS", payload: prev })
        toast.error(res.error)
      } else toast.success("Removed from Active")
    } else {
      const prev = [...futureSongs]
      dispatch({ type: "SET_FUTURE_SONGS", payload: futureSongs.filter((s: Song) => s.id !== id) })
      
      const res = await deleteSongAction(id, 'future')
      if (!res.success) {
        dispatch({ type: "SET_FUTURE_SONGS", payload: prev })
        toast.error(res.error)
      } else toast.success("Removed from Future")
    }
  }, [activeSongs, futureSongs])

  const handleClearAll = useCallback(async (type: 'active' | 'future') => {
    if (!confirm(`⚠️ WARNING: This will delete ALL songs in the ${type.toUpperCase()} list. Are you sure?`)) return;
    
    if (type === 'active') {
      const prev = [...activeSongs]
      dispatch({ type: "SET_ACTIVE_SONGS", payload: [] })
      const result = await deleteAllSongsAction('active')
      if (!result.success) {
        dispatch({ type: "SET_ACTIVE_SONGS", payload: prev })
        toast.error(result.error)
      } else toast.success("Active list cleared")
    } else {
      const prev = [...futureSongs]
      dispatch({ type: "SET_FUTURE_SONGS", payload: [] })
      const result = await deleteAllSongsAction('future')
      if (!result.success) {
        dispatch({ type: "SET_FUTURE_SONGS", payload: prev })
        toast.error(result.error)
      } else toast.success("Future list cleared")
    }
  }, [activeSongs, futureSongs])

  const handleDragEndActive = useCallback(async (event: any) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = activeSongs.findIndex((i: Song) => i.id === active.id)
    const newIndex = activeSongs.findIndex((i: Song) => i.id === over.id)
    const newOrder = arrayMove(activeSongs, oldIndex, newIndex) as Song[]
    
    dispatch({ type: "SET_ACTIVE_SONGS", payload: newOrder })

    if (!showRankings) {
      const result = await updateSongOrderAction(newOrder, 'active')
      if (!result.success) toast.error("Failed to save Active order")
    } else {
      toast("Visual reorder only (Vote view active)", {
        description: "Switch off vote view to save permanent order."
      })
    }
  }, [activeSongs, showRankings])

  const handleDragEndFuture = useCallback(async (event: any) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    
    const oldIndex = futureSongs.findIndex((i: Song) => i.id === active.id)
    const newIndex = futureSongs.findIndex((i: Song) => i.id === over.id)
    const newOrder = arrayMove(futureSongs, oldIndex, newIndex) as Song[]
    
    dispatch({ type: "SET_FUTURE_SONGS", payload: newOrder })
    const result = await updateSongOrderAction(newOrder, 'future') 
    if (!result.success) toast.error("Failed to save Future order")
  }, [futureSongs])

  const handleExport = useCallback(async () => {
    dispatch({ type: "EXPORT_START" })
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
      dispatch({ type: "EXPORT_FINISH" })
    }
  }, [])

  return {
    query, setQuery,
    searchResults, activeSongs, futureSongs,
    showRankings, loadingSearch, isRefreshing, isExporting,
    fetchAllSongs, toggleRankings, addSongToActive, addSongToFuture,
    handleDelete, handleClearAll, handleDragEndActive, handleDragEndFuture, handleExport
  }
}