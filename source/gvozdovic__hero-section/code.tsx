import * as React from "react"
import { cn } from "@/lib/utils"

export interface HeroSectionProps {
  badge?: string
  headline: string
  subheadline?: string
  primaryCta?: {
    label: string
    href?: string
    onClick?: () => void
  }
  secondaryCta?: {
    label: string
    href?: string
    onClick?: () => void
  }
  media?: React.ReactNode
  align?: "left" | "center"
  className?: string
}

export default function HeroSection({
  badge,
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
  media,
  align = "center",
  className,
}: HeroSectionProps) {
  const isCenter = align === "center"

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-background py-24 md:py-32",
        className
      )}
    >
      {/* Radial glow */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-40 h-[600px] w-[600px] rounded-full bg-primary/10 blur-3xl",
          isCenter ? "left-1/2 -translate-x-1/2" : "-left-20"
        )}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "flex flex-col gap-8",
            isCenter ? "items-center text-center" : "items-start text-left"
          )}
        >
          {/* Badge */}
          {badge && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
              {badge}
            </span>
          )}

          {/* Headline */}
          <h1
            className={cn(
              "max-w-3xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl",
              isCenter && "mx-auto"
            )}
          >
            {headline}
          </h1>

          {/* Subheadline */}
          {subheadline && (
            <p
              className={cn(
                "max-w-xl text-balance text-lg text-muted-foreground",
                isCenter && "mx-auto"
              )}
            >
              {subheadline}
            </p>
          )}

          {/* CTAs */}
          {(primaryCta || secondaryCta) && (
            <div className="flex flex-wrap items-center gap-3">
              {primaryCta && (
                <a
                  href={primaryCta.href ?? "#"}
                  onClick={primaryCta.onClick}
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm ring-1 ring-primary transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {primaryCta.label}
                </a>
              )}
              {secondaryCta && (
                <a
                  href={secondaryCta.href ?? "#"}
                  onClick={secondaryCta.onClick}
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {secondaryCta.label}
                  <svg
                    aria-hidden
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              )}
            </div>
          )}

          {/* Media */}
          {media && (
            <div
              className={cn(
                "mt-8 w-full",
                isCenter && "mx-auto max-w-4xl"
              )}
            >
              <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted/30 shadow-2xl ring-1 ring-black/5">
                {media}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
