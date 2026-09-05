"use client";

import * as React from "react";

export type Stat = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: React.ReactNode;
};

export interface StatBandProps {
  stats: Stat[];
  footnote?: React.ReactNode;
  /** Accent colour for the numbers + hover glow. */
  accent?: string;
  /** Count-up duration (ms). */
  duration?: number;
  className?: string;
}

const CSS = `
.asb-root { max-width: 980px; margin: 0 auto; }
.asb-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.asb-item {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 26px 18px; border-radius: 18px; text-align: center; opacity: 0;
  background: linear-gradient(165deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
  border: 1px solid rgba(255,255,255,0.12); backdrop-filter: blur(10px);
  animation: asb-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  transition: transform 0.18s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}
.asb-item:hover {
  transform: translateY(-3px);
  border-color: color-mix(in oklab, var(--asb-accent) 38%, transparent);
  box-shadow: 0 16px 40px rgba(0,0,0,0.4), 0 0 26px color-mix(in oklab, var(--asb-accent) 18%, transparent);
}
@keyframes asb-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
.asb-num {
  font-family: var(--font-display, inherit); font-weight: 600;
  font-size: clamp(32px, 4.4vw, 46px); line-height: 1; letter-spacing: -0.025em;
  color: var(--asb-accent); font-variant-numeric: tabular-nums;
  text-shadow: 0 0 24px color-mix(in oklab, var(--asb-accent) 28%, transparent);
}
.asb-label { font-size: 13px; opacity: 0.78; line-height: 1.45; max-width: 24ch; }
.asb-foot { text-align: center; margin-top: 18px; font-size: 12.5px; opacity: 0.6; }
@media (max-width: 780px) { .asb-grid { grid-template-columns: repeat(2, 1fr); } }
@media (prefers-reduced-motion: reduce) { .asb-item { animation: none; opacity: 1; } }
`;

/** Counts from 0 to `to` the first time it scrolls into view (rAF, no deps). */
function CountUp({
  to,
  duration = 1500,
  suffix = "",
  prefix = "",
}: {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced =
      typeof matchMedia !== "undefined" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dur = reduced ? 0 : duration;
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = dur > 0 ? Math.min(1, (t - start) / dur) : 1;
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          raf = requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {Math.round(value).toLocaleString()}
      {suffix}
    </span>
  );
}

/**
 * StatBand — a calm row of in-view count-up proof points on glassy cards.
 *
 * Self-contained: styling (responsive grid, entrance, hover glow) is injected
 * inline and themeable via the `accent` prop; the count-up uses a tiny
 * IntersectionObserver + requestAnimationFrame loop, so there is no animation
 * dependency. Numbers animate from 0 the first time the band scrolls into view;
 * instant under `prefers-reduced-motion`.
 *
 * @example
 * <StatBand stats={[{ value: 46, label: "integrations" }, { value: 100, suffix: "%", label: "you approve" }]} />
 */
export default function StatBand({
  stats,
  footnote,
  accent = "oklch(0.86 0.155 135)",
  duration = 1500,
  className,
}: StatBandProps) {
  return (
    <div
      className={["asb-root", className].filter(Boolean).join(" ")}
      style={{ ["--asb-accent" as string]: accent } as React.CSSProperties}
    >
      <style>{CSS}</style>
      <div className="asb-grid">
        {stats.map((s, i) => (
          <div
            key={i}
            className="asb-item"
            style={{ animationDelay: `${i * 0.08}s` } as React.CSSProperties}
          >
            <span className="asb-num">
              <CountUp to={s.value} suffix={s.suffix} prefix={s.prefix} duration={duration} />
            </span>
            <span className="asb-label">{s.label}</span>
          </div>
        ))}
      </div>
      {footnote ? <p className="asb-foot">{footnote}</p> : null}
    </div>
  );
}
