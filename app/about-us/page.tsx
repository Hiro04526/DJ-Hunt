import { TitleSection } from "./sections/title"
import { HistorySection } from "./sections/history"
import { OrgStructureSection } from "./sections/org-structure"
import { ExecutiveBoardSection } from "./sections/executive-board"

export const revalidate = 3600;

export default async function AboutUsPage() {
  return (
    <div className="min-h-screen bg-[#191919] text-white selection:bg-[#569429] selection:text-black">
      <TitleSection />

      <div className="mx-auto max-w-6xl px-6 pb-12 space-y-12">
        <hr className="border-[#363636]" />
        <HistorySection />
        <hr className="border-[#363636]" />

        <ExecutiveBoardSection />
        <hr className="border-[#363636]" />

        <OrgStructureSection />
      </div>
    </div>
  );
}