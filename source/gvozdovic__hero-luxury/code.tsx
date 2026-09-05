import * as React from "react"
import { cn } from "@/lib/utils"

export interface HeroLuxuryProps {
  headline: string
  subheadline?: string
  badge?: string
  primaryCta?: { label: string; href?: string; onClick?: () => void }
  secondaryCta?: { label: string; href?: string; onClick?: () => void }
  imageSrc?: string
  className?: string
}

export default function HeroLuxury({
  headline,
  subheadline,
  badge,
  primaryCta,
  secondaryCta,
  imageSrc,
  className,
}: HeroLuxuryProps) {
  return (
    <section
      className={cn(
        "relative min-h-screen overflow-hidden bg-[#1C1C1E] text-white",
        className
      )}
    >
      {/* Background image with overlay */}
      {imageSrc && (
        <>
          <img
            src={imageSrc}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1C1C1E]/60 via-[#1C1C1E]/40 to-[#1C1C1E]" />
        </>
      )}

      {/* Subtle top border accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-32 lg:px-12">
        <div className="max-w-3xl">
          {badge && (
            <p className="mb-10 text-xs font-light uppercase tracking-[0.3em] text-white/40">
              {badge}
            </p>
          )}

          <h1
            className="mb-8 text-balance font-serif text-5xl font-light leading-[1.1] tracking-tight md:text-7xl lg:text-8xl"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {headline}
          </h1>

          {/* Thin decorative rule */}
          <div className="mb-8 h-px w-16 bg-white/30" />

          {subheadline && (
            <p className="mb-12 max-w-lg text-base font-light leading-relaxed text-white/60">
              {subheadline}
            </p>
          )}

          {(primaryCta || secondaryCta) && (
            <div className="flex flex-wrap items-center gap-6">
              {primaryCta && (
                <a
                  href={primaryCta.href ?? "#"}
                  onClick={primaryCta.onClick}
                  className="inline-flex items-center gap-3 border border-white/30 px-8 py-3.5 text-xs font-light uppercase tracking-[0.2em] text-white transition-colors hover:border-white/70 hover:bg-white/5"
                >
                  {primaryCta.label}
                </a>
              )}
              {secondaryCta && (
                <a
                  href={secondaryCta.href ?? "#"}
                  onClick={secondaryCta.onClick}
                  className="inline-flex items-center gap-2 text-xs font-light uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white/70"
                >
                  {secondaryCta.label}
                  <span className="text-base">→</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
