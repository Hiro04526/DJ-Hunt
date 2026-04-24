"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FaChevronRight } from "react-icons/fa"
import AudioPlayer from "@/components/dj-hunt/audio-player"
import { DJVotingForm } from "@/components/dj-hunt/voting-form"
import { useDJSection } from "@/hooks/polls/dj-hunt/use-dj-section"

export function DJSection() {
  const {
    DJs,
    loading,
    error,
    selectedDJ, setSelectedDJ,
    isVotingOpen, setIsVotingOpen,
    isWithinVotingWindow,
    buildDriveEmbedSrc
  } = useDJSection()

  return (
    <section id="djs" className="bg-[#569429]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 relative min-h-screen flex flex-col items-center justify-center"
      >
        <div className="container mx-auto px-4 z-10">
          {loading && <p className="text-white/90 mb-4">Loading…</p>}
          {error && <p className="text-red-100 mb-4">{error}</p>}
          {!loading && !error && DJs.length === 0 && (
            <p className="text-white/90 mb-4">No DJs found.</p>
          )}

          {/* Cards */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="py-8 sm:py-8 flex flex-wrap justify-center gap-8"
          >
            {DJs.map((DJ, index) => (
              <motion.div
                key={DJ.id}
                className="w-full sm:w-88 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white text-neutral-900 dark:bg-[#0d0d0d] dark:text-white flex flex-col"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.img
                  src={DJ.image}
                  alt={DJ.name}
                  className="h-fit object-contain rounded-t-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                />
                <div className="p-6 flex flex-col h-full">
                  <motion.h3
                    className="text-4xl font-semibold"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  >
                    {DJ.name}
                  </motion.h3>
                  <motion.p
                    className="mt-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                  >
                    {DJ.description}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                    className="mt-auto flex justify-center pt-4"
                  >
                    <Button
                      size="lg"
                      className="group bg-[#191919] text-white hover:shadow-[0_0_25px_#00FF84] hover:scale-105 dark:bg-white dark:text-black"
                      onClick={() => setSelectedDJ(DJ)}
                    >
                      View Details
                      <FaChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="mt-4 mb-8 flex flex-col items-center gap-2">
          {isWithinVotingWindow ? (
            <Button
              size="xl"
              className="px-10 py-5 text-2xl font-extrabold tracking-widest rounded-md bg-[#191919] text-white hover:shadow-[0_0_25px_#00FF84] hover:scale-105 transition-all duration-300 dark:bg-white dark:text-black"
              onClick={() => setIsVotingOpen(true)}
            >
              VOTE
            </Button>
          ) : (
            <Button
              size="xl"
              disabled
              className="px-10 py-5 text-2xl font-extrabold tracking-widest rounded-md bg-neutral-700/60 text-neutral-300 dark:bg-neutral-300/60 dark:text-neutral-700 cursor-not-allowed"
            >
              VOTING CLOSED
            </Button>
          )}
        </div>
      </motion.div>

      {/* Details Modal */}
      <Dialog open={!!selectedDJ} onOpenChange={() => setSelectedDJ(null)}>
        <DialogContent className="sm:max-w-270 max-h-[90vh] overflow-y-scroll scrollbar-hide bg-white text-neutral-900 dark:bg-[#0f0f0f] dark:text-white border border-neutral-200 dark:border-neutral-800 p-6">
          <DialogHeader>
            <DialogTitle className="flex justify-start text-2xl">{selectedDJ?.name}</DialogTitle>
            
            {selectedDJ && (
              <>
                <div className="flex flex-col items-center mb-6">
                  <h1 className="text-xl m-0 mb-2">Stinger</h1>
                  <AudioPlayer src={selectedDJ.stinger} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-2">
                  {/* Segue */}
                  <div className="flex flex-col items-center">
                    <h2 className="text-lg text-center mb-2 font-medium">Segue Challenge</h2>
                    <div className="w-full rounded-lg overflow-hidden bg-black relative aspect-9/16">
                      <iframe
                        src={buildDriveEmbedSrc(selectedDJ.segue)}
                        className="absolute top-0 left-0 w-full h-full border-0"
                        allow="autoplay; fullscreen"
                        title="Segue Challenge"
                      />
                    </div>
                  </div>

                  {/* Solo Videoshoot */}
                  <div className="flex flex-col items-center">
                    <h2 className="text-lg text-center mb-2 font-medium">Solo Videoshoot</h2>
                    <div className="w-full rounded-lg overflow-hidden bg-black relative aspect-9/16">
                      <iframe
                        src={buildDriveEmbedSrc(selectedDJ.videoshoot)}
                        className="absolute top-0 left-0 w-full h-full border-0"
                        allow="autoplay; fullscreen"
                        title="Solo Videoshoot"
                      />
                    </div>
                  </div>

                  {/* Voiceover Challenge */}
                  <div className="flex flex-col items-center">
                    <h2 className="text-lg text-center mb-2 font-medium">Voiceover Challenge</h2>
                    <div className="w-full rounded-lg overflow-hidden bg-black relative aspect-9/16">
                      <iframe
                        src={buildDriveEmbedSrc(selectedDJ.voiceover)}
                        className="absolute top-0 left-0 w-full h-full border-0"
                        allow="autoplay; fullscreen"
                        title="Voiceover Challenge"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Voting Form Modal */}
      <Dialog open={isVotingOpen} onOpenChange={setIsVotingOpen}>
        <DialogContent className="max-w-200 bg-white text-neutral-900 dark:bg-[#0f0f0f] dark:text-white border border-neutral-200 dark:border-neutral-800 p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">Vote for Your Favorite DJs (Maximum of 3)</DialogTitle>
          </DialogHeader>
          <DJVotingForm djs={DJs} />
        </DialogContent>
      </Dialog>
    </section>
  )
}