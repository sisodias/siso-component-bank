"use client"

import { cn } from "../_utils/cn"

interface UniqueLoadingProps {
  variant?: "squares"
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export default function UniqueLoading({
  variant = "squares",
  size = "md",
  text = "Loading...",
  className,
}: UniqueLoadingProps) {
  const containerSizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  if (variant === "squares") {
    return (
      <div className={cn("relative", containerSizes[size], className)}>
        <div className="grid grid-cols-3 gap-1 w-full h-full">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="bg-black dark:bg-gray-200 animate-pulse"
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: "1.5s",
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  return null
}