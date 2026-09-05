import * as React from "react"
import { cn } from "@/lib/utils"

export interface HeroPenthouseProps {
  headline: string
  subheadline?: string
  floor?: string
  primaryCta?: { label: string; href?: string; onClick?: () => void }
  secondaryCta?: { label: string; href?: string; onClick?: () => void }
  imageSrc?: string
  className?: string
}

export default function HeroPenthouse({
  headline,
  subheadline,
  floor,
  primaryCta,
  secondaryCta,
  imageSrc,
  className,
}: HeroPenthouseProps) {
  return (
    <section
      className={cn(
        "relative min-h-screen overflow-hidden bg-[#0A0A0A]",
        className
      )}
    >
      {imageSrc && (
        <>
          <img
            src={imageSrc}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 to-[#0A0A0A]" />
        </>
      )}

      {/* Gold horizontal rule — top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[#C9A84C]/30" />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-32 text-center">
        {floor && (
          <p className="mb-12 text-xs font-light uppercase tracking-[0.4em] text-[#C9A84C]/60">
            {floor}
          </p>
        )}

        <h1
          className="mb-8 max-w-2xl text-balance text-5xl font-light uppercase leading-none tracking-[0.15em] text-white md:text-7xl"
          style={{ fontFamily: "'Didact Gothic', system-ui, sans-serif" }}
        >
          {headline}
        </h1>

        {/* Gold rules flanking a diamond */}
        <div className="mb-8 flex items-center gap-4">
          <div className="h-px w-20 bg-[#C9A84C]/40" />
          <span className="text-[#C9A84C]">◆</span>
          <div className="h-px w-20 bg-[#C9A84C]/40" />
        </div>

        {subheadline && (
          <p className="mb-16 max-w-sm text-sm font-light leading-loose tracking-wide text-white/40">
            {subheadline}
          </p>
        )}

        {(primaryCta || secondaryCta) && (
          <div className="flex flex-wrap items-center justify-center gap-8">
            {primaryCta && (
              <a
                href={primaryCta.href ?? "#"}
                onClick={primaryCta.onClick}
                className="inline-flex items-center gap-3 border border-[#C9A84C]/50 px-10 py-4 text-xs font-light uppercase tracking-[0.3em] text-[#C9A84C] transition-colors hover:border-[#C9A84C] hover:bg-[#C9A84C]/5"
              >
                {primaryCta.label}
              </a>
            )}
            {secondaryCta && (
              <a
                href={secondaryCta.href ?? "#"}
                onClick={secondaryCta.onClick}
                className="text-xs font-light uppercase tracking-[0.3em] text-white/30 transition-colors hover:text-white/60"
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
        )}
      </div>

      {/* Gold horizontal rule — bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#C9A84C]/30" />
    </section>
  )
}
