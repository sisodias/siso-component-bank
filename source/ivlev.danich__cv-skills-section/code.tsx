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
  className?: string
}

const starSizes = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" }

function StarRating({ value = 0, max = 5, size = "md", className }: StarRatingProps) {
  return (
    <div className={cn("inline-flex items-center gap-0.5", className)}>
      {Array.from({ length: max }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          fill={i < value ? "#FBBF24" : "#E5E7EB"}
          className={starSizes[size]}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

// ============================================================================
// SKILL CARD (inline dependency)
// ============================================================================

interface SkillCardProps {
  name: string
  level: number
}

function SkillCard({ name, level }: SkillCardProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 p-4",
        "rounded-2xl border border-zinc-200 bg-white shadow-sm",
        "dark:border-zinc-800 dark:bg-zinc-950"
      )}
    >
      <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">
        {name}
      </span>
      <StarRating value={level} size="sm" />
    </div>
  )
}

// ============================================================================
// CV SKILLS SECTION
// ============================================================================

export interface Skill {
  /** Skill name */
  name: string
  /** Skill level (1-5) */
  level: number
}

export interface CVSkillsSectionProps {
  /** Array of skills */
  skills?: Skill[]
  /** Section title */
  title?: string
  /** Info tooltip text */
  infoText?: string
  /** Number of columns (2, 3, or 4) */
  columns?: 2 | 3 | 4
  /** Additional CSS classes */
  className?: string
}

const InfoIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  </svg>
)

const columnClasses = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
}

/**
 * CVSkillsSection - Skills section for CV with grid layout
 *
 * @example
 * ```tsx
 * <CVSkillsSection
 *   title="Technical Skills"
 *   skills={[
 *     { name: "React", level: 4 },
 *     { name: "TypeScript", level: 3 },
 *   ]}
 *   infoText="5 stars = expert level"
 * />
 * ```
 */
export function CVSkillsSection({
  skills = [],
  title = "Skills",
  infoText,
  columns = 3,
  className,
}: CVSkillsSectionProps) {
  return (
    <div className={cn("flex flex-col w-full items-start gap-6 sm:gap-8", className)}>
      <div
        className={cn(
          "flex flex-col items-start gap-6 sm:gap-8 p-6 sm:p-8 w-full",
          "bg-white rounded-[24px] sm:rounded-[32px] border-2 border-zinc-200",
          "dark:bg-zinc-950 dark:border-zinc-800"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-2 w-full">
          <h3 className="flex-1 font-bold text-xl sm:text-2xl leading-8 text-zinc-900 dark:text-zinc-50">
            {title}
          </h3>

          {infoText && (
            <div className="group relative inline-flex items-center p-1">
              <InfoIcon className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400 cursor-help" />
              <div
                className={cn(
                  "absolute right-0 top-full mt-2 z-10",
                  "invisible group-hover:visible opacity-0 group-hover:opacity-100",
                  "transition-all duration-200",
                  "px-3 py-2 text-sm text-white bg-zinc-900 rounded-lg shadow-lg",
                  "whitespace-nowrap max-w-xs",
                  "dark:bg-zinc-700"
                )}
              >
                {infoText}
              </div>
            </div>
          )}
        </div>

        {/* Skills Grid */}
        {skills.length > 0 ? (
          <div className={cn("grid grid-cols-1 gap-4 w-full", columnClasses[columns])}>
            {skills.map((skill, index) => (
              <SkillCard key={index} name={skill.name} level={skill.level} />
            ))}
          </div>
        ) : (
          <div className="w-full py-8 text-center text-zinc-400">
            No skills added yet
          </div>
        )}
      </div>
    </div>
  )
}
