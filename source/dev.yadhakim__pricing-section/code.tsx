"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Check, Star, ArrowRight } from "lucide-react";

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingTier {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: PricingFeature[];
  cta: string;
  popular?: boolean;
  badge?: string;
}

interface PricingSectionProps {
  title?: string;
  subtitle?: string;
  tiers: PricingTier[];
  className?: string;
}

function AnimatedPrice({
  price,
  duration = 0.5,
}: {
  price: number;
  duration?: number;
}) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={price}
        initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
        transition={{ duration: duration, ease: [0.32, 0.72, 0, 1] }}
        className="inline-block"
      >
        {price === 0 ? "Free" : `$${price}`}
      </motion.span>
    </AnimatePresence>
  );
}

export function Component({
  title = "Simple, transparent pricing",
  subtitle = "No hidden fees. Cancel anytime.",
  tiers,
  className,
}: PricingSectionProps) {
  const [isYearly, setIsYearly] = useState(false);

  const savings = useMemo(() => {
    const tier = tiers.find((t) => t.monthlyPrice > 0);
    if (!tier) return 0;
    return Math.round(
      ((tier.monthlyPrice - tier.yearlyPrice) / tier.monthlyPrice) * 100
    );
  }, [tiers]);

  return (
    <section className={cn("w-full max-w-5xl mx-auto px-4 py-20", className)}>
      {/* Header */}
      <div className="text-center mb-10">
        <motion.h2
          className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>
        <motion.p
          className="text-muted-foreground text-base md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {subtitle}
        </motion.p>

        {/* Toggle */}
        <motion.div
          className="flex items-center justify-center gap-3 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              !isYearly ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Monthly
          </span>

          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative h-7 w-12 rounded-full bg-muted border border-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Toggle billing period"
          >
            <motion.div
              className="absolute top-0.5 left-0.5 size-6 rounded-full bg-foreground"
              animate={{ x: isYearly ? 20 : 0 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            />
          </button>

          <span
            className={cn(
              "text-sm font-medium transition-colors",
              isYearly ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Yearly
          </span>

          {savings > 0 && (
            <motion.span
              className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isYearly ? 1 : 0,
                scale: isYearly ? 1 : 0.8,
              }}
              transition={{ duration: 0.2 }}
            >
              Save {savings}%
            </motion.span>
          )}
        </motion.div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.name}
            className={cn(
              "relative flex flex-col rounded-2xl border bg-card p-6 md:p-8",
              tier.popular
                ? "border-foreground shadow-xl z-10 md:-my-4 md:py-12"
                : "border-border",
              i === 0 && "md:rounded-r-none",
              i === 1 && tier.popular && "md:rounded-2xl",
              i === 2 && "md:rounded-l-none"
            )}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
          >
            {/* Badge */}
            {tier.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase bg-foreground text-background px-3 py-1 rounded-full">
                  <Star className="size-3 fill-current" />
                  {tier.badge}
                </span>
              </div>
            )}

            {/* Tier Info */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                {tier.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {tier.description}
              </p>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-foreground">
                  <AnimatedPrice
                    price={isYearly ? tier.yearlyPrice : tier.monthlyPrice}
                  />
                </span>
                {tier.monthlyPrice > 0 && (
                  <span className="text-sm text-muted-foreground">/mo</span>
                )}
              </div>

              {isYearly && tier.monthlyPrice > 0 && (
                <motion.p
                  className="text-xs text-muted-foreground mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="line-through">${tier.monthlyPrice}/mo</span>
                  <span className="text-emerald-600 dark:text-emerald-400 ml-1.5 font-medium">
                    Save ${(tier.monthlyPrice - tier.yearlyPrice) * 12}/yr
                  </span>
                </motion.p>
              )}
            </div>

            {/* CTA */}
            <button
              className={cn(
                "w-full rounded-lg py-2.5 text-sm font-semibold transition-all",
                tier.popular
                  ? "bg-foreground text-background hover:opacity-90 shadow-sm"
                  : "bg-muted text-foreground hover:bg-muted/80 border border-border"
              )}
            >
              <span className="flex items-center justify-center gap-2">
                {tier.cta}
                <ArrowRight className="size-3.5" />
              </span>
            </button>

            {/* Divider */}
            <div className="h-px bg-border my-6" />

            {/* Features */}
            <ul className="space-y-3 flex-1">
              {tier.features.map((feature) => (
                <motion.li
                  key={feature.text}
                  className="flex items-start gap-2.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                >
                  <Check
                    className={cn(
                      "size-4 mt-0.5 shrink-0",
                      feature.included
                        ? "text-foreground"
                        : "text-muted-foreground/40"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm",
                      feature.included
                        ? "text-foreground"
                        : "text-muted-foreground/40 line-through"
                    )}
                  >
                    {feature.text}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}