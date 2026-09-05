"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type AquaButtonVariant = "primary" | "secondary";

export interface AquaButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AquaButtonVariant;
}

const PRIMARY_BG =
  "linear-gradient(rgb(95, 160, 230), rgb(50, 115, 205) 55%, rgb(95, 160, 230))";
const SECONDARY_BG =
  "linear-gradient(rgb(225, 226, 228), rgb(245, 246, 248) 55%, rgb(230, 230, 232))";

const PRIMARY_SHADOW =
  "0 0.25em 0.375em rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(0, 30, 95, 0.55), inset 0 0.125em 0.25em rgba(0, 20, 80, 0.3)";
const SECONDARY_SHADOW =
  "0 0.25em 0.375em rgba(0, 0, 0, 0.18), inset 0 0 0 1px rgba(120, 122, 130, 0.5), inset 0 0.125em 0.25em rgba(0, 0, 0, 0.15)";

const PRIMARY_HOVER_SHADOW =
  PRIMARY_SHADOW + ", 0 0 0.875em 0.0625em rgba(60, 150, 235, 0.55)";
const SECONDARY_HOVER_SHADOW =
  SECONDARY_SHADOW + ", 0 0 0.875em 0.0625em rgba(0, 0, 0, 0.18)";

const PRIMARY_FOCUS_SHADOW =
  PRIMARY_SHADOW +
  ", 0 0 0 0.125em rgba(255, 255, 255, 0.95), 0 0 0 0.3125em rgba(40, 150, 255, 0.95), 0 0 1.25em 0.1875em rgba(60, 170, 255, 0.7)";
const SECONDARY_FOCUS_SHADOW =
  SECONDARY_SHADOW +
  ", 0 0 0 0.125em rgba(255, 255, 255, 0.95), 0 0 0 0.3125em rgba(40, 150, 255, 0.95), 0 0 1.25em 0.1875em rgba(60, 170, 255, 0.55)";

const PRIMARY_ACTIVE_SHADOW =
  "0 0.0625em 0.125em rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(0, 30, 95, 0.65), inset 0 0.25em 0.5em rgba(0, 20, 80, 0.55)";
const SECONDARY_ACTIVE_SHADOW =
  "0 0.0625em 0.125em rgba(0, 0, 0, 0.18), inset 0 0 0 1px rgba(120, 122, 130, 0.6), inset 0 0.25em 0.5em rgba(0, 0, 0, 0.3)";

const EASE_AQUA = "cubic-bezier(0.32, 0.72, 0, 1)";

export const AquaButton = React.forwardRef<HTMLButtonElement, AquaButtonProps>(
  ({ className, variant = "primary", style, children, ...props }, ref) => {
    const isPrimary = variant === "primary";

    return (
      <button
        ref={ref}
        className={cn(
          "group relative inline-flex h-[1.75em] min-w-[6em] cursor-pointer items-center justify-center overflow-hidden rounded-full px-[2em] text-base font-medium outline-none will-change-transform",
          isPrimary ? "text-[rgb(20,30,55)]" : "text-[rgb(35,35,40)]",
          "transition-[transform,box-shadow] duration-[320ms] [transition-timing-function:var(--aqua-ease)]",
          "hover:-translate-y-px hover:[box-shadow:var(--aqua-shadow-hover)]",
          "focus-visible:-translate-y-px focus-visible:[box-shadow:var(--aqua-shadow-focus)]",
          "active:translate-y-0 active:scale-[0.97] active:duration-[140ms] active:[box-shadow:var(--aqua-shadow-active)]",
          "motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0 motion-reduce:active:scale-100",
          className,
        )}
        style={
          {
            background: isPrimary ? PRIMARY_BG : SECONDARY_BG,
            "--aqua-ease": EASE_AQUA,
            "--aqua-shadow": isPrimary ? PRIMARY_SHADOW : SECONDARY_SHADOW,
            "--aqua-shadow-hover": isPrimary
              ? PRIMARY_HOVER_SHADOW
              : SECONDARY_HOVER_SHADOW,
            "--aqua-shadow-focus": isPrimary
              ? PRIMARY_FOCUS_SHADOW
              : SECONDARY_FOCUS_SHADOW,
            "--aqua-shadow-active": isPrimary
              ? PRIMARY_ACTIVE_SHADOW
              : SECONDARY_ACTIVE_SHADOW,
            boxShadow: "var(--aqua-shadow)",
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute left-1/2 top-[6%] z-[2] h-[42%] w-[calc(100%-0.625em)] -translate-x-1/2 rounded-[2em_2em_0.75em_0.75em] opacity-90 blur-[0.5px]",
            "origin-top transition-[opacity,transform] duration-[320ms] [transition-timing-function:var(--aqua-ease)]",
            "group-hover:scale-y-[1.04] group-hover:opacity-100",
            "group-focus-visible:scale-y-[1.04] group-focus-visible:opacity-100",
            "group-active:scale-y-[0.82] group-active:opacity-75 group-active:duration-[140ms]",
            "motion-reduce:transition-none motion-reduce:group-hover:scale-y-100 motion-reduce:group-focus-visible:scale-y-100 motion-reduce:group-active:scale-y-100",
          )}
          style={{
            background:
              "linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.25))",
          }}
        />
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute bottom-[8%] left-1/2 h-[28%] w-[calc(100%-1.25em)] -translate-x-1/2 rounded-[0.75em] opacity-70 blur-[2px]",
            "transition-opacity duration-[320ms] [transition-timing-function:var(--aqua-ease)]",
            "group-hover:opacity-90",
            "group-focus-visible:opacity-90",
            "group-active:opacity-40 group-active:duration-[140ms]",
            "motion-reduce:transition-none",
          )}
          style={{
            background:
              "linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.5))",
          }}
        />
        <span
          className={cn(
            "relative z-[1] tracking-[0.005em]",
            "transition-transform duration-[320ms] [transition-timing-function:var(--aqua-ease)]",
            "group-active:translate-y-[0.5px] group-active:duration-[140ms]",
            "motion-reduce:transition-none motion-reduce:group-active:translate-y-0",
          )}
          style={{
            textShadow: isPrimary
              ? "0 1px 0 rgba(255, 255, 255, 0.35)"
              : "0 1px 0 rgba(255, 255, 255, 0.7)",
          }}
        >
          {children}
        </span>
      </button>
    );
  },
);

AquaButton.displayName = "AquaButton";

export default AquaButton;
