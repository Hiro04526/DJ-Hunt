"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FaChevronRight } from "react-icons/fa"
import AudioPlayer from "@/components/audio-player"
import { DJVotingForm } from "@/components/voting-form"

type DJ = {
  id: number
  name: string
  description: string
  image: string
  details: string
  videoshoot: string
  stinger: string
}

export function DJSection() {
  const [selectedDJ, setSelectedDJ] = useState<DJ | null>(null)
  const [DJs, setDJs] = useState<DJ[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVotingOpen, setIsVotingOpen] = useState(false)

  useEffect(() => {
    async function fetchDJs() {
      try {
        const res = await fetch("/api/djs", { cache: "no-store" })
        const result = await res.json()
        console.log("GET /api/djs →", result)

        if (res.ok && Array.isArray(result.data)) {
          setDJs(result.data as DJ[])
        } else {
          setError(result.error || "Unexpected response shape")
        }
      } catch (err) {
        console.error(err)
        setError("Something went wrong while fetching DJs")
      } finally {
        setLoading(false)
      }
    }
    fetchDJs()
  }, [])

  const isFacebookVideo = (raw: string) => {
    try {
      const u = new URL(raw)
      const host = u.hostname.replace(/^www\./, "")
      return host === "facebook.com" || host === "fb.watch" || host.endsWith(".facebook.com")
    } catch {
      const s = raw.toLowerCase()
      return s.includes("facebook.com") || s.includes("fb.watch")
    }
  }

  const isMp4Video = (url: string) => {
    try {
      const clean = url.split("?")[0].toLowerCase().trim()
      return clean.endsWith(".mp4")
    } catch {
      return false
    }
  }

  const buildFacebookEmbedSrc = (videoUrl: string) => {
    const base = "https://www.facebook.com/plugins/video.php"
    const params = new URLSearchParams({
      href: videoUrl,
      show_text: "false",
      width: "1280",
      height: "720",
    })
    return `${base}?${params.toString()}`
  }

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
            className="py-8 sm:py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {DJs.map((DJ, index) => (
              <motion.div
                key={DJ.id}
                className="
                  rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2
                  bg-white text-neutral-900
                  dark:bg-[#0d0d0d] dark:text-white
                "
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.img
                  src={DJ.image}
                  alt={DJ.name}
                  className="w-full h-100 object-cover rounded-t-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                />
                <div className="p-6">
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
                    className="mt-4 flex justify-center"
                  >
                    {/* Theme-aware button */}
                    <Button
                      size="lg"
                      className="
                        group
                        bg-[#191919] text-white hover:shadow-[0_0_25px_#00FF84] hover:scale-105
                        dark:bg-white dark:text-black
                      "
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

        <Button
          size="xl"
          className="
            px-10 py-5 text-2xl font-extrabold tracking-widest
            rounded-md bg-[#191919] text-white
            hover:shadow-[0_0_25px_#00FF84] hover:scale-105
            transition-all duration-300 dark:bg-white dark:text-black
          "
          onClick={() => setIsVotingOpen(true)}
        >
          VOTE
        </Button>
      </motion.div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedDJ && (
          <Dialog open={!!selectedDJ} onOpenChange={() => setSelectedDJ(null)}>
            <DialogContent
              className="
                sm:max-w-[1080px]
                max-h-[90vh] overflow-y-auto
                bg-white text-neutral-900
                dark:bg-[#0f0f0f] dark:text-white
                border border-neutral-200 dark:border-neutral-800
                p-6
              "
            >
              <DialogHeader>
                <DialogTitle className="flex justify-start text-2xl">{selectedDJ.name}</DialogTitle>
                <div className="flex flex-col items-center">
                  <h1 className="text-xl m-0">Stinger</h1>
                  <AudioPlayer src={selectedDJ.stinger} />
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <h1 className="text-xl m-0">Solo Videoshoot</h1>
                  <div className="[&>*]:m-0 [&>p]:m-0 [&>div]:m-0 text-sm">
                    <div className="flex justify-center mx-auto rounded-lg overflow-visible">
                      {isFacebookVideo(selectedDJ.videoshoot) ? (
                        <div className="w-full h-full md:w-1/3 mx-auto rounded-lg overflow-hidden">
                          <div className="relative aspect-[16/9]">
                            <iframe
                              key={selectedDJ.videoshoot}
                              src={buildFacebookEmbedSrc(selectedDJ.videoshoot)}
                              className="absolute inset-0 w-full h-full"
                              style={{ border: "none", overflow: "hidden" }}
                              scrolling="no"
                              frameBorder={0}
                              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      ) : isMp4Video(selectedDJ.videoshoot) ? (
                        <video
                          key={selectedDJ.videoshoot}
                          src={selectedDJ.videoshoot}
                          className="w-full md:w-1/3 object-cover rounded-lg"
                          controls
                          playsInline
                          preload="metadata"
                          crossOrigin="anonymous"
                        >
                          <source src={selectedDJ.videoshoot} type="video/mp4" />
                        </video>
                      ) : (
                        <p className="text-center">Video format not supported.</p>
                      )}
                    </div>

                    <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-6 md:gap-8 w-full mt-6">
                      <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
                        <h1 className="w-full text-xl my-2 text-center">Segue</h1>
                        <div className="w-full rounded-lg overflow-hidden">
                          <div className="relative aspect-[16/9]">
                            <iframe
                              src={buildFacebookEmbedSrc("https://www.facebook.com/goinkss/videos/748888000554843")}
                              className="absolute inset-0 w-full h-full"
                              style={{ border: "none", overflow: "hidden" }}
                              scrolling="no"
                              frameBorder={0}
                              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
                        <h1 className="w-full text-xl my-2 text-center">Voiceover Challenge</h1>
                        <div className="w-full rounded-lg overflow-hidden">
                          <div className="relative aspect-[16/9]">
                            <iframe
                              src={buildFacebookEmbedSrc("https://www.facebook.com/goinkss/videos/999999999999999")}
                              className="absolute inset-0 w-full h-full"
                              style={{ border: "none", overflow: "hidden" }}
                              scrolling="no"
                              frameBorder={0}
                              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full justify-start">
                    <p>{selectedDJ.details}</p>
                  </div>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Voting Form Modal */}
      <AnimatePresence>
        <Dialog open={isVotingOpen} onOpenChange={setIsVotingOpen}>
          <DialogContent
            className="max-w-[800px] bg-white text-neutral-900 dark:bg-[#0f0f0f] dark:text-white border border-neutral-200 dark:border-neutral-800 p-6"
          >
            <DialogHeader>
              <DialogTitle className="text-2xl text-center">Vote for Your Favorite DJs</DialogTitle>
            </DialogHeader>
            <DJVotingForm djs={DJs.map(({ id, name, image }) => ({ id, name, image }))} />
          </DialogContent>
        </Dialog>
      </AnimatePresence>
    </section>
  )
}