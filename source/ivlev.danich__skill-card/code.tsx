import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================================================
// STAR RATING (inline dependency)
// ============================================================================

interface StarRatingProps {
  value?: number
  max?: number
  size?: "sm" | "md" | "lg"
  color?: string
  emptyColor?: string
  readOnly?: boolean
  onChange?: (value: number) => void
  className?: string
}

const starSizes = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" }

function StarRating({
  value = 0,
  max = 5,
  size = "md",
  color = "#FBBF24",
  emptyColor = "#E5E7EB",
  readOnly = true,
  onChange,
  className,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null)
  const displayValue = hoverValue ?? value

  return (
    <div className={cn("inline-flex items-center gap-0.5", className)}>
      {Array.from({ length: max }, (_, index) => (
        <button
          key={index}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange?.(index + 1)}
          onMouseEnter={() => !readOnly && setHoverValue(index + 1)}
          onMouseLeave={() => !readOnly && setHoverValue(null)}
          className={cn(
            starSizes[size],
            "transition-all duration-150",
            !readOnly && "cursor-pointer hover:scale-110 active:scale-95",
            readOnly && "cursor-default"
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill={index < displayValue ? color : emptyColor}
            className="w-full h-full"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  )
}

// ============================================================================
// CARD (inline dependency)
// ============================================================================

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all",
        "dark:border-zinc-800 dark:bg-zinc-950",
        className
      )}
    >
      {children}
    </div>
  )
}

// ============================================================================
// SKILL CARD
// ============================================================================

export interface SkillCardProps {
  /** Skill name */
  name: string
  /** Skill level (1-5) */
  level: number
  /** Maximum level */
  maxLevel?: number
  /** Whether the rating is read-only */
  readOnly?: boolean
  /** Callback when level changes */
  onChange?: (level: number) => void
  /** Star color */
  color?: string
  /** Additional CSS classes */
  className?: string
}

/**
 * SkillCard - Compact card displaying a skill with star rating
 *
 * @example
 * ```tsx
 * // Read-only
 * <SkillCard name="React" level={4} />
 *
 * // Interactive
 * <SkillCard
 *   name="TypeScript"
 *   level={level}
 *   readOnly={false}
 *   onChange={setLevel}
 * />
 * ```
 */
export function SkillCard({
  name,
  level,
  maxLevel = 5,
  readOnly = true,
  onChange,
  color,
  className,
}: SkillCardProps) {
  return (
    <Card className={cn("w-full", className)}>
      <div className="flex items-center justify-between gap-4 p-4">
        <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">
          {name}
        </span>
        <StarRating
          value={level}
          max={maxLevel}
          readOnly={readOnly}
          onChange={onChange}
          color={color}
          size="sm"
        />
      </div>
    </Card>
  )
}
