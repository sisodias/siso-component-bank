"use client";

import * as React from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const hoverCardVariants = cva("", {
  variants: {
    font: {
      normal: "",
      retro: "retro",
    },
  },
  defaultVariants: {
    font: "retro",
  },
});

export interface BitHoverCardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof hoverCardVariants> {}

function HoverCard({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="hover-card" className="group/hover-card relative inline-block" {...props}>
      {children}
    </div>
  );
}

function HoverCardTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="hover-card-trigger"
      className={cn("cursor-pointer", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function HoverCardContent({
  children,
  className,
  font,
  ...props
}: BitHoverCardProps) {
  return (
    <div
      data-slot="hover-card-content"
      className={cn(
        "invisible opacity-0 group-hover/hover-card:visible group-hover/hover-card:opacity-100",
        "absolute left-0 top-full z-50 mt-2 min-w-[8rem] rounded-md bg-popover p-4 text-popover-foreground shadow-md",
        "transition-opacity duration-150",
        "relative",
        hoverCardVariants({ font, className })
      )}
      {...props}
    >
      {children}

      <div
        className="absolute inset-0 border-x-6 -mx-1.5 border-foreground dark:border-ring pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 border-y-6 -my-1.5 border-foreground dark:border-ring pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };

export default HoverCard;
