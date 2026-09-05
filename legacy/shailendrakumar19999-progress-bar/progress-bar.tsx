"use client";

import { useEffect, useState } from "react";
import { Progress } from "@ark-ui/react/progress";

type ProgressWithLabelProps = {
  value: number;              
  label?: string;         
  delay?: number;         
  duration?: number;     
  colorFrom?: string;        
  colorTo?: string;         
  className?: string;
};

export function ProgressWithLabel({
  value,
  label,
  delay,
  duration,
  colorFrom,
  colorTo,
  className,
}: ProgressWithLabelProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <Progress.Root
      value={progress}
      className={`w-full max-w-md mx-auto space-y-3 p-4 rounded-2xl shadow-sm 
        bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {label && (
        <div className="flex justify-between items-center">
          <Progress.Label className="text-base font-semibold text-gray-800 dark:text-gray-200">
            {label}
          </Progress.Label>
        </div>
      )}

      <div className="relative w-full">
        <Progress.Track className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <Progress.Range
            className={`h-full bg-gradient-to-r ${colorFrom} ${colorTo} 
              transition-all ease-out rounded-full shadow-sm`}
            style={{ transitionDuration: `${duration}ms` }}
          />
        </Progress.Track>
        <Progress.ValueText className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white" />
      </div>
    </Progress.Root>
  );
}
