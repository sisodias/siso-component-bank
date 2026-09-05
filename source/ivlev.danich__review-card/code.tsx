import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================================================
// AVATAR (inline dependency)
// ============================================================================

interface AvatarProps {
  src?: string | null
  fallback?: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const avatarSizes = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
}

function Avatar({ src, fallback = "?", size = "md", className }: AvatarProps) {
  const [hasError, setHasError] = React.useState(false)

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-xl",
        "bg-gradient-to-br from-violet-500 to-purple-600",
        "font-medium text-white select-none",
        avatarSizes[size],
        className
      )}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt=""
          onError={() => setHasError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{fallback.slice(0, 2).toUpperCase()}</span>
      )}
    </div>
  )
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
// CARD (inline dependency)
// ============================================================================

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-200 bg-white shadow-sm",
        "dark:border-zinc-800 dark:bg-zinc-950",
        className
      )}
    >
      {children}
    </div>
  )
}

// ============================================================================
// REVIEW CARD
// ============================================================================

export interface Review {
  /** Author name */
  author: string
  /** Author position/title */
  position?: string
  /** Author company */
  company?: string
  /** Review text content */
  text: string
  /** Rating (1-5) */
  rating?: number
  /** Author avatar URL */
  avatar?: string
  /** Review date (ISO string or Date) */
  date?: string | Date
}

export interface ReviewCardProps {
  /** Review data */
  review: Review
  /** Additional CSS classes */
  className?: string
}

const QuoteIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
  </svg>
)

function formatDate(date: string | Date, locale = "ru-RU"): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

/**
 * ReviewCard - Testimonial/review card with author info and rating
 *
 * @example
 * ```tsx
 * <ReviewCard
 *   review={{
 *     author: "John Doe",
 *     position: "CTO",
 *     company: "Tech Corp",
 *     text: "Great product!",
 *     rating: 5,
 *     date: "2024-01-15"
 *   }}
 * />
 * ```
 */
export function ReviewCard({ review, className }: ReviewCardProps) {
  const authorInitials = getInitials(review.author)

  return (
    <Card className={cn("w-full max-w-lg", className)}>
      <div className="flex flex-col gap-4 p-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Avatar src={review.avatar} fallback={authorInitials} size="lg" />
          <div className="flex flex-col flex-1 min-w-0">
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">
              {review.author}
            </h4>
            {review.position && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {review.position}
              </p>
            )}
            {review.company && (
              <p className="text-sm text-zinc-500">{review.company}</p>
            )}
          </div>
          {review.rating && <StarRating value={review.rating} size="sm" />}
        </div>

        {/* Quote */}
        <blockquote className="relative pl-6">
          <QuoteIcon className="absolute -top-1 left-0 w-5 h-5 text-blue-200 dark:text-blue-900" />
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {review.text}
          </p>
        </blockquote>

        {/* Date */}
        {review.date && (
          <time className="text-sm text-zinc-400 text-right">
            {formatDate(review.date)}
          </time>
        )}
      </div>
    </Card>
  )
}
