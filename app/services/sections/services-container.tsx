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
      
      // CHANGE THIS NUMBER: Increase it to stop the scroll higher up the page
      // Try 150, 200, or even 250 until it frames the "Not sure what you need?" perfectly below your header.
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