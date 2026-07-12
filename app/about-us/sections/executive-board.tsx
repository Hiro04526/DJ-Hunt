import { HeaderComponent } from "@/components/about-us/header"
import { EBMemberGrid } from "@/components/about-us/eb-member-grid"
import { EBMember } from "@/types/about-us"

interface ExecutiveBoardSectionProps {
  members: EBMember[]
}

export function ExecutiveBoardSection({ members }: ExecutiveBoardSectionProps) {
  const top3 = members.filter((m) => {
    const roleCheck = (m.position || "").toLowerCase()
    return roleCheck === "president" || roleCheck.includes("president")
  })

  const vpiManagers = members.filter((m) => {
    const roleCheck = (m.position || "").toLowerCase()
    return ["human resources", "training & development", "formations"].includes(roleCheck)
  })

  const poolDirectors = members.filter((m) => {
    const roleCheck = (m.position || "").toLowerCase()
    return roleCheck === "pool director"
  })

  return (
    <section>
      <div className="relative mb-12 flex flex-col items-center justify-center">
        <HeaderComponent
          title="The Executive Board"
          description="The student leaders dedicated to directing the station's vision."
        />
      </div>

      <EBMemberGrid title="Top 3" members={top3} layout="wide" />
      <EBMemberGrid title="VPI Managers" members={vpiManagers} layout="wide" />
      <EBMemberGrid title="Pool Directors" members={poolDirectors} layout="wrap" />

      {members.length === 0 && (
        <div className="py-12 text-center font-secondary text-[#646464]">
          No board members found.
        </div>
      )}
    </section>
  )
}