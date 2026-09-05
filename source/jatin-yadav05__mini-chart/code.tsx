"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

const data = [
  { label: "Mon", value: 65 },
  { label: "Tue", value: 85 },
  { label: "Wed", value: 45 },
  { label: "Thu", value: 95 },
  { label: "Fri", value: 70 },
  { label: "Sat", value: 55 },
  { label: "Sun", value: 80 },
]

export function MiniChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [displayValue, setDisplayValue] = useState<number | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const maxValue = Math.max(...data.map((d) => d.value))

  useEffect(() => {
    if (hoveredIndex !== null) {
      setDisplayValue(data[hoveredIndex].value)
    }
  }, [hoveredIndex])

  const handleContainerEnter = () => setIsHovering(true)
  const handleContainerLeave = () => {
    setIsHovering(false)
    setHoveredIndex(null)
    setTimeout(() => {
      setDisplayValue(null)
    }, 150)
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleContainerEnter}
      onMouseLeave={handleContainerLeave}
      className="group relative w-72 p-6 rounded-2xl bg-foreground/[0.02] border border-foreground/[0.06] backdrop-blur-sm transition-all duration-500 hover:bg-foreground/[0.04] hover:border-foreground/[0.1] flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">Activity</span>
        </div>
        <div className="relative h-7 flex items-center">
          <span
            className={cn(
              "text-lg font-semibold tabular-nums transition-all duration-300 ease-out",
              isHovering && displayValue !== null ? "opacity-100 text-foreground" : "opacity-50 text-muted-foreground",
            )}
          >
            {displayValue !== null ? displayValue : ""}
            <span
              className={cn(
                "text-xs font-normal text-muted-foreground ml-0.5 transition-opacity duration-300",
                displayValue !== null ? "opacity-100" : "opacity-0",
              )}
            >
              %
            </span>
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end gap-2 h-24">
        {data.map((item, index) => {
          const heightPx = (item.value / maxValue) * 96
          const isHovered = hoveredIndex === index
          const isAnyHovered = hoveredIndex !== null
          const isNeighbor = hoveredIndex !== null && (index === hoveredIndex - 1 || index === hoveredIndex + 1)

          return (
            <div
              key={item.label}
              className="relative flex-1 flex flex-col items-center justify-end h-full"
              onMouseEnter={() => setHoveredIndex(index)}
            >
              {/* Bar */}
              <div
                className={cn(
                  "w-full rounded-full cursor-pointer transition-all duration-300 ease-out origin-bottom",
                  isHovered
                    ? "bg-foreground"
                    : isNeighbor
                      ? "bg-foreground/30"
                      : isAnyHovered
                        ? "bg-foreground/10"
                        : "bg-foreground/20 group-hover:bg-foreground/25",
                )}
                style={{
                  height: `${heightPx}px`,
                  transform: isHovered ? "scaleX(1.15) scaleY(1.02)" : isNeighbor ? "scaleX(1.05)" : "scaleX(1)",
                }}
              />

              {/* Label */}
              <span
                className={cn(
                  "text-[10px] font-medium mt-2 transition-all duration-300",
                  isHovered ? "text-foreground" : "text-muted-foreground/60",
                )}
              >
                {item.label.charAt(0)}
              </span>

              {/* Tooltip */}
              <div
                className={cn(
                  "absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-foreground text-background text-xs font-medium transition-all duration-200 whitespace-nowrap",
                  isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none",
                )}
              >
                {item.value}%
              </div>
            </div>
          )
        })}
      </div>

      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-foreground/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  )
}
