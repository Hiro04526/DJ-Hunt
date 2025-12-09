import { TitleSection } from "@/app/dj-hunt/sections/title"
import { DJSection } from "@/app/dj-hunt/sections/dj"

export default function Home() {
  return (
    <div className="flex flex-col">
      <TitleSection />
      <DJSection/>
    </div>
  )
}