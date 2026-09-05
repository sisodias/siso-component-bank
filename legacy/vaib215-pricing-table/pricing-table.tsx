"use client"

import type React from "react"

import { Check, Info } from "lucide-react"
import { Button } from "./button"
import { Card } from "./card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { cn } from "../_utils/cn"
import { useState } from "react"

export interface PricingFeature {
  text: string
  hasInfo?: boolean
}

export interface PricingTier {
  name: string
  description: string
  price?: number
  priceLabel?: string
  billingPeriod?: string
  buttonText: string
  buttonVariant?: "default" | "secondary" | "outline"
  isPrimary?: boolean
  features: PricingFeature[]
  hasAnnualToggle?: boolean
  creditOptions?: string[]
  defaultCredits?: string
  featuresTitle?: string
}

export interface PricingProps {
  icon?: React.ReactNode
  title: string
  subtitle: string
  tiers: PricingTier[]
  footerTitle?: string
  footerDescription?: string
  footerButtonText?: string
  className?: string
}

export function Pricing({
  icon,
  title,
  subtitle,
  tiers,
  footerTitle,
  footerDescription,
  footerButtonText,
  className,
}: PricingProps) {
  const [annualBilling, setAnnualBilling] = useState<Record<string, boolean>>({})
  const [selectedCredits, setSelectedCredits] = useState<Record<string, string>>({})

  return (
    <div className={cn("w-full bg-background text-foreground py-16 px-4", className)}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          {icon && <div className="flex justify-center mb-4">{icon}</div>}
          <h1 className="text-5xl font-bold mb-4 text-balance">{title}</h1>
          <p className="text-muted-foreground text-lg text-balance">{subtitle}</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {tiers.map((tier, index) => (
            <Card
              key={index}
              className={cn("bg-card border-border p-6 flex flex-col", tier.isPrimary && "ring-2 ring-purple-500")}
            >
              {/* Tier Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{tier.name}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{tier.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                {tier.price !== undefined ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold">${tier.price}</span>
                    <span className="text-muted-foreground">{tier.billingPeriod || "per month"}</span>
                  </div>
                ) : (
                  <div className="text-xl font-semibold">{tier.priceLabel}</div>
                )}
              </div>

              {/* Annual Toggle */}
              {tier.hasAnnualToggle && (
                <div className="mb-6 flex items-center gap-3">
                  <button
                    onClick={() =>
                      setAnnualBilling((prev) => ({
                        ...prev,
                        [tier.name]: !prev[tier.name],
                      }))
                    }
                    className={cn(
                      "w-11 h-6 rounded-full relative transition-colors",
                      annualBilling[tier.name] ? "bg-muted/80" : "bg-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-primary-foreground transition-transform",
                        annualBilling[tier.name] && "translate-x-5",
                      )}
                    />
                  </button>
                  <span className="text-sm text-foreground">{tier.name === "Pro" ? "Annual" : "Annual"}</span>
                </div>
              )}

              {/* CTA Button */}
              <Button
                className={cn(
                  "w-full mb-6",
                  tier.isPrimary
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border",
                )}
                variant={tier.buttonVariant || "default"}
              >
                {tier.buttonText}
              </Button>

              {/* Credit Options */}
              {tier.creditOptions && tier.creditOptions.length > 0 && (
                <div className="mb-6">
                  <Select
                    value={selectedCredits[tier.name] || tier.defaultCredits || tier.creditOptions[0]}
                    onValueChange={(value) =>
                      setSelectedCredits((prev) => ({
                        ...prev,
                        [tier.name]: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full bg-secondary border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border text-popover-foreground">
                      {tier.creditOptions.map((option) => (
                        <SelectItem
                          key={option}
                          value={option}
                          className="focus:bg-accent focus:text-accent-foreground"
                        >
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Features Title */}
              {tier.featuresTitle && (
                <div className="mb-4 text-sm font-medium text-foreground">{tier.featuresTitle}</div>
              )}

              {/* Features List */}
              <div className="space-y-3 flex-1">
                {tier.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-foreground flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground leading-relaxed flex-1">{feature.text}</span>
                    {feature.hasInfo && <Info className="w-4 h-4 text-muted-foreground/50 flex-shrink-0 mt-0.5" />}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Footer Banner */}
        {footerTitle && (
          <Card className="bg-card border-border p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2">{footerTitle}</h3>
              {footerDescription && <p className="text-muted-foreground text-sm">{footerDescription}</p>}
            </div>
            {footerButtonText && (
              <Button
                variant="outline"
                className="bg-transparent border-border text-foreground hover:bg-accent hover:text-accent-foreground whitespace-nowrap"
              >
                {footerButtonText}
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
