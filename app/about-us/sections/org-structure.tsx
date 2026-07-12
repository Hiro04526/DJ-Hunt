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
    // NOTE: this branch reads `eb.role`, while ExecutiveBoardSection (fed
    // from a different query) reads `m.position` for what looks like the
    // same concept. Left both untouched since I can't confirm from here
    // whether that's two names for one field or two genuinely different
    // ones — worth a quick check.
    const roleCheck = (eb.role || "").toLowerCase()
    let generatedBadges: string[] = []

    if (roleCheck.includes("president")) {
      generatedBadges.push("TOP 3")
    } else if (roleCheck === "pool director") {
      generatedBadges.push("PD")
    } else if (["human resources", "training & development", "formations"].includes(roleCheck)) {
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
      <div className="mb-10 flex flex-col items-center text-center">
        <HeaderComponent
          title="Organizational Structure"
          description="Behind the airwaves is a dedicated team operating across specialized pools to maintain our high broadcasting and operational standards."
        />
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Internal Pools */}
        <div className="space-y-6">
          <h3 className="border-b border-[#363636] pb-3 font-kenyan text-xl font-bold uppercase tracking-tight text-white">
            Internal Pools
          </h3>
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
          <h3 className="border-b border-[#363636] pb-3 font-kenyan text-xl font-bold uppercase tracking-tight text-white">
            External Pools
          </h3>
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