"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const radioGroupVariants = cva("", {
  variants: {
    font: { normal: "", retro: "retro" },
  },
  defaultVariants: { font: "retro" },
});

type RadioGroupContextValue = {
  value: string;
  setValue: (next: string) => void;
  name?: string;
};
const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);
const useRadioGroup = () => {
  const ctx = React.useContext(RadioGroupContext);
  if (!ctx) throw new Error("RadioGroupItem must be used inside <RadioGroup>");
  return ctx;
};

type RadioGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
};

function RadioGroup({
  className,
  value,
  defaultValue,
  onValueChange,
  name,
  children,
  ...props
}: RadioGroupProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<string>(defaultValue ?? "");
  const current = isControlled ? value! : internal;
  const setValue = React.useCallback(
    (next: string) => {
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );
  return (
    <RadioGroupContext.Provider value={{ value: current, setValue, name }}>
      <div
        role="radiogroup"
        data-slot="radio-group"
        className={cn("grid gap-2", className)}
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

type RadioGroupItemProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> & {
  value: string;
};

const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  ({ className, value, onClick, disabled, ...props }, ref) => {
    const { value: current, setValue } = useRadioGroup();
    const checked = current === value;
    const state = checked ? "checked" : "unchecked";
    return (
      <div className={cn("relative", className)}>
        <button
          ref={ref}
          type="button"
          role="radio"
          aria-checked={checked}
          data-state={state}
          data-slot="radio-group-item"
          disabled={disabled}
          onClick={(e) => {
            if (disabled) return;
            setValue(value);
            onClick?.(e);
          }}
          className={cn(
            "flex items-center justify-center rounded-none border-none py-3 peer border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 size-4 shrink-0 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
            "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary",
          )}
          {...props}
        >
          {checked ? (
            <svg
              viewBox="0 0 256 256"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              strokeWidth="0"
              className="w-2.5"
              aria-label="square"
            >
              <rect x="30" y="35" width="200" height="200" rx="0" />
              <rect x="80" y="5" width="100" height="200" rx="0" />
              <rect x="0" y="85" width="100" height="100" rx="0" />
              <rect x="80" y="65" width="100" height="200" rx="0" />
              <rect x="200" y="85" width="100" height="100" rx="0" />
            </svg>
          ) : null}
        </button>

        <div className="absolute top-[0px] w-2.5 left-1.5 h-1 bg-foreground dark:bg-ring" />
        <div className="absolute top-[0px] w-2.5 right-1.5 h-1 bg-foreground dark:bg-ring" />
        <div className="absolute bottom-[0px] w-2.5 left-1.5 h-1 bg-foreground dark:bg-ring" />
        <div className="absolute bottom-[0px] w-2.5 right-1.5 h-1 bg-foreground dark:bg-ring" />
        <div className="absolute top-[4px] -left-1 w-1 h-[15px] bg-foreground dark:bg-ring" />
        <div className="absolute top-[4px] -right-1 w-1 h-[15px] bg-foreground dark:bg-ring" />
        <div className="absolute top-[2px] -right-0.5 w-1 h-1 bg-foreground dark:bg-ring" />
        <div className="absolute top-[2px] -left-0.5 w-1 h-1 bg-foreground dark:bg-ring" />
        <div className="absolute bottom-[2px] -right-0.5 w-1 h-1 bg-foreground dark:bg-ring" />
        <div className="absolute bottom-[2px] -left-0.5 w-1 h-1 bg-foreground dark:bg-ring" />
      </div>
    );
  },
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };

export default RadioGroup;
