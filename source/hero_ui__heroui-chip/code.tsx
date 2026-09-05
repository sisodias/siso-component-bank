"use client";

import * as React from "react";

type ChipColor = "default" | "accent" | "success" | "warning" | "danger";
type ChipSize = "sm" | "md" | "lg";
type ChipVariant = "primary" | "secondary" | "tertiary" | "soft" | "dot";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const sizeClasses: Record<ChipSize, { base: string; content: string; icon: string; close: string }> = {
  sm: { base: "h-6 px-1 text-xs", content: "px-1", icon: "h-4 w-4", close: "h-4 w-4" },
  md: { base: "h-7 px-1 text-sm", content: "px-2", icon: "h-4 w-4", close: "h-4 w-4" },
  lg: { base: "h-8 px-2 text-base", content: "px-2", icon: "h-4 w-4", close: "h-5 w-5" },
};

const variantClasses: Record<ChipVariant, Record<ChipColor, string>> = {
  primary: {
    default: "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950",
    accent: "bg-sky-600 text-white",
    success: "bg-emerald-600 text-white",
    warning: "bg-amber-500 text-zinc-950",
    danger: "bg-rose-600 text-white",
  },
  secondary: {
    default: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
    accent: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-200",
    success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
    danger: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200",
  },
  tertiary: {
    default: "border border-zinc-200 bg-transparent text-zinc-700 dark:border-zinc-700 dark:text-zinc-200",
    accent: "border border-sky-300 bg-transparent text-sky-700 dark:border-sky-800 dark:text-sky-200",
    success: "border border-emerald-300 bg-transparent text-emerald-700 dark:border-emerald-800 dark:text-emerald-200",
    warning: "border border-amber-300 bg-transparent text-amber-700 dark:border-amber-800 dark:text-amber-200",
    danger: "border border-rose-300 bg-transparent text-rose-700 dark:border-rose-800 dark:text-rose-200",
  },
  soft: {
    default: "bg-zinc-50 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400",
    accent: "bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-300",
    success: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300",
    warning: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300",
    danger: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300",
  },
  dot: {
    default: "border border-zinc-200 bg-transparent text-zinc-700 dark:border-zinc-700 dark:text-zinc-200",
    accent: "border border-zinc-200 bg-transparent text-zinc-700 dark:border-zinc-700 dark:text-zinc-200",
    success: "border border-zinc-200 bg-transparent text-zinc-700 dark:border-zinc-700 dark:text-zinc-200",
    warning: "border border-zinc-200 bg-transparent text-zinc-700 dark:border-zinc-700 dark:text-zinc-200",
    danger: "border border-zinc-200 bg-transparent text-zinc-700 dark:border-zinc-700 dark:text-zinc-200",
  },
};

const dotClasses: Record<ChipColor, string> = {
  default: "bg-zinc-400",
  accent: "bg-sky-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
};

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: ChipColor;
  size?: ChipSize;
  variant?: ChipVariant;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function Chip({
  children,
  className,
  color = "default",
  size = "md",
  variant = "secondary",
  startContent,
  endContent,
  onClose,
  ...props
}: ChipProps) {
  const isOneChar = typeof children === "string" && children.length === 1;
  const hasStart = Boolean(startContent) || variant === "dot";
  const hasEnd = Boolean(endContent) || Boolean(onClose);

  return (
    <div
      className={cn(
        "relative box-border inline-flex min-w-min max-w-fit items-center justify-between whitespace-nowrap rounded-full font-normal transition-colors",
        sizeClasses[size].base,
        variantClasses[variant][color],
        isOneChar && !hasStart && !hasEnd && size === "sm" && "h-5 min-h-5 w-5 min-w-5 justify-center px-0",
        isOneChar && !hasStart && !hasEnd && size === "md" && "h-6 min-h-6 w-6 min-w-6 justify-center px-0",
        isOneChar && !hasStart && !hasEnd && size === "lg" && "h-7 min-h-7 w-7 min-w-7 justify-center px-0",
        variant === "dot" && "h-7 px-1",
        className,
      )}
      data-slot="chip"
      {...props}
    >
      {variant === "dot" && !startContent ? (
        <span className={cn("ml-1 h-2 w-2 rounded-full", dotClasses[color])} data-slot="chip-dot" />
      ) : (
        startContent
      )}
      <span
        className={cn(
          "flex-1 text-inherit",
          sizeClasses[size].content,
          hasStart && size === "sm" && "pl-0.5",
          hasStart && size !== "sm" && "pl-1",
          hasEnd && size === "sm" && "pr-0.5",
          hasEnd && size !== "sm" && "pr-1",
          isOneChar && !hasStart && !hasEnd && "flex-none px-0",
        )}
        data-slot="chip-label"
      >
        {children}
      </span>
      {onClose ? (
        <button
          aria-label="close chip"
          className={cn(
            "z-10 inline-flex appearance-none items-center justify-center rounded-full outline-none opacity-70 transition-opacity hover:opacity-100 active:opacity-40 focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-1",
            sizeClasses[size].close,
          )}
          data-slot="chip-close-button"
          type="button"
          onClick={onClose}
        >
          {endContent ?? <CloseFilledIcon />}
        </button>
      ) : (
        endContent
      )}
    </div>
  );
}

export function ChipLabel({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("flex-1 text-inherit", className)} data-slot="chip-label" {...props}>
      {children}
    </span>
  );
}

