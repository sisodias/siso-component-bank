import React, { useState } from "react";
import { User, Users, Check, Star, Zap, Shield, Crown } from "lucide-react";

type CTA = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "premium";
};

type Plan = {
  name: string;
  icon?: React.ReactNode;
  description: string;
  price: number;
  originalPrice?: number;
  priceNote?: string;
  cta: CTA;
  features: string[];
  variant?: "basic" | "popular" | "premium";
  badge?: string;
  className?: string;
};

type PricingProps = {
  title?: string | false;
  description?: string | false;
  className?: string;
};

export default function Pricing({
  title = "Choose the perfect plan for your needs",
  description = "Transparent pricing with no hidden fees. Upgrade or downgrade at any time.",
  className = "",
}: PricingProps) {
  const [isAnnual, setIsAnnual] = useState(true);

  const stats = {
    websiteTemplates: 12,
    appTemplates: 8,
    sections: 150,
    illustrations: 40,
    animations: 25,
  };

  const plans: Plan[] = [
    {
      name: "Starter",
      icon: <Zap className="w-5 h-5" />,
      description: "Perfect for individuals and small projects just getting started",
      price: isAnnual ? 0 : 0,
      priceNote: "Forever free",
      cta: {
        variant: "secondary",
        label: "Start for free",
        href: "/get-started",
      },
      features: [
        "3 website templates",
        "20+ blocks and sections", 
        "Basic animations",
        "Community support",
        "Mobile responsive",
      ],
      variant: "basic",
    },
    {
      name: "Professional",
      icon: <User className="w-5 h-5" />,
      description: "Ideal for professionals, freelancers and growing businesses",
      price: isAnnual ? 29 : 35,
      originalPrice: isAnnual ? 49 : 59,
      priceNote: isAnnual ? "per month, billed annually" : "per month",
      cta: {
        variant: "primary",
        label: "Start free trial",
        href: "/start-trial",
      },
      features: [
        `${stats.websiteTemplates} website templates`,
        `${stats.sections}+ blocks and sections`,
        `${stats.animations} premium animations`,
        "Priority email support",
        "Advanced integrations",
        "Custom branding",
        "Export capabilities",
      ],
      variant: "popular",
      badge: "Most Popular",
    },
    {
      name: "Enterprise",
      icon: <Crown className="w-5 h-5" />,
      description: "Advanced features and dedicated support for teams and agencies",
      price: isAnnual ? 99 : 119,
      originalPrice: isAnnual ? 149 : 179,
      priceNote: isAnnual ? "per month, billed annually" : "per month",
      cta: {
        variant: "premium",
        label: "Contact sales",
        href: "/contact-sales",
      },
      features: [
        "Everything in Professional",
        "Unlimited team members",
        "White-label solutions",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantee",
        "Advanced analytics",
      ],
      variant: "premium",
    },
  ];

  return (
    <section className={`relative min-h-screen bg-background max-w-full py-20 ${className}`}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        {(title || description) && (
          <div className="text-center mb-16">
            {title && (
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {description}
              </p>
            )}

            {/* Billing toggle */}
            <div className="flex items-center justify-center mt-10 mb-8">
              <div className="relative flex items-center bg-muted rounded-xl p-1 border">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-6 py-3 text-sm font-medium rounded-lg transition-all ${
                    !isAnnual
                      ? "bg-background text-foreground shadow-sm border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-6 py-3 text-sm font-medium rounded-lg transition-all relative ${
                    isAnnual
                      ? "bg-background text-foreground shadow-sm border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Annual
                  <span className="absolute -top-2 -right-2 bg-green-600 dark:bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Save 40%
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative group ${
                plan.variant === "popular"
                  ? "lg:scale-105 lg:-mt-4"
                  : ""
              }`}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-semibold shadow-lg border">
                    <Star className="w-4 h-4 inline mr-1" />
                    {plan.badge}
                  </div>
                </div>
              )}

              <div
                className={`relative h-full rounded-xl p-8 transition-all duration-300 group-hover:-translate-y-1 border ${
                  plan.variant === "popular"
                    ? "bg-card border-primary/50 shadow-2xl shadow-primary/10"
                    : plan.variant === "premium"
                    ? "bg-card border-primary shadow-2xl bg-gradient-to-br from-card to-muted/20"
                    : "bg-card shadow-lg hover:shadow-xl"
                }`}
              >
                {/* Premium glow effect */}
                {plan.variant === "premium" && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
                )}

                {/* Header */}
                <div className="mb-8 relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`p-2 rounded-lg border ${
                        plan.variant === "premium"
                          ? "bg-primary/10 text-primary border-primary/20"
                          : plan.variant === "popular"
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {plan.icon}
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {plan.name}
                    </h3>
                  </div>
                  
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2 mb-2">
                    {plan.originalPrice && (
                      <span className="text-2xl line-through text-muted-foreground/60">
                        ${plan.originalPrice}
                      </span>
                    )}
                    <span className="text-5xl font-bold text-foreground">
                      ${plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-sm text-muted-foreground">
                        /month
                      </span>
                    )}
                  </div>
                  
                  {plan.priceNote && (
                    <p className="text-sm text-muted-foreground">
                      {plan.priceNote}
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-center transition-all duration-200 mb-8 ${
                    plan.cta.variant === "primary"
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      : plan.cta.variant === "premium"
                      ? "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-primary"
                      : "bg-secondary hover:bg-secondary/80 text-secondary-foreground border hover:border-primary/20"
                  }`}
                >
                  {plan.cta.label}
                </button>

                {/* Features */}
                <div>
                  <h4 className="font-semibold mb-4 text-foreground">
                    What's included:
                  </h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div className="mt-0.5 p-1 rounded-full bg-green-600 dark:bg-green-500 flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card accent for popular plan */}
                {plan.variant === "popular" && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-primary rounded-b-full" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="text-center mt-16">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="p-1 rounded-full bg-green-600/10">
                <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm">30-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="p-1 rounded-full bg-primary/10">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm">Trusted by 10,000+ customers</span>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-muted/30 border border-dashed border-muted-foreground/20 max-w-md mx-auto">
            <p className="text-muted-foreground text-sm">
              Need a custom solution? 
              <a href="/contact" className="text-primary hover:text-primary/80 font-medium ml-1 underline underline-offset-4">
                Contact our sales team
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}