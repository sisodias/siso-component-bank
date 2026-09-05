"use client";

import { motion, MotionConfig, useReducedMotion } from "motion/react";
import {
  createContext,
  useContext,
  useId,
  useState,
  type ReactNode,
} from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* -------------------------------------------------------------------------- */
/* Shared motion tokens                                                       */
/* -------------------------------------------------------------------------- */

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

/** CSS string form of EASE_OUT for inline style transitions. */
export const EASE_OUT_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

/** Press feedback on buttons and other tappable surfaces. */
export const SPRING_PRESS = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 0.6,
} as const;

/** Content swaps — label/icon slots trading places inside a control. */
export const SPRING_SWAP = {
  type: "spring",
  stiffness: 460,
  damping: 30,
  mass: 0.55,
} as const;

/** Overlay panel entrances — modals and sheets summoned by pointer. */
export const SPRING_PANEL = {
  type: "spring",
  stiffness: 420,
  damping: 40,
  mass: 0.5,
} as const;

/** Shared-layout glides — pills, indicators and panels morphing between positions. */
export const SPRING_LAYOUT = {
  type: "spring",
  stiffness: 360,
  damping: 32,
  mass: 0.6,
} as const;

/** Cursor-follow physics for decorative mouse tracking. */
export const SPRING_MOUSE = {
  stiffness: 200,
  damping: 15,
  mass: 0.3,
} as const;

/* -------------------------------------------------------------------------- */
/* Utils                                                                      */
/* -------------------------------------------------------------------------- */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* -------------------------------------------------------------------------- */
/* Radio Group                                                                */
/* -------------------------------------------------------------------------- */

type RadioCtxValue = {
  value: string;
  setValue: (value: string) => void;
  layoutId: string;
};

const RadioCtx = createContext<RadioCtxValue | null>(null);

function useRadioGroup() {
  const ctx = useContext(RadioCtx);

  if (!ctx) {
    throw new Error("RadioGroupItem must be used inside <RadioGroup>");
  }

  return ctx;
}

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
  orientation?: "vertical" | "horizontal";
}

export function RadioGroup({
  value,
  defaultValue = "",
  onValueChange,
  children,
  className,
  orientation = "vertical",
}: RadioGroupProps) {
  const [internal, setInternal] = useState(defaultValue);
  const layoutId = useId();
  const reduce = useReducedMotion();

  const controlled = value !== undefined;
  const current = controlled ? value : internal;

  const setValue = (next: string) => {
    if (!controlled) setInternal(next);
    onValueChange?.(next);
  };

  return (
    <MotionConfig transition={reduce ? { duration: 0 } : SPRING_LAYOUT}>
      <RadioCtx.Provider value={{ value: current, setValue, layoutId }}>
        <div
          role="radiogroup"
          className={cn(
            "flex gap-3",
            orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
            className,
          )}
        >
          {children}
        </div>
      </RadioCtx.Provider>
    </MotionConfig>
  );
}

export interface RadioGroupItemProps {
  value: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function RadioGroupItem({
  value,
  label,
  disabled,
  className,
  id: idProp,
}: RadioGroupItemProps) {
  const { value: groupValue, setValue, layoutId } = useRadioGroup();
  const autoId = useId();
  const id = idProp ?? autoId;
  const reduce = useReducedMotion();
  const selected = groupValue === value;

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <motion.button
        id={id}
        type="button"
        role="radio"
        aria-checked={selected}
        disabled={disabled}
        onClick={() => !disabled && setValue(value)}
        whileTap={reduce || disabled ? undefined : { scale: 0.92 }}
        transition={SPRING_PRESS}
        data-state={selected ? "checked" : "unchecked"}
        className={cn(
          "relative inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 outline-none transition-colors duration-200",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-60",
          selected
            ? "border-primary"
            : "border-muted-foreground/50 hover:border-muted-foreground",
        )}
      >
        {selected ? (
          <motion.span
            layoutId={layoutId}
            className="absolute inset-1 rounded-full bg-primary"
            transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
          />
        ) : null}
      </motion.button>

      {label ? (
        <label
          htmlFor={id}
          onClick={() => !disabled && setValue(value)}
          className={cn(
            "text-sm text-foreground",
            disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
          )}
        >
          {label}
        </label>
      ) : null}
    </span>
  );
}