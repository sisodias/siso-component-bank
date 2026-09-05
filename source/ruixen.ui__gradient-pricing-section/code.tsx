"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Users } from "lucide-react";
import { cn } from "@/lib/utils";
// import { PricingColumn, PricingColumnProps } from "@/components/ui/pricing-column";

import { cva, type VariantProps } from "class-variance-authority";
import { CircleCheckBig } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

const pricingColumnVariants = cva(
  "max-w-container relative flex flex-col gap-6 overflow-hidden rounded-2xl p-8 shadow-xl",
  {
    variants: {
      variant: {
        default: "glass-1 to-transparent dark:glass-3",
        glow: "glass-2 to-trasparent dark:glass-3 after:content-[''] after:absolute after:-top-[128px] after:left-1/2 after:h-[128px] after:w-[100%] after:max-w-[960px] after:-translate-x-1/2 after:rounded-[50%] dark:after:bg-foreground/30 after:blur-[72px]",
        "glow-brand":
          "glass-3 from-card/100 to-card/100 dark:glass-4 after:content-[''] after:absolute after:-top-[128px] after:left-1/2 after:h-[128px] after:w-[100%] after:max-w-[960px] after:-translate-x-1/2 after:rounded-[50%] after:bg-brand-foreground/70 after:blur-[72px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface PricingColumnProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pricingColumnVariants> {
  name: string;
  icon?: ReactNode;
  description: string;
  price: number;
  priceNote: string;
  cta: {
    variant: "glow" | "default";
    label: string;
    href: string;
  };
  features: string[];
}

export function PricingColumn({
  name,
  icon,
  description,
  price,
  priceNote,
  cta,
  features,
  variant,
  className,
  ...props
}: PricingColumnProps) {
  return (
    <div
      className={cn(pricingColumnVariants({ variant, className }))}
      {...props}
    >
      <hr
        className={cn(
          "via-foreground/60 absolute top-0 left-[10%] h-[1px] w-[80%] border-0 bg-linear-to-r from-transparent to-transparent",
          variant === "glow-brand" && "via-brand",
        )}
      />
      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-2">
          <h2 className="flex items-center gap-2 font-bold">
            {icon && (
              <div className="text-muted-foreground flex items-center gap-2">
                {icon}
              </div>
            )}
            {name}
          </h2>
          <p className="text-muted-foreground max-w-[220px] text-sm">
            {description}
          </p>
        </div>
        <div className="flex items-center gap-3 lg:flex-col lg:items-start xl:flex-row xl:items-center">
          <div className="flex items-baseline gap-1">
            <span className="text-muted-foreground text-2xl font-bold">$</span>
            <span className="text-6xl font-bold">{price}</span>
          </div>
          <div className="flex min-h-[40px] flex-col">
            {price > 0 && (
              <>
                <span className="text-sm">one-time payment</span>
                <span className="text-muted-foreground text-sm">
                  plus local taxes
                </span>
              </>
            )}
          </div>
        </div>
        <Button
          variant={cta.variant === "glow" ? "default" : cta.variant}
          size="lg"
          className={cta.variant === "glow" ? "shadow-lg shadow-primary/50" : ""}
          asChild
        >
          <Link href={cta.href}>{cta.label}</Link>
        </Button>
        <p className="text-muted-foreground min-h-[40px] max-w-[220px] text-sm">
          {priceNote}
        </p>
        <hr className="border-input" />
      </div>
      <div>
        <ul className="flex flex-col gap-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <CircleCheckBig className="text-muted-foreground size-4 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export { pricingColumnVariants };

export interface PricingProps {
  title?: string | false;
  description?: string | false;
  plans?: PricingColumnProps[] | false;
  className?: string;
}

const defaultPlans: PricingColumnProps[] = [
  {
    name: "Free",
    description: "Perfect for trying Ruixen UI before committing",
    price: 0,
    priceNote: "Free and open-source forever.",
    cta: {
      variant: "glow",
      label: "Get started for free",
      href: "/docs/getting-started/introduction",
    },
    features: [
      "1 website template",
      "9 blocks and sections",
      "4 custom animations",
    ],
    variant: "default",
  },
  {
    name: "Pro",
    icon: <User className="size-4" />,
    description: "For founders, indie devs & solopreneurs who want premium UI",
    price: 99,
    priceNote: "Lifetime access. Free updates. No recurring fees.",
    cta: {
      variant: "default",
      label: "Get all-access",
      href: "https://ruixenui.com/buy/pro",
    },
    features: [
      "4 website templates",
      "2 app templates",
      "72 blocks and sections",
      "16 illustrations",
      "14 custom animations",
    ],
    variant: "glow-brand",
  },
  {
    name: "Pro Team",
    icon: <Users className="size-4" />,
    description: "For teams & agencies building amazing products together",
    price: 499,
    priceNote: "Lifetime access. Free updates. No recurring fees.",
    cta: {
      variant: "default",
      label: "Get all-access for your team",
      href: "https://ruixenui.com/buy/team",
    },
    features: [
      "All templates, components & sections for your whole team",
    ],
    variant: "glow",
  },
];

export default function GradientPricingSection({
  title = "Level-up your design game, today",
  description = "Get lifetime access to all Ruixen UI templates, blocks, and future updates. No recurring fees, no fake discounts — just simple, transparent pricing.",
  plans = defaultPlans,
  className = "",
}: PricingProps) {
  const [showGradient, setShowGradient] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowGradient(true), 300); // delay for effect
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={cn(className)}>
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 min-h-screen justify-center">
        {(title || description) && (
          <div className="flex flex-col items-start gap-1 text-start sm:gap-4">
            {title && (
              <h2 className="text-3xl leading-tight font-medium sm:text-5xl sm:leading-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-md text-gray-500 dark:text-gray-400 max-w-[600px] font-normal sm:text-xl">
                {description}
              </p>
            )}
          </div>
        )}

        {plans && plans.length > 0 && (
          <div className="max-w-container mx-auto grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.name} className="relative">
                {/* Gradient light effect */}
                {showGradient && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute top-0 left-0 right-0 h-[500px] rounded-3xl 
                    bg-gradient-to-b from-blue-200 via-pink-200 to-transparent"
                  />
                )}
                <PricingColumn {...plan} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
