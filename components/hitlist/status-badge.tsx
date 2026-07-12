import { memo } from "react"

interface StatusBadgeProps {
  isOnline?: boolean
}

function StatusBadgeComponent({ isOnline = true }: StatusBadgeProps) {
  return (
    <div
      className={[
        "inline-flex items-center justify-center",
        "px-4 md:px-6",
        "h-11.25 md:h-15",
        "rounded-full text-xl md:text-3xl font-medium",
        "transition-all duration-300",
        "backdrop-blur-md border bg-white dark:bg-black",
        isOnline
          ? "text-green-400 border-green-500/60 shadow-[0_0_28px_rgba(0,200,0,0.55),0_0_40px_rgba(0,200,0,0.35)]"
          : "text-red-500 border-red-500/60 shadow-[0_0_28px_rgba(200,0,0,0.55),0_0_40px_rgba(200,0,0,0.35)]"
      ].join(" ")}
    >
      {isOnline ? "CURRENTLY ONLINE" : "CURRENTLY OFFLINE"}
    </div>
  )
}

export default memo(StatusBadgeComponent)