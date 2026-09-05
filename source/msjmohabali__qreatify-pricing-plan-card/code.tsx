"use client";

import { CheckIcon } from "lucide-react";

import { cn } from "./qreatify-pricing-plan-card-utils/utils";

export type QreatifyPricingPlanCardProps = {
  name?: string;
  eyebrow?: string;
  description?: string;
  price?: string;
  cadence?: string;
  icon?: string;
  messageCredits?: string;
  integrationCredits?: string;
  features?: string[];
  accent?: string;
  soft?: string;
  active?: boolean;
  recommended?: boolean;
  ctaLabel?: string;
  disabled?: boolean;
  onSelect?: () => void;
  className?: string;
};

export default function QreatifyPricingPlanCard({
  name = "Flame",
  eyebrow = "Most Qreatify teams pick this",
  description = "For serious app building with richer integrations, automations and more room for iteration.",
  price = "EUR 49",
  cadence = "/month",
  icon,
  messageCredits = "2,500 message credits",
  integrationCredits = "1,000 integration credits",
  features = [
    "Unlimited apps and projects",
    "Built-in integrations",
    "Choose your AI model",
    "Custom domains",
  ],
  accent = "#ff5a3d",
  soft = "#ffe0d7",
  active = false,
  recommended = false,
  ctaLabel = active ? "Current plan" : `Choose ${name}`,
  disabled = false,
  onSelect,
  className,
}: QreatifyPricingPlanCardProps) {
  return (
    <article
      className={cn(
        "relative flex min-h-96 flex-col overflow-hidden rounded-3xl border bg-white/95 p-6 text-slate-950 shadow-xl backdrop-blur",
        recommended
          ? "border-orange-500 ring-2 ring-orange-500/15"
          : "border-black/10",
        className,
      )}
      style={{
        boxShadow: active ? `0 22px 75px ${accent}24` : undefined,
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{
          background: `linear-gradient(90deg, ${accent}, #ffb21f, #ec2c8c)`,
        }}
      />
      {recommended && (
        <div className="absolute inset-x-0 top-0 overflow-hidden rounded-t-3xl">
          <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-pink-600 py-2 text-center text-xs font-semibold tracking-widest text-white uppercase">
            Qreatify pick
          </div>
        </div>
      )}

      <div className={cn(recommended && "pt-9")}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className="mb-2 text-xs font-semibold tracking-widest uppercase"
              style={{ color: accent }}
            >
              {eyebrow}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">
              {name}
            </h2>
          </div>
          <div
            className="grid size-11 place-items-center rounded-2xl text-sm font-bold"
            style={{ backgroundColor: soft, color: accent }}
          >
            {icon ?? name.slice(0, 1).toUpperCase()}
          </div>
        </div>

        <div className="mt-7 flex items-end gap-1">
          <span className="text-4xl font-semibold tracking-tight">
            {price}
          </span>
          <span className="mb-1 text-sm font-medium text-black/40">
            {cadence}
          </span>
        </div>
        <p className="mt-4 min-h-12 text-sm leading-6 text-black/52">
          {description}
        </p>
      </div>

      <div className="mt-6 border-t border-black/10 pt-5">
        <div
          className="rounded-xl border p-3 text-sm"
          style={{ backgroundColor: soft, borderColor: `${accent}28` }}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">{messageCredits}</p>
              <p className="mt-1 text-black/48">{integrationCredits}</p>
            </div>
            {active && (
              <span className="rounded-full bg-black px-2.5 py-1 text-xs font-semibold text-white">
                Active
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          disabled={disabled || active}
          onClick={onSelect}
          className={cn(
            "mt-5 flex h-11 w-full items-center justify-center rounded-xl text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55",
            recommended
              ? "bg-gradient-to-r from-amber-400 via-orange-500 to-pink-600 text-white shadow-lg"
              : "border border-black/12 bg-white text-black hover:bg-orange-50",
          )}
        >
          {ctaLabel}
        </button>
      </div>

      <div className="mt-7 border-t border-black/10 pt-5">
        <p className="mb-4 text-sm font-semibold">Plan highlights:</p>
        <ul className="space-y-3">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-3 text-sm leading-5 text-black/70"
            >
              <CheckIcon className="mt-0.5 size-4 shrink-0 text-emerald-600" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
