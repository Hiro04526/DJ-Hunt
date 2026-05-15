import EBMemberCard from "@/components/about-us/eb-card-client"
import { EBMember } from "@/types/about-us"

interface PoolDirectorsGridProps {
  members: EBMember[]
}

export function PoolDirectorsGrid({ members }: PoolDirectorsGridProps) {
  if (members.length === 0) return null

  return (
    <div>
      <h3 className="text-center text-xl font-bold text-white mb-8">
        Pool Directors
      </h3>
      <div className="flex flex-wrap justify-center gap-6">
        {members.map((member) => (
          <EBMemberCard 
            key={member.id}
            name={member.name} 
            position={member.position} 
            image={member.image} 
            path={member.path}
            title={member.title}
            pools={member.pools}
          />
        ))}
      </div>
    </div>
  )
}