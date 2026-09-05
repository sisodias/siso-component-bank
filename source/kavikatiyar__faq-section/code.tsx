"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { Plus, Minus } from "lucide-react"

import { cn } from "@/lib/utils" // Assumes you have a 'lib/utils.ts' file for 'cn'

// --- Internal Accordion Components ---
// These are styled variants of the shadcn/ui Accordion,
// modified to use Plus/Minus icons. They are not exported,
// as they are encapsulated by the FaqSection component.

const FaqAccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b border-border", className)} // Use theme-aware border
    {...props}
  />
))
FaqAccordionItem.displayName = "FaqAccordionItem"

const FaqAccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-6 text-lg md:text-xl font-medium transition-all", // Adjusted text size and padding
        "text-foreground hover:text-muted-foreground", // Theme-aware text color
        className
      )}
      {...props}
    >
      {children}
      <div className="relative h-6 w-6 flex-shrink-0">
        <Plus
          className="h-full w-full shrink-0 transition-transform duration-300 ease-in-out scale-100 data-[state=open]:scale-0"
          aria-hidden
        />
        <Minus
          className="absolute inset-0 h-full w-full shrink-0 transition-transform duration-300 ease-in-out scale-0 data-[state=open]:scale-100"
          aria-hidden
        />
      </div>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
FaqAccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const FaqAccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-base text-muted-foreground transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className
    )}
    {...props}
  >
    <div className="pt-0 pb-5">{children}</div>
  </AccordionPrimitive.Content>
))
FaqAccordionContent.displayName = AccordionPrimitive.Content.displayName

// --- Main Exported Component ---

/**
 * Props for the FaqSection component.
 */
interface FaqSectionProps {
  /**
   * The main title for the FAQ section (e.g., "FAQ").
   * Accepts a ReactNode for flexible styling.
   */
  title: React.ReactNode
  /**
   * An array of FAQ items.
   * Each item requires a 'value' (unique string), 'question', and 'answer'.
   */
  items: {
    value: string
    question: React.ReactNode
    answer: React.ReactNode
  }[]
  /**
   * Optional class name to apply to the root section element.
   */
  className?: string
  /**
   * Optional props to pass directly to the underlying Radix Accordion root.
   * Use this to set 'type', 'collapsible', 'defaultValue', etc.
   */
  accordionProps?: Omit<
    React.ComponentProps<typeof AccordionPrimitive.Root>,
    "children"
  >
}

/**
 * A reusable FAQ section component.
 * It renders a title and an accordion of questions and answers.
 */
export function FaqSection({
  title,
  items,
  className,
  accordionProps,
}: FaqSectionProps) {
  return (
    <section className={cn("w-full", className)}>
      {/* Title */}
      <div className="text-center">{title}</div>

      {/* Accordion */}
      <AccordionPrimitive.Root
        type="single"
        collapsible
        className="w-full mt-8 md:mt-12"
        {...accordionProps}
      >
        {items.map((item) => (
          <FaqAccordionItem key={item.value} value={item.value}>
            <FaqAccordionTrigger>{item.question}</FaqAccordionTrigger>
            <FaqAccordionContent>{item.answer}</FaqAccordionContent>
          </FaqAccordionItem>
        ))}
      </AccordionPrimitive.Root>
    </section>
  )
}