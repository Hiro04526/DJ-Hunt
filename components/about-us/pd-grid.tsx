// components/about-us/directors-grid.tsx
import EBMemberCard from "@/components/about-us/eb-card"
import { BoardMember } from "@/types/about-us"

interface PoolDirectorsGridProps {
  members: BoardMember[]
}

export function PoolDirectorsGrid({ members }: PoolDirectorsGridProps) {
  if (members.length === 0) return null

  return (
    <div>
      <h3 className="text-center text-xl font-bold text-white mb-8">
        Pool Directors
      </h3>
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-4 md:grid-cols-7">
        {members.map((member) => (
          <EBMemberCard 
            key={member.id} 
            name={member.name} 
            position={member.position} 
            imageUrl={member.image_url} 
          />
        ))}
      </div>
    </div>
  )
}