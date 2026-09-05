import * as React from "react"
import { cn } from "@/lib/utils"

export interface HeroWaterfrontProps {
  headline: string
  subheadline?: string
  badge?: string
  primaryCta?: { label: string; href?: string; onClick?: () => void }
  secondaryCta?: { label: string; href?: string; onClick?: () => void }
  imageSrc?: string
  className?: string
}

export default function HeroWaterfront({
  headline,
  subheadline,
  badge,
  primaryCta,
  secondaryCta,
  imageSrc,
  className,
}: HeroWaterfrontProps) {
  return (
    <section
      className={cn(
        "relative min-h-screen overflow-hidden",
        className
      )}
    >
      {/* Background */}
      {imageSrc ? (
        <>
          <img
            src={imageSrc}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: "saturate(0.9) hue-rotate(5deg)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0C4A6E]/50 via-[#0C4A6E]/40 to-[#0C4A6E]/80" />
        </>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, #155E75 0%, #0C4A6E 50%, #083344 100%)",
          }}
        />
      )}

      {/* Wave pattern at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z" fill="white" fillOpacity="0.05" />
        </svg>
      </div>

      <div className="relative flex min-h-screen items-center">
        <div className="mx-auto max-w-5xl px-6 py-32 lg:px-12">
          {badge && (
            <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#7DD3FC]/30 bg-[#7DD3FC]/10 px-4 py-1.5 text-xs font-medium text-[#7DD3FC]">
              {badge}
            </span>
          )}

          <h1
            className="mb-6 max-w-2xl text-balance text-5xl font-light leading-[1.15] text-white md:text-6xl lg:text-7xl"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {headline}
          </h1>

          {subheadline && (
            <p className="mb-12 max-w-lg text-lg font-light leading-relaxed text-[#BAE6FD]">
              {subheadline}
            </p>
          )}

          {(primaryCta || secondaryCta) && (
            <div className="flex flex-wrap items-center gap-4">
              {primaryCta && (
                <a
                  href={primaryCta.href ?? "#"}
                  onClick={primaryCta.onClick}
                  className="inline-flex h-13 items-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#0C4A6E] transition-colors hover:bg-[#E0F2FE]"
                >
                  {primaryCta.label}
                </a>
              )}
              {secondaryCta && (
                <a
                  href={secondaryCta.href ?? "#"}
                  onClick={secondaryCta.onClick}
                  className="inline-flex h-13 items-center rounded-full border border-white/30 px-8 py-3.5 text-sm font-medium text-white/80 transition-colors hover:border-white/60 hover:text-white"
                >
                  {secondaryCta.label}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
