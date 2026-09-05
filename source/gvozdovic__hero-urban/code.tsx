import * as React from "react"
import { cn } from "@/lib/utils"

export interface HeroUrbanProps {
  headline: string
  subheadline?: string
  badge?: string
  stat?: { value: string; label: string }
  primaryCta?: { label: string; href?: string; onClick?: () => void }
  secondaryCta?: { label: string; href?: string; onClick?: () => void }
  imageSrc?: string
  className?: string
}

export default function HeroUrban({
  headline,
  subheadline,
  badge,
  stat,
  primaryCta,
  secondaryCta,
  imageSrc,
  className,
}: HeroUrbanProps) {
  return (
    <section
      className={cn(
        "relative min-h-screen overflow-hidden bg-[#0F172A]",
        className
      )}
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 92%, 0 100%)" }}
    >
      {imageSrc && (
        <>
          <img
            src={imageSrc}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-[#0F172A]/70" />
        </>
      )}

      {/* Amber accent bar */}
      <div className="absolute left-0 top-0 h-1 w-1/3 bg-[#F59E0B]" />

      <div className="relative mx-auto max-w-7xl px-6 py-32 lg:px-12">
        <div className="grid lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-8">
            {badge && (
              <span className="mb-8 inline-flex items-center gap-2 bg-[#F59E0B]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#F59E0B]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                {badge}
              </span>
            )}

            <h1
              className="mb-6 text-balance text-6xl font-black uppercase leading-none tracking-tight text-white md:text-8xl lg:text-9xl"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
            >
              {headline}
            </h1>
          </div>

          {stat && (
            <div className="mb-4 lg:col-span-4 lg:text-right">
              <p className="text-6xl font-black text-[#F59E0B]">{stat.value}</p>
              <p className="mt-1 text-sm font-medium uppercase tracking-widest text-white/40">
                {stat.label}
              </p>
            </div>
          )}
        </div>

        {subheadline && (
          <p className="mb-12 max-w-xl border-l-2 border-[#F59E0B] pl-4 text-lg font-light text-white/60">
            {subheadline}
          </p>
        )}

        {(primaryCta || secondaryCta) && (
          <div className="flex flex-wrap items-center gap-4">
            {primaryCta && (
              <a
                href={primaryCta.href ?? "#"}
                onClick={primaryCta.onClick}
                className="inline-flex h-14 items-center bg-[#F59E0B] px-8 text-sm font-bold uppercase tracking-wider text-[#0F172A] transition-colors hover:bg-[#FBBF24]"
              >
                {primaryCta.label}
              </a>
            )}
            {secondaryCta && (
              <a
                href={secondaryCta.href ?? "#"}
                onClick={secondaryCta.onClick}
                className="inline-flex h-14 items-center border border-white/20 px-8 text-sm font-bold uppercase tracking-wider text-white/70 transition-colors hover:border-white/50 hover:text-white"
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
