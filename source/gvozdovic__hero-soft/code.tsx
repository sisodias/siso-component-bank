import * as React from "react"
import { cn } from "@/lib/utils"

export interface HeroSoftProps {
  headline: string
  subheadline?: string
  badge?: string
  trustItems?: string[]
  primaryCta?: { label: string; href?: string; onClick?: () => void }
  secondaryCta?: { label: string; href?: string; onClick?: () => void }
  imageSrc?: string
  className?: string
}

export default function HeroSoft({
  headline,
  subheadline,
  badge,
  trustItems,
  primaryCta,
  secondaryCta,
  imageSrc,
  className,
}: HeroSoftProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-white py-24 md:py-32",
        className
      )}
    >
      {/* Sky-blue tint blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#EFF6FF] blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-8">
        {badge && (
          <span className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-[#EFF6FF] px-4 py-1.5 text-xs font-semibold text-[#2563EB]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
            {badge}
          </span>
        )}

        <h1
          className="mx-auto mb-6 max-w-3xl text-balance text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl"
          style={{ fontFamily: "'Mulish', system-ui, sans-serif" }}
        >
          {headline}
        </h1>

        {subheadline && (
          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-gray-500">
            {subheadline}
          </p>
        )}

        {(primaryCta || secondaryCta) && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {primaryCta && (
              <a
                href={primaryCta.href ?? "#"}
                onClick={primaryCta.onClick}
                className="inline-flex h-12 items-center rounded-2xl bg-[#2563EB] px-7 text-sm font-semibold text-white shadow-lg shadow-[#2563EB]/20 transition-colors hover:bg-[#1D4ED8]"
              >
                {primaryCta.label}
              </a>
            )}
            {secondaryCta && (
              <a
                href={secondaryCta.href ?? "#"}
                onClick={secondaryCta.onClick}
                className="inline-flex h-12 items-center rounded-2xl border-2 border-gray-200 bg-white px-7 text-sm font-semibold text-gray-700 transition-colors hover:border-[#2563EB]/30 hover:text-[#2563EB]"
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
        )}

        {trustItems && trustItems.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            {trustItems.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5 text-sm text-gray-400">
                <svg className="h-4 w-4 text-[#2563EB]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {item}
              </span>
            ))}
          </div>
        )}

        {imageSrc && (
          <div className="mx-auto mt-16 max-w-4xl overflow-hidden rounded-3xl border border-gray-100 shadow-2xl">
            <img src={imageSrc} alt="" className="w-full object-cover" />
          </div>
        )}
      </div>
    </section>
  )
}
