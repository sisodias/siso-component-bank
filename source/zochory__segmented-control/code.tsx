// Custom SegmentedControl component
// Based on OpenAI Apps SDK UI design

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SegmentedControlProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  ariaLabel?: string;
}

export const Component = () => {
  const [selectedView, setSelectedView] = useState("all");

  const options = [
    { value: "all", label: "All" },
    { value: "failed", label: "Failed" },
    { value: "successful", label: "Successful" },
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8 min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">SegmentedControl Example</h1>
        <p className="text-secondary">Toggle through grouped options</p>
      </div>

      <SegmentedControl
        value={selectedView}
        onChange={setSelectedView}
        options={options}
        ariaLabel="Select view"
      />

      <div className="text-center">
        <p className="text-sm text-secondary">Selected value:</p>
        <p className="text-lg font-semibold mt-1">{selectedView}</p>
      </div>
    </div>
  );
};

const SegmentedControl = ({
  value,
  onChange,
  options,
  ariaLabel,
}: SegmentedControlProps) => {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex items-center bg-[#2a2a2a] rounded-full p-1"
    >
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-white/20",
            value === option.value
              ? "bg-[#3f3f3f] text-white shadow-sm"
              : "text-gray-400 hover:text-gray-200"
          )}
          aria-pressed={value === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};