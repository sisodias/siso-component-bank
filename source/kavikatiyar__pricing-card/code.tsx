import * as React from "react";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Your utility for merging Tailwind classes
import { Button } from "@/components/ui/button"; // Assuming you have a shadcn Button

// Define the props for the PricingCard component
interface PricingCardProps {
  planName: string;
  price: string;
  annualPrice: string;
  savings: string;
  description: string;
  features: { text: string; special?: boolean }[];
  isPopular?: boolean;
  iconUrl: string;
  className?: string;
}

// The PricingCard component
export const PricingCard = ({
  planName,
  price,
  annualPrice,
  savings,
  description,
  features,
  isPopular = false,
  iconUrl,
  className,
}: PricingCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={cn(
        "relative flex h-full w-full max-w-md flex-col rounded-2xl border p-8 shadow-lg",
        isPopular
          ? "border-primary/50 bg-card text-card-foreground"
          : "border-border bg-muted/30 text-muted-foreground",
        className
      )}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-8">
          <div className="inline-block rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground">
            Popular
          </div>
        </div>
      )}

      {/* Card Header */}
      <div className="flex items-start justify-between">
        <h3 className="text-2xl font-bold text-foreground">{planName}</h3>
        <img src={iconUrl} alt={`${planName} icon`} className="absolute -top-0.5 left-49 rounded-2xl" />
      </div>

      {/* Price Section */}
      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-5xl font-bold tracking-tight text-foreground">
          ${price}
        </span>
        <span className="text-lg font-medium">/mo</span>
      </div>
      <p className="mt-1 text-sm">${annualPrice} / yr</p>

      {/* Savings Badge */}
      <div className="mt-6 inline-block self-start rounded-md border border-border bg-background px-3 py-1 text-sm font-medium text-foreground">
        You save {savings} a year
      </div>
      <p className="mt-4 text-base">{description}</p>

      {/* Features List */}
      <div className="mt-8 flex-1">
        <p className="mb-4 font-semibold text-foreground">
          {isPopular ? "All features from Premium, plus:" : "All Premium features:"}
        </p>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              {feature.special ? (
                <Sparkles className="h-5 w-5 text-primary" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
              <span className="text-sm text-foreground">{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Subscribe Button */}
      <div className="mt-10">
        <Button
          size="lg"
          className={cn(
            "w-full font-semibold",
            isPopular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-foreground text-background hover:bg-foreground/90"
          )}
        >
          Subscribe <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <p className="mt-4 text-center text-xs">
          30-day money-back guarantee
        </p>
      </div>
    </motion.div>
  );
};