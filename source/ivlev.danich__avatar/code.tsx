import { useMemo, useState, useEffect} from "react"
import { cn } from "@/lib/utils"

export interface AvatarProps {
  src?: string | null
  alt?: string
  fallback?: string
  firstName?: string
  lastName?: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
} as const

function getInitials(firstName?: string, lastName?: string, fallback?: string): string {
  if (fallback) return fallback.slice(0, 2).toUpperCase()
  const first = firstName?.trim().charAt(0)?.toUpperCase() || ""
  const last = lastName?.trim().charAt(0)?.toUpperCase() || ""
  return first + last || "?"
}

export function Avatar({
  src,
  alt = "Avatar",
  fallback,
  firstName,
  lastName,
  size = "md",
  className,
}: AvatarProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(!!src)

  const initials = useMemo(
    () => getInitials(firstName, lastName, fallback),
    [firstName, lastName, fallback]
  )

  useEffect(() => {
    if (src) {
      setHasError(false)
      setIsLoading(true)
    }
  }, [src])

  const showFallback = !src || hasError

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-xl",
        "bg-gradient-to-br from-violet-500 to-purple-600",
        "font-medium text-white select-none",
        sizeMap[size],
        className
      )}
      role="img"
      aria-label={alt}
    >
      {!showFallback && (
        <img
          src={src!}
          alt={alt}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true)
            setIsLoading(false)
          }}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-200",
            isLoading ? "opacity-0" : "opacity-100"
          )}
        />
      )}
      {(showFallback || isLoading) && (
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            !showFallback && isLoading && "animate-pulse"
          )}
        >
          {initials}
        </span>
      )}
    </div>
  )
}
