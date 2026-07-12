import EBMemberCardClient from "@/components/about-us/eb-card-client"
import { EBMember } from "@/types/about-us"

interface EBMemberGridProps {
  title: string
  members: EBMember[]
  layout?: "wide" | "wrap"
}

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size))
  }
  return rows
}

export function EBMemberGrid({ title, members, layout = "wide" }: EBMemberGridProps) {
  if (members.length === 0) return null

  const renderCard = (member: EBMember) => (
    <EBMemberCardClient
      key={member.id}
      name={member.name}
      position={member.position}
      image={member.image}
      path={member.path}
      title={member.title}
      pools={member.pools}
    />
  )

  return (
    <div className="mb-12">
      <h3 className="mb-8 text-center font-kenyan text-xl font-bold uppercase tracking-tight text-white">
        {title}
      </h3>

      {layout === "wide" ? (
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
          {members.map(renderCard)}
        </div>
      ) : (
        <div className="mx-auto flex max-w-7xl flex-col gap-4">
          {chunk(members, 4).map((row, i) => (
            <div key={i} className="flex flex-wrap justify-center gap-4">
              {row.map(renderCard)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}