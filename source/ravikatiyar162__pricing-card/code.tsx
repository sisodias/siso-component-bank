import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckCircle2, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils"; // Assuming you have a `cn` utility from shadcn/ui

// Define variants for the pricing card using cva
const pricingCardVariants = cva(
  "relative flex w-full max-w-sm flex-col rounded-2xl border p-6 shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl lg:p-8",
  {
    variants: {
      variant: {
        default: "border-orange-200/50 dark:border-orange-900/50",
        primary: "border-sky-200/50 dark:border-sky-900/50",
      },
      isPopular: {
        true: "ring-2 ring-primary",
      },
    },
    defaultVariants: {
      variant: "default",
      isPopular: false,
    },
  }
);

// Define variants for the colored elements like button, checkmarks, etc.
const colorVariants = {
  default: {
    divider: "bg-gradient-to-r from-orange-200 to-amber-200 dark:from-orange-900/50 dark:to-amber-900/50",
    check: "text-orange-500",
    button: "bg-gradient-to-r from-orange-400 to-amber-500 text-white hover:from-orange-500 hover:to-amber-600",
  },
  primary: {
    divider: "bg-gradient-to-r from-sky-200 to-cyan-200 dark:from-sky-900/50 dark:to-cyan-900/50",
    check: "text-sky-500",
    button: "bg-gradient-to-r from-sky-400 to-cyan-500 text-white hover:from-sky-500 hover:to-cyan-600",
  },
};

export interface PricingCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof pricingCardVariants> {
  planName: string;
  price: string;
  billingCycle: string;
  description: string;
  features: string[];
  buttonText: string;
  footnote: string;
}

const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  ({ className, variant, isPopular, planName, price, billingCycle, description, features, buttonText, footnote, ...props }, ref) => {
    const colors = variant ? colorVariants[variant] : colorVariants.default;

    return (
      <div className={cn(pricingCardVariants({ variant, isPopular, className }))} ref={ref} {...props}>
        {isPopular && (
          <div className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            POPULAR
          </div>
        )}

        {/* Plan Header */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-2xl font-bold">{planName}</h3>
          <p className="text-5xl font-extrabold tracking-tight">
            {price}
            <span className="ml-1 text-lg font-normal text-muted-foreground">{billingCycle}</span>
          </p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {/* Divider */}
        <div className={cn("my-6 h-1 w-full rounded-full", colors.divider)} />
        
        {/* Features List */}
        <div className="flex-grow">
          <ul className="space-y-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle2 className={cn("mr-3 h-5 w-5 flex-shrink-0", colors.check)} />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Subscribe Button & Footnote */}
        <div className="mt-8 pt-6">
          <button className={cn(
            "inline-flex w-full items-center justify-center rounded-lg px-6 py-3 font-semibold transition-all duration-300",
             colors.button
          )}>
            {buttonText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
          <p className="mt-4 text-center text-xs text-muted-foreground">{footnote}</p>
        </div>
      </div>
    );
  }
);
PricingCard.displayName = "PricingCard";

export { PricingCard };