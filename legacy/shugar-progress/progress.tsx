import React from "react";

type TProgressType = "default" | "success" | "warning" | "error" | "secondary";

interface ProgressProps {
  value: number;
  max?: number;
  colors?: { [key: string]: string; };
  type?: TProgressType;
}

const getColor = (value: number, type: TProgressType, colors?: any) => {
  if (colors) {
    const keys = Object.keys(colors);
    for (let i = keys.length - 1; i >= 0; i--) {
      if (value >= parseInt(keys[i])) {
        return colors[keys[i]];
      }
    }
  } else {
    switch (type) {
      case "default":
        return "var(--ds-gray-1000)";
      case "success":
        return "var(--ds-blue-700)";
      case "error":
        return "var(--ds-red-700)";
      case "warning":
        return "var(--ds-amber-700)";
      case "secondary":
        return "var(--ds-gray-700)";
    }
  }
};

export const Progress = ({ value, max = 100, colors, type = "default" }: ProgressProps) => {
  return (
    <progress
      value={value}
      max={max}
      className="text-gray-1000 appearance-none border-none [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-bar]:rounded-[5px] [&::-webkit-progress-value]:rounded-[5px] [&::-moz-progress-bar]:rounded-[5px] h-2.5 w-full [&::-webkit-progress-value]:transition-all [&::-moz-progress-bar]:transition-all"
      // @ts-ignore
      style={{ "--ds-progress-color": getColor(value, type, colors) }}
    />
  );
};