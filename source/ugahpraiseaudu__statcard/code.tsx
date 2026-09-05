import { type LucideIcon } from "lucide-react";

type Accent = "navy" | "gold" | "emerald" | "red" | "muted";

const ACCENT_TEXT: Record<Accent, string> = {
  navy: "text-navy",
  gold: "text-gold-dark",
  emerald: "text-emerald-600",
  red: "text-red-600",
  muted: "text-slate-400",
};

interface Props {
  label: string;
  value: string;
  accent?: Accent;
  icon?: LucideIcon;
  /** Bordered card vs. inline (use false when the card sits inside an existing
   *  card row like a summary strip). */
  framed?: boolean;
}

/**
 * Flat Linear/Vercel-style stat card with optional Lucide icon and a small
 * accent palette (navy / gold / emerald / red / muted). No gradients, no glow.
 *
 * Consumers need Tailwind theme keys `navy.*` and `gold.*` configured (e.g.
 * via CSS custom properties) — or swap the ACCENT_TEXT entries for plain
 * Tailwind colors.
 */
export default function StatCard({
  label,
  value,
  accent = "muted",
  icon: Icon,
  framed = true,
}: Props) {
  const valueColor = ACCENT_TEXT[accent];
  return (
    <div className={framed ? "bg-white rounded-lg border border-slate-200 px-4 py-3.5" : ""}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
          {label}
        </div>
        {Icon && <Icon className={`w-4 h-4 shrink-0 ${valueColor}`} aria-hidden />}
      </div>
      <div className={`text-2xl font-semibold mt-1 tracking-tight tabular-nums ${valueColor}`}>
        {value}
      </div>
    </div>
  );
}

export { StatCard };
