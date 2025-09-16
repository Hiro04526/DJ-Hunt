import { TitleSection } from "@/components/sections/title"
import { DJSection } from "@/components/sections/dj"

export default function Home() {
  return (
    <div className="flex flex-col">
      <TitleSection />
      <DJSection/>
    </div>
  )
}