import React, { useState } from 'react';
import { Check, X, Users, Shield, Zap } from 'lucide-react';

// Constants for better maintainability
const BILLING_CYCLES = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly'
} as const;

const PLAN_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary'
} as const;

// Type definitions
interface Feature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  badge?: string;
  features: Feature[];
  cta: string;
  ctaVariant: keyof typeof PLAN_VARIANTS;
}

// Component variants and styling
const buttonVariants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm',
  secondary: 'bg-gray-50 text-gray-900 hover:bg-gray-100 focus:ring-gray-500 border border-gray-300'
};

const cardVariants = {
  default: 'border-gray-200 hover:border-gray-300',
  featured: 'border-blue-200 shadow-md ring-1 ring-blue-100 md:scale-105'
};

// Subcomponents for better organization
const BillingToggle = ({ billingCycle, onBillingChange }) => (
  <div className="inline-flex items-center bg-gray-100 rounded-lg p-1 w-full max-w-xs sm:max-w-none sm:w-auto" role="tablist" aria-label="Billing cycle">
    <button
      onClick={() => onBillingChange(BILLING_CYCLES.MONTHLY)}
      className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
        billingCycle === BILLING_CYCLES.MONTHLY
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-500 hover:text-gray-900'
      }`}
      role="tab"
      aria-selected={billingCycle === BILLING_CYCLES.MONTHLY}
      aria-controls="pricing-content"
    >
      Monthly billing
    </button>
    <button
      onClick={() => onBillingChange(BILLING_CYCLES.YEARLY)}
      className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
        billingCycle === BILLING_CYCLES.YEARLY
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-500 hover:text-gray-900'
      }`}
      role="tab"
      aria-selected={billingCycle === BILLING_CYCLES.YEARLY}
      aria-controls="pricing-content"
    >
      Yearly billing
      <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-green-500 text-white text-xs px-1 sm:px-1.5 py-0.5 rounded-full" aria-label="20% discount">
        20% off
      </span>
    </button>
  </div>
);

const PricingBadge = ({ text }) => (
  <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 z-10">
    <div className="bg-blue-600 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
      {text}
    </div>
  </div>
);

const PriceDisplay = ({ plan, billingCycle }) => {
  const getPrice = (plan) => {
    if (plan.monthlyPrice === 0) return 'Free';
    return billingCycle === BILLING_CYCLES.MONTHLY ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const price = getPrice(plan);

  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex items-baseline justify-center">
        <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
          {price === 'Free' ? 'Free' : `$${price}`}
        </span>
        {price !== 'Free' && (
          <span className="text-gray-500 ml-1 text-sm sm:text-base">
            /{billingCycle === BILLING_CYCLES.MONTHLY ? 'mo' : 'mo'}
          </span>
        )}
      </div>
      {billingCycle === BILLING_CYCLES.YEARLY && plan.monthlyPrice > 0 && (
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          ${plan.monthlyPrice}/mo billed monthly
        </p>
      )}
    </div>
  );
};

