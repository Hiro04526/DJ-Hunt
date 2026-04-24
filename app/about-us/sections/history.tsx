
import { History, Radio } from "lucide-react"
import { HeaderComponent } from "@/components/about-us/header"

export function HistorySection() {
  return (
    <section className="flex flex-col md:flex-row gap-12 items-center">
      <div className="flex-1 space-y-6">
        <HeaderComponent 
          icon={<History className="text-[#1DB954]" />} 
          title="Our History" 
        />
        
        <div className="space-y-4 text-gray-300 leading-relaxed">
          <div className="p-5 rounded-xl border border-[#222] bg-[#111]">
            <h3 className="text-lg font-bold text-white mb-2">The Founding (2008)</h3>
            <p>
              Green Giant FM was established through a historic collaborative effort between 
              <strong className="text-[#1DB954]"> Team Communications (TeamComm) </strong> and the 
              <strong className="text-[#1DB954]"> Electronics and Communications Engineering Society (ECES)</strong> to establish the station.
            </p>
          </div>
          
          <p className="px-2">
            From our roots as an ambitious student project to our current digital evolution, we have continually adapted to bring the best audio content and programming to the Lasallian community.
          </p>
        </div>
      </div>
      
      {/* Visual Placeholder for a historical photo */}
      <div className="w-full md:w-1/3 aspect-square rounded-xl bg-[#111] border border-[#222] flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-linear-to-tr from-[#1DB954]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <Radio className="w-24 h-24 text-[#333] mb-4 transition-transform group-hover:scale-110" />
        <p className="text-[#333] font-bold tracking-widest text-sm uppercase">GGFM Archives</p>
      </div>
    </section>
  )
}