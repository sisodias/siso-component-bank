"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

function MoviePassButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      className={cn(
        className,
        "px-6 py-3 bg-primary text-background",
        "relative",
        "active:scale-95 transition-all duration-75",
      )}
    >
      {/* Outer corner cutouts */}
      <div className="size-4 rounded-full absolute -top-1.5 bg-background -left-1.5" />
      <div className="size-4 rounded-full absolute -top-1.5 bg-background -right-1.5" />
      <div className="size-4 rounded-full absolute -bottom-1.5 bg-background -right-1.5" />
      <div className="size-4 rounded-full absolute -bottom-1.5 bg-background -left-1.5" />

      {children}
    </button>
  );
}
export default MoviePassButton;
