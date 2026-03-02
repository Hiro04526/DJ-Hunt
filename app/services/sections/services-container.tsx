"use client"

import { useState } from "react"
import { ServicesGrid } from "./grid"
import { ServicesCTA } from "./call-to-action"

export function ServicesContainer() {
  const [inquirySubject, setInquirySubject] = useState("")

  const handleInquireClick = (subjectText: string) => {
    setInquirySubject(subjectText)
    
    const formElement = document.getElementById("contact-section")
    if (formElement) {
      const elementPosition = formElement.getBoundingClientRect().top + window.scrollY
      
      const offsetPosition = elementPosition - 20

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  return (
    <>
      <ServicesGrid onInquireClick={handleInquireClick} />
      <ServicesCTA prefilledSubject={inquirySubject} />
    </>
  )
}