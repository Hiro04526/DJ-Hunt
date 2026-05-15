import EBMemberCard from "@/components/about-us/eb-card-client"
import { EBMember } from "@/types/about-us"

interface Top3GridProps {
  members: EBMember[]
}

export function Top3Grid({ members }: Top3GridProps) {
  if (members.length === 0) return null

  return (
    <div className="mb-12">
      <h3 className="text-center text-xl font-bold text-white mb-8">Top 3</h3>
      <div className="grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
        {members.map((member) => (
          <EBMemberCard 
            key={member.id}
            name={member.name} 
            role={member.role} 
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