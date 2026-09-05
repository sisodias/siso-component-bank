import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils"; // Your utility for merging class names
import { Button } from "@/components/ui/button"; // Assuming shadcn Button
import { Switch } from "@/components/ui/switch"; // Assuming shadcn Switch
import { Label } from "@/components/ui/label";   // Assuming shadcn Label
import { Badge } from "@/components/ui/badge";   // Assuming shadcn Badge
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Assuming shadcn Card

// Define types for props for strong typing and reusability
interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Tier {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  priceSuffix?: string;
  cta: string;
  features: Feature[];
  accentColor: string; // e.g., 'hsl(var(--primary))' or 'hsl(346.8 77.2% 49.8%)'
  extraInfo?: React.ReactNode;
}

interface AnimatedPricingTiersProps {
  title: string;
  subtitle: string;
  illustrationSrc: string;
  monthlyLabel?: string;
  yearlyLabel?: string;
  yearlyDiscountBadge?: string;
  tiers: Tier[];
}

export const AnimatedPricingTiers: React.FC<AnimatedPricingTiersProps> = ({
  title,
  subtitle,
  illustrationSrc,
  monthlyLabel = "Pay monthly",
  yearlyLabel = "Pay yearly",
  yearlyDiscountBadge,
  tiers,
}) => {
  const [isYearly, setIsYearly] = useState(false);

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        {/* Header Section */}
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
            {title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
        </motion.div>
        <motion.div className="hidden lg:block justify-self-end" variants={itemVariants}>
          <img
            src={illustrationSrc}
            alt="Doodle illustration"
            className="w-64 h-auto"
          />
        </motion.div>
      </motion.div>

      {/* Billing Toggle Switch */}
      <motion.div
        className="flex items-center justify-center mt-10 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Label htmlFor="billing-toggle">{monthlyLabel}</Label>
        <Switch
          id="billing-toggle"
          checked={isYearly}
          onCheckedChange={setIsYearly}
          aria-label="Toggle billing cycle"
        />
        <div className="flex items-center gap-2">
            <Label htmlFor="billing-toggle">{yearlyLabel}</Label>
            {yearlyDiscountBadge && (
                <Badge variant="secondary" className="text-xs font-semibold">
                    {yearlyDiscountBadge}
                </Badge>
            )}
        </div>
      </motion.div>

      {/* Pricing Cards */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 items-start"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {tiers.map((tier) => (
          <motion.div key={tier.name} variants={itemVariants}>
            <Card className="h-full border-2">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                <div className="flex items-baseline gap-2 mt-4">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={isYearly ? "yearly" : "monthly"}
                      className="text-4xl font-extrabold"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      ${isYearly ? tier.yearlyPrice : tier.monthlyPrice}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-muted-foreground">
                    {tier.priceSuffix || "/ per month"}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <Button
                  className="w-full text-white font-semibold"
                  style={{ backgroundColor: tier.accentColor }}
                >
                  {tier.cta}
                </Button>
                {tier.extraInfo && <div className="mt-6">{tier.extraInfo}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 mt-8 pt-8 border-t">
                  {tier.features.map((feature) => (
                    <div key={feature.title} className="flex items-start gap-3">
                      <div className="flex-shrink-0" style={{ color: tier.accentColor }}>
                        {feature.icon}
                      </div>
                      <div>
                        <p className="font-semibold">{feature.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};