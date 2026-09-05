"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type AnimatedBannerProps = {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  href?: string;
  videoSrc: string;
  posterSrc?: string;
  /** Countdown target. Renders a DD:HH:MM:SS timer that ticks down to it. */
  deadline?: Date | number | string;
  /** Solid color faded from the text side of the banner. */
  overlayColor?: string;
  className?: string;
};

type TimeParts = { days: number; hours: number; minutes: number; seconds: number };

function getTimeParts(target: number): TimeParts {
  const diff = Math.max(0, target - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function Countdown({ target }: { target: number }) {
  const [parts, setParts] = useState<TimeParts>(() => getTimeParts(target));

  useEffect(() => {
    setParts(getTimeParts(target));
    const timer = window.setInterval(() => {
      setParts(getTimeParts(target));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  const segments = [parts.days, parts.hours, parts.minutes, parts.seconds];

  return (
    <div
      aria-hidden="true"
      className="flex shrink-0 items-center gap-1 font-mono text-sm font-medium tabular-nums text-white/90"
    >
      {segments.map((segment, index) => (
        <span className="flex items-center gap-1" key={index}>
          <span className="rounded-md bg-white/10 px-1.5 py-1 backdrop-blur-sm">
            {pad(segment)}
          </span>
          {index < segments.length - 1 ? (
            <span className="text-white/40">:</span>
          ) : null}
        </span>
      ))}
    </div>
  );
}

export function AnimatedBanner({
  title,
  subtitle,
  ctaLabel = "Explore",
  href = "#",
  videoSrc,
  posterSrc,
  deadline,
  overlayColor = "oklch(0.15 0 0)",
  className,
}: AnimatedBannerProps) {
  const target =
    deadline === undefined ? undefined : new Date(deadline).getTime();

  return (
    <a
      className={cn(
        "group relative block aspect-[5/2] w-full overflow-hidden rounded-2xl [--banner-overlay:var(--overlay)]",
        className,
      )}
      href={href}
      style={{ ["--overlay" as string]: overlayColor }}
    >
      <video
        aria-hidden="true"
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted
        playsInline
        poster={posterSrc}
        src={videoSrc}
      />

      {/* gradient overlay: solid on the text side, transparent over the image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[var(--banner-overlay)] via-[var(--banner-overlay)]/70 to-transparent"
      />

      {/* interaction depth: strengthen the text side on hover/focus */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[var(--banner-overlay)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-40 group-focus-visible:opacity-40"
      />

      {/* content layer */}
      <div className="relative z-10 flex h-full items-end justify-between gap-4 p-5 text-white">
        <div className="min-w-0 max-w-xs">
          <h3 className="text-balance text-lg font-semibold leading-tight">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-1 text-pretty text-sm leading-snug text-white/80">
              {subtitle}
            </p>
          ) : null}
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-white transition-transform duration-200 group-hover:gap-1.5">
            {ctaLabel}
            <svg
              aria-hidden="true"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        {target !== undefined ? <Countdown target={target} /> : null}
      </div>
    </a>
  );
}

export default AnimatedBanner;
