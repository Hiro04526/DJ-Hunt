import { HeaderComponent } from "@/components/about-us/header"
import { HistoricalImageStack } from "@/components/about-us/image-stack"

export function HistorySection() {
  return (
    <section className="flex flex-col items-center gap-12 md:flex-row">
      <div className="flex-1 space-y-6">
        <HeaderComponent title="Our History" />

        <div className="space-y-4 leading-relaxed text-[#a8a8a8]">
          <div className="rounded-2xl border border-[#363636] bg-[#252525] p-5">
            <h3 className="mb-2 font-secondary text-[1.2rem] font-bold uppercase tracking-tight text-white">
              The Founding (2008)
            </h3>
            <h4 className="font-secondary text-[1.075rem]">
              Green Giant FM was established through a historic collaborative effort between
              <strong className="text-[#569429]"> Team Communications (TeamComm) </strong> and the
              <strong className="text-[#569429]"> Electronics and Communications Engineering Society (ECES)</strong> to establish the station.
            </h4>
          </div>

          <h5 className="px-2 font-secondary text-[0.925rem]">
            From our roots as an ambitious student project to our current digital evolution, we have continually adapted to bring the best audio content and programming to the Lasallian community.
          </h5>
        </div>
      </div>

      <div className="flex w-full justify-center px-4 md:w-1/3">
        <HistoricalImageStack />
      </div>
    </section>
  )
}