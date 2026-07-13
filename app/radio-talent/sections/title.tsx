import { Mic2 } from "lucide-react"

export function TitleSection() {
  return (
    <section className="relative overflow-hidden bg-[#191919] px-6 pb-8 pt-24 lg:pt-32 lg:pb-16 lg:px-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#569429]/10 blur-[100px]"
      />

      <div className="container relative mx-auto text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#363636] bg-[#252525] px-4 py-2 font-secondary text-xs font-semibold uppercase tracking-[0.2em] text-[#D8CEAE]">
          <Mic2 className="h-6 w-6 lg:h-3.5 lg:w-3.5 text-[#569429]" />
          The voices of Green Giant FM
          <Mic2 className="h-6 w-6 lg:h-3.5 lg:w-3.5 text-[#569429] scale-x-[-1]" />
        </span>

        <h1 className="flex flex-col items-center justify-center gap-2 font-kenyan text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:flex-row sm:gap-4 md:text-6xl">
          <span className="text-white">Radio</span>
          <span className="text-[#569429]">Talent</span>
        </h1>
      </div>
    </section>
  )
}