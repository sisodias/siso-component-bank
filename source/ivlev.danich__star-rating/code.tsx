import { useState, KeyboardEvent } from "react"
import { cn } from "@/lib/utils"

export interface StarRatingProps {
  /** Current rating value */
  value?: number
  /** Maximum number of stars */
  max?: number
  /** Size variant */
  size?: "sm" | "md" | "lg"
  /** Color of filled stars */
  color?: string
  /** Color of empty stars */
  emptyColor?: string
  /** Whether the rating is read-only */
  readOnly?: boolean
  /** Callback when rating changes */
  onChange?: (value: number) => void
  /** Additional CSS classes */
  className?: string
  /** Accessible label for the rating */
  "aria-label"?: string
}

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
} as const

export function StarRating({
  value = 0,
  max = 5,
  size = "md",
  color = "#FBBF24",
  emptyColor = "#E5E7EB",
  readOnly = true,
  onChange,
  className,
  "aria-label": ariaLabel,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)
  const displayValue = hoverValue ?? value

  const handleClick = (index: number) => {
    if (!readOnly && onChange) {
      onChange(index + 1)
    }
  }

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    if (readOnly) return

    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault()
      const newValue = Math.min(value + 1, max)
      onChange?.(newValue)
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault()
      const newValue = Math.max(value - 1, 0)
      onChange?.(newValue)
    }
  }

  return (
    <div
      role={readOnly ? "img" : "radiogroup"}
      aria-label={ariaLabel || `Rating: ${value} out of ${max} stars`}
      className={cn("inline-flex items-center gap-0.5", className)}
    >
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1
        const filled = index < displayValue

        return (
          <button
            key={index}
            type="button"
            role={readOnly ? "presentation" : "radio"}
            aria-checked={!readOnly ? starValue === value : undefined}
            aria-label={!readOnly ? `${starValue} star${starValue > 1 ? "s" : ""}` : undefined}
            disabled={readOnly}
            tabIndex={readOnly ? -1 : starValue === value ? 0 : -1}
            onClick={() => handleClick(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onMouseEnter={() => !readOnly && setHoverValue(starValue)}
            onMouseLeave={() => !readOnly && setHoverValue(null)}
            className={cn(
              sizeMap[size],
              "transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-amber-400 rounded-sm",
              !readOnly && "cursor-pointer hover:scale-110 active:scale-95",
              readOnly && "cursor-default"
            )}
          >
            <svg
              viewBox="0 0 24 24"
              fill={filled ? color : emptyColor}
              className="w-full h-full drop-shadow-sm"
              aria-hidden="true"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        )
      })}
    </div>
  )
}
