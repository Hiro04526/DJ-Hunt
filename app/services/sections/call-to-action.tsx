"use client"

import { useState, useCallback, memo } from "react"
import { AnimatePresence } from "framer-motion"
import { ContactForm } from "@/components/services/contact-form"
import { ContactSuccess } from "@/components/services/success-message"
import { ServicesCTAProps } from "@/types/services"

function ServicesCTAComponent({ prefilledSubject }: ServicesCTAProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSuccess = useCallback(() => setIsSubmitted(true), [])
  const handleReset = useCallback(() => setIsSubmitted(false), [])

  return (
    <div id="contact-section" className="max-w-3xl mx-auto mt-20 bg-linear-to-br from-[#111] to-[#0a0a0a] border border-[#222] rounded-3xl shadow-2xl overflow-hidden">
      <div className="p-8 sm:p-12">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4 text-white">Not sure what you need?</h2>
          <p className="text-gray-400">
            Reach out to our centralized contact team for general inquiries, artist features, or custom partnership proposals.
          </p>
        </div>

        {/* Form / Success Area */}
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <ContactSuccess onReset={handleReset} />
          ) : (
            <ContactForm 
              onSuccess={handleSuccess} 
              prefilledSubject={prefilledSubject}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export const ServicesCTA = memo(ServicesCTAComponent)