import * as React from "react"
import { cn } from "@/lib/utils"

export interface HeroNaturalProps {
  headline: string
  subheadline?: string
  badge?: string
  primaryCta?: { label: string; href?: string; onClick?: () => void }
  secondaryCta?: { label: string; href?: string; onClick?: () => void }
  imageSrc?: string
  className?: string
}

export default function HeroNatural({
  headline,
  subheadline,
  badge,
  primaryCta,
  secondaryCta,
  imageSrc,
  className,
}: HeroNaturalProps) {
  return (
    <section
      className={cn(
        "relative min-h-screen overflow-hidden",
        className
      )}
      style={{ background: "#F5F0E8" }}
    >
      {/* Organic noise texture overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* Green radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-20 h-[500px] w-[500px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #3D6B35 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-32 lg:px-12">
        <div className="grid lg:grid-cols-2 lg:items-center lg:gap-20">
          <div>
            {badge && (
              <span className="mb-8 inline-flex items-center gap-2 rounded-full bg-[#3D6B35]/10 px-4 py-2 text-xs font-semibold text-[#3D6B35]">
                🌿 {badge}
              </span>
            )}

            <h1
              className="mb-6 text-balance text-5xl font-bold leading-[1.1] text-[#2A2A2A] md:text-6xl"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              {headline}
            </h1>

            {subheadline && (
              <p className="mb-10 text-lg leading-relaxed text-[#5A5A5A]">
                {subheadline}
              </p>
            )}

            {(primaryCta || secondaryCta) && (
              <div className="flex flex-wrap items-center gap-4">
                {primaryCta && (
                  <a
                    href={primaryCta.href ?? "#"}
                    onClick={primaryCta.onClick}
                    className="inline-flex h-13 items-center rounded-full bg-[#3D6B35] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#3D6B35]/20 transition-colors hover:bg-[#2D5A27]"
                  >
                    {primaryCta.label}
                  </a>
                )}
                {secondaryCta && (
                  <a
                    href={secondaryCta.href ?? "#"}
                    onClick={secondaryCta.onClick}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#3D6B35] transition-opacity hover:opacity-70"
                  >
                    {secondaryCta.label} →
                  </a>
                )}
              </div>
            )}
          </div>

          {imageSrc ? (
            <div className="mt-12 lg:mt-0">
              <img
                src={imageSrc}
                alt=""
                className="h-[500px] w-full rounded-[32px] object-cover shadow-2xl"
              />
            </div>
          ) : (
            <div
              className="mt-12 hidden h-[500px] rounded-[32px] lg:mt-0 lg:block"
              style={{
                background: "linear-gradient(135deg, #3D6B35 0%, #2D5A27 50%, #C4A882 100%)",
              }}
            />
          )}
        </div>
      </div>
    </section>
  )
}
