import { ReactNode } from "react";

interface HeaderComponentProps {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export function HeaderComponent({ icon, title, description }: HeaderComponentProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center w-full">
      <h2 className="flex items-center justify-center gap-2 text-3xl font-bold text-white mb-4">
        {icon} {title}
      </h2>
      {description && (
        <p className="text-gray-400 max-w-2xl text-center">
          {description}
        </p>
      )}
    </div>
  );
}