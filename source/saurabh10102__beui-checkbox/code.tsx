"use client";

import { useId, type ButtonHTMLAttributes } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* -------------------------------------------------------------------------- */
/* Utils                                                                      */
/* -------------------------------------------------------------------------- */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* -------------------------------------------------------------------------- */
/* Shared motion tokens                                                       */
/* -------------------------------------------------------------------------- */

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

export const EASE_OUT_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

export const SPRING_PRESS = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 0.6,
} as const;

export const SPRING_SWAP = {
  type: "spring",
  stiffness: 460,
  damping: 30,
  mass: 0.55,
} as const;

export const SPRING_PANEL = {
  type: "spring",
  stiffness: 420,
  damping: 40,
  mass: 0.5,
} as const;

export const SPRING_LAYOUT = {
  type: "spring",
  stiffness: 360,
  damping: 32,
  mass: 0.6,
} as const;

export const SPRING_MOUSE = {
  stiffness: 200,
  damping: 15,
  mass: 0.3,
} as const;

/* -------------------------------------------------------------------------- */
/* Checkbox                                                                   */
/* -------------------------------------------------------------------------- */

type CheckboxProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "checked" | "defaultChecked" | "onChange"
> & {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
  labelClassName?: string;
  indicatorClassName?: string;
};

export function Checkbox({
  checked = false,
  indeterminate = false,
  disabled = false,
  label,
  onCheckedChange,
  className,
  labelClassName,
  indicatorClassName,
  id,
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  const handleToggle = () => {
    if (disabled) return;
    onCheckedChange?.(!checked);
  };

  const active = checked || indeterminate;

  return (
    <label
      htmlFor={checkboxId}
      className={cn(
        "inline-flex min-h-[44px] cursor-pointer items-center gap-2 text-sm",
        disabled && "cursor-not-allowed opacity-50",
        labelClassName,
      )}
    >
      <button
        id={checkboxId}
        type="button"
        role="checkbox"
        aria-checked={indeterminate ? "mixed" : checked}
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-input bg-background transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          active && "border-primary bg-primary text-primary-foreground",
          disabled && "cursor-not-allowed",
          className,
        )}
        {...props}
      >
        {indeterminate ? (
          <svg
            viewBox="0 0 16 16"
            className={cn("h-3.5 w-3.5", indicatorClassName)}
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 8h8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : checked ? (
          <svg
            viewBox="0 0 16 16"
            className={cn("h-3.5 w-3.5", indicatorClassName)}
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3.5 8.5 6.5 11.5 12.5 4.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </button>

      {label ? <span>{label}</span> : null}
    </label>
  );
}