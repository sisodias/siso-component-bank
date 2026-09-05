import * as React from 'react';
import { useState } from 'react';
import { cn } from "../_utils/cn";
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { Switch } from "./switch";
import { Label } from "./label";
import { CheckIcon, XIcon } from 'lucide-react';

interface Feature {
  text: string;
  included: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: Feature[];
  isPopular?: boolean;
  ctaText: string;
  /**
   * Tailwind CSS grid classes to apply to the card for bento layout.
   * E.g., 'md:col-span-2 lg:col-span-2 xl:col-span-2' for a wider card.
   */
  gridClasses?: string;
  popularBadgeText?: string;
}

interface PricingBentoProps {
  plans: PricingPlan[];
  className?: string; // For the overall section container
}

const FeatureItem: React.FC<{ feature: Feature }> = ({ feature }) => (
  <li className="flex items-start gap-2">
    {feature.included ? (
      <CheckIcon className="h-4 w-4 flex-shrink-0 text-green-500 mt-1" />
    ) : (
      <XIcon className="h-4 w-4 flex-shrink-0 text-gray-400 mt-1" />
    )}
    <span className={cn(feature.included ? 'text-foreground' : 'text-muted-foreground')}>
      {feature.text}
    </span>
  </li>
);

export const PricingBento: React.FC<PricingBentoProps> = ({ plans, className }) => {
  const [isYearly, setIsYearly] = useState(false);

  const handleCtaClick = (planId: string) => {
    console.log(`Selected plan: ${planId}, Billing: ${isYearly ? 'Yearly' : 'Monthly'}`);
    // Here you would typically redirect to a checkout page or trigger a subscription flow
  };

  const getPriceDisplay = (plan: PricingPlan) => {
    const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
    const period = isYearly ? '/year' : '/month';
    const monthlyEquivalentYearly = plan.yearlyPrice / 12;
    const savings = isYearly && plan.monthlyPrice > monthlyEquivalentYearly
      ? Math.round((1 - (monthlyEquivalentYearly / plan.monthlyPrice)) * 100)
      : 0;

    return (
      <div className="flex items-baseline space-x-2">
        <p className="text-5xl font-extrabold tracking-tight">
          ${price}
        </p>
        <span className="text-xl font-normal text-muted-foreground">{period}</span>
        {isYearly && savings > 0 && (
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            (Save {savings}%)
          </span>
        )}
      </div>
    );
  };

  // Sort plans to ensure 'isPopular' plans appear first, which can help with bento layout visually
  const sortedPlans = [...plans].sort((a, b) => {
    if (a.isPopular && !b.isPopular) return -1;
    if (!a.isPopular && b.isPopular) return 1;
    return 0;
  });

  return (
    <section className={cn('container py-12 md:py-24', className)}>
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Flexible Pricing for Everyone</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose the plan that's right for you, and start building today.
        </p>
        <div className="mt-8 flex items-center justify-center space-x-3">
          <Label htmlFor="billing-toggle-monthly" className={cn(!isYearly && 'font-bold text-primary')}>Monthly</Label>
          <Switch
            id="billing-toggle-monthly"
            checked={isYearly}
            onCheckedChange={setIsYearly}
            className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
          />
          <Label htmlFor="billing-toggle-monthly" className={cn(isYearly && 'font-bold text-primary')}>Yearly (Save ~17%)</Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
        {sortedPlans.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              'flex flex-col justify-between p-6 transition-all duration-300 ease-in-out',
              plan.isPopular && 'border-2 border-primary shadow-lg dark:shadow-primary/20 scale-[1.02]', // Emphasize popular plan
              plan.gridClasses // Apply custom grid classes for bento layout
            )}
          >
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-3xl font-bold flex items-center">
                {plan.name}
                {plan.isPopular && (
                  <span className="ml-3 inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    {plan.popularBadgeText || 'Most Popular'}
                  </span>
                )}
              </CardTitle>
              <CardDescription className="mt-2 text-base text-muted-foreground">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow p-0 mb-6">
              {getPriceDisplay(plan)}
              <ul className="mt-6 space-y-3 text-sm">
                {plan.features.map((feature, index) => (
                  <FeatureItem key={index} feature={feature} />
                ))}
              </ul>
            </CardContent>
            <CardFooter className="p-0 mt-auto">
              <Button
                className={cn('w-full', plan.isPopular && 'bg-primary hover:bg-primary/90 text-primary-foreground')}
                onClick={() => handleCtaClick(plan.id)}
              >
                {plan.ctaText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
