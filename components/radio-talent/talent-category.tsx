import type { RadioTalentMember } from "@/app/actions/radio-talent"
import { TalentCard } from "./talent-card"

interface TalentCategoryProps {
  title: string
  subtitle?: string
  members: RadioTalentMember[]
}

export function TalentCategory({ title, subtitle, members }: TalentCategoryProps) {
  return (
    <section className="flex flex-col items-center">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black uppercase text-[#569429] tracking-tight relative inline-block">
          {title}
        </h2>
        {subtitle && (
          <p className="text-white/60 text-sm tracking-widest uppercase mt-2 font-medium">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-x-10 gap-y-16 max-w-7xl">
        {members.map((member) => (
          <TalentCard key={member.id} member={member} />
        ))}
      </div>
    </section>
  )
}