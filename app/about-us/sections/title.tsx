import { Radio } from "lucide-react"

export function TitleSection() {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 py-24 text-center md:py-32">
      {/* Glowing background gradient */}
      <div className="absolute inset-0 bg-green-500/5 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-green-900/20 via-black to-black pointer-events-none"></div>
      
      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 border border-[#569429]/30 shadow-[0_0_30px_rgba(29,185,84,0.3)]">
          <Radio className="h-10 w-10 text-[#569429]" />
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white">
          DLSU Radio <span className="text-[#569429]">Green Giant FM</span>
        </h1>
        
        <p className="text-lg text-gray-400 md:text-xl max-w-2xl">
          The official radio station of De La Salle University. We bring the energetic campus vibe to the airwaves with the professional integrity of a Student Media Office.
        </p>
      </div>
    </section>
  )
}