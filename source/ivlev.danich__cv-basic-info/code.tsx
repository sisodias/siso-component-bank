import { ReactNode } from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================================================
// BADGE (inline dependency)
// ============================================================================

interface BadgeProps {
  children: ReactNode
  variant?: "solid" | "flat"
  color?: "default" | "success" | "primary"
  size?: "sm" | "md" | "lg"
  startContent?: ReactNode
  className?: string
}

function Badge({
  children,
  variant = "solid",
  color = "default",
  size = "md",
  startContent,
  className,
}: BadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-sm",
  }

  const colorClasses = {
    solid: {
      default: "bg-zinc-900 text-white",
      success: "bg-green-600 text-white",
      primary: "bg-blue-600 text-white",
    },
    flat: {
      default: "bg-zinc-100 text-zinc-700",
      success: "bg-green-100 text-green-700",
      primary: "bg-blue-100 text-blue-700",
    },
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        sizeClasses[size],
        colorClasses[variant][color],
        className
      )}
    >
      {startContent}
      {children}
    </span>
  )
}

// ============================================================================
// CV BASIC INFO
// ============================================================================

export interface CVBasicInfoProps {
  /** First name */
  firstName?: string
  /** Middle name (patronymic) */
  middleName?: string
  /** Last name (surname) */
  lastName?: string
  /** Photo URL */
  photoUrl?: string
  /** Job position */
  position?: string
  /** Show approval badge */
  approved?: boolean
  /** Approval badge text */
  approvedText?: string
  /** Additional banner element */
  banner?: ReactNode
  /** Additional CSS classes */
  className?: string
}

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
)

/**
 * CVBasicInfo - Hero section with photo, name and position for CV
 *
 * @example
 * ```tsx
 * <CVBasicInfo
 *   firstName="Иван"
 *   middleName="Петрович"
 *   lastName="Иванов"
 *   photoUrl="/photo.jpg"
 *   position="Junior Developer"
 *   approved
 * />
 * ```
 */
export function CVBasicInfo({
  firstName,
  middleName,
  lastName,
  photoUrl,
  position = "Specialist",
  approved = false,
  approvedText = "Verified",
  banner,
  className,
}: CVBasicInfoProps) {
  const fullName = [firstName, middleName].filter(Boolean).join(" ")

  return (
    <div
      className={cn(
        "p-6 sm:p-8 bg-white border-2 border-zinc-200 rounded-[24px] sm:rounded-[32px]",
        "flex flex-col lg:flex-row justify-between items-start gap-6 sm:gap-8",
        "dark:bg-zinc-950 dark:border-zinc-800",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
        {/* Photo */}
        <div className="flex-shrink-0">
          <img
            src={photoUrl || "https://placehold.co/800x600?text=Photo"}
            alt={`${fullName} ${lastName || ""}`.trim()}
            className={cn(
              "w-32 h-32 sm:w-[188px] sm:h-[188px]",
              "rounded-2xl sm:rounded-[32px] object-cover",
              "bg-zinc-100 dark:bg-zinc-800"
            )}
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-3 sm:gap-4 text-center sm:text-left">
          <div className="flex flex-col gap-1">
            {fullName && (
              <h2 className="text-2xl sm:text-[32px] font-bold leading-tight text-zinc-900 dark:text-zinc-50">
                {fullName}
              </h2>
            )}
            {lastName && (
              <h2 className="text-2xl sm:text-[32px] font-bold leading-tight text-zinc-900 dark:text-zinc-50">
                {lastName}
              </h2>
            )}
            <p className="text-base font-medium text-zinc-600 dark:text-zinc-400 mt-1">
              {position}
            </p>
          </div>

          {approved && (
            <Badge
              color="success"
              variant="solid"
              size="lg"
              startContent={<CheckIcon className="w-4 h-4" />}
              className="self-center sm:self-start"
            >
              {approvedText}
            </Badge>
          )}
        </div>
      </div>

      {/* Optional Banner */}
      {banner && <div className="flex-shrink-0 w-full lg:w-auto">{banner}</div>}
    </div>
  )
}
