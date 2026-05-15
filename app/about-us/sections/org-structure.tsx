import { HeaderComponent } from "@/components/about-us/header"
import PoolCardComponent from "@/components/about-us/pool-card"
import { getOrgMembersAction, getExecutiveBoardAction } from "@/actions/about-us"
import { POOLS_DATA } from "@/constants/about-us"

export async function OrgStructureSection() {
  const [membersRes, ebRes] = await Promise.all([
    getOrgMembersAction(),
    getExecutiveBoardAction()
  ])

  const membersData = membersRes.success && membersRes.data ? membersRes.data : []
  const ebData = ebRes.success && ebRes.data ? ebRes.data : []

  const parsePools = (poolsData: any) => {
    if (typeof poolsData === "string") {
      try { return JSON.parse(poolsData) } catch (e) { return [] }
    }
    return poolsData || []
  }

  const formattedEBMembers = ebData.map((eb: any) => {
    const roleCheck = (eb.role || "").toLowerCase()
    let generatedBadges: string[] = []

    // 1. Assign TOP 3
    if (roleCheck.includes("president")) {
      generatedBadges.push("TOP 3")
    } 
    // 2. Assign Pool Director
    else if (roleCheck === "pool director") {
      generatedBadges.push("PD")
    } 
    // 3. Assign VPI Manager ONLY to specific roles
    else if (["human resources", "training & development", "formations"].includes(roleCheck)) {
      generatedBadges.push("VPI MGR")
    }

    return {
      ...eb,
      pools: parsePools(eb.pools),
      image: eb.image || null,
      badges: [...generatedBadges, ...(eb.badges || [])].filter(b => b !== "CORE" && b !== "HR REP")
    }
  })

  const allMembers = [...membersData, ...formattedEBMembers]

  const getPoolMembers = (targetPoolName: string) => {
    return allMembers.filter((member) => {
      const poolsArray = parsePools(member.pools)
      return poolsArray?.some(
        (p: any) => p.pool_name.toLowerCase() === targetPoolName.toLowerCase()
      )
    })
  }

  return (
    <section className="py-12">
      <div className="flex flex-col items-center text-center mb-10">
        <HeaderComponent
          title="Organizational Structure"
          description="Behind the airwaves is a dedicated team operating across specialized pools to maintain our high broadcasting and operational standards."
        />
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Internal Pools */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white border-b border-zinc-800 pb-3">Internal Pools</h3>
          <ul className="space-y-4">
            {POOLS_DATA.internal.map((pool) => {
              const poolMembers = getPoolMembers(pool.name)
              return (
                <PoolCardComponent
                  key={pool.name}
                  name={pool.name}
                  description={pool.description}
                  iconName={pool.icon}
                  color={pool.color}
                  members={poolMembers}
                />
              )
            })}
          </ul>
        </div>

        {/* External Pools */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white border-b border-zinc-800 pb-3">External Pools</h3>
          <ul className="space-y-4">
            {POOLS_DATA.external.map((pool) => {
              const poolMembers = getPoolMembers(pool.name)
              return (
                <PoolCardComponent
                  key={pool.name}
                  name={pool.name}
                  description={pool.description}
                  iconName={pool.icon}
                  color={pool.color}
                  members={poolMembers}
                />
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default OrgStructureSection