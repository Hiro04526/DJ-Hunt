import { HeaderComponent } from "@/components/about-us/header"
import { MANDATE_DATA } from "@/constants/about-us"

export function MandateSection() {
  return (
    <section className="grid gap-8 md:grid-cols-3 items-center">
      <div className="col-span-1"> 
        <HeaderComponent 
          title="The Mandate" 
          description="The core foundation and purpose driving the Green Giant FM community." 
        />
      </div>
      <div className="col-span-1 md:col-span-2 grid gap-6 sm:grid-cols-2">
        {MANDATE_DATA.map((mandate, i) => (
          <div 
            key={i} 
            className={`rounded-xl border border-[#222] bg-[#111] p-6 hover:border-[#333] transition-colors ${mandate.span === 2 ? 'sm:col-span-2' : ''}`}
          >
            <h3 className="mb-3 text-lg font-bold text-[#569429]">{mandate.title}</h3>
            <p className="text-gray-300 italic">"{mandate.content}"</p>
          </div>
        ))}
      </div>
    </section>
  );
}