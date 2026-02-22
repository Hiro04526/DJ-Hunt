import { TitleSection } from "./sections/title"
import { ServicesContainer } from "./sections/services-container"

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#111] text-white mt-12 pb-20 font-sans">
      <TitleSection />
      <ServicesContainer />
    </div>
  )
}