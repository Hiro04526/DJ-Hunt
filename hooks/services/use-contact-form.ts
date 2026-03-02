"use client"

import { useState, useEffect } from "react"
import { ContactFormData, ContactFormProps } from "@/types/services"
import { DEFAULT_CONTACT_SUBJECT } from "@/lib/constants/services"
import { getEmailSuggestion } from "@/lib/email-validator"
import { submitContactFormAction } from "@/app/actions/services"

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
    if (prefilledSubject && formState.subject !== prefilledSubject) {
      setFormState((prev) => ({ ...prev, subject: prefilledSubject }))
    }
  }, [prefilledSubject, formState.subject])

  // --- Input Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (value: string) => {
    setFormState(prev => ({ ...prev, title: value }))
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: "" }))
    }
  }

  // --- Email Suggestion Handlers ---
  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const suggestedEmail = getEmailSuggestion(e.target.value)
    setSuggestion(suggestedEmail)
  }

  const acceptSuggestion = () => {
    if (suggestion) {
      setFormState((prev) => ({ ...prev, email: suggestion }))
      setSuggestion(null) 
      if (errors.email) {
        setErrors((prev) => ({ ...prev, email: undefined }))
      }
    }
  }

  // --- Submission Logic ---
  const handleSubmit = async (e: React.FormEvent) => {
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
  }

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