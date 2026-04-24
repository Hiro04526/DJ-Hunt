// components/about/OrgStructureSection.tsx
import { Users } from "lucide-react"
import { HeaderComponent } from "@/components/about-us/header"
import PoolCardComponent from "@/components/about-us/pool-card"
import { POOLS_DATA } from "@/constants/about-us"

export function OrgStructureSection() {
  return (
    <section>
      <div className="flex flex-col items-center text-center">
        <HeaderComponent 
          icon={<Users className="text-[#1DB954]" />} 
          title="Organizational Structure" 
          description="Behind the airwaves is a dedicated team operating across specialized pools to maintain our high broadcasting and operational standards." 
        />
      </div>

      <div className="grid gap-12 md:grid-cols-2 mt-8">
        
        {/* Internal Pools Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-[#222] pb-3">
            <div className="w-2 h-2 rounded-full bg-[#1DB954]"></div>
            <h3 className="text-xl font-bold text-white">Internal Pools</h3>
          </div>
          <ul className="space-y-4">
            {POOLS_DATA.internal.map((pool, i) => (
              <PoolCardComponent 
                key={`internal-${i}`} 
                name={pool.name} 
                description={pool.description} 
                iconName={pool.icon} 
              />
            ))}
          </ul>
        </div>

        {/* External Pools Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-[#222] pb-3">
            <div className="w-2 h-2 rounded-full bg-[#2E77D0]"></div>
            <h3 className="text-xl font-bold text-white">External Pools</h3>
          </div>
          <ul className="space-y-4">
            {POOLS_DATA.external.map((pool, i) => (
              <PoolCardComponent 
                key={`external-${i}`} 
                name={pool.name} 
                description={pool.description} 
                iconName={pool.icon} 
              />
            ))}
          </ul>
        </div>

      </div>
    </section>
  )
}