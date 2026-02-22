"use client"

import { useState } from "react"
import { SERVICES_DATA } from "@/lib/constants/services"
import { ServiceCard } from "@/components/services/service-card"
import { ServicesGridProps } from "@/types/services"

export function ServicesGrid({ onInquireClick }: ServicesGridProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 gap-6">
      {SERVICES_DATA.map((service) => (
        <ServiceCard 
          key={service.id}
          service={service}
          isExpanded={expandedId === service.id}
          onToggle={() => handleToggle(service.id)}
          onInquireClick={onInquireClick}
        />
      ))}
    </div>
  )
}