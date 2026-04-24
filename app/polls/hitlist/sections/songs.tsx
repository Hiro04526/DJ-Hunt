"use client"

import { motion, AnimatePresence } from "framer-motion"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { HitlistHeader } from "@/components/hitlist/header"
import { LoginModal } from "@/components/hitlist/login-modal"
import { CarouselSection } from "@/components/hitlist/carousel-section"
import { HitlistPlayer } from "@/components/hitlist/spotify-player"
import { HitlistVoteList } from "@/components/hitlist/vote-list"
import { HitlistLeaderboard } from "@/components/hitlist/leaderboard"
import { useHitlist } from "@/hooks/polls/hitlist/use-hitlist-regular"

export default function SongsSection() {
  const {
    userEmail,
    songs, activeSong, selected, selectedSongsList,
    hasVoted, setActiveIndex,
    status, submitting, showLoginModal, setShowLoginModal, isRefreshing,
    fetchStatus, handleToken, handleLogout, toggle, submit
  } = useHitlist()

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <div className="w-full min-h-screen relative transition-colors duration-500 bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 selection:bg-green-500 selection:text-white">
        
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)}
          onToken={handleToken}
        />

        <div className="max-w-360 mx-auto px-4 md:px-8 py-8 md:py-12">
          
          {/* HEADER */}
          <HitlistHeader 
              user={userEmail ? { email: userEmail } : null}
              onLogout={handleLogout} 
          />

          {/* --- STATUS BANNER --- */}
          <AnimatePresence>
            {!status.isOpen && !status.loading && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-center font-medium"
                >
                    <p>{status.message}</p>
                    {status.nextOpeningTime && (
                        <p className="text-sm opacity-80 mt-1">
                            Next voting cycle begins: {new Date(status.nextOpeningTime).toLocaleString(undefined, { 
                                weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                            })}
                        </p>
                    )}
                </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr">
            
            {/* CAROUSEL & PLAYER */}
            <div className="lg:col-span-2 min-h-100">
              <CarouselSection 
                songs={songs}
                selected={selected}
                onToggle={toggle}
                onIndexChange={setActiveIndex}
                hasVoted={hasVoted || !status.isOpen} 
              />
            </div>

            <div className="lg:col-span-1 min-h-100">
              <HitlistPlayer activeSong={activeSong} />
            </div>

            {/* LEADERBOARD & VOTE LIST */}
            <div className="lg:col-span-2 min-h-100">
              <HitlistLeaderboard 
                songs={songs} 
                onRefresh={() => fetchStatus()} 
                isRefreshing={isRefreshing}
              />
            </div>

            <div className="lg:col-span-1 min-h-100">
               <HitlistVoteList 
                 selectedSongs={selectedSongsList}
                 onToggle={toggle}
                 user={userEmail ? { email: userEmail } : null}
                 hasVoted={hasVoted || !status.isOpen}
                 submitting={submitting}
                 onSubmit={submit}
               />
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  )
}