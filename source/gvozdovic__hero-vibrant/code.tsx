import * as React from "react"
import { cn } from "@/lib/utils"

export interface HeroVibrantProps {
  headline: string
  subheadline?: string
  highlightWord?: string
  badge?: string
  primaryCta?: { label: string; href?: string; onClick?: () => void }
  secondaryCta?: { label: string; href?: string; onClick?: () => void }
  imageSrc?: string
  className?: string
}

function HighlightedHeadline({ text, word }: { text: string; word?: string }) {
  if (!word) return <>{text}</>
  const idx = text.indexOf(word)
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ color: "#F97316" }}>{word}</span>
      {text.slice(idx + word.length)}
    </>
  )
}

export default function HeroVibrant({
  headline,
  subheadline,
  highlightWord,
  badge,
  primaryCta,
  secondaryCta,
  imageSrc,
  className,
}: HeroVibrantProps) {

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-white py-24 md:py-32",
        className
      )}
    >
      {/* Purple blob top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#6D28D9]/10 blur-3xl"
      />
      {/* Coral blob bottom-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#F97316]/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            {badge && (
              <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#6D28D9]/10 px-4 py-1.5 text-xs font-bold text-[#6D28D9]">
                ✦ {badge}
              </span>
            )}

            <h1
              className="mb-5 text-balance text-5xl font-extrabold leading-tight text-gray-900 md:text-6xl"
              style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
            >
              <HighlightedHeadline text={headline} word={highlightWord} />
            </h1>

            {subheadline && (
              <p className="mb-10 text-lg leading-relaxed text-gray-500">
                {subheadline}
              </p>
            )}

            {(primaryCta || secondaryCta) && (
              <div className="flex flex-wrap items-center gap-3">
                {primaryCta && (
                  <a
                    href={primaryCta.href ?? "#"}
                    onClick={primaryCta.onClick}
                    className="inline-flex h-12 items-center rounded-full bg-[#F97316] px-7 text-sm font-bold text-white shadow-lg shadow-[#F97316]/30 transition-transform hover:scale-[1.02]"
                  >
                    {primaryCta.label}
                  </a>
                )}
                {secondaryCta && (
                  <a
                    href={secondaryCta.href ?? "#"}
                    onClick={secondaryCta.onClick}
                    className="inline-flex h-12 items-center rounded-full border-2 border-[#6D28D9] px-7 text-sm font-bold text-[#6D28D9] transition-colors hover:bg-[#6D28D9]/5"
                  >
                    {secondaryCta.label}
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="mt-12 lg:mt-0">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt=""
                className="w-full rounded-3xl object-cover shadow-2xl transition-transform hover:rotate-[-1deg]"
                style={{ aspectRatio: "4/3" }}
              />
            ) : (
              <div
                className="aspect-[4/3] w-full rounded-3xl shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #6D28D9 0%, #9333EA 50%, #F97316 100%)",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
