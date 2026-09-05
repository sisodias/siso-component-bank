"use client";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "../_utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";

export const buttonVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border font-medium text-base outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 sm:text-sm",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-9 px-3 sm:h-8",
        icon: "size-9 sm:size-8",
        "icon-lg": "size-10 sm:size-9",
        "icon-sm": "size-8 sm:size-7",
        "icon-xl":
          "size-11 sm:size-10 [&_svg:not([class*='size-'])]:size-5 sm:[&_svg:not([class*='size-'])]:size-4.5",
        "icon-xs":
          "size-7 rounded-md sm:size-6 [&_svg:not([class*='size-'])]:size-4 sm:[&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 px-3.5 sm:h-9",
        sm: "h-8 gap-1.5 px-2.5 sm:h-7",
        xl: "h-11 px-4 text-lg sm:h-10 sm:text-base [&_svg:not([class*='size-'])]:size-5 sm:[&_svg:not([class*='size-'])]:size-4.5",
        xs: "h-7 gap-1 rounded-md px-2 text-sm sm:h-6 sm:text-xs [&_svg:not([class*='size-'])]:size-4 sm:[&_svg:not([class*='size-'])]:size-3.5",
      },
      variant: {
        default:
          "border-primary bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:bg-primary/90",
        destructive:
          "border-destructive bg-destructive text-white shadow-sm hover:bg-destructive/90 active:bg-destructive/90",
        "destructive-outline":
          "border-input bg-popover text-destructive-foreground shadow-xs/5 hover:border-destructive/32 hover:bg-destructive/4 active:border-destructive/32 active:bg-destructive/4",
        ghost:
          "border-transparent text-foreground hover:bg-accent active:bg-accent",
        link: "border-transparent text-foreground underline-offset-4 hover:underline active:underline",
        outline:
          "border-input bg-popover text-foreground shadow-xs/5 hover:bg-accent/50 active:bg-accent/50 dark:bg-input/32 dark:hover:bg-input/64",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90 active:bg-secondary/80",
      },
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled: disabledProp,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = Boolean(loading || disabledProp);

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={loading || undefined}
        data-loading={loading ? "" : undefined}
        data-slot="button"
        type={asChild ? undefined : "button"}
        {...props}
      >
        {loading ? (
          <span className="invisible inline-flex items-center gap-2">{children}</span>
        ) : (
          children
        )}
        {loading && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Loader2
              className="size-4 animate-spin"
              data-slot="button-loading-indicator"
              aria-label="Loading"
            />
          </span>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";
