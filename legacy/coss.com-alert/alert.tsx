import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "./utils";

const alertVariants = cva(
  "relative grid w-full items-start gap-x-2 gap-y-0.5 rounded-xl border px-3.5 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] [&>svg]:h-[1lh] [&>svg]:w-4",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default:
          "bg-transparent text-card-foreground dark:bg-muted/30 [&>svg]:text-muted-foreground",
        error:
          "border-red-500/30 bg-red-500/5 text-red-700 dark:text-red-400 [&>svg]:text-red-500",
        info: "border-blue-500/30 bg-blue-500/5 text-blue-700 dark:text-blue-400 [&>svg]:text-blue-500",
        success:
          "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 [&>svg]:text-emerald-500",
        warning:
          "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400 [&>svg]:text-amber-500",
      },
    },
  },
);

export function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants>): React.ReactElement {
  return (
    <div
      className={cn(alertVariants({ variant }), className)}
      data-slot="alert"
      role="alert"
      {...props}
    />
  );
}

export function AlertTitle({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      className={cn("font-medium [svg~&]:col-start-2", className)}
      data-slot="alert-title"
      {...props}
    />
  );
}

export function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 text-muted-foreground [svg~&]:col-start-2",
        className,
      )}
      data-slot="alert-description"
      {...props}
    />
  );
}

export function AlertAction({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      className={cn(
        "flex gap-1 max-sm:col-start-2 max-sm:mt-2 sm:row-start-1 sm:row-end-3 sm:self-center",
        className,
      )}
      data-slot="alert-action"
      {...props}
    />
  );
}
