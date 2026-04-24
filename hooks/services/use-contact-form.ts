"use client"

import { useState, useEffect, useCallback } from "react"
import { ContactFormData, ContactFormProps } from "@/types/services"
import { DEFAULT_CONTACT_SUBJECT } from "@/constants/services"
import { getEmailSuggestion } from "@/lib/email-validator"
import { submitContactFormAction } from "@/actions/services"

export function useContactForm({ onSuccess, prefilledSubject }: ContactFormProps) {
  // --- Form State ---
  const [formState, setFormState] = useState<ContactFormData>({ 
    title: "", 
    name: "", 
    email: "", 
    subject: DEFAULT_CONTACT_SUBJECT, 
    message: "" 
  })
  
  // --- UI States ---
  const [errors, setErrors] = useState<Partial<ContactFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [globalError, setGlobalError] = useState("")
  const [suggestion, setSuggestion] = useState<string | null>(null)

  // --- Effect: Handle prefilled subject ---
  useEffect(() => {
    if (prefilledSubject) {
      setFormState((prev) => 
        prev.subject !== prefilledSubject 
          ? { ...prev, subject: prefilledSubject } 
          : prev
      )
    }
  }, [prefilledSubject])

  // --- Input Handlers ---
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState(prev => ({ ...prev, [name]: value }))
    
    setErrors(prev => {
      if (prev[name as keyof ContactFormData]) {
        return { ...prev, [name]: undefined }
      }
      return prev
    })
  }, [])

  const handleSelectChange = useCallback((value: string) => {
    setFormState(prev => ({ ...prev, title: value }))
    setErrors(prev => prev.title ? { ...prev, title: undefined } : prev)
  }, [])

  // --- Email Suggestion Handlers ---
  const handleEmailBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const suggestedEmail = getEmailSuggestion(e.target.value)
    setSuggestion(suggestedEmail)
  }, [])

  const acceptSuggestion = useCallback(() => {
    setSuggestion((currentSuggestion) => {
      if (currentSuggestion) {
        setFormState((prev) => ({ ...prev, email: currentSuggestion }))
        setErrors((prev) => prev.email ? { ...prev, email: undefined } : prev)
      }
      return null
    })
  }, [])

  // --- Submission Logic ---
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setGlobalError("")
    
    let newErrors: Partial<ContactFormData> = {}
    let hasError = false
    
    // Manual Validation
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
      const result = await submitContactFormAction(formState)

      if (result.success) {
        onSuccess()
      } else {
        setGlobalError(result.error || "An error occurred.")
      }
    } catch (error) {
      setGlobalError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }, [formState, onSuccess])

  return { 
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
  }
}