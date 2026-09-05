import { forwardRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Adds a soft outward glow in the role's accent colour. */
  glow?: boolean;
  /** Tightens padding for nested cards. */
  compact?: boolean;
  /** Wraps the card in a hover-lift transition. */
  interactive?: boolean;
};

const GlassCard = forwardRef<HTMLDivElement, Props>(function GlassCard(
  { children, className = "", glow = false, compact = false, interactive = false },
  ref,
) {
  return (
    <div
      ref={ref}
      className={[
        "relative rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-xl",
        "shadow-[0_8px_32px_rgba(15,23,42,0.06)]",
        "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white before:to-transparent",
        compact ? "p-4" : "p-6",
        glow ? "shadow-[0_8px_32px_rgba(15,23,42,0.06),0_0_60px_-15px_var(--glass-glow,rgba(15,23,42,0.10))]" : "",
        interactive ? "transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white" : "",
        className,
      ].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
});

export default GlassCard;
