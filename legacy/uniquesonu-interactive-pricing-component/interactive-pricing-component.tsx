import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Switch } from "./switch";
import { Badge } from "./badge";
import { Check, X } from 'lucide-react';

// Types
interface Feature {
  name: string;
  included: boolean;
  description?: string;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: Feature[];
  popular?: boolean;
  buttonText?: string;
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

interface PricingComponentProps {
  plans: PricingPlan[];
  onPlanSelect?: (planId: string, billingCycle: 'monthly' | 'annual') => void;
  defaultBillingCycle?: 'monthly' | 'annual';
  currency?: string;
  annualDiscount?: number;
  className?: string;
  showComparison?: boolean;
}

// Default plans data
const defaultPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individuals and small projects',
    monthlyPrice: 9,
    annualPrice: 7,
    features: [
      { name: 'Up to 5 projects', included: true },
      { name: '10GB storage', included: true },
      { name: 'Basic support', included: true },
      { name: 'API access', included: false },
      { name: 'Advanced analytics', included: false },
      { name: 'Priority support', included: false }
    ],
    buttonText: 'Get Started'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Ideal for growing teams and businesses',
    monthlyPrice: 29,
    annualPrice: 24,
    features: [
      { name: 'Unlimited projects', included: true },
      { name: '100GB storage', included: true },
      { name: 'Priority support', included: true },
      { name: 'API access', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Custom integrations', included: false }
    ],
    popular: true,
    buttonText: 'Start Free Trial'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Advanced features for large organizations',
    monthlyPrice: 99,
    annualPrice: 79,
    features: [
      { name: 'Unlimited everything', included: true },
      { name: 'Unlimited storage', included: true },
      { name: '24/7 dedicated support', included: true },
      { name: 'Full API access', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Custom integrations', included: true }
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'outline'
  }
];

const PricingComponent: React.FC<PricingComponentProps> = ({
  plans = defaultPlans,
  onPlanSelect,
  defaultBillingCycle = 'monthly',
  currency = '$',
  annualDiscount = 20,
  className = '',
  showComparison = false
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(defaultBillingCycle);
  const [activeTab, setActiveTab] = useState<'pricing' | 'comparison'>('pricing');

  const handlePlanSelect = (planId: string) => {
    onPlanSelect?.(planId, billingCycle);
  };

  const handleBillingToggle = (isAnnual: boolean) => {
    setBillingCycle(isAnnual ? 'annual' : 'monthly');
  };

  const formatPrice = (plan: PricingPlan) => {
    const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
    return `${currency}${price}`;
  };

  const getAnnualSavings = (plan: PricingPlan) => {
    const monthlyCost = plan.monthlyPrice * 12;
    const annualCost = plan.annualPrice * 12;
    const savings = Math.round(((monthlyCost - annualCost) / monthlyCost) * 100);
    return savings;
  };

  // Get all unique features for comparison table
  const allFeatures = React.useMemo(() => {
    const featureSet = new Set<string>();
    plans.forEach(plan => {
      plan.features.forEach(feature => featureSet.add(feature.name));
    });
    return Array.from(featureSet);
  }, [plans]);

  const PricingCards = () => (
    <div className="grid gap-6 lg:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
      {plans.map((plan) => (
        <Card 
          key={plan.id}
          className={`relative transition-all duration-200 hover:shadow-lg ${
            plan.popular 
              ? 'border-primary shadow-md scale-105 lg:scale-110' 
              : 'hover:border-muted-foreground/20'
          } ${className}`}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge variant="default" className="px-3 py-1 text-xs font-medium">
                Most Popular
              </Badge>
            </div>
          )}
          
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {plan.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-6">
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight">
                  {formatPrice(plan)}
                </span>
                <span className="text-muted-foreground">
                  /{billingCycle === 'annual' ? 'mo' : 'month'}
                </span>
              </div>
              {billingCycle === 'annual' && (
                <div className="text-sm text-muted-foreground mt-1">
                  Billed annually • Save {getAnnualSavings(plan)}%
                </div>
              )}
            </div>

            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className={`mt-0.5 ${feature.included ? 'text-primary' : 'text-muted-foreground'}`}>
                    {feature.included ? (
                      <Check className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <X className="h-4 w-4" aria-hidden="true" />
                    )}
                  </div>
                  <span className={`text-sm ${feature.included ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter>
            <Button
              onClick={() => handlePlanSelect(plan.id)}
              variant={plan.buttonVariant || (plan.popular ? 'default' : 'outline')}
              className="w-full transition-all duration-200"
              size="lg"
            >
              {plan.buttonText || 'Get Started'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  const ComparisonTable = () => (
    <div className="max-w-5xl mx-auto">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-4 px-4 font-semibold">Features</th>
              {plans.map((plan) => (
                <th key={plan.id} className="text-center py-4 px-4 min-w-[140px]">
                  <div className="space-y-1">
                    <div className="font-semibold">{plan.name}</div>
                    <div className="text-2xl font-bold">{formatPrice(plan)}</div>
                    <div className="text-xs text-muted-foreground">
                      /{billingCycle === 'annual' ? 'mo' : 'month'}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allFeatures.map((featureName) => (
              <tr key={featureName} className="border-b border-border/50 hover:bg-muted/20">
                <td className="py-4 px-4 font-medium">{featureName}</td>
                {plans.map((plan) => {
                  const feature = plan.features.find(f => f.name === featureName);
                  return (
                    <td key={`${plan.id}-${featureName}`} className="text-center py-4 px-4">
                      {feature?.included ? (
                        <Check className="h-5 w-5 text-primary mx-auto" aria-label="Included" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground mx-auto" aria-label="Not included" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className={`w-full py-12 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Select the perfect plan for your needs. All plans include our core features with varying limits and support levels.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-medium transition-colors ${
              billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              Monthly
            </span>
            <Switch
              checked={billingCycle === 'annual'}
              onCheckedChange={handleBillingToggle}
              aria-label="Toggle billing cycle"
            />
            <span className={`text-sm font-medium transition-colors ${
              billingCycle === 'annual' ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              Annual
            </span>
            {billingCycle === 'annual' && (
              <Badge variant="secondary" className="ml-2 text-xs">
                Save up to {annualDiscount}%
              </Badge>
            )}
          </div>

          {/* Tab Navigation */}
          {showComparison && (
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center bg-muted p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('pricing')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'pricing'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Pricing
                </button>
                <button
                  onClick={() => setActiveTab('comparison')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'comparison'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Compare Features
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {!showComparison || activeTab === 'pricing' ? (
          <PricingCards />
        ) : (
          <ComparisonTable />
        )}

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            All plans include 14-day free trial. No credit card required. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

// Example Usage
const ExampleUsage = () => {
  const customPlans: PricingPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'For personal use',
      monthlyPrice: 5,
      annualPrice: 4,
      features: [
        { name: '5 projects', included: true },
        { name: '1GB storage', included: true },
        { name: 'Email support', included: true },
        { name: 'API access', included: false }
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For professionals',
      monthlyPrice: 19,
      annualPrice: 15,
      features: [
        { name: 'Unlimited projects', included: true },
        { name: '50GB storage', included: true },
        { name: 'Priority support', included: true },
        { name: 'API access', included: true }
      ],
      popular: true
    }
  ];

  const handlePlanSelection = (planId: string, billingCycle: 'monthly' | 'annual') => {
    console.log(`Selected plan: ${planId} with ${billingCycle} billing`);
  };

  return (
    <div className="min-h-screen bg-background">
      <PricingComponent
        plans={customPlans}
        onPlanSelect={handlePlanSelection}
        defaultBillingCycle="annual"
        currency="$"
        annualDiscount={25}
        showComparison={true}
        className="my-8"
      />
    </div>
  );
};

export default ExampleUsage;