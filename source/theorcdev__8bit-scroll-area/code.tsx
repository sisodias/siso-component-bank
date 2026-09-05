"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

function ScrollArea({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="scroll-area"
      className={cn("relative overflow-auto retro-scrollbar", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { orientation?: "vertical" | "horizontal" }) {
  return (
    <div
      data-slot="scroll-area-scrollbar"
      aria-orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none bg-foreground/30 dark:bg-ring/30 relative",
        orientation === "vertical" && "h-full w-1.5 border-l border-l-transparent",
        orientation === "horizontal" && "h-1.5 flex-col border-t border-t-transparent",
        className,
      )}
      {...props}
    >
      <div
        data-slot="scroll-area-thumb"
        className={cn(
          "relative dark:bg-ring rounded-none flex-1 bg-foreground transition-none duration-75",
          orientation === "vertical" && "scale-x-250",
          orientation === "horizontal" && "scale-y-250",
        )}
      />
    </div>
  );
}

export { ScrollArea, ScrollBar };

export default ScrollArea;
