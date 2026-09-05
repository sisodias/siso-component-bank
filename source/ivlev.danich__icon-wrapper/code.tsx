import { ComponentType, ReactNode } from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface IconProps {
  /** SVG component to render */
  component?: ComponentType<{ className?: string }>
  /** Inline SVG or any content as children */
  children?: ReactNode
  /** Fallback text/emoji when no icon provided */
  name?: string
  /** Size preset */
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  /** Container className */
  className?: string
  /** Icon element className */
  iconClassName?: string
}

const sizeMap = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
} as const

/**
 * Icon - Flexible wrapper for icons and SVGs
 *
 * @example
 * ```tsx
 * // With component
 * <Icon component={StarIcon} size="lg" />
 *
 * // With inline SVG
 * <Icon size="md">
 *   <svg viewBox="0 0 24 24">...</svg>
 * </Icon>
 *
 * // With emoji fallback
 * <Icon name="⭐" size="lg" />
 * ```
 */
export function Icon({
  component: Component,
  children,
  name,
  size = "md",
  className,
  iconClassName,
}: IconProps) {
  const sizeClass = sizeMap[size]

  // Render passed component
  if (Component) {
    return (
      <span
        className={cn("inline-flex items-center justify-center", className)}
        aria-hidden="true"
      >
        <Component className={cn(sizeClass, iconClassName)} />
      </span>
    )
  }

  // Render inline children (SVG)
  if (children) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center",
          sizeClass,
          className
        )}
        aria-hidden="true"
      >
        {children}
      </span>
    )
  }

  // Fallback to name/text/emoji
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        sizeClass,
        className
      )}
      aria-hidden="true"
    >
      <span className={cn("text-center", iconClassName)}>{name}</span>
    </span>
  )
}
