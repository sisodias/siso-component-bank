import * as React from "react"
import { cn } from "@/lib/utils"

export interface HeroBoutiqueProps {
  headline: string
  subheadline?: string
  badge?: string
  pullQuote?: string
  primaryCta?: { label: string; href?: string; onClick?: () => void }
  secondaryCta?: { label: string; href?: string; onClick?: () => void }
  imageSrc?: string
  className?: string
}

export default function HeroBoutique({
  headline,
  subheadline,
  badge,
  pullQuote,
  primaryCta,
  secondaryCta,
  imageSrc,
  className,
}: HeroBoutiqueProps) {
  return (
    <section
      className={cn(
        "relative min-h-screen overflow-hidden",
        className
      )}
      style={{ background: "#FFFBF0" }}
    >
      {/* Grain texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-32 lg:px-12">
        <div className="grid lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            {badge && (
              <p className="mb-10 text-xs font-semibold uppercase tracking-[0.25em] text-[#78350F]/60">
                — {badge}
              </p>
            )}

            <h1
              className="mb-6 text-balance text-5xl font-bold leading-[1.1] text-[#1A1008] md:text-6xl lg:text-7xl"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {headline}
            </h1>

            <div className="mb-6 h-px w-24 bg-[#78350F]/30" />

            {subheadline && (
              <p className="mb-10 max-w-md text-lg leading-relaxed text-[#5A4A3A]">
                {subheadline}
              </p>
            )}

            {(primaryCta || secondaryCta) && (
              <div className="flex flex-wrap items-center gap-6">
                {primaryCta && (
                  <a
                    href={primaryCta.href ?? "#"}
                    onClick={primaryCta.onClick}
                    className="inline-flex h-12 items-center bg-[#78350F] px-8 text-sm font-semibold text-[#FFFBF0] transition-colors hover:bg-[#6B2C0A]"
                  >
                    {primaryCta.label}
                  </a>
                )}
                {secondaryCta && (
                  <a
                    href={secondaryCta.href ?? "#"}
                    onClick={secondaryCta.onClick}
                    className="inline-flex items-center gap-2 border-b border-[#78350F]/40 pb-0.5 text-sm font-medium text-[#78350F] transition-colors hover:border-[#78350F]"
                  >
                    {secondaryCta.label}
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="mt-12 lg:col-span-5 lg:mt-0">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt=""
                className="h-[520px] w-full rounded-sm object-cover shadow-xl"
              />
            ) : (
              <div
                className="h-[520px] rounded-sm shadow-xl"
                style={{
                  background: "linear-gradient(160deg, #78350F 0%, #C4A882 60%, #FFFBF0 100%)",
                }}
              />
            )}
            {pullQuote && (
              <blockquote className="mt-8 border-l-2 border-[#78350F]/30 pl-4 text-sm italic leading-relaxed text-[#5A4A3A]">
                "{pullQuote}"
              </blockquote>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
