import { Metadata } from "next"
import { TitleSection } from "./sections/title"
import { RosterSection } from "./sections/roster"

export const metadata: Metadata = {
  title: 'Radio Talent',
  description: 'The faces and voices of Green Giant FM.',
}

export default function RadioTalentPage() {
  return (
    <main className="min-h-screen bg-[#111] text-white mt-12 pb-16 font-sans">
      <TitleSection />
      <RosterSection />
    </main>
  )
}