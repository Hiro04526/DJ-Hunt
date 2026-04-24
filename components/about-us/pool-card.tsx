import { memo } from "react"
import * as LucideIcons from "lucide-react"

function PoolCardComponent({ name, description, iconName }: { name: string, description: string, iconName: string }) {
  const Icon = (LucideIcons as any)[iconName] || LucideIcons.Circle; 

  return (
    <li className="flex items-start gap-4 p-4 rounded-lg bg-[#111] border border-[#222] hover:border-[#1DB954]/50 transition-colors">
      <Icon className="mt-1 text-[#1DB954] shrink-0" />
      <div>
        <h4 className="font-bold text-white">{name}</h4>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      </div>
    </li>
  )
}

export default memo(PoolCardComponent)