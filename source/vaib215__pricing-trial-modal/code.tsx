"use client"

import type React from "react"

import { useState } from "react"
import { X, Check, Shield, Lock, Bell, CheckCircle2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TimelineStep {
  icon: React.ReactNode
  date: string
  title: string
  description: string
}

interface PricingPlan {
  id: string
  name: string
  price: number
  period: "mo" | "year"
  billedAmount?: number
  badge?: string
  recommended?: boolean
}

interface PricingTrialModalProps {
  isOpen: boolean
  onClose: () => void
  trialDays?: number
  plans?: PricingPlan[]
  features?: string[]
  timelineSteps?: TimelineStep[]
  onStartTrial?: (selectedPlan: string) => void
  title?: string
  subtitle?: string
}

export function PricingTrialModal({
  isOpen,
  onClose,
  trialDays = 14,
  plans = [
    {
      id: "yearly",
      name: "Yearly",
      price: 24,
      period: "mo",
      billedAmount: 288,
      badge: "21% OFF",
      recommended: true,
    },
    {
      id: "monthly",
      name: "Monthly",
      price: 29,
      period: "mo",
    },
  ],
  features = ["Unlock top features used by successful creators", "Free for 14-days, option to cancel anytime"],
  timelineSteps = [
    {
      icon: <Lock className="h-5 w-5" />,
      date: "Today",
      title: "All Pro features immediately unlocked.",
      description: "Things just leveled up!",
    },
    {
      icon: <Bell className="h-5 w-5" />,
      date: "Jan 09, 2025",
      title: "You'll get a reminder 7 days before the",
      description: "trial is up.",
    },
    {
      icon: <CheckCircle2 className="h-5 w-5" />,
      date: "Jan 16, 2025",
      title: "Your Pro subscription starts! Unless you",
      description: "cancel before.",
    },
  ],
  onStartTrial,
  title = "Start your free 14-day Pro trial",
  subtitle,
}: PricingTrialModalProps) {
  const [selectedPlan, setSelectedPlan] = useState(plans.find((p) => p.recommended)?.id || plans[0]?.id)
  const [isAccordionOpen, setIsAccordionOpen] = useState(false)

  if (!isOpen) return null

  const handleStartTrial = () => {
    onStartTrial?.(selectedPlan)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-zinc-950 shadow-2xl animate-in fade-in zoom-in-95 duration-300 lg:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-20 rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white sm:right-4 sm:top-4"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Section - Pricing */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between sm:mb-8">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>

          {/* Title */}
          <div className="mb-6 space-y-2 sm:mb-8">
            <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">{title}</h2>
            {subtitle && <p className="text-sm text-zinc-400 sm:text-base">{subtitle}</p>}
          </div>

          {/* Features */}
          <div className="mb-6 space-y-2 sm:mb-8 sm:space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500 sm:h-5 sm:w-5" />
                <span className="text-sm text-zinc-300 sm:text-base">{feature}</span>
              </div>
            ))}
          </div>

          {/* Plans */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-zinc-400">Choose a plan:</h3>
            <div className="space-y-3">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`group relative w-full rounded-xl border-2 p-4 text-left transition-all sm:p-6 ${
                    selectedPlan === plan.id
                      ? "border-lime-400 bg-lime-400/5"
                      : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Radio Button */}
                      <div
                        className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          selectedPlan === plan.id
                            ? "border-lime-400 bg-lime-400"
                            : "border-zinc-600 group-hover:border-zinc-500"
                        }`}
                      >
                        {selectedPlan === plan.id && <div className="h-2 w-2 rounded-full bg-zinc-950" />}
                      </div>

                      {/* Plan Details */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-semibold text-white sm:text-xl">{plan.name}</h4>
                          {plan.badge && (
                            <span className="rounded-full bg-lime-400/20 px-2 py-0.5 text-xs font-medium text-lime-400">
                              {plan.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-white sm:text-3xl">${plan.price}</span>
                          <span className="text-sm text-zinc-400 sm:text-base">/{plan.period}</span>
                        </div>
                        {plan.billedAmount && (
                          <p className="text-xs text-zinc-500 sm:text-sm">Billed ${plan.billedAmount} annually</p>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleStartTrial}
            className="mt-6 h-11 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 sm:mt-8 sm:h-12 sm:text-base"
          >
            Start your free trial
          </Button>

          {/* Footer Note */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-500 sm:text-sm">
            <Shield className="h-4 w-4" />
            <span>No strings attached, cancel anytime</span>
          </div>

          {/* Mobile Accordion */}
          <div className="mt-6 lg:hidden">
            <button
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              className="flex w-full items-center justify-between text-left transition-colors hover:border-zinc-700"
            >
              <span className="text-xl font-semibold text-white">How it works</span>
              <ChevronDown
                className={`h-5 w-5 text-zinc-400 transition-transform duration-300 ${
                  isAccordionOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isAccordionOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="space-y-6 p-4">
                {timelineSteps.map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-lime-400/10 text-lime-400">
                      {step.icon}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-semibold text-white">{step.date}</p>
                      <p className="text-xs leading-relaxed text-zinc-300">{step.title}</p>
                      <p className="text-xs leading-relaxed text-zinc-300">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Timeline (Desktop only) */}
        <div className="hidden w-[400px] border-l border-zinc-800 bg-zinc-900/50 p-8 lg:block">
          <h3 className="mb-8 text-xl font-semibold text-white">How it works</h3>
          <div className="space-y-8">
            {timelineSteps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-lime-400/10 text-lime-400">
                  {step.icon}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold text-white">{step.date}</p>
                  <p className="text-sm leading-relaxed text-zinc-300">{step.title}</p>
                  <p className="text-sm leading-relaxed text-zinc-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
