"use client"

import { motion, AnimatePresence } from "framer-motion"
import { FaPaperPlane } from "react-icons/fa"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ContactFormProps } from "@/types/services"
import { NAME_TITLES, ANIMATION_VARIANTS } from "@/lib/constants/services"
import { useContactForm } from "@/hooks/use-contact-form"

export function ContactForm({ onSuccess, prefilledSubject }: ContactFormProps) {
  const { 
    formState, 
    errors, 
    isSubmitting, 
    globalError, 
    suggestion, 
    handleChange, 
    handleSelectChange, 
    handleEmailBlur, 
    acceptSuggestion, 
    handleSubmit 
  } = useContactForm({ onSuccess, prefilledSubject })

  return (
    <motion.form 
      key="form-state"
      onSubmit={handleSubmit}
      variants={ANIMATION_VARIANTS.form}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="space-y-6">
        {globalError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center font-bold">
            {globalError}
          </div>
        )}

        {/* Title & Name */}
        <motion.div variants={ANIMATION_VARIANTS.child} className="flex gap-4">
            <div className="w-27.5 shrink-0">
                <Label htmlFor="title" className="text-gray-300 font-semibold mb-2 block text-md">Title</Label>
                <Select onValueChange={handleSelectChange} value={formState.title}>
                <SelectTrigger className={`bg-black border-[#333] h-12 text-white cursor-pointer focus:ring-[#569429] ${errors.title ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-[#333] text-white">
                    {NAME_TITLES.map((t) => (
                    <SelectItem 
                        key={t} 
                        value={t} 
                        className="cursor-pointer focus:bg-[#569429] focus:text-black hover:bg-[#569429] hover:text-black transition-colors"
                    >
                        {t}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
                {errors.title && <p className="mt-2 text-sm text-red-400 font-medium">{errors.title}</p>}
            </div>

            <div className="flex-1">
                <Label htmlFor="name" className="text-gray-300 font-semibold mb-2 block text-md">Name</Label>
                <Input id="name" name="name" value={formState.name} onChange={handleChange} className={`bg-black border-[#333] h-12 text-white focus-visible:ring-[#569429] ${errors.name ? "border-red-500" : ""}`} />
                {errors.name && <p className="mt-2 text-sm text-red-400 font-medium">{errors.name}</p>}
            </div>
        </motion.div>

        {/* Email Address */}
        <motion.div variants={ANIMATION_VARIANTS.child}>
          <Label htmlFor="email" className="text-gray-300 font-semibold mb-2 block text-md">Email Address</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            value={formState.email} 
            onChange={handleChange} 
            onBlur={handleEmailBlur} 
            className={`bg-black border-[#333] h-12 text-white focus-visible:ring-[#569429] ${errors.email ? "border-red-500" : ""}`} 
          />
          
          <AnimatePresence>
            {suggestion && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 text-sm text-yellow-500 font-medium"
              >
                Did you mean <button type="button" onClick={acceptSuggestion} className="font-bold underline text-[#569429] hover:text-white transition-colors cursor-pointer">{suggestion}</button>?
              </motion.div>
            )}
          </AnimatePresence>

          {errors.email && !suggestion && <p className="mt-2 text-sm text-red-400 font-medium">{errors.email}</p>}
        </motion.div>

        {/* Subject */}
        <motion.div variants={ANIMATION_VARIANTS.child}>
          <Label htmlFor="subject" className="text-gray-300 font-semibold mb-2 block text-md">Subject</Label>
          <Input id="subject" name="subject" value={formState.subject} onChange={handleChange} className={`bg-black border-[#333] h-12 text-white focus-visible:ring-[#569429] ${errors.subject ? "border-red-500" : ""}`} />
          {errors.subject && <p className="mt-2 text-sm text-red-400 font-medium">{errors.subject}</p>}
        </motion.div>

        {/* Message Body*/}
        <motion.div variants={ANIMATION_VARIANTS.child}>
          <Label htmlFor="message" className="text-gray-300 font-semibold mb-2 block text-md">Message Body</Label>
          <Textarea id="message" name="message" value={formState.message} onChange={handleChange} className={`bg-black border-[#333] text-white focus-visible:ring-[#569429] resize-none ${errors.message ? "border-red-500" : ""}`} rows={5} />
          {errors.message && <p className="mt-2 text-sm text-red-400 font-medium">{errors.message}</p>}
        </motion.div>

        {/* Submit */}
        <motion.div variants={ANIMATION_VARIANTS.child} className="pt-4">
          <Button type="submit" className="w-full bg-[#569429] hover:bg-[#55B233] text-black font-bold text-lg h-14 rounded-xl transition-all cursor-pointer disabled:bg-[#569429]/70" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center gap-3">
                <motion.div className="h-5 w-5 rounded-full border-t-2 border-r-2 border-black" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                <span>Sending...</span>
              </div>
            ) : (
              <>Send Message <FaPaperPlane className="ml-3 h-4 w-4" /></>
            )}
          </Button>
        </motion.div>
      </div>
    </motion.form>
  )
}