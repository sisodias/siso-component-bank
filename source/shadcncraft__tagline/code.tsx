import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const taglineVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 font-medium whitespace-nowrap [&_svg]:shrink-0 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "text-base text-primary",
        primary:
          "rounded-4xl bg-primary px-2 py-0.5 text-xs text-primary-foreground [a&]:hover:bg-primary/80",
        secondary:
          "rounded-4xl bg-secondary px-2 py-0.5 text-xs text-secondary-foreground [a&]:hover:bg-secondary/80",
        badge:
          "rounded-4xl border border-border bg-background px-2 py-0.5 text-xs [a&]:hover:bg-muted [a&]:hover:text-muted-foreground",
        outline:
          "rounded-4xl border border-border bg-transparent px-2 py-0.5 text-xs [a&]:hover:bg-muted [a&]:hover:text-muted-foreground",
        ghost:
          "bg-transparent text-xs text-muted-foreground hover:bg-muted hover:text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Tagline({
  className,
  variant,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof taglineVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div";

  return (
    <Comp
      data-slot="tagline"
      data-variant={variant}
      className={cn(taglineVariants({ variant }), className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

export { Tagline, taglineVariants };

export default Tagline;
