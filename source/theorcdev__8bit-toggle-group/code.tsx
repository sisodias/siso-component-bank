"use client";

import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

import {
  ToggleGroup as ShadcnToggleGroup,
  ToggleGroupItem as ShadcnToggleGroupItem,
} from "@/components/ui/toggle-group";

export const toggleGroupVariants = cva("", {
  variants: {
    font: { normal: "", retro: "retro" },
    variant: {
      default: "bg-transparent",
      outline:
        "bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
    },
    size: {
      default: "h-9 px-2 min-w-9",
      sm: "h-4 px-1.5 min-w-4",
      lg: "h-10 px-2.5 min-w-10",
    },
  },
  defaultVariants: { variant: "default", font: "retro", size: "default" },
});

export type BitToggleGroupProps = React.ComponentPropsWithoutRef<typeof ShadcnToggleGroup> &
  VariantProps<typeof toggleGroupVariants>;

export type BitToggleGroupItemProps = React.ComponentPropsWithoutRef<typeof ShadcnToggleGroupItem> &
  VariantProps<typeof toggleGroupVariants>;

function ToggleGroup({ className, font, children, ...rest }: BitToggleGroupProps) {
  return (
    <ShadcnToggleGroup
      className={cn("gap-3", className, font !== "normal" && "retro")}
      {...rest}
    >
      {children}
    </ShadcnToggleGroup>
  );
}

function ToggleGroupItem({ className, font, children, variant, ...rest }: BitToggleGroupItemProps) {
  return (
    <ShadcnToggleGroupItem
      variant={variant as any}
      className={cn(
        "relative transition-transform active:translate-x-1 active:translate-y-1",
        className,
        font !== "normal" && "retro"
      )}
      {...rest}
    >
      {children}
      {variant === "outline" && (
        <>
          <div
            className="absolute inset-0 -my-1.5 border-y-6 border-foreground dark:border-ring pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 -mx-1.5 border-x-6 border-foreground dark:border-ring pointer-events-none"
            aria-hidden="true"
          />
        </>
      )}
    </ShadcnToggleGroupItem>
  );
}

export { ToggleGroup, ToggleGroupItem };

export default ToggleGroup;
