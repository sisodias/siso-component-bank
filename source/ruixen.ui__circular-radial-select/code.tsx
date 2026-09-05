"use client";

import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface RadialOption {
  value: string;
  label: string;
  color?: string; // optional visual color
}

interface CircularRadialSelectProps {
  options: RadialOption[];
  label?: string;
  placeholder?: string;
  radius?: number; // radius of the circle
  knobSize?: number; // size of the draggable knob
  onChange?: (value: string) => void;
  defaultValue?: string;
  selectWidth?: string | number; // optional width of hidden select
}

export const CircularRadialSelect: React.FC<CircularRadialSelectProps> = ({
  options,
  label,
  placeholder = "Select...",
  radius = 120,
  knobSize = 24,
  onChange,
  defaultValue,
  selectWidth = "200px",
}) => {
  const [selected, setSelected] = React.useState(defaultValue || "");

  const angleStep = (2 * Math.PI) / options.length;

  const handleSelect = (value: string) => {
    setSelected(value);
    onChange?.(value);
  };

  return (
    <div className="flex flex-col items-center gap-4 relative w-full">
      {/* Hidden shadcn Select for accessibility */}
      <Select defaultValue={defaultValue} onValueChange={handleSelect}>
        <SelectTrigger className="w-[1px] h-[1px] p-0 overflow-hidden">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent style={{ width: selectWidth }}>
          <SelectGroup>
            {label && <span className="font-semibold">{label}</span>}
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Circular layout */}
      <div
        className="relative"
        style={{ width: radius * 2, height: radius * 2 }}
      >
        {options.map((opt, idx) => {
          const angle = idx * angleStep - Math.PI / 2; // start from top
          const x = radius + radius * Math.cos(angle) - knobSize / 2;
          const y = radius + radius * Math.sin(angle) - knobSize / 2;
          const isSelected = selected === opt.value;

          return (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              style={{
                left: x,
                top: y,
                width: knobSize,
                height: knobSize,
                backgroundColor: opt.color || (isSelected ? "#3b82f6" : "#e5e7eb"),
              }}
              className={cn(
                "absolute rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                isSelected && "ring-2 ring-blue-500"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {selected && (
        <p className="mt-2 text-center">
          Selected: <strong>{selected}</strong>
        </p>
      )}
    </div>
  );
};
