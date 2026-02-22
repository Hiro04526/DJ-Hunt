"use client"

import { useState, useEffect } from "react" 
import { motion, AnimatePresence } from "framer-motion"
import { FaPaperPlane } from "react-icons/fa"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ContactFormData, ContactFormProps } from "@/types/services"
import { NAME_TITLES, ANIMATION_VARIANTS } from "@/lib/constants/services"
import { getEmailSuggestion } from "@/lib/email-validator" 
import { useContactForm } from "@/hooks/use-contact-form"

export function ContactForm({ onSuccess, prefilledSubject }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [globalError, setGlobalError] = useState("")
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const { formState, errors, setErrors, handleChange, handleSelectChange } = useContactForm()

  useEffect(() => {
    if (prefilledSubject && formState.subject !== prefilledSubject) {
      handleChange({
        target: { name: "subject", value: prefilledSubject }
      } as React.ChangeEvent<HTMLInputElement>)
    }
  }, [prefilledSubject, formState.subject, handleChange])
  
  // 1. Check for typos when the user clicks out of the email field
  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const suggestedEmail = getEmailSuggestion(e.target.value)
    setSuggestion(suggestedEmail)
  }

  // 2. Instantly fix the email if they click our suggestion
  const acceptSuggestion = () => {
    if (suggestion) {
      handleChange({
        target: { name: "email", value: suggestion }
      } as React.ChangeEvent<HTMLInputElement>)
      setSuggestion(null) 
      
      if (errors.email) {
        setErrors((prev) => ({ ...prev, email: undefined }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGlobalError("")
    
    let newErrors: Partial<ContactFormData> = {}
    let hasError = false
    
    if (!formState.title) { newErrors.title = "Required"; hasError = true }
    if (!formState.name.trim()) { newErrors.name = "Required"; hasError = true }
    if (!formState.subject.trim()) { newErrors.subject = "Required"; hasError = true }
    if (!formState.message.trim()) { newErrors.message = "Required"; hasError = true }
    if (!formState.email.trim()) { newErrors.email = "Required"; hasError = true }

    if (hasError) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    
    try {
      // Fetch directly from the client to automatically bypass Cloudflare
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
          subject: `New GGFM Inquiry: ${formState.subject}`,
          from_name: `${formState.title} ${formState.name}`,
          email: formState.email, 
          message: formState.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        onSuccess()
      } else {
        setGlobalError(result.message || "An error occurred.")
      }
    } catch (error) {
      console.error("Submission error:", error)
      setGlobalError("Failed to connect to the email server. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

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
                <SelectTrigger className={`bg-black border-[#333] h-12 text-white cursor-pointer focus:ring-[#1DB954] ${errors.title ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-[#333] text-white">
                    {NAME_TITLES.map((t) => (
                    <SelectItem 
                        key={t} 
                        value={t} 
                        className="cursor-pointer focus:bg-[#1DB954] focus:text-black hover:bg-[#1DB954] hover:text-black transition-colors"
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
                <Input id="name" name="name" value={formState.name} onChange={handleChange} className={`bg-black border-[#333] h-12 text-white focus-visible:ring-[#1DB954] ${errors.name ? "border-red-500" : ""}`} />
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
            className={`bg-black border-[#333] h-12 text-white focus-visible:ring-[#1DB954] ${errors.email ? "border-red-500" : ""}`} 
          />
          
          <AnimatePresence>
            {suggestion && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 text-sm text-yellow-500 font-medium"
              >
                Did you mean <button type="button" onClick={acceptSuggestion} className="font-bold underline text-[#1DB954] hover:text-white transition-colors cursor-pointer">{suggestion}</button>?
              </motion.div>
            )}
          </AnimatePresence>

          {errors.email && !suggestion && <p className="mt-2 text-sm text-red-400 font-medium">{errors.email}</p>}
        </motion.div>

        {/* Subject */}
        <motion.div variants={ANIMATION_VARIANTS.child}>
          <Label htmlFor="subject" className="text-gray-300 font-semibold mb-2 block text-md">Subject</Label>
          <Input id="subject" name="subject" value={formState.subject} onChange={handleChange} className={`bg-black border-[#333] h-12 text-white focus-visible:ring-[#1DB954] ${errors.subject ? "border-red-500" : ""}`} />
          {errors.subject && <p className="mt-2 text-sm text-red-400 font-medium">{errors.subject}</p>}
        </motion.div>

        {/* Message Body*/}
        <motion.div variants={ANIMATION_VARIANTS.child}>
          <Label htmlFor="message" className="text-gray-300 font-semibold mb-2 block text-md">Message Body</Label>
          <Textarea id="message" name="message" value={formState.message} onChange={handleChange} className={`bg-black border-[#333] text-white focus-visible:ring-[#1DB954] resize-none ${errors.message ? "border-red-500" : ""}`} rows={5} />
          {errors.message && <p className="mt-2 text-sm text-red-400 font-medium">{errors.message}</p>}
        </motion.div>

        {/* Submit */}
        <motion.div variants={ANIMATION_VARIANTS.child} className="pt-4">
          <Button type="submit" className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-lg h-14 rounded-xl transition-all cursor-pointer disabled:bg-[#1DB954]/70" disabled={isSubmitting}>
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