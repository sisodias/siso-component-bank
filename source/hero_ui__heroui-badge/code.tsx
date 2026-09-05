"use client";

import * as React from "react";

type BadgeColor = "default" | "accent" | "success" | "warning" | "danger";
type BadgePlacement = "top-right" | "top-left" | "bottom-right" | "bottom-left";
type BadgeSize = "sm" | "md" | "lg";
type BadgeVariant = "primary" | "secondary" | "soft";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const colorClasses: Record<BadgeVariant, Record<BadgeColor, string>> = {
  primary: {
    default: "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950",
    accent: "bg-blue-600 text-white",
    success: "bg-emerald-600 text-white",
    warning: "bg-amber-500 text-white",
    danger: "bg-rose-600 text-white",
  },
  secondary: {
    default: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
    accent: "bg-zinc-100 text-blue-700 dark:bg-zinc-800 dark:text-blue-300",
    success: "bg-zinc-100 text-emerald-700 dark:bg-zinc-800 dark:text-emerald-300",
    warning: "bg-zinc-100 text-amber-700 dark:bg-zinc-800 dark:text-amber-300",
    danger: "bg-zinc-100 text-rose-700 dark:bg-zinc-800 dark:text-rose-300",
  },
  soft: {
    default: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
    accent: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-200",
    success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
    danger: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200",
  },
};

const placementClasses: Record<BadgePlacement, string> = {
  "top-right": "absolute right-0 top-0 translate-x-1/4 -translate-y-1/4",
  "top-left": "absolute left-0 top-0 -translate-x-1/4 -translate-y-1/4",
  "bottom-right": "absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4",
  "bottom-left": "absolute bottom-0 left-0 -translate-x-1/4 translate-y-1/4",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "min-h-4 min-w-4 rounded-xl text-[10px] leading-[1.34]",
  md: "min-h-7 min-w-7 rounded-3xl text-xs leading-[1.34]",
  lg: "min-h-8 min-w-8 rounded-2xl text-sm leading-[1.43]",
};

type BadgeContextValue = {
  hasLabel: boolean;
};

const BadgeContext = React.createContext<BadgeContextValue>({ hasLabel: false });

interface BadgeAnchorProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

function BadgeAnchor({ children, className, ...props }: BadgeAnchorProps) {
  return (
    <span
      className={cn("relative inline-flex shrink-0", className)}
      data-slot="badge-anchor"
      {...props}
    >
      {children}
    </span>
  );
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
  placement?: BadgePlacement;
  size?: BadgeSize;
  variant?: BadgeVariant;
  children?: React.ReactNode;
}

function Badge({
  children,
  className,
  color = "default",
  placement = "top-right",
  size = "sm",
  variant = "primary",
  ...props
}: BadgeProps) {
  const label = typeof children === "string" || typeof children === "number";

  return (
    <BadgeContext.Provider value={{ hasLabel: label }}>
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center gap-0.5 border border-background font-medium shadow-sm transition-colors",
          placementClasses[placement],
          sizeClasses[size],
          colorClasses[variant][color],
          !children && "size-3 min-h-3 min-w-3 rounded-full p-0",
          className,
        )}
        data-slot="badge"
        {...props}
      >
        {label ? <BadgeLabel>{children}</BadgeLabel> : children}
      </span>
    </BadgeContext.Provider>
  );
}

interface BadgeLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
}

function BadgeLabel({ children, className, ...props }: BadgeLabelProps) {
  const { hasLabel } = React.useContext(BadgeContext);

  return (
    <span
      className={cn(hasLabel && "px-0.5", className)}
      data-slot="badge-label"
      {...props}
    >
      {children}
    </span>
  );
}

Badge.Anchor = BadgeAnchor;
Badge.Label = BadgeLabel;

export { Badge, BadgeAnchor, BadgeLabel };
export type { BadgeProps, BadgeAnchorProps, BadgeLabelProps };
