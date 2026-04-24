import { HeaderComponent } from "@/components/about-us/header"
import { Top3Grid } from "@/components/about-us/top3-grid"
import { VpiManagersGrid } from "@/components/about-us/vpi-grid"
import { PoolDirectorsGrid } from "@/components/about-us/pd-grid"
import { BoardMember } from "@/types/about-us"

interface ExecutiveBoardSectionProps {
  members: BoardMember[]
}

export function ExecutiveBoardSection({ members }: ExecutiveBoardSectionProps) {
  // 1. Categorize the members (no hooks needed!)
  const top3 = members.filter(m => m.category === 'top3')
  const vpiManagers = members.filter(m => m.category === 'vpi manager')
  const poolDirectors = members.filter(m => m.category === 'pool director')

  return (
    <section>
      {/* Header */}
      <div className="relative flex flex-col items-center justify-center mb-12">
        <HeaderComponent
          title="The Executive Board" 
          description="The student leaders dedicated to directing the station's vision." 
        />
      </div>

      {/* Grid Renders (These handle their own empty states internally) */}
      <Top3Grid members={top3} />
      
      <VpiManagersGrid members={vpiManagers} />

      <PoolDirectorsGrid members={poolDirectors} />
      
      {/* Fallback if database is completely empty */}
      {members.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No board members found.
        </div>
      )}
    </section>
  )
}