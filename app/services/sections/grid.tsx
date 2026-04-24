"use client"

import { useState, useCallback, memo } from "react"
import { SERVICES_DATA } from "@/constants/services"
import { ServiceCard } from "@/components/services/service-card"
import { ServicesGridProps } from "@/types/services"

function ServicesGridComponent({ onInquireClick }: ServicesGridProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleToggle = useCallback((id: string) => {
    setExpandedId((prevId) => (prevId === id ? null : id))
  }, [])

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

export const ServicesGrid = memo(ServicesGridComponent)