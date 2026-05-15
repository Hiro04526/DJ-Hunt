import { HeaderComponent } from "@/components/about-us/header"
import { HistoricalImageStack } from "@/components/about-us/image-stack"

export function HistorySection() {
  return (
    <section className="flex flex-col md:flex-row gap-12 items-center">
      <div className="flex-1 space-y-6">
        <HeaderComponent
          title="Our History" 
        />
        
        <div className="space-y-4 text-gray-300 leading-relaxed">
          <div className="p-5 rounded-xl border border-[#222] bg-[#111]">
            <h3 className="text-lg font-bold text-white mb-2">The Founding (2008)</h3>
            <p>
              Green Giant FM was established through a historic collaborative effort between 
              <strong className="text-[#569429]"> Team Communications (TeamComm) </strong> and the 
              <strong className="text-[#569429]"> Electronics and Communications Engineering Society (ECES)</strong> to establish the station.
            </p>
          </div>
          
          <p className="px-2">
            From our roots as an ambitious student project to our current digital evolution, we have continually adapted to bring the best audio content and programming to the Lasallian community.
          </p>
        </div>
      </div>
      
      <div className="w-full md:w-1/3 flex justify-center px-4">
        <HistoricalImageStack />
      </div>
    </section>
  )
}