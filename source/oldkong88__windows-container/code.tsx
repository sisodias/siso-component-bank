import { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type WindowsContainerProps = {
  title: string;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export const WindowsContainer = ({
  title,
  children,
  footer,
  className,
}: WindowsContainerProps) => {
  return (
    <div className={cn(
      "border border-t-[#9FCFD0] border-l-[#9FCFD0] border-r-[#010303] border-b-[#010303] w-full", className
    )}>
      <div
        className="flex w-full flex-col windows-border">
        {/* Header */}
        <div className="vt323-regular flex items-center justify-between h-4.5 p-0.5 bg-[#010081]">
          <span className="text-white text-base">{title}</span>
          <button className="flex items-center justify-center w-3.5 h-3 windows-border cursor-pointer">
            <X color="black" size={10} strokeWidth={3} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-auto text-sm">{children}</div>

        {/* Footer */}
        {footer && <div className="p-4">{footer}</div>}
      </div>
    </div>
  );
};
