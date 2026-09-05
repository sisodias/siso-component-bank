"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

interface ColorSwatchProps {
  color: string
  index: number
  totalColors: number
}

export function ColorSwatch({ color, index, totalColors }: ColorSwatchProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(color.toUpperCase())
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 1500)
  }

  const isLightColor = (hex: string) => {
    const r = Number.parseInt(hex.slice(1, 3), 16)
    const g = Number.parseInt(hex.slice(3, 5), 16)
    const b = Number.parseInt(hex.slice(5, 7), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5
  }

  const textColor = isLightColor(color) ? "text-zinc-900" : "text-white"
  const iconBgColor = isLightColor(color) ? "bg-zinc-900/10" : "bg-white/10"

  return (
    <button
      onClick={handleCopy}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative h-40 rounded-full transition-all duration-500 ease-out cursor-pointer",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
        isHovered ? "w-28 z-20 scale-105" : "w-16",
      )}
      style={{
        backgroundColor: color,
        marginLeft: index === 0 ? 0 : "-12px",
        zIndex: isHovered ? 20 : totalColors - index,
        boxShadow: isHovered
          ? "0 20px 40px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)"
          : "0 4px 12px -4px rgba(0, 0, 0, 0.3)",
      }}
      aria-label={`Copy ${color} to clipboard`}
    >
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center gap-3 transition-all duration-300",
          isHovered ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        {/* Hex code with refined typography */}
        <span
          className={cn(
            "text-[11px] font-mono font-semibold tracking-widest uppercase transition-all duration-500 ease-out",
            textColor,
            isHovered ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
          )}
          style={{ transitionDelay: isHovered ? "100ms" : "0ms" }}
        >
          {color.toUpperCase()}
        </span>

        {/* Copy icon with subtle background */}
        <div
          className={cn(
            "p-2 rounded-full backdrop-blur-sm transition-all duration-500 ease-out",
            iconBgColor,
            textColor,
            isHovered ? "translate-y-0 opacity-100 scale-100" : "translate-y-2 opacity-0 scale-90",
          )}
          style={{ transitionDelay: isHovered ? "150ms" : "0ms" }}
        >
          <div className="relative w-3.5 h-3.5">
            <Copy
              className={cn(
                "w-3.5 h-3.5 absolute inset-0 transition-all duration-300",
                isCopied ? "opacity-0 scale-75 rotate-12" : "opacity-100 scale-100 rotate-0",
              )}
            />
            <Check
              className={cn(
                "w-3.5 h-3.5 absolute inset-0 transition-all duration-300",
                isCopied ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-75 -rotate-12",
              )}
            />
          </div>
        </div>

        {/* Subtle hint text */}
        <span
          className={cn(
            "text-[9px] font-medium uppercase tracking-wider transition-all duration-500 ease-out",
            isLightColor(color) ? "text-black/80" : "text-white/60",
            isHovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          )}
          style={{ transitionDelay: isHovered ? "200ms" : "0ms" }}
        >
          {isCopied ? "Copied!" : "Click to copy"}
        </span>
      </div>
    </button>
  )
}
