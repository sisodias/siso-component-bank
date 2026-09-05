"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./card";
import { Button } from "./button";
import { Switch } from "./switch";
import { Check, X } from "lucide-react";
import { cn } from "../_utils/cn";

export interface PlanFeature {
  label: string;
  included: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  priceMonthly: number;
  priceYearly: number;
  users: string;
  features: PlanFeature[];
  recommended?: boolean;
}

export interface PricingModuleProps {
  title?: string;
  subtitle?: string;
  annualBillingLabel?: string;
  buttonLabel?: string;
  plans: PricingPlan[];
  defaultAnnual?: boolean;
  className?: string;
}

export function PricingModule({
  title = "Pricing Plans",
  subtitle = "Choose a plan that fits your needs.",
  annualBillingLabel = "Annual billing",
  buttonLabel = "Get started",
  plans,
  defaultAnnual = false,
  className,
}: PricingModuleProps) {
  const [isAnnual, setIsAnnual] = React.useState(defaultAnnual);

  return (
    <section
      className={cn(
        "w-full bg-background text-foreground py-20 px-4 md:px-8",
        className
      )}
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-2">{title}</h2>
        <p className="text-muted-foreground mb-8">{subtitle}</p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <Switch
            id="billing-toggle"
            checked={isAnnual}
            onCheckedChange={(checked) => setIsAnnual(checked)}
          />
          <label
            htmlFor="billing-toggle"
            className="text-sm text-muted-foreground cursor-pointer"
          >
            {annualBillingLabel}
          </label>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "relative border border-muted rounded-xl transition-all hover:shadow-md hover:border-primary/30",
                plan.recommended && "border-primary ring-1 ring-primary/30 scale-[1.03]"
              )}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-0 right-0 mx-auto w-fit bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                  Recommended
                </div>
              )}

              <CardHeader className="text-center pt-8">
                <div className="flex justify-center mb-4">{plan.icon}</div>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="text-center">
                <div className="text-3xl font-bold mb-2 transition-all duration-300">
                  ${isAnnual ? plan.priceYearly : plan.priceMonthly}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  / {isAnnual ? "year" : "month"}
                </p>

                <Button
                  variant={plan.recommended ? "default" : "outline"}
                  className="w-full mb-6"
                >
                  {buttonLabel}
                </Button>

                <div className="text-left text-sm">
                  <h4 className="font-semibold mb-2">Overview</h4>
                  <p className="text-muted-foreground mb-4">✓ {plan.users}</p>

                  <h4 className="font-semibold mb-2">Highlights</h4>
                  <ul className="space-y-2">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        {f.included ? (
                          <Check className="w-4 h-4 text-primary" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span
                          className={f.included
                            ? "text-muted-foreground"
                            : "text-muted-foreground/60 line-through"}
                        >
                          {f.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
