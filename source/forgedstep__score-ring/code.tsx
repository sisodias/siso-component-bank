"use client";

import * as React from "react";

/**
 * Animated resume-score ring: the arc draws in and the number counts up on
 * mount. Shows the final value instantly under prefers-reduced-motion.
 *
 * Colors come from `--color-muted` / `--color-accent` CSS variables when
 * defined, with neutral fallbacks so it works out of the box.
 */
export function ScoreRing({ value }: { value: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;

  const [progress, setProgress] = React.useState(0); // 0 → 1

  React.useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      setProgress(1);
      return;
    }

    const duration = 1100;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    let raf = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now;
      const t = Math.min((now - start) / duration, 1);
      setProgress(easeOutCubic(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const offset = c * (1 - (value / 100) * progress);
  const display = Math.round(value * progress);

  return (
    <div className="relative size-24 shrink-0">
      <svg viewBox="0 0 80 80" className="size-24 -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="var(--color-muted, #e5e7eb)"
          strokeWidth="7"
        />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="var(--color-accent, #6366f1)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-bold leading-none tabular-nums">
          {display}
        </span>
        <span className="mt-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-muted-foreground">
          / 100
        </span>
      </div>
    </div>
  );
}

export default ScoreRing;
