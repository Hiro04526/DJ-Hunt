"use client"

import { useState } from "react"
import { ContactFormData } from "@/types/services"
import { DEFAULT_CONTACT_SUBJECT } from "@/lib/constants/services"

export function useContactForm() {
  const [formState, setFormState] = useState<ContactFormData>({ 
    title: "", 
    name: "", 
    email: "", 
    subject: DEFAULT_CONTACT_SUBJECT, 
    message: "" 
  })
  
  const [errors, setErrors] = useState<Partial<ContactFormData>>({})

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

  return { formState, setFormState, errors, setErrors, handleChange, handleSelectChange }
}