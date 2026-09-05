"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type SliderProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> & {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  name?: string;
};

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      value,
      defaultValue,
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      disabled,
      name,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState<number[]>(defaultValue ?? [min]);
    const current = isControlled ? value! : internal;
    const head = current[0] ?? min;
    const pct = Math.min(100, Math.max(0, ((head - min) / (max - min)) * 100));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = [Number(e.target.value)];
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    };

    return (
      <div ref={ref} className={cn("relative w-full", className)} {...props}>
        <div className="relative flex w-full touch-none select-none items-center">
          <div className="relative h-2 w-full grow overflow-hidden bg-secondary">
            <div className="absolute h-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={head}
            disabled={disabled}
            name={name}
            onChange={handleChange}
            aria-label="slider"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed disabled:pointer-events-none"
          />
          <div
            className="absolute block size-5 border-2 border-foreground dark:border-ring bg-foreground dark:bg-ring pointer-events-none"
            style={{ left: `calc(${pct}% - 10px)` }}
            aria-hidden="true"
          />
        </div>

        <div
          className="absolute inset-0 border-y-4 -my-1 border-foreground dark:border-ring pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 border-x-4 -mx-1 border-foreground dark:border-ring pointer-events-none"
          aria-hidden="true"
        />
      </div>
    );
  },
);
Slider.displayName = "Slider";

export { Slider };

export default Slider;
