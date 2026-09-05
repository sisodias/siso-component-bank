"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type SwitchProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked, defaultChecked, onCheckedChange, disabled, ...props }, ref) => {
    const isControlled = checked !== undefined;
    const [internal, setInternal] = React.useState<boolean>(!!defaultChecked);
    const value = isControlled ? !!checked : internal;
    const state = value ? "checked" : "unchecked";

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={value}
        data-state={state}
        data-slot="switch"
        disabled={disabled}
        onClick={(e) => {
          if (disabled) return;
          if (!isControlled) setInternal(!value);
          onCheckedChange?.(!value);
          props.onClick?.(e);
        }}
        className={cn(
          "relative peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-4 w-8 shrink-0 items-center border border-transparent shadow-xs transition-all outline-none border-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        <span
          data-slot="switch-thumb"
          data-state={state}
          className={cn(
            "bg-primary data-[state=checked]:bg-primary-foreground dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground pointer-events-none block size-4 data-[state=checked]:border-l data-[state=unchecked]:border-r border-foreground dark:border-ring ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%)] data-[state=unchecked]:translate-x-0"
          )}
        />

        <span
          className="absolute inset-0 border-y-4 -my-1 border-foreground dark:border-ring pointer-events-none"
          aria-hidden="true"
        />

        <span
          className="absolute inset-0 border-x-4 -mx-1 border-foreground dark:border-ring pointer-events-none"
          aria-hidden="true"
        />
      </button>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };

export default Switch;
