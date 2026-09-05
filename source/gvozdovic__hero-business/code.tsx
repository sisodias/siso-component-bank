import * as React from "react"
import { cn } from "@/lib/utils"

export interface HeroBusinessProps {
  headline: string
  subheadline?: string
  badge?: string
  specs?: Array<{ label: string; value: string }>
  primaryCta?: { label: string; href?: string; onClick?: () => void }
  secondaryCta?: { label: string; href?: string; onClick?: () => void }
  imageSrc?: string
  className?: string
}

export default function HeroBusiness({
  headline,
  subheadline,
  badge,
  specs,
  primaryCta,
  secondaryCta,
  imageSrc,
  className,
}: HeroBusinessProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-white",
        className
      )}
    >
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left — navy panel */}
        <div className="relative flex flex-col justify-center bg-[#1E3A5F] px-8 py-24 lg:px-16">
          <div className="absolute top-0 left-0 h-1 w-full bg-[#1E3A5F]/80" />

          {badge && (
            <span className="mb-8 text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
              {badge}
            </span>
          )}

          <h1
            className="mb-6 text-balance text-4xl font-bold leading-tight text-white md:text-5xl"
            style={{ fontFamily: "'Inter', system-ui, sans-serif", fontFeatureSettings: "'tnum'" }}
          >
            {headline}
          </h1>

          {subheadline && (
            <p className="mb-10 text-base leading-relaxed text-white/60">
              {subheadline}
            </p>
          )}

          {specs && specs.length > 0 && (
            <dl className="mb-10 divide-y divide-white/10 border-t border-white/10">
              {specs.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <dt className="text-xs uppercase tracking-wider text-white/40">{s.label}</dt>
                  <dd className="font-mono text-sm font-semibold tabular-nums text-white">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {(primaryCta || secondaryCta) && (
            <div className="flex flex-wrap gap-3">
              {primaryCta && (
                <a
                  href={primaryCta.href ?? "#"}
                  onClick={primaryCta.onClick}
                  className="inline-flex h-11 items-center bg-white px-6 text-sm font-semibold text-[#1E3A5F] transition-colors hover:bg-[#EFF6FF]"
                >
                  {primaryCta.label}
                </a>
              )}
              {secondaryCta && (
                <a
                  href={secondaryCta.href ?? "#"}
                  onClick={secondaryCta.onClick}
                  className="inline-flex h-11 items-center border border-white/20 px-6 text-sm font-semibold text-white/70 transition-colors hover:border-white/50 hover:text-white"
                >
                  {secondaryCta.label}
                </a>
              )}
            </div>
          )}
        </div>

        {/* Right — image or grid pattern */}
        <div className="relative min-h-[400px] lg:min-h-0">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0 bg-[#F1F5F9]"
              style={{
                backgroundImage: "linear-gradient(#CBD5E1 1px, transparent 1px), linear-gradient(90deg, #CBD5E1 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#1E3A5F]/10" />
        </div>
      </div>
    </section>
  )
}
