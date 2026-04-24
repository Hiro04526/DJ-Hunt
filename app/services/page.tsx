import { Metadata } from "next"
import { TitleSection } from "./sections/title"
import { ServicesContainer } from "./sections/services-container"

export const metadata: Metadata = {
  title: "Services | Green Giant FM",
  description: "Explore the media, partnership, and talent services offered by Green Giant FM.",
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#111] text-white mt-12 pb-20 font-sans">
      <TitleSection />
      <ServicesContainer />
    </div>
  )
}