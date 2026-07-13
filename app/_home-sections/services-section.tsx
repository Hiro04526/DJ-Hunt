import Link from "next/link"
import { SERVICES_DATA } from "@/constants/services"
import { ArrowRight } from "lucide-react"

export function ServicesSection() {
  return (
    <section id="services" className="bg-[#191919] px-6 py-8 sm:px-10 lg:px-16 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-secondary text-xs font-semibold uppercase tracking-[0.25em] text-[#569429]">
            Partnerships
          </span>
          <h2 className="mt-4 font-kenyan text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
            Elevate Your <span className="text-[#569429]">Brand.</span>
          </h2>
          <p className="mt-4 font-secondary text-base text-[#a8a8a8] sm:text-lg">
            From advertising campaigns to full event coverage, partner with Green Giant FM to reach an engaged Lasallian audience.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {SERVICES_DATA.map((service, index) => {
            const Icon = service.icon;
            const isLast = index === SERVICES_DATA.length - 1;
            return (
              <div
                key={service.title}
                className={`group flex flex-col gap-4 rounded-2xl border border-[#363636] bg-[#252525] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#646464] ${
                  isLast ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center bg-linear-to-br ${service.color} rounded-xl transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="h-6 w-6 text-white" strokeWidth={2.25} />
                </div>
                <h3 className="font-secondary text-base font-bold text-white">{service.title}</h3>
                <p className="font-secondary text-sm leading-relaxed text-[#a8a8a8]">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            href="/services"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#569429] px-8 py-4 font-secondary text-sm font-bold uppercase tracking-wide text-black transition-all duration-300 hover:bg-[#63a92f] hover:shadow-[0_0_35px_-5px_#569429] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#569429] focus-visible:ring-offset-2 focus-visible:ring-offset-[#191919]"
          >
            Work With Us
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}