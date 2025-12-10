import React from "react"

type StatusBadgeProps = {
  online: boolean;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ online }) => {
  return (
    <div
      className={[
        "inline-flex items-center justify-center",
        "px-4 md:px-6",
        "h-[45px] md:h-[60px]",
        "rounded-full text-xl md:text-3xl font-medium",
        "transition-all duration-300",
        "backdrop-blur-md border bg-white dark:bg-black border-white/20",
        online
            ? "text-green-600 border-green-500/60 shadow-[0_0_40px_rgba(0,200,0,0.5),_0_0_50px_rgba(0,200,0,0.35)]"
            : "text-red-600 border-red-500/60 shadow-[0_0_40px_rgba(200,0,0,0.5),_0_0_50px_rgba(200,0,0,0.35)]"
      ].join(" ")}
    >
      {online ? "Currently online" : "Currently offline"}
    </div>
  );
};

export default StatusBadge;