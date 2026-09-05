"use client"

import type React from "react"
import { useState } from "react"
import { CheckCircle2, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface PricingFeature {
  name: string
  included: boolean
}

interface PricingPlan {
  id: string
  name: string
  icon: React.ReactNode
  price: number
  originalPrice?: number
  billingPeriod: string
  description: string
  cta: {
    text: string
    variant: "primary" | "secondary"
  }
  subtitle: string
  features: PricingFeature[]
  isPopular?: boolean
  badge?: string
}

interface PricingComparisonProps {
  plans: PricingPlan[]
  billingOptions?: {
    label: string
    value: string
  }[]
  onBillingChange?: (value: string) => void
  activeBilling?: string
}

export function PricingComparison({
  plans,
  billingOptions = [
    { label: "Annually", value: "annual" },
    { label: "Monthly", value: "monthly" },
  ],
  onBillingChange,
  activeBilling = "annual",
}: PricingComparisonProps) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [currentBilling, setCurrentBilling] = useState(activeBilling)

  const handleBillingChange = (value: string) => {
    setCurrentBilling(value)
    onBillingChange?.(value)
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-in fade-in duration-500">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-foreground">Compare plans</h1>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="text-muted-foreground">Billing period</span>
            <div className="inline-flex rounded-lg border border-border bg-card p-1 shadow-sm">
              {billingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleBillingChange(option.value)}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
                    currentBilling === option.value
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">-15%</span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 lg:gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={cn(
                "group relative animate-in fade-in zoom-in duration-500",
                plan.isPopular && "md:scale-105 md:z-10",
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Popular Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Card */}
              <div
                className={cn(
                  "relative h-full rounded-2xl border transition-all duration-300 overflow-hidden",
                  "hover:shadow-xl hover:-translate-y-2",
                  plan.isPopular ? "border-primary bg-card shadow-xl" : "border-border bg-card hover:border-primary/50",
                )}
              >
                {/* Gradient Background */}
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-5",
                    plan.isPopular && "group-hover:opacity-10",
                  )}
                  style={{
                    background: "radial-gradient(circle at top right, hsl(var(--primary)), transparent)",
                  }}
                />

                <div className="relative p-8 space-y-6">
                  {/* Icon */}
                  <div className="inline-flex">
                    <div
                      className={cn(
                        "p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
                        plan.isPopular ? "bg-primary/10" : "bg-muted",
                      )}
                    >
                      <div className="text-2xl">{plan.icon}</div>
                    </div>
                  </div>

                  {/* Plan Name & Description */}
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-1">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>

                  {/* Price Section */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-foreground">${plan.price}</span>
                    <span className="text-muted-foreground text-sm">
                      per user/month, billed {currentBilling === "annual" ? "annually" : "monthly"}
                    </span>
                  </div>

                  {plan.originalPrice && (
                    <div className="text-sm font-semibold text-green-600 dark:text-green-400">15% off</div>
                  )}

                  {/* CTA Button */}
                  <button
                    className={cn(
                      "w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform",
                      "hover:scale-105 active:scale-95",
                      plan.cta.variant === "primary"
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                        : "bg-muted text-foreground hover:bg-muted/80 border border-border",
                    )}
                  >
                    {plan.cta.text}
                  </button>

                  {/* Subtitle */}
                  <p className="text-sm text-muted-foreground font-medium">{plan.subtitle}</p>

                  {/* Features List */}
                  <div className="space-y-3 pt-6 border-t border-border">
                    {plan.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-start gap-3 animate-in fade-in"
                        style={{ animationDelay: `${index * 100 + featureIndex * 50}ms` }}
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Free Plan Card */}
        <div className="animate-in fade-in duration-500 delay-300">
          <button
            onClick={() => setExpanded(expanded === "free" ? null : "free")}
            className={cn(
              "w-full p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300",
              "hover:shadow-lg hover:-translate-y-1",
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-2xl">📦</div>
                </div>
                <div className="text-left">
                  <h4 className="text-xl font-bold text-foreground">Free</h4>
                  <p className="text-sm text-muted-foreground">For very small teams</p>
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "w-5 h-5 text-muted-foreground transition-transform duration-300",
                  expanded === "free" && "rotate-180",
                )}
              />
            </div>

            {/* Expanded Content */}
            {expanded === "free" && (
              <div className="mt-6 pt-6 border-t border-border space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                {["Up to 3 seats", "Real-time contact syncing", "Automatic data enrichment"].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
                <div className="text-right pt-4">
                  <span className="text-sm font-semibold text-primary">Current plan</span>
                </div>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
