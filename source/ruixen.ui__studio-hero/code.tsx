// components/studio-hero.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type ServiceItem = { label: string; href: string };

export interface StudioHeroProps {
  /** Large wordmark text used in the watermark */
  wordmark?: string;
  /** Short line near the right column */
  tagline?: string;
  /** Chips under the tagline */
  chips?: string[];
  /** Left menu services */
  services?: ServiceItem[];
  /** Primary/Secondary CTAs */
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  /** Background image URL */
  backgroundImage?: string;
  /** Overlay accent color (CSS color string) */
  overlayAccent?: string;
  /** Minimum height of the hero in pixels */
  minHeightPx?: number;

  /** Watermark controls */
  showWatermark?: boolean;
  watermarkText?: string;          // defaults to wordmark
  watermarkClassName?: string;     // style override for the watermark

  className?: string;
}

export function StudioHero({
  wordmark = "RUIXEN STUDIOS®",
  tagline = "Independent studio building brand systems and web experiences.",
  chips = ["Identity", "Web", "Motion"],
  services = [
    { label: "Brand Systems", href: "#" },
    { label: "Web Platforms", href: "#" },
    { label: "Motion Design", href: "#" },
    { label: "Campaigns", href: "#" },
  ],
  ctaPrimary = { label: "Book a Call", href: "#contact" },
  ctaSecondary = { label: "View Work", href: "#work" },
  backgroundImage = "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/gold-texture.png",
  overlayAccent = "rgba(255, 200, 0, 0.25)", // soft amber
  minHeightPx = 720,

  showWatermark = true,
  watermarkText,
  watermarkClassName,

  className,
}: StudioHeroProps) {
  const wm = watermarkText ?? wordmark;

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden text-white",
        "bg-cover bg-center bg-no-repeat",
        className
      )}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        minHeight: `${minHeightPx}px`,
      }}
    >
      {/* Overlays: vignette + accent sweep */}
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(90deg, rgba(0,0,0,0.55) 0%, ${overlayAccent} 40%, rgba(0,0,0,0.15) 100%)`,
        }}
      />

      {/* Bottom watermark (behind content, above overlays) */}
      {showWatermark && (
        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-[5]">
          <div className="container mx-auto max-w-7xl px-6">
            <div
              className={cn(
                // huge, subtle, left-aligned wordmark
                "select-none text-left font-extrabold leading-[0.8] tracking-tight",
                "text-white/10",
                "text-[clamp(2.75rem,12vw,11rem)]",
                "drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
                watermarkClassName
              )}
              aria-hidden="true"
            >
              {wm}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 md:grid-cols-12 md:py-24">
        {/* Left: services rail */}
        <div className="md:col-span-6 lg:col-span-5">
          <div className="space-y-2">
            {services.map((s) => (
              <div
                key={s.label}
                className="group flex items-center justify-between border-b border-white/25 py-3"
              >
                <Link
                  href={s.href}
                  className="uppercase tracking-wide text-sm transition-colors hover:text-white/80"
                >
                  {s.label}
                </Link>
                <span className="text-base opacity-0 transition-opacity group-hover:opacity-100">
                  →
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: tagline, chips, CTAs */}
        <div className="md:col-span-6 lg:col-span-5 md:col-start-8">
          <p className="text-balance text-lg/7 text-white/85 md:text-xl">{tagline}</p>

          {chips?.length ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {chips.map((c, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="bg-white/15 text-white backdrop-blur"
                >
                  {c}
                </Badge>
              ))}
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            {ctaPrimary ? (
              <Button asChild size="lg">
                <Link href={ctaPrimary.href}>{ctaPrimary.label}</Link>
              </Button>
            ) : null}
            {ctaSecondary ? (
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="border border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                <Link href={ctaSecondary.href}>{ctaSecondary.label}</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
