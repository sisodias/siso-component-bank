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

export interface BlobOption {
  value: string;
  label: string;
  color?: string;
}

interface FluidBlobSelectProps {
  options: BlobOption[];
  label?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  blobSize?: number; // diameter in px
  spacing?: number;  // gap between blobs
}

export const FluidBlobSelect: React.FC<FluidBlobSelectProps> = ({
  options,
  label,
  placeholder = "Select...",
  onChange,
  defaultValue,
  blobSize = 80,
  spacing = 16,
}) => {
  const [selected, setSelected] = React.useState(defaultValue || "");

  const handleSelect = (value: string) => {
    setSelected(value);
    onChange?.(value);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      {/* Hidden shadcn Select for accessibility */}
      <Select defaultValue={defaultValue} onValueChange={handleSelect}>
        <SelectTrigger className="w-[1px] h-[1px] p-0 overflow-hidden">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent style={{ width: "1px", height: "1px", overflow: "hidden" }}>
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

      {/* Blob dropdown */}
      <div className="flex flex-wrap gap-4 justify-center">
        {options.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <div
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={cn(
                "flex items-center justify-center cursor-pointer rounded-full transition-transform duration-300 ease-out",
                "shadow-md hover:scale-110 hover:z-10",
                isSelected ? "ring-4 ring-blue-400" : "",
              )}
              style={{
                width: blobSize,
                height: blobSize,
                backgroundColor: opt.color || "#60a5fa",
                clipPath: "ellipse(50% 50% at 50% 50%)", // simple blob shape, can customize
                margin: spacing / 2,
              }}
            >
              <span className="text-white font-semibold select-none">{opt.label}</span>
            </div>
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