const FeatureList = ({ features }) => (
  <div className="space-y-3 sm:space-y-4">
    <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-3 sm:mb-4">
      What's included:
    </h4>
    <ul className="space-y-3 sm:space-y-4" role="list">
      {features.map((feature, index) => (
        <li key={`feature-${index}`} className="flex items-start gap-2 sm:gap-3">
          <div className={`mt-0.5 sm:mt-1 flex-shrink-0 ${feature.included ? 'text-green-500' : 'text-gray-300'}`} aria-hidden="true">
            {feature.included ? (
              <Check className="w-3 h-3 sm:w-4 sm:h-4" />
            ) : (
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
          </div>
          <span
            className={`text-xs sm:text-sm leading-relaxed ${
              feature.included ? 'text-gray-700' : 'text-gray-400'
            }`}
          >
            {feature.text}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

const PricingCard = ({ plan, billingCycle, onPlanSelect }) => {
  const isFeatured = Boolean(plan.badge);
  
  return (
    <div
      className={`relative bg-white rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-lg ${
        isFeatured ? cardVariants.featured : cardVariants.default
      }`}
      role="article"
      aria-labelledby={`plan-${plan.id}-title`}
    >
      {plan.badge && <PricingBadge text={plan.badge} />}

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Plan Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h3 id={`plan-${plan.id}-title`} className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            {plan.name}
          </h3>
          <p className="text-gray-600 text-sm mb-4 sm:mb-6 px-2">
            {plan.description}
          </p>
          
          <PriceDisplay plan={plan} billingCycle={billingCycle} />
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onPlanSelect(plan)}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 mb-6 sm:mb-8 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            buttonVariants[plan.ctaVariant]
          }`}
          aria-describedby={`plan-${plan.id}-title`}
        >
          {plan.cta}
        </button>

        {/* Features */}
        <FeatureList features={plan.features} />
      </div>
    </div>
  );
};

const TrustIndicators = () => {
  const indicators = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with SOC2 compliance and advanced encryption"
    },
    {
      icon: Zap,
      title: "99.9% Uptime",
      description: "Reliable service with guaranteed uptime and 24/7 monitoring"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Get help when you need it from our team of product experts"
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
        {indicators.map((indicator, index) => (
          <div key={`indicator-${index}`} className="flex flex-col items-center">
            <indicator.icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mx-auto mb-2 sm:mb-3" aria-hidden="true" />
            <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
              {indicator.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {indicator.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main component
export default function ModernPricingCards() {
  const [billingCycle, setBillingCycle] = useState(BILLING_CYCLES.MONTHLY);

  // Plan data - could be moved to external config
  const plans: Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for individuals and small teams getting started',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        { text: '2 workspaces', included: true },
        { text: 'Up to 10 team members', included: true },
        { text: '5GB storage', included: true },
        { text: 'Basic analytics', included: true },
        { text: 'Email support', included: true },
        { text: 'Mobile app access', included: false },
        { text: 'Advanced integrations', included: false },
        { text: 'Priority support', included: false }
      ],
      cta: 'Start Free',
      ctaVariant: 'secondary'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal for growing businesses and established teams',
      monthlyPrice: 15,
      yearlyPrice: 12,
      badge: 'Most Popular',
      features: [
        { text: 'Unlimited workspaces', included: true },
        { text: 'Unlimited team members', included: true },
        { text: '100GB storage', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Priority email support', included: true },
        { text: 'Mobile app access', included: true },
        { text: 'Advanced integrations', included: true },
        { text: 'Priority support', included: false }
      ],
      cta: 'Start 14-day Trial',
      ctaVariant: 'primary'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Advanced features for large organizations',
      monthlyPrice: 25,
      yearlyPrice: 20,
      features: [
        { text: 'Unlimited workspaces', included: true },
        { text: 'Unlimited team members', included: true },
        { text: 'Unlimited storage', included: true },
        { text: 'Custom analytics', included: true },
        { text: '24/7 phone & email support', included: true },
        { text: 'Mobile app access', included: true },
        { text: 'Advanced integrations', included: true },
        { text: 'Dedicated account manager', included: true }
      ],
      cta: 'Contact Sales',
      ctaVariant: 'secondary'
    }
  ];

  const handleBillingChange = (cycle: string) => {
    setBillingCycle(cycle);
  };

  const handlePlanSelect = (plan: Plan) => {
    // Handle plan selection - could emit event or call parent callback
    console.log('Selected plan:', plan.id);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Choose the perfect plan for your team. Always know what you'll pay.
          </p>
          
          <BillingToggle billingCycle={billingCycle} onBillingChange={handleBillingChange} />
        </header>

        {/* Pricing Cards */}
        <main id="pricing-content" role="tabpanel">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan) => (
              <PricingCard 
                key={plan.id} 
                plan={plan} 
                billingCycle={billingCycle}
                onPlanSelect={handlePlanSelect}
              />
            ))}
          </div>
        </main>

        {/* Trust Indicators & Footer */}
        <footer className="text-center mt-12 sm:mt-16">
          <TrustIndicators />
          
          <div className="mt-6 sm:mt-8 text-gray-500 px-4">
            <p className="mb-2 text-sm sm:text-base">All plans include a 30-day money-back guarantee</p>
            <p className="text-xs sm:text-sm">
              Questions? {' '}
              <a 
                href="#contact" 
                className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
              >
                Contact our sales team
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}