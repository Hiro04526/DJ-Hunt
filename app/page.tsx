import { TitleSection } from "@/app/polls/dj-hunt/sections/title"
import { DJSection } from "@/app/polls/dj-hunt/sections/dj"

export default function Home() {
  return (
    <div className="flex flex-col">
      <TitleSection />
      <DJSection/>
    </div>
  )
}