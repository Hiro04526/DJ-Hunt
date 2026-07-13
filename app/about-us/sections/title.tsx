import { Radio } from "lucide-react"

export function TitleSection() {
  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden bg-[#191919] px-6 pt-28 pb-12 text-center sm:px-10">
      {/* Glowing background gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-[#569429]/15 via-[#191919] to-[#191919]"
      />

      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#569429]/30 bg-[#569429]/10 shadow-[0_0_30px_rgba(86,148,41,0.3)]">
          <Radio className="h-10 w-10 text-[#569429]" />
        </div>

        <h1 className="font-kenyan text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl md:text-6xl">
          DLSU Radio <span className="text-[#569429]">Green Giant FM</span>
        </h1>

        <p className="max-w-3xl font-secondary text-lg text-[#a8a8a8] md:text-xl">
          The official radio station of De La Salle University. We bring the energetic campus vibe to the airwaves with the professional integrity of a Student Media Office.
        </p>
      </div>
    </section>
  )
}