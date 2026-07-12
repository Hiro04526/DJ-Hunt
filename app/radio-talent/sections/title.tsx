import { Mic2 } from "lucide-react"

export function TitleSection() {
  return (
    <section className="relative overflow-hidden bg-[#191919] px-6 pb-12 pt-16 sm:px-10 sm:pt-20 lg:px-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#569429]/10 blur-[100px]"
      />

      <div className="container relative mx-auto px-4 text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#363636] bg-[#252525] px-4 py-2 font-secondary text-xs font-semibold uppercase tracking-[0.2em] text-[#D8CEAE]">
          <Mic2 className="h-3.5 w-3.5 text-[#569429]" />
          The voices of Green Giant FM
        </span>

        <h1 className="flex flex-col items-center justify-center gap-2 font-kenyan text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:flex-row sm:gap-4 md:text-6xl">
          <span className="text-white">Radio</span>
          <span className="text-[#569429]">Talent</span>
        </h1>
      </div>
    </section>
  )
}