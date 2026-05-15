import { supabaseAdmin } from "@/lib/supabase/admin"
import { TitleSection } from "./sections/title"
import { MandateSection } from "./sections/mandate"
import { HistorySection } from "./sections/history"
import { OrgStructureSection } from "./sections/org-structure"
import { ExecutiveBoardSection } from "./sections/executive-board"

export const revalidate = 3600; 

export default async function AboutUsPage() {
  const { data: boardMembers } = await supabaseAdmin
    .from('About Us EB')
    .select('*')
    .order('order', { ascending: true });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#569429] selection:text-black">
      <TitleSection />

      <div className="mx-auto max-w-6xl px-6 pb-24 space-y-24">
        
        {/* These sections now use your static constants internally */}
        {/* <MandateSection /> 
        <hr className="border-[#222]" /> */}

        <HistorySection />
        <hr className="border-[#222]" />

        {boardMembers && boardMembers.length > 0 && (
          <ExecutiveBoardSection members={boardMembers} />
        )}

        <OrgStructureSection />
        <hr className="border-[#222]" />
        
      </div>
    </div>
  );
}