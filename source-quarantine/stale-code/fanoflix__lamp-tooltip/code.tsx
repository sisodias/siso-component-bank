"use client";

import { cn } from "../_utils/cn";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 18, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden bg-primary px-3 py-1.5 text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      // Shape (Padding, width, height etc)
      "py-2",
      // Background color and text color
      "bg-muted dark:bg-black text-popover-foreground",
      // Border-color
      "border-secondary-foreground",
      // Border sides and shadow for each side
      "data-[side=top]:border-b dark:data-[side=top]:shadow-tooltip-b",
      "data-[side=bottom]:border-t dark:data-[side=bottom]:shadow-tooltip-t",
      "data-[side=right]:border-l dark:data-[side=right]:shadow-tooltip-r",
      "data-[side=left]:border-r dark:data-[side=left]:shadow-tooltip-l",
      // Slide and zoom animations
      "data-[side=bottom]:slide-in-from-top-3",
      // Text classes
      "text-sm",

      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
