import TitleSection from "./sections/title"
import SongsSection from "./sections/songs";

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
