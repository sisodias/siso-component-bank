import * as React from 'react';
import { cn } from "../_utils/cn"; // Assuming a utility function for class merging
import { Button } from "./button";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { Check, X } from "lucide-react";

// --- 1. Typescript Interfaces (API) ---

type BillingCycle = 'monthly' | 'annually';

interface Feature {
  name: string;
  isIncluded: boolean;
  tooltip?: string;
}

interface PriceTier {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceAnnually: number;
  isPopular: boolean;
  buttonLabel: string;
  features: Feature[];
}

interface PricingComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The list of pricing tiers to display. Must contain exactly 3 tiers. */
  plans: [PriceTier, PriceTier, PriceTier];
  /** The currently selected billing cycle. */
  billingCycle: BillingCycle;
  /** Callback function when the user changes the billing cycle. */
  onCycleChange: (cycle: BillingCycle) => void;
  /** Callback function when a user selects a plan. */
  onPlanSelect: (planId: string, cycle: BillingCycle) => void;
}

// --- 2. Utility Components ---

/** Renders a single feature row with an icon. */
const FeatureItem: React.FC<{ feature: Feature }> = ({ feature }) => {
  const Icon = feature.isIncluded ? Check : X;
  const iconColor = feature.isIncluded ? "text-primary" : "text-muted-foreground";

  return (
    <li className="flex items-start space-x-3 py-2">
      <Icon className={cn("h-4 w-4 flex-shrink-0 mt-0.5", iconColor)} aria-hidden="true" />
      <span className={cn("text-sm", feature.isIncluded ? "text-foreground" : "text-muted-foreground")}>
        {feature.name}
      </span>
    </li>
  );
};

// --- 3. Main Component: PricingComponent ---

const PricingComponent: React.FC<PricingComponentProps> = ({
  plans,
  billingCycle,
  onCycleChange,
  onPlanSelect,
  className,
  ...props
}) => {
  // Ensure exactly 3 plans are passed for the intended layout
  if (plans.length !== 3) {
    console.error("PricingComponent requires exactly 3 pricing tiers.");
    return null;
  }

  const annualDiscountPercent = 20; // Example: 20% discount for annual billing

  // --- 3.1. Billing Toggle ---
  const CycleToggle = (
    <div className="flex justify-center mb-10 mt-2">
      <ToggleGroup
        type="single"
        value={billingCycle}
        onValueChange={(value) => {
          if (value && (value === 'monthly' || value === 'annually')) {
            onCycleChange(value);
          }
        }}
        aria-label="Select billing cycle"
        className="border rounded-lg p-1 bg-muted/50 dark:bg-muted/30"
      >
        <ToggleGroupItem
          value="monthly"
          aria-label="Monthly Billing"
          className="px-6 py-1.5 text-sm font-medium data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:border data-[state=on]:ring-1 data-[state=on]:ring-ring/20 rounded-md transition-colors"
        >
          Monthly
        </ToggleGroupItem>
        <ToggleGroupItem
          value="annually"
          aria-label="Annual Billing"
          className="px-6 py-1.5 text-sm font-medium data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:border data-[state=on]:ring-1 data-[state=on]:ring-ring/20 rounded-md transition-colors relative"
        >
          Annually
          <span className="absolute -top-3 right-0 text-xs font-semibold text-primary/80 dark:text-primary/70 bg-primary/10 dark:bg-primary/20 px-1.5 rounded-full whitespace-nowrap">
            Save {annualDiscountPercent}%
          </span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );

  // --- 3.2. Pricing Cards & Comparison Table Data ---

  // Extract all unique feature names across all plans for the comparison table header
  const allFeatures = Array.from(new Set(plans.flatMap(p => p.features.map(f => f.name))));
  
  // Render the list of pricing cards
  const PricingCards = (
    <div className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
      {plans.map((plan) => {
        const isFeatured = plan.isPopular;
        const currentPrice = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnually;
        const originalMonthlyPrice = plan.priceMonthly;
        const priceSuffix = billingCycle === 'monthly' ? '/mo' : '/yr';

        return (
          <Card
            key={plan.id}
            className={cn(
              "flex flex-col transition-all duration-300 shadow-md hover:shadow-lg dark:hover:shadow-white/10",
              isFeatured && "ring-2 ring-primary dark:ring-primary/80 shadow-xl dark:shadow-primary/20 transform md:scale-[1.02] hover:scale-[1.04]"
            )}
          >
            <CardHeader className="p-6 pb-4">
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                {isFeatured && (
                  <span className="text-xs font-semibold px-3 py-1 bg-primary text-primary-foreground rounded-full">
                    Most Popular
                  </span>
                )}
              </div>
              <CardDescription className="text-sm mt-1">{plan.description}</CardDescription>
              <div className="mt-4">
                <p className="text-4xl font-extrabold text-foreground">
                  ${currentPrice}
                  <span className="text-base font-normal text-muted-foreground ml-1">{priceSuffix}</span>
                </p>
                {billingCycle === 'annually' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Billed annually (${plan.priceAnnually})
                  </p>
                )}
                {billingCycle === 'annually' && (
                    <p className="text-xs text-muted-foreground line-through opacity-70 mt-1">
                        ${originalMonthlyPrice}/mo
                    </p>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-grow p-6 pt-0">
              <h4 className="text-sm font-semibold mb-2 mt-4 text-foreground/80">Key Features:</h4>
              <ul className="list-none space-y-0">
                {plan.features.slice(0, 5).map((feature) => (
                  <FeatureItem key={feature.name} feature={feature} />
                ))}
                {plan.features.length > 5 && (
                    <li className="text-sm text-muted-foreground mt-2">
                        + {plan.features.length - 5} more features
                    </li>
                )}
              </ul>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button
                onClick={() => onPlanSelect(plan.id, billingCycle)}
                className={cn(
                  "w-full transition-all duration-200",
                  isFeatured
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 dark:shadow-primary/40"
                    : "bg-muted text-foreground hover:bg-muted/80 border border-input"
                )}
                size="lg"
                aria-label={`Select ${plan.name} plan for ${currentPrice} ${priceSuffix}`}
              >
                {plan.buttonLabel}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );

  // --- 3.3. Comparison Table (Mobile hidden, Tablet/Desktop visible) ---
  const ComparisonTable = (
    <div className="mt-16 hidden md:block border rounded-lg overflow-x-auto shadow-sm dark:border-border/50">
      <table className="min-w-full divide-y divide-border/80 dark:divide-border/50">
        <thead>
          <tr className="bg-muted/30 dark:bg-muted/20">
            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-foreground/80 w-[200px] whitespace-nowrap">
              Feature
            </th>
            {plans.map((plan) => (
              <th
                key={`th-${plan.id}`}
                scope="col"
                className={cn(
                  "px-6 py-4 text-center text-sm font-semibold text-foreground/80 whitespace-nowrap",
                  plan.isPopular && "bg-primary/10 dark:bg-primary/20"
                )}
              >
                {plan.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/80 dark:divide-border/50 bg-background/90">
          {allFeatures.map((featureName, index) => (
            <tr key={featureName} className={cn("transition-colors hover:bg-accent/20 dark:hover:bg-accent/10", index % 2 === 0 ? "bg-background" : "bg-muted/10 dark:bg-muted/5")}>
              <td className="px-6 py-3 text-left text-sm font-medium text-foreground/90 whitespace-nowrap">
                {featureName}
              </td>
              {plans.map((plan) => {
                const feature = plan.features.find(f => f.name === featureName);
                const isIncluded = feature?.isIncluded ?? false;
                const Icon = isIncluded ? Check : X;
                const iconColor = isIncluded ? "text-primary" : "text-muted-foreground/70";

                return (
                  <td
                    key={`${plan.id}-${featureName}`}
                    className={cn(
                      "px-6 py-3 text-center transition-all duration-150",
                      plan.isPopular && "bg-primary/5 dark:bg-primary/10"
                    )}
                  >
                    <Icon className={cn("h-5 w-5 mx-auto", iconColor)} aria-hidden="true" />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // --- 3.4. Final Render ---
  return (
    <div className={cn("w-full py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)} {...props}>
      <header className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Choose the right plan for your business.
        </h2>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Scale effortlessly with features designed for growth, from startups to enterprise.
        </p>
      </header>
      
      {CycleToggle}
      
      {/* Pricing Cards (Mobile-first layout) */}
      <section aria-labelledby="pricing-plans">
        {PricingCards}
      </section>

      {/* Comparison Table (Desktop/Tablet visibility) */}
      <section aria-label="Feature Comparison Table" className="mt-16">
        <h3 className="text-2xl font-bold mb-6 hidden md:block text-center text-foreground">
          Detailed Feature Comparison
        </h3>
        {ComparisonTable}
      </section>
    </div>
  );
};




const examplePlans: [PriceTier, PriceTier, PriceTier] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for new teams and small projects.',
    priceMonthly: 19,
    priceAnnually: 182, // ~15.17/mo (20% discount from $19)
    isPopular: false,
    buttonLabel: 'Start Free Trial',
    features: [
      { name: '1 Project', isIncluded: true },
      { name: 'Basic Analytics', isIncluded: true },
      { name: 'Email Support', isIncluded: true },
      { name: '10,000 API Calls', isIncluded: true },
      { name: 'Custom Domains', isIncluded: false },
      { name: 'Dedicated Account Manager', isIncluded: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Everything a growing business needs to succeed.',
    priceMonthly: 49,
    priceAnnually: 470, // ~39.17/mo (20% discount from $49)
    isPopular: true,
    buttonLabel: 'Choose Pro',
    features: [
      { name: 'Unlimited Projects', isIncluded: true },
      { name: 'Advanced Analytics', isIncluded: true },
      { name: 'Priority Chat Support', isIncluded: true },
      { name: '500,000 API Calls', isIncluded: true },
      { name: 'Custom Domains', isIncluded: true },
      { name: 'SLAs and Uptime Guarantees', isIncluded: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Advanced features and dedicated support for large organizations.',
    priceMonthly: 199,
    priceAnnually: 1910, // ~159.17/mo (20% discount from $199)
    isPopular: false,
    buttonLabel: 'Contact Sales',
    features: [
      { name: 'Unlimited Projects', isIncluded: true },
      { name: 'Advanced Analytics', isIncluded: true },
      { name: 'Priority Chat Support', isIncluded: true },
      { name: '5,000,000 API Calls', isIncluded: true },
      { name: 'Custom Domains', isIncluded: true },
      { name: 'Dedicated Account Manager', isIncluded: true },
      { name: 'SLAs and Uptime Guarantees', isIncluded: true },
      { name: 'Single Sign-On (SSO)', isIncluded: true },
    ],
  },
];

// Example React Component Usage
const ExampleComp = () => {
  const [cycle, setCycle] = React.useState<BillingCycle>('annually');

  const handleCycleChange = (newCycle: BillingCycle) => {
    setCycle(newCycle);
    console.log(`Billing cycle changed to: ${newCycle}`);
  };

  const handlePlanSelect = (planId: string, currentCycle: BillingCycle) => {
    console.log(`User selected plan: ${planId} with cycle: ${currentCycle}`);
    // Navigation or API call logic would go here
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PricingComponent
        plans={examplePlans}
        billingCycle={cycle}
        onCycleChange={handleCycleChange}
        onPlanSelect={handlePlanSelect}
      />
    </div>
  );
};


export default ExampleComp