"use client"
import React, { useState } from "react"
import { ParticleButton } from "./particle-button"
import { cn } from "@/lib/utils"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card"
import { Check } from "lucide-react"
import { Badge } from "./badge" 




interface PricingPlan {
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  features: string[]
  popular?: boolean
  buttonText: string
  buttonVariant?: "default" | "outline" | "secondary"
  discount?: string
  ctaLink?: string
}

interface PricingSectionProps {
  plans?: PricingPlan[]
  className?: string
  showDiscount?: boolean
}

const defaultPlans: PricingPlan[] = [
  {
    name: "Free",
    description: "Perfect for getting started",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: ["Up to 3 projects", "Basic analytics", "Community support", "1GB storage", "Standard templates"],
    buttonText: "Get Started",
    buttonVariant: "outline",
  },
  {
    name: "Pro",
    description: "Best for growing businesses",
    monthlyPrice: 29,
    yearlyPrice: 290,
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "100GB storage",
      "Premium templates",
      "Custom integrations",
      "Team collaboration",
      "API access",
    ],
    popular: true,
    buttonText: "Start Free Trial",
    buttonVariant: "default",
  },
  {
    name: "Enterprise",
    description: "For large-scale operations",
    monthlyPrice: 99,
    yearlyPrice: 990,
    features: [
      "Everything in Pro",
      "Unlimited storage",
      "24/7 phone support",
      "Custom branding",
      "Advanced security",
      "Dedicated account manager",
      "SLA guarantee",
      "Custom integrations",
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline",
  },
]

export function PricingSection({ plans = defaultPlans, className, showDiscount = true }: PricingSectionProps) {
  const [isYearly, setIsYearly] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const handleToggle = (checked: boolean) => {
    setIsYearly(checked)
    if (checked && showDiscount) {
      setShowTooltip(true)
      setTimeout(() => setShowTooltip(false), 3000)
    }
  }

  return (
    <section className={cn("relative py-20 px-4 overflow-hidden", className)}>
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-purple-50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-balance mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 text-balance mb-8 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Upgrade or downgrade at any time.
          </p>

          {/* Billing Toggle */}
          <div className="relative flex items-center justify-center gap-4 mb-8">
            <span className={cn("text-sm font-medium transition-colors duration-200", !isYearly ? "text-gray-900" : "text-gray-500")}>Monthly</span>
            <input
  type="checkbox"
  checked={isYearly}
  onChange={(e) => handleToggle(e.target.checked)}
  className="h-5 w-10 cursor-pointer accent-blue-600"
/>
            <span className={cn("text-sm font-medium transition-colors duration-200", isYearly ? "text-gray-900" : "text-gray-500")}>Yearly</span>
          <span className="ml-2 px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
  Save 20%
</span>

            {showTooltip && (
              <div className="absolute top-12 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                Save 20% with yearly billing!
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rotate-45" />
              </div>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
            const monthlyPrice = isYearly ? Math.floor(plan.yearlyPrice / 12) : plan.monthlyPrice
            const savings = plan.monthlyPrice * 12 - plan.yearlyPrice

            return (
              <Card key={plan.name} className={cn(
                "relative transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 animate-in fade-in slide-in-from-bottom-4",
                plan.popular && "border-blue-500 shadow-lg scale-105 ring-1 ring-blue-500/20",
                "group cursor-pointer bg-white"
              )} style={{ animationDelay: `${index * 150}ms` }}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white hover:scale-110 transition-transform duration-200">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold group-hover:text-blue-600 transition-colors duration-200">{plan.name}</CardTitle>
                  <CardDescription className="text-base text-gray-600">{plan.description}</CardDescription>

                  <div className="mt-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold transition-all duration-500 ease-out">${monthlyPrice}</span>
                      <span className="text-gray-500">{price === 0 ? "" : "/month"}</span>
                    </div>

                    {isYearly && price > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-500">Billed annually (${price}/year)</p>
                        {savings > 0 && (
                          <p className="text-sm text-green-600 font-medium animate-in fade-in duration-300">
                            Save ${savings} per year
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-start gap-3 animate-in fade-in slide-in-from-left-1"
                      style={{ animationDelay: `${index * 150 + featureIndex * 50}ms` }}
                    >
                      <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </CardContent>

                <CardFooter className="pt-6">
                  <ParticleButton
                    className="w-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    onSuccess={() => console.log(`${plan.name} clicked!`)}
                  >
                    {plan.ctaLink ? <a href={plan.ctaLink}>{plan.buttonText}</a> : plan.buttonText}
                  </ParticleButton>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-gray-600 mb-4">All plans include a 14-day free trial. No credit card required.</p>
          <p className="text-sm text-gray-500">
            Questions?{" "}
            <a href="#" className="text-blue-600 hover:underline transition-colors duration-200">
              Contact our sales team
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
