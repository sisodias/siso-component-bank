import { cn } from "@/lib/utils";
import "daisyui";
import React from "react";

const BadgeVariants = {
  base: "badge",
  color: {
    primary: "badge-primary",
    secondary: "badge-secondary",
    accent: "badge-accent",
    info: "badge-info",
    success: "badge-success",
    warning: "badge-warning",
    error: "badge-error",
    neutral: "badge-neutral",
  },
  variant: {
    outline: "badge-outline",
    soft: "badge-soft",
    dash: "badge-dash",
    ghost: "badge-ghost",
  },
  size: {
    xs: "badge-xs",
    sm: "badge-sm",
    md: "badge-md",
    lg: "badge-lg",
    xl: "badge-xl",
  }
} as const;

export type BadgeColor = keyof typeof BadgeVariants.color;
export type BadgeVariant = keyof typeof BadgeVariants.variant;
export type BadgeSize = keyof typeof BadgeVariants.size;


export type BadgeProps<T extends React.ElementType = "span"> = {
  as?: T;
  color?: BadgeColor;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<T>;

export function BadgeDaisyUI<T extends React.ElementType = "span">({
  as,
  color,
  variant,
  size,
  className,
  children,
  ...rest
}: BadgeProps<T>) {
  const Component = as ?? "span";

  const classes = cn(
    BadgeVariants.base,
    color && BadgeVariants.color[color],
    variant && BadgeVariants.variant[variant],
    size && BadgeVariants.size[size],
    className
  );

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
}
