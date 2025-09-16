"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FaChevronRight } from 'react-icons/fa'

type DJ = {
  id: number;
  name: string;
  description: string;
  image: string;
  details: string;
};

export function DJSection() {
  // Define selectedProject state to accept Project type or null
  const [selectedDJ, setSelectedDJ] = useState<DJ | null>(null);
  const [DJs, setDJs] = useState<DJ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDJs() {
      try {
        const res = await fetch("/api/djs");
        const result = await res.json();
        if (res.ok) {
          setDJs(result.data);
        } else {
          setError(result.error || "Failed to fetch DJs");
        }
      } catch (err) {
        setError("Something went wrong while fetching DJs");
      } finally {
        setLoading(false);
      }
    }
    fetchDJs();
  }, []);

  return (
    <section id="djs" className="bg-gradient-to-br from-background to-secondary/30 transition-colors duration-300 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative min-h-screen flex flex-col items-center justify-center"
      >
        {/* Animated background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 animate-gradient" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-secondary/20 to-background animate-pulse" />
        </div>

        <div className="container mx-auto px-4 mb-6 z-10">
          <div className="text-center mb-4">
            <motion.h2
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-5xl font-bold mt-4 mb-4 pb-2 bg-clip-text text-primary"
            >
              Featured Projects
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Explore a collection of innovative projects that showcase my expertise in cutting-edge web technologies and creative problem-solving.
            </motion.p>
          </div>

          {/* Project Cards */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {DJs.map((DJ, index) => (
              <motion.div
                key={DJ.id}
                className={`bg-[#569429] p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.img
                  src={DJ.image}
                  alt={DJ.name}
                  className="w-full h-48 object-cover rounded-t-lg mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                />
                <motion.h3
                  className={`text-2xl font-semibold mt-4 text-white`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                >
                  {DJ.name}
                </motion.h3>
                <motion.p
                  className={`mt-2 text-white opacity-90`}
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
                  className="mt-4"
                >
                  <Button 
                    size="lg" 
                    className={`group bg-white/20 hover:bg-white/30 text-white`}
                    onClick={() => setSelectedDJ(DJ)}
                  >
                    View Details
                    <FaChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedDJ && (
          <Dialog open={!!selectedDJ} onOpenChange={() => setSelectedDJ(null)}>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>{selectedDJ.name}</DialogTitle>
                <div className="text-sm text-muted-foreground">
                  <img 
                    src={selectedDJ.image} 
                    alt={selectedDJ.name} 
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <p className="mb-4">{selectedDJ.details}</p>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </section>
  )
}
