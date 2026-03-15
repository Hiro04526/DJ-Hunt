"use client"

import { useHitlistAdmin } from "@/hooks/admin/hitlist/use-hitlist-admin"
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { SortableSongRow } from "@/components/admin/hitlist/sortable-song-row"
import { Search, Music, RefreshCw, Layers, Trash2, Eye, EyeOff, Download } from "lucide-react"
import { FaSpotify } from "react-icons/fa"

export default function AddSongsClientComponent() {
  const {
    query, setQuery, searchResults, activeSongs, futureSongs,
    showRankings, loadingSearch, isRefreshing, isExporting,
    fetchAllSongs, toggleRankings, addSongToActive, addSongToFuture,
    handleDelete, handleClearAll, handleDragEndActive, handleDragEndFuture, handleExport
  } = useHitlistAdmin()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8 mt-14">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-[#1DB954]">Hitlist Manager</h1>
        
        <div className="flex items-center gap-3">
            <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 hover:bg-green-700 transition-colors text-m font-bold cursor-pointer disabled:opacity-50"
            >
                {isExporting ? (
                    <RefreshCw size={16} className="animate-spin" />
                ) : (
                    <Download size={16} />
                )}
                Export CSV
            </button>
            
            <button 
            onClick={fetchAllSongs}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#222] hover:bg-[#333] transition-colors text-m font-bold cursor-pointer disabled:opacity-50"
            >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin text-[#1DB954]" : ""} />
            Refresh All
            </button>
        </div>
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