import * as React from "react";

export type RevealSegment = {
  /** A run of text. It is split into words for the stagger. */
  text: string;
  /** Render this run as the accent (coloured + optional glow). */
  accent?: boolean;
};

export interface WordRevealProps {
  /** The headline, as one or more runs. Mark the highlight run `accent: true`. */
  segments: RevealSegment[];
  /** Heading element to render. */
  as?: "h1" | "h2" | "h3" | "p";
  /** Class on the wrapper — bring your own type scale. */
  className?: string;
  /** Delay before the first word (seconds). */
  delay?: number;
  /** Per-word stagger (seconds). */
  stagger?: number;
  /** Colour for accent words (ignored if `accentClassName` is set). */
  accentColor?: string;
  /** Breathing glow on accent words. */
  accentGlow?: boolean;
  /** Use your own class on accent words instead of the built-in styling. */
  accentClassName?: string;
}

const CSS = `
@keyframes atlas-wr-in {
  from { opacity: 0; transform: translateY(0.5em); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes atlas-wr-glow {
  0%, 100% { text-shadow: 0 0 0 transparent; }
  50% { text-shadow: 0 0 22px var(--atlas-wr-glow, oklch(0.86 0.2 130 / 0.42)); }
}
.atlas-wr-word {
  display: inline-block; opacity: 0; will-change: transform, opacity;
  animation: atlas-wr-in 0.62s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.atlas-wr-accent { animation: atlas-wr-glow 5s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .atlas-wr-word { animation: none; opacity: 1; }
  .atlas-wr-accent { animation: none; }
}
`;

/**
 * WordReveal — a calm, word-by-word headline reveal (rise + fade).
 *
 * One run of the headline can be marked `accent` to render coloured with a soft
 * breathing glow. Pure CSS (no animation library) and self-contained — keyframes
 * are injected inline — so it works in Server or Client Components. Fully
 * overridable via `accentClassName` / `className`. Honors `prefers-reduced-motion`.
 *
 * @example
 * <WordReveal
 *   className="text-5xl font-semibold"
 *   segments={[{ text: "Everyone should automate." }, { text: "Not just big teams.", accent: true }]}
 * />
 */
export default function WordReveal({
  segments,
  as: Tag = "h1",
  className,
  delay = 0.12,
  stagger = 0.05,
  accentColor = "oklch(0.86 0.155 135)",
  accentGlow = true,
  accentClassName,
}: WordRevealProps) {
  const label = segments.map((s) => s.text).join(" ");

  const words: { w: string; accent?: boolean }[] = [];
  segments.forEach((s) => s.text.split(" ").forEach((w) => words.push({ w, accent: s.accent })));

  const accentCls = (accent?: boolean) =>
    accent ? accentClassName ?? (accentGlow ? "atlas-wr-accent" : undefined) : undefined;
  const accentStyle = (accent?: boolean): React.CSSProperties =>
    accent && !accentClassName ? { color: accentColor } : {};

  return (
    <Tag className={className} aria-label={label}>
      <style>{CSS}</style>
      {words.map((wd, i) => (
        // The space is a sibling text node, not inside the inline-block span —
        // trailing whitespace inside inline-block collapses (words would jam),
        // while a sibling space renders and still allows the line to wrap.
        <React.Fragment key={i}>
          <span
            aria-hidden
            className={["atlas-wr-word", accentCls(wd.accent)].filter(Boolean).join(" ")}
            style={{ animationDelay: `${delay + i * stagger}s`, ...accentStyle(wd.accent) }}
          >
            {wd.w}
          </span>
          {i < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </Tag>
  );
}
