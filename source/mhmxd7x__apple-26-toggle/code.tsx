"use client"

import { cn } from "@/lib/utils"

interface ToggleProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
  disabled?: boolean
}

export function Toggle({
  checked = false,
  onCheckedChange,
  className,
  disabled = false,
}: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "relative inline-block h-7 w-16 rounded-full transition-colors duration-300 outline-none",
        "focus-visible:ring-2 focus-visible:ring-[#4cd964] focus-visible:ring-offset-2",
        checked ? "bg-[#4cd964]" : "bg-[#d1d1d6]",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <div
        className={cn(
          "absolute top-0.5 left-0.5 h-6 w-9 rounded-full bg-white shadow-sm",
          "transition-transform duration-300 ease-in-out",
          checked && "translate-x-6"
        )}
        style={{ filter: "url(#goo-toggle)" }}
      >
        <div
          className={cn(
            "absolute -top-px left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-white",
            "transition-transform duration-400 ease-[cubic-bezier(.34,1.4,.64,1)]",
            checked ? "scale-100" : "scale-0"
          )}
        />
      </div>
    </button>
  )
}

export function Filter() {
  return (
    <svg className="absolute h-0 w-0 overflow-hidden">
      <defs>
        <filter id="goo-toggle" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  )
}
