import { memo } from "react"

function EBMemberCard({ name, position, imageUrl, isTop3 }: { name: string, position: string, imageUrl: string | null, isTop3?: boolean }) {
  return (
    <div className="flex flex-col items-center text-center p-4 bg-[#111] rounded-xl border border-[#222] transition-transform hover:scale-105">
      <div 
        className={`${isTop3 ? 'w-24 h-24 mb-4' : 'w-16 h-16 mb-3'} rounded-full bg-[#222] overflow-hidden`}
        style={imageUrl ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      />
      <h4 className={`font-bold text-white ${isTop3 ? 'text-base' : 'text-sm'}`}>{name}</h4>
      <p className={`${isTop3 ? 'text-sm' : 'text-xs'} text-[#1DB954]`}>{position}</p>
    </div>
  )
}

export default memo(EBMemberCard)