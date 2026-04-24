import { Metadata } from "next"
import { TitleSection } from "./sections/title"
import { DJSection } from "./sections/dj"

export const metadata: Metadata = {
	title: 'DJ Hunt',
	description: 'Voting polls for voting the next Green Giant FM DJ!',
}

export default function DJHunt() {
  return (
    <div className="flex flex-col">
      <TitleSection />
      <DJSection/>
    </div>
  )
}