"use client"

import { useState, useEffect } from "react"
import { 
  addSongServerAction, 
  searchSongsAction, 
  getHitlistSongsAction, 
  deleteSongAction,
  deleteAllSongsAction,
  updateSongOrderAction
} from "@/app/actions/hitlist"
import { 
  DndContext, 
  closestCenter, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from "@dnd-kit/core"
import { 
  arrayMove, 
  SortableContext, 
  verticalListSortingStrategy 
} from "@dnd-kit/sortable"
import { SortableSongRow } from "@/components/hitlist/sortable-song-row"
import { toast } from "sonner"
import { Search, Music, RefreshCw, Layers, Trash2, Eye, EyeOff } from "lucide-react"
import { FaSpotify } from "react-icons/fa"

export default function AddSongsClientComponent() {
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  
  const [activeSongs, setActiveSongs] = useState<any[]>([]) 
  const [futureSongs, setFutureSongs] = useState<any[]>([])
  
  // State for toggling the Ranking View
  const [showRankings, setShowRankings] = useState(false)
  
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

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
        // If we are currently viewing ranks, ensure we keep sorting by votes
        songs.sort((a: any, b: any) => (b.votes || 0) - (a.votes || 0))
      } else {
        // Otherwise sort by the saved manual order
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

    // Create a copy to sort
    const sorted = [...activeSongs]

    if (nextState === true) {
      // User turned ON rankings -> Sort by VOTES
      sorted.sort((a, b) => (b.votes || 0) - (a.votes || 0))
      toast.success("Sorted by Votes")
    } else {
      // User turned OFF rankings -> Restore MANUAL sort_order
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
    
    // Optimistic Update
    const updatedList = [...activeSongs, newSong]
    // If we are in Rank mode, re-sort immediately so the new song (0 votes) goes to bottom
    if (showRankings) updatedList.sort((a, b) => (b.votes || 0) - (a.votes || 0))
    
    setActiveSongs(updatedList)
    toast.loading("Adding to Active...", { id: "add-active" })
    const result = await addSongServerAction(track, 'active')
    if (result.success) {
      toast.success("Added to Active DB!", { id: "add-active" })
      fetchAllSongs() // Re-fetch to get real ID and correct sort_order
    } else {
      setActiveSongs(current => current.filter(s => s.id !== tempId))
      toast.error(result.error, { id: "add-active" })
    }
  }

  // 5. Add to FUTURE (Standard)
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

  // 6. Delete Handler
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

  // 8. DRAG AND DROP SETUP
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const handleDragEndActive = async (event: any) => {
    // If we are in "Rank Mode", we generally shouldn't allow reordering 
    // because the order is strictly defined by votes.
    // However, if you DO drag, we assume you want to overwrite the manual sort_order.
    
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = activeSongs.findIndex((i) => i.id === active.id)
    const newIndex = activeSongs.findIndex((i) => i.id === over.id)
    const newOrder = arrayMove(activeSongs, oldIndex, newIndex)
    
    setActiveSongs(newOrder) 

    // Only save to DB if we are NOT in Rank Mode
    // OR: If you want dragging in Rank Mode to act as a "permanent override", remove this check.
    // Usually, you only want to save Drag order when in Manual mode.
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

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8 mt-14">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#1DB954]">Hitlist Manager</h1>
        <button 
          onClick={fetchAllSongs}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#222] hover:bg-[#333] transition-colors text-m font-bold cursor-pointer"
        >
          <RefreshCw size={16} className={isRefreshing ? "animate-spin text-[#1DB954]" : ""} />
          Refresh All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === COLUMN 1: SEARCH === */}
        <div className="flex flex-col h-[calc(100vh-150px)]">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FaSpotify className="w-5 h-5" /> Search Spotify
          </h2>
          <div className="relative mb-6 shrink-0">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a song title..."
              className="w-full p-3 pl-10 rounded bg-[#222] border border-[#333] text-white focus:outline-none focus:border-[#1DB954] transition-colors"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {loadingSearch ? <RefreshCw size={18} className="animate-spin text-[#1DB954]" /> : <Search size={18} />}
            </div>
          </div>
          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
            {searchResults.map((track, i) => {
              const inActive = activeSongs.some(s => s.spotify_link === track.spotify_link)
              const inFuture = futureSongs.some(s => s.spotify_link === track.spotify_link)
              return (
                <div key={i} className="flex items-center gap-3 bg-[#111] p-3 rounded border border-[#222]">
                  <img src={track.image_url} className="w-12 h-12 rounded bg-[#333]" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate text-sm">{track.title}</p>
                    <p className="text-gray-400 truncate text-xs">{track.artist}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => addSongToActive(track)}
                      disabled={inActive}
                      className={`px-3 py-1 rounded text-[10px] font-bold flex items-center justify-center gap-1 transition-all w-20
                        ${inActive ? "bg-green-900/30 text-green-500 border border-green-900 cursor-not-allowed" : "bg-[#1DB954] text-black hover:bg-[#1ed760] cursor-pointer"}`}
                    >
                      {inActive ? "Active ✓" : "+ Active"}
                    </button>
                    <button 
                      onClick={() => addSongToFuture(track)}
                      disabled={inFuture}
                      className={`px-3 py-1 rounded text-[10px] font-bold flex items-center justify-center gap-1 transition-all w-20
                        ${inFuture ? "bg-blue-900/30 text-blue-400 border border-blue-900 cursor-not-allowed" : "bg-[#2E77D0] text-white hover:bg-blue-500 cursor-pointer"}`}
                    >
                      {inFuture ? "Future ✓" : "+ Future"}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* === COLUMN 2: ACTIVE SONGS === */}
        <div className="flex flex-col h-[calc(100vh-150px)]">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <Music className="w-5 h-5 text-[#1DB954]" /> Active ({activeSongs.length})
            </h2>
            <div className="flex items-center gap-1">
              
              {/* TOGGLE BUTTON: Controls View AND Sorting */}
              {activeSongs.length > 0 && (
                <button 
                  onClick={toggleRankings}
                  title={showRankings ? "Switch to Manual Order" : "Switch to Vote Order"}
                  className={`p-2 rounded transition-colors cursor-pointer ${showRankings ? "text-[#1DB954] bg-green-500/10" : "text-gray-400 hover:text-white hover:bg-[#333]"}`}
                >
                  {showRankings ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              )}

              {activeSongs.length > 0 && (
                <button 
                  onClick={() => handleClearAll('active')}
                  className="text-m font-bold text-red-500 hover:bg-red-500/10 px-3 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={16} /> Clear All
                </button>
              )}
            </div>
          </div>
          <div className="bg-[#111] rounded-xl border border-[#222] flex-1 overflow-hidden flex flex-col">
            <div className="overflow-y-auto flex-1 p-1 custom-scrollbar">
              {activeSongs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
                  <Music size={40} className="opacity-20" />
                  <p>No active songs.</p>
                </div>
              ) : (
                <DndContext 
                  sensors={sensors} 
                  collisionDetection={closestCenter} 
                  onDragEnd={handleDragEndActive}
                  id="active-dnd-context"
                >
                  <SortableContext items={activeSongs} strategy={verticalListSortingStrategy}>
                    <div className="divide-y divide-[#222]">
                      {activeSongs.map((song, index) => (
                        <SortableSongRow 
                          key={song.id} 
                          song={song} 
                          handleDelete={(id) => handleDelete(id, 'active')}
                          index={showRankings ? index : undefined}
                          showVotes={showRankings}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>
        </div>

        {/* === COLUMN 3: FUTURE SONGS === */}
        <div className="flex flex-col h-[calc(100vh-150px)]">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <Layers className="w-5 h-5 text-blue-400" /> Future ({futureSongs.length})
            </h2>
            {futureSongs.length > 0 && (
              <button 
                onClick={() => handleClearAll('future')}
                className="text-m font-bold text-red-500 hover:bg-red-500/10 px-3 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={16} /> Clear All
              </button>
            )}
          </div>
          <div className="bg-[#111] rounded-xl border border-[#222] flex-1 overflow-hidden flex flex-col">
            <div className="overflow-y-auto flex-1 p-1 custom-scrollbar">
              {futureSongs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
                  <Layers size={40} className="opacity-20" />
                  <p>No future songs.</p>
                </div>
              ) : (
                <DndContext 
                  sensors={sensors} 
                  collisionDetection={closestCenter} 
                  onDragEnd={handleDragEndFuture}
                  id="future-dnd-context"
                >
                  <SortableContext items={futureSongs} strategy={verticalListSortingStrategy}>
                    <div className="divide-y divide-[#222]">
                      {futureSongs.map((song) => (
                        <SortableSongRow 
                          key={song.id} 
                          song={song} 
                          handleDelete={(id) => handleDelete(id, 'future')} 
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}