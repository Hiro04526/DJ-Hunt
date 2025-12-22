import TitleSection from "./sections/title"
import SongsSection from "./sections/songs"

export const metadata = {
	title: 'Hitlist',
	description: "Voting polls for this week's Top 20 songs!",
}

export default function Hitlist() {
  return (
    <div className="flex flex-col">
        <div className="relative w-full flex flex-col justify-center items-center text-white bg-black">
          <TitleSection />
          <SongsSection />
        </div>
    </div>
  );
}
