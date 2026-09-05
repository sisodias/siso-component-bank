import { ReactNode } from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface CVHeaderProps {
  /** Header title */
  title?: string
  /** Header subtitle */
  subtitle?: string
  /** Logo element (image or component) */
  logo?: ReactNode
  /** Background color class */
  bgColor?: string
  /** Additional CSS classes */
  className?: string
}

/**
 * CVHeader - Professional header for CV/Resume pages
 *
 * @example
 * ```tsx
 * <CVHeader
 *   title="IT Camp для бизнеса"
 *   subtitle="Образовательная программа"
 *   logo={<Logo />}
 * />
 * ```
 */
export function CVHeader({
  title = "Professional CV",
  subtitle,
  logo,
  bgColor = "bg-blue-600",
  className,
}: CVHeaderProps) {
  return (
    <header
      className={cn(
        "w-full min-h-[88px] flex items-center justify-center py-4 px-6",
        bgColor,
        className
      )}
    >
      <div className="inline-flex items-center gap-4 flex-wrap justify-center">
        {logo && (
          <>
            <div className="h-12 sm:h-16 flex items-center justify-center">
              {logo}
            </div>
            <div
              className="hidden sm:block w-10 h-0.5 bg-white/80 rounded-full"
              aria-hidden="true"
            />
          </>
        )}
        <div className="text-center sm:text-left">
          <h1 className="text-white text-xl sm:text-2xl font-medium leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-white/80 text-sm sm:text-base mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  )
}
