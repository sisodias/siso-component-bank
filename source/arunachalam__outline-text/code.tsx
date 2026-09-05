import React, { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface OutlineTextProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  className?: string;
}

export function OutlineText({ children, className = "", ...props }: OutlineTextProps) {
  return (
    <span
      className={cn(
        "inline-block font-extrabold",
        "text-[4rem] md:text-[6rem] leading-none",
        "text-transparent bg-clip-text select-none",
        className
      )}
      style={{
        WebkitTextStroke: "2px",
        WebkitTextFillColor: "transparent",
        WebkitBackgroundClip: "text",
      }}
      {...props}
    >
      <span className="[-webkit-text-stroke-color:#000] dark:[-webkit-text-stroke-color:#fff]">
        {children}
      </span>
    </span>
  );
}
