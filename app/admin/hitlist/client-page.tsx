"use client"

import { useState, useEffect } from "react"
import { 
  addSongServerAction, 
  searchSongsAction, 
  getHitlistSongsAction, 
  deleteSongAction
} from "@/app/actions/hitlist"
import { toast } from "sonner"
import { Search, Plus, ExternalLink, Trash2, Check, Music, RefreshCw } from "lucide-react"

export default function AddSongsClientComponent() {
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [dbSongs, setDbSongs] = useState<any[]>([]) 
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // 1. Fetch DB Songs on Load
  useEffect(() => {
    fetchDbSongs()
  }, [])

  const fetchDbSongs = async () => {
    setIsRefreshing(true)
    console.log("🔄 Fetching songs for Admin UI...")
    const res = await getHitlistSongsAction()
    
    if (res.success && res.songs) {
      console.log("✅ Songs loaded:", res.songs)
      setDbSongs(res.songs)
    } else {
      console.error("❌ Failed to load songs:", res.error)
      toast.error("Failed to load songs. Check console.")
    }

    setIsRefreshing(false)
  }

  // Helper: Check if song is in DB
  const isSongInDB = (track: any) => {
    return dbSongs.some(dbSong => {
      if (dbSong.spotify_link === track.spotify_link) return true;
      return (
        dbSong.title?.toLowerCase() === track.title?.toLowerCase() && 
        dbSong.artist?.toLowerCase() === track.artist?.toLowerCase()
      )
    })
  }

  // 2. Search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query) return
    setLoadingSearch(true)
    
    const result = await searchSongsAction(query)
    if (result.success && result.tracks) {
      setSearchResults(result.tracks)
    } else {
      toast.error("No tracks found")
    }
    setLoadingSearch(false)
  }

  // 3. Add
  const addSongToDB = async (track: any) => {
    if (isSongInDB(track)) return

    // Optimistic Update
    const tempId = Date.now()
    const newSong = { ...track, id: tempId }
    setDbSongs([newSong, ...dbSongs]) 
    toast.loading("Adding song...", { id: "add-action" })

    const result = await addSongServerAction(track)

    if (result.success) {
      toast.success("Added to database!", { id: "add-action" })
      fetchDbSongs() // Refresh specifically to get the real ID
    } else {
      setDbSongs(current => current.filter(s => s.id !== tempId))
      toast.error(result.error, { id: "add-action" })
    }
  }

  // 4. Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Remove this song from the database?")) return
    
    const previousSongs = [...dbSongs]
    setDbSongs(current => current.filter(s => s.id !== id))
    
    const result = await deleteSongAction(id)
    
    if (result.success) {
      toast.success("Song removed")
    } else {
      setDbSongs(previousSongs)
      toast.error(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 mt-14">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#1DB954]">Hitlist Manager</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* LEFT COLUMN: Search */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Search className="w-5 h-5" /> Search Spotify
          </h2>
          
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter song name..."
              className="flex-1 p-3 rounded bg-[#222] border border-[#333] text-white focus:outline-none focus:border-[#1DB954]"
            />
            <button type="submit" disabled={loadingSearch} className="bg-[#1DB954] text-black font-bold p-3 rounded hover:bg-[#1ed760] disabled:opacity-50 hover:cursor-pointer">
              {loadingSearch ? "..." : "Search"}
            </button>
          </form>

          <div className="space-y-3">
            {searchResults.map((track, i) => {
              const alreadyAdded = isSongInDB(track)
              return (
                <div key={i} className="flex items-center gap-3 bg-[#111] p-3 rounded border border-[#222]">
                  <img src={track.image_url} className="w-12 h-12 rounded bg-[#333]" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate text-sm">{track.title}</p>
                    <p className="text-gray-400 truncate text-xs">{track.artist}</p>
                  </div>
                  
                  <button 
                    onClick={() => addSongToDB(track)}
                    disabled={alreadyAdded}
                    className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1 transition-all whitespace-nowrap
                      ${alreadyAdded 
                        ? "bg-[#222] text-gray-500 cursor-not-allowed border border-[#333]" 
                        : "bg-white text-black hover:bg-gray-200 cursor-pointer"
                      }`}
                  >
                    {alreadyAdded ? (
                      <> <Check size={14} /> In List </>
                    ) : (
                      <> <Plus size={14} /> Add </>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Database */}
        <div>
          {/* HEADER WITH REFRESH BUTTON */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <Music className="w-5 h-5" /> Active Database ({dbSongs.length})
            </h2>
            
            <button 
              onClick={fetchDbSongs}
              disabled={isRefreshing}
              className="p-2 rounded-full hover:bg-[#222] text-gray-400 transition-colors hover:cursor-pointer hover:text-white"
              title="Refresh Database"
            >
              <RefreshCw size={18} className={isRefreshing ? "animate-spin text-[#569429]" : ""} />
            </button>
          </div>

          <div className="bg-[#111] rounded-xl border border-[#222] overflow-hidden max-h-150 overflow-y-auto">
            {dbSongs.length === 0 ? (
              <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-3">
                <Music size={40} className="opacity-20" />
                <p>Database is empty. Add some songs!</p>
              </div>
            ) : (
              <div className="divide-y divide-[#222]">
                {dbSongs.map((song) => (
                  <div key={song.id} className="p-3 flex items-center gap-3 hover:bg-[#1a1a1a] group transition-colors">
                    <div className="w-10 h-10 relative shrink-0">
                      <img src={song.image_url || "/placeholder.png"} alt="" className="w-full h-full rounded object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate text-white">{song.title}</p>
                      <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <a 
                        href={song.spotify_link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 text-gray-500 hover:text-[#1DB954] transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                      <button 
                        onClick={() => handleDelete(song.id)}
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}