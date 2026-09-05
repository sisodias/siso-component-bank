import { Check } from "lucide-react";

interface Props {
  name: string;
  priceLabel: string;
  features: string[];
  ctaLabel: string;
  onChoose?: () => void;
  /** Lifted, accent-bordered, filled-primary CTA. Only one tier per page. */
  popular?: boolean;
  /** Override badge text. Defaults to "Most Popular" when popular. */
  badge?: string;
}

/**
 * Linear/Vercel-style pricing tier with real hierarchy: the popular tier is
 * lifted on desktop, gold-bordered, badged "Most Popular", and the only one
 * with a filled CTA. Other tiers recede to outline buttons. Flat — no
 * gradients, no glow.
 *
 * Consumers need Tailwind theme keys `navy.*` and `gold.*` (or swap the
 * literal class names for your brand). Inter for body, an Instrument-Serif-
 * style display face for the tier name reads best, but any sans-serif works.
 */
export default function PricingTier({
  name,
  priceLabel,
  features,
  ctaLabel,
  onChoose,
  popular = false,
  badge,
}: Props) {
  const cardClass = `relative flex flex-col bg-white rounded-lg p-6 transition-colors border ${
    popular ? "border-gold md:-translate-y-2.5" : "border-slate-200"
  }`;
  const ctaClass = popular
    ? "w-full py-2.5 px-4 rounded-md font-semibold text-sm transition-colors bg-navy text-white border border-navy hover:bg-navy-dark"
    : "w-full py-2.5 px-4 rounded-md font-semibold text-sm transition-colors bg-transparent text-navy border border-slate-200 hover:border-navy";

  return (
    <div className={cardClass}>
      {popular && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gold text-navy text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap">
          {badge ?? "Most Popular"}
        </span>
      )}
      <div className="font-serif text-2xl text-navy leading-none mb-2">{name}</div>
      <div className="text-[1.7rem] font-semibold text-navy tracking-tight mb-4">{priceLabel}</div>
      <ul className="text-sm text-slate-700 space-y-2 flex-1 mb-6">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="w-3.5 h-3.5 mt-1 shrink-0 text-gold-dark" strokeWidth={2.6} aria-hidden />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button type="button" onClick={onChoose} className={ctaClass}>
        {ctaLabel}
      </button>
    </div>
  );
}

export { PricingTier };
