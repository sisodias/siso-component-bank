import * as React from "react"
import { cn } from "@/lib/utils"

export interface HeroHeritageProps {
  headline: string
  subheadline?: string
  badge?: string
  established?: string
  primaryCta?: { label: string; href?: string; onClick?: () => void }
  secondaryCta?: { label: string; href?: string; onClick?: () => void }
  imageSrc?: string
  className?: string
}

export default function HeroHeritage({
  headline,
  subheadline,
  badge,
  established,
  primaryCta,
  secondaryCta,
  imageSrc,
  className,
}: HeroHeritageProps) {
  return (
    <section
      className={cn(
        "relative min-h-screen overflow-hidden",
        className
      )}
      style={{ background: "#F9F4EE" }}
    >
      {imageSrc && (
        <>
          <img
            src={imageSrc}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: "sepia(0.3) saturate(0.8)" }}
          />
          <div className="absolute inset-0 bg-[#F9F4EE]/80" />
        </>
      )}

      <div className="relative mx-auto max-w-5xl px-6 py-32 lg:px-12">
        {/* Ornamental top */}
        <div className="mb-12 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#7C2D12]/20" />
          <span className="text-xs text-[#7C2D12]/40">·—·</span>
          <div className="h-px flex-1 bg-[#7C2D12]/20" />
        </div>

        {badge && (
          <p
            className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.3em] text-[#B45309]"
          >
            {badge}
          </p>
        )}

        <h1
          className="mb-6 text-center text-balance text-5xl font-bold leading-[1.15] text-[#1A0E08] md:text-6xl lg:text-7xl"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          {headline}
        </h1>

        {/* Ornamental divider under h1 */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="h-px w-16 bg-[#7C2D12]/30" />
          <span className="text-[#B45309] text-lg">✦</span>
          <div className="h-px w-16 bg-[#7C2D12]/30" />
        </div>

        {subheadline && (
          <p className="mx-auto mb-12 max-w-xl text-center text-lg leading-relaxed text-[#5A3C2A]">
            {subheadline}
          </p>
        )}

        {(primaryCta || secondaryCta) && (
          <div className="flex flex-wrap items-center justify-center gap-6">
            {primaryCta && (
              <a
                href={primaryCta.href ?? "#"}
                onClick={primaryCta.onClick}
                className="inline-flex items-center gap-2 border border-[#7C2D12] bg-[#7C2D12] px-8 py-3.5 text-sm font-semibold text-[#F9F4EE] transition-colors hover:bg-[#6B2410]"
              >
                {primaryCta.label}
              </a>
            )}
            {secondaryCta && (
              <a
                href={secondaryCta.href ?? "#"}
                onClick={secondaryCta.onClick}
                className="inline-flex items-center gap-2 border border-[#7C2D12]/30 px-8 py-3.5 text-sm font-semibold text-[#7C2D12] transition-colors hover:border-[#7C2D12]"
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
        )}

        {established && (
          <p className="mt-10 text-center text-xs uppercase tracking-[0.3em] text-[#7C2D12]/40">
            Est. {established}
          </p>
        )}

        {/* Ornamental bottom */}
        <div className="mt-12 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#7C2D12]/20" />
          <span className="text-xs text-[#7C2D12]/40">·—·</span>
          <div className="h-px flex-1 bg-[#7C2D12]/20" />
        </div>
      </div>
    </section>
  )
}