function iconProps(width = 12) {
  return {
    "aria-hidden": true,
    className: "shrink-0",
    fill: "none",
    height: 16,
    viewBox: "0 0 16 16",
    width,
    xmlns: "http://www.w3.org/2000/svg",
  } as const;
}

export function CircleDashedIcon() {
  return (
    <svg {...iconProps(16)}>
      <path
        clipRule="evenodd"
        d="M6.906 1.085a7 7 0 0 1 2.188 0 .75.75 0 0 1-.232 1.482 5.6 5.6 0 0 0-1.724 0 .75.75 0 0 1-.232-1.482M4.933 2.502a.75.75 0 0 1-.166 1.048c-.466.34-.878.75-1.217 1.217a.75.75 0 0 1-1.213-.882 7 7 0 0 1 1.548-1.548.75.75 0 0 1 1.048.165m6.135 0a.75.75 0 0 1 1.047-.165 7 7 0 0 1 1.548 1.548.75.75 0 0 1-1.213.882 5.5 5.5 0 0 0-1.217-1.217.75.75 0 0 1-.165-1.048M1.943 6.28a.75.75 0 0 1 .624.857 5.6 5.6 0 0 0 0 1.724.75.75 0 0 1-1.482.232 7 7 0 0 1 0-2.188.75.75 0 0 1 .858-.625m12.115 0a.75.75 0 0 1 .857.625 7 7 0 0 1 0 2.188.75.75 0 1 1-1.482-.232 5.5 5.5 0 0 0 0-1.724.75.75 0 0 1 .624-.857M2.502 11.068a.75.75 0 0 1 1.048.165c.34.466.75.878 1.217 1.217a.75.75 0 0 1-.882 1.213 7 7 0 0 1-1.548-1.548.75.75 0 0 1 .165-1.047m10.996 0a.75.75 0 0 1 .165 1.047 7 7 0 0 1-1.548 1.548.75.75 0 0 1-.883-1.213 5.5 5.5 0 0 0 1.218-1.217.75.75 0 0 1 1.048-.165m-7.217 2.99a.75.75 0 0 1 .857-.625 5.5 5.5 0 0 0 1.724 0 .75.75 0 0 1 .232 1.482 7 7 0 0 1-2.188 0 .75.75 0 0 1-.625-.857"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

export function CircleFillIcon() {
  return (
    <svg {...iconProps(6)}>
      <path clipRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14" fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

export function CircleCheckFillIcon() {
  return (
    <svg {...iconProps()}>
      <path
        clipRule="evenodd"
        d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m3.1-8.55a.75.75 0 1 0-1.2-.9L7.419 8.858 6.03 7.47a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.13-.08z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

export function ClockIcon() {
  return (
    <svg {...iconProps()}>
      <path
        clipRule="evenodd"
        d="M13.5 8a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0M8.75 4.5a.75.75 0 0 0-1.5 0V8a.75.75 0 0 0 .3.6l2 1.5a.75.75 0 1 0 .9-1.2l-1.7-1.275z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

export function XmarkIcon() {
  return (
    <svg {...iconProps()}>
      <path
        clipRule="evenodd"
        d="M3.47 3.47a.75.75 0 0 1 1.06 0L8 6.94l3.47-3.47a.75.75 0 1 1 1.06 1.06L9.06 8l3.47 3.47a.75.75 0 1 1-1.06 1.06L8 9.06l-3.47 3.47a.75.75 0 0 1-1.06-1.06L6.94 8 3.47 4.53a.75.75 0 0 1 0-1.06"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

export function ChevronDownIcon() {
  return (
    <svg {...iconProps()}>
      <path
        clipRule="evenodd"
        d="M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

export function CircleInfoIcon() {
  return (
    <svg {...iconProps()}>
      <path
        clipRule="evenodd"
        d="M8 13.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m1-9.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-.25 3a.75.75 0 0 0-1.5 0V11a.75.75 0 0 0 1.5 0z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg {...iconProps()}>
      <path
        clipRule="evenodd"
        d="M13.488 3.43a.75.75 0 0 1 .081 1.058l-6 7a.75.75 0 0 1-1.1.042l-3.5-3.5A.75.75 0 0 1 4.03 6.97l2.928 2.927 5.473-6.385a.75.75 0 0 1 1.057-.081"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

export function TriangleExclamationIcon() {
  return (
    <svg {...iconProps()}>
      <path
        clipRule="evenodd"
        d="M7.134 2.994 2.217 11.5a1 1 0 0 0 .866 1.5h9.834a1 1 0 0 0 .866-1.5L8.866 2.993a1 1 0 0 0-1.732 0m3.03-.75c-.962-1.665-3.366-1.665-4.329 0L.918 10.749c-.963 1.666.24 3.751 2.165 3.751h9.834c1.925 0 3.128-2.085 2.164-3.751zM8 5a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2A.75.75 0 0 1 8 5m1 5.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

export function BanIcon() {
  return (
    <svg {...iconProps()}>
      <path
        clipRule="evenodd"
        d="M11.323 12.383a5.5 5.5 0 0 1-7.706-7.706zm1.06-1.06L4.677 3.617a5.5 5.5 0 0 1 7.706 7.706M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

function CloseFilledIcon() {
  return (
    <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="8" fill="currentColor" opacity="0.35" />
      <path
        d="m7.2 7.2 5.6 5.6M12.8 7.2l-5.6 5.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

Chip.Label = ChipLabel;
