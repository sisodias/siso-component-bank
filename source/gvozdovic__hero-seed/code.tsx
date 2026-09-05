import * as React from "react"
import { cn } from "@/lib/utils"

// Seed design system tokens
const seed = {
  forestCanopy: "#1c3a13",
  limeSprout: "#d3fa99",
  warmParchment: "#fcfcf7",
  paleStone: "#eeeee9",
  softSage: "#c4c7c4",
} as const

const fontStack = "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif"
const monoStack = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace"

export interface HeroSeedProps {
  /** Lime Sprout announcement strip at the very top */
  announcementText?: string
  /** Nav brand mark (text or React node) */
  brand?: React.ReactNode
  /** Nav links */
  navLinks?: Array<{ label: string; href?: string }>
  /** Small pill badge above the headline — e.g. "Clinically Studied" */
  badge?: string
  /** Product code shown in mono outlined pill — e.g. "DS-01®" */
  productCode?: string
  /** 48px weight-300 display headline */
  headline: string
  /** Body copy below the headline */
  subheadline?: string
  /** Primary filled pill CTA */
  primaryCta?: { label: string; href?: string; onClick?: () => void }
  /** Ghost text link with arrow */
  secondaryCta?: { label: string; href?: string; onClick?: () => void }
  /** Right-side product / hero image */
  imageSrc?: string
  /** Alt text for the hero image */
  imageAlt?: string
  className?: string
}

export default function HeroSeed({
  announcementText,
  brand = "Seed●",
  navLinks = [
    { label: "Shop", href: "#" },
    { label: "Science", href: "#" },
    { label: "Learn", href: "#" },
  ],
  badge,
  productCode,
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
  imageSrc,
  imageAlt = "",
  className,
}: HeroSeedProps) {
  return (
    <div
      className={cn("flex min-h-screen flex-col", className)}
      style={{ background: seed.warmParchment, fontFamily: fontStack, color: seed.forestCanopy }}
    >
      {/* ── Announcement Bar ── */}
      {announcementText && (
        <div
          className="w-full py-1.5 text-center text-xs font-medium"
          style={{
            background: seed.limeSprout,
            color: seed.forestCanopy,
            fontFamily: fontStack,
            letterSpacing: "-0.3px",
            fontWeight: 500,
          }}
        >
          {announcementText}
        </div>
      )}

      {/* ── Floating Pill Nav ── */}
      <div className="px-6 pt-4 md:px-12">
        <nav
          className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-2"
          style={{
            background: seed.warmParchment,
            border: `1px solid ${seed.forestCanopy}`,
            borderRadius: 9999,
          }}
        >
          {/* Brand mark */}
          <span
            className="flex items-center gap-1 text-sm font-medium select-none"
            style={{ letterSpacing: "-0.3px", fontWeight: 500, color: seed.forestCanopy }}
          >
            {brand}
          </span>

          {/* Nav links */}
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href ?? "#"}
                className="text-sm transition-opacity hover:opacity-60"
                style={{ fontWeight: 400, letterSpacing: "-0.42px", color: seed.forestCanopy, textDecoration: "none" }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="hidden text-sm transition-opacity hover:opacity-60 md:inline"
              style={{ fontWeight: 400, letterSpacing: "-0.42px", color: seed.forestCanopy, textDecoration: "none" }}
            >
              Sign in
            </a>
            <a
              href="#"
              className="inline-flex items-center px-4 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
              style={{
                background: seed.forestCanopy,
                color: seed.warmParchment,
                borderRadius: 9999,
                fontWeight: 500,
                letterSpacing: "-0.3px",
                textDecoration: "none",
              }}
            >
              Get Started
            </a>
          </div>
        </nav>
      </div>

      {/* ── Hero Body ── */}
      <div className="mx-auto flex w-full max-w-[1200px] flex-1 items-center gap-0 px-6 py-16 md:gap-12 md:px-12 md:py-24 lg:py-32">
        {/* Left — editorial content */}
        <div className="flex flex-1 flex-col gap-6">
          {/* Badge */}
          {badge && (
            <span
              className="inline-flex w-fit items-center px-3 py-1.5 text-xs font-medium"
              style={{
                background: seed.limeSprout,
                color: seed.forestCanopy,
                borderRadius: 9999,
                fontWeight: 500,
                letterSpacing: "-0.3px",
              }}
            >
              {badge}
            </span>
          )}

          {/* Product code pill */}
          {productCode && (
            <span
              className="inline-flex w-fit items-center px-3 py-1"
              style={{
                border: `1px solid ${seed.forestCanopy}`,
                color: seed.forestCanopy,
                borderRadius: 9999,
                fontFamily: monoStack,
                fontSize: 11,
                letterSpacing: "0.015em",
                fontWeight: 300,
              }}
            >
              {productCode}
            </span>
          )}

          {/* Display headline — weight 300, -1.44px tracking */}
          <h1
            style={{
              fontSize: "clamp(2.5rem, 5vw, 3rem)",
              lineHeight: 1,
              fontWeight: 300,
              letterSpacing: "-1.44px",
              color: seed.forestCanopy,
              maxWidth: "22ch",
              margin: 0,
            }}
          >
            {headline}
          </h1>

          {/* Body copy */}
          {subheadline && (
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.4,
                fontWeight: 400,
                letterSpacing: "-0.4px",
                color: seed.forestCanopy,
                maxWidth: "40ch",
                opacity: 0.75,
                margin: 0,
              }}
            >
              {subheadline}
            </p>
          )}

          {/* CTAs */}
          {(primaryCta || secondaryCta) && (
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {primaryCta && (
                <a
                  href={primaryCta.href ?? "#"}
                  onClick={primaryCta.onClick}
                  className="inline-flex items-center transition-opacity hover:opacity-80"
                  style={{
                    background: seed.forestCanopy,
                    color: seed.warmParchment,
                    borderRadius: 9999,
                    padding: "7px 20px",
                    fontSize: 14,
                    fontWeight: 500,
                    letterSpacing: "-0.42px",
                    textDecoration: "none",
                  }}
                >
                  {primaryCta.label}
                </a>
              )}
              {secondaryCta && (
                <a
                  href={secondaryCta.href ?? "#"}
                  onClick={secondaryCta.onClick}
                  className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-60"
                  style={{
                    color: seed.forestCanopy,
                    fontSize: 14,
                    fontWeight: 400,
                    letterSpacing: "-0.42px",
                    textDecoration: "none",
                  }}
                >
                  {secondaryCta.label}
                  <span style={{ fontSize: 16 }}>→</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Right — product image */}
        <div
          className="hidden shrink-0 md:block"
          style={{ width: "46%", minHeight: 480 }}
        >
          <div
            className="relative flex h-full w-full items-center justify-center overflow-hidden"
            style={{
              background: seed.paleStone,
              borderRadius: 32,
              minHeight: 480,
            }}
          >
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={imageAlt}
                loading="lazy"
                style={{
                  maxWidth: "80%",
                  maxHeight: "80%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            ) : (
              /* Placeholder when no image — botanical-style gradient */
              <div
                style={{
                  width: "55%",
                  aspectRatio: "1",
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 40% 40%, ${seed.limeSprout} 0%, ${seed.softSage} 60%, ${seed.paleStone} 100%)`,
                  opacity: 0.5,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
