import EBMemberCard from "@/components/about-us/eb-card"
import { BoardMember } from "@/types/about-us"

interface VpiManagersGridProps {
  members: BoardMember[]
}

export function VpiManagersGrid({ members }: VpiManagersGridProps) {
  if (members.length === 0) return null

  return (
    <div className="mb-12">
      <h3 className="text-center text-xl font-bold text-white mb-8">
        VPI Managers
      </h3>
      <div className="grid gap-6 sm:grid-cols-3">
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