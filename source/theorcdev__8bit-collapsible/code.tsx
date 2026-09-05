"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import {
  Collapsible as ShadcnCollapsible,
  CollapsibleContent as ShadcnCollapsibleContent,
  CollapsibleTrigger as ShadcnCollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface BitCollapsibleProps
  extends React.ComponentProps<typeof ShadcnCollapsible> {
  asChild?: boolean;
}

function Collapsible({ children, ...props }: BitCollapsibleProps) {
  const { className } = props;
  return (
    <div className={cn("relative", className)}>
      <ShadcnCollapsible {...props} className={cn(className, "retro")}>
        {children}
      </ShadcnCollapsible>
    </div>
  );
}

function CollapsibleTrigger({
  children,
  ...props
}: React.ComponentProps<typeof ShadcnCollapsibleTrigger>) {
  const { className } = props;
  return (
    <ShadcnCollapsibleTrigger
      data-slot="collapsible-trigger"
      className={cn(className, "retro")}
      {...props}
    >
      {children}
    </ShadcnCollapsibleTrigger>
  );
}

function CollapsibleContent({
  children,
  ...props
}: React.ComponentProps<typeof ShadcnCollapsibleContent>) {
  const { className } = props;
  return (
    <ShadcnCollapsibleContent
      data-slot="collapsible-content"
      className={cn(className, "retro")}
      {...props}
    >
      {children}
    </ShadcnCollapsibleContent>
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };

export default Collapsible;
