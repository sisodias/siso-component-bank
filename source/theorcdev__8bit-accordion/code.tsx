"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import {
  Accordion as ShadcnAccordion,
  AccordionContent as ShadcnAccordionContent,
  AccordionItem as ShadcnAccordionItem,
  AccordionTrigger as ShadcnAccordionTrigger,
} from "@/components/ui/accordion";

export interface BitAccordionItemProps
  extends React.ComponentProps<typeof ShadcnAccordionItem> {
  asChild?: boolean;
}

function AccordionItem({
  className,
  children,
  ...props
}: BitAccordionItemProps) {
  return (
    <ShadcnAccordionItem
      className={cn(
        "border-dashed border-b-4 border-foreground dark:border-ring relative",
        className
      )}
      {...props}
    >
      {children}
    </ShadcnAccordionItem>
  );
}

export interface BitAccordionTriggerProps
  extends React.ComponentProps<typeof ShadcnAccordionTrigger> {
  font?: "normal" | "retro";
}

function AccordionTrigger({
  className,
  children,
  font,
  ...props
}: BitAccordionTriggerProps) {
  return (
    <ShadcnAccordionTrigger
      className={cn(font !== "normal" && "retro", className)}
      {...props}
    >
      {children}
    </ShadcnAccordionTrigger>
  );
}

export interface BitAccordionContentProps
  extends React.ComponentProps<typeof ShadcnAccordionContent> {
  font?: "normal" | "retro";
}

function AccordionContent({
  className,
  children,
  font,
  ...props
}: BitAccordionContentProps) {
  return (
    <ShadcnAccordionContent
      className={cn(
        "overflow-hidden text-sm",
        font !== "normal" && "retro",
        className
      )}
      {...props}
    >
      <div className="pb-4 pt-0 relative z-10 p-1">{children}</div>
    </ShadcnAccordionContent>
  );
}

const Accordion = ShadcnAccordion;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

export default Accordion;
