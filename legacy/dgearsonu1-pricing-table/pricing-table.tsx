import * as React from 'react';
import { Check, X } from 'lucide-react';
import {useState} from 'react'


// --- Types ---

/**
 * Defines the structure for a single feature in a pricing plan.
 */
interface Feature {
  id: string;
  name: string;
  included: boolean;
}

/**
 * Defines the structure for a single pricing plan.
 */
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: Feature[];
  isRecommended?: boolean;
  buttonText: string;
  disabled?: boolean;
}

/**
 * Defines the valid billing cycles.
 */
export type BillingCycle = 'monthly' | 'annually';

/**
 * Props for the PricingTable component.
 */
export interface PricingTableProps extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * Array of pricing plans to display.
   */
  plans: PricingPlan[];
  /**
   * The currently selected billing cycle.
   */
  billingCycle: BillingCycle;
  /**
   * Callback function when a plan's button is clicked.
   * @param planId The ID of the selected plan.
   */
  onSelect: (planId: string) => void;
  /**
   * Optional custom label for the billing cycle toggle.
   */
  cycleToggleLabel?: string;
  /**
   * Callback function when the billing cycle is changed.
   * @param cycle The new billing cycle.
   */
  onCycleChange?: (cycle: BillingCycle) => void;
  /**
   * ID of the currently active/selected plan (optional for highlighting).
   */
  activePlanId?: string;
}

// --- Component: BillingCycleToggle (Internal) ---

interface BillingCycleToggleProps {
  billingCycle: BillingCycle;
  onCycleChange: (cycle: BillingCycle) => void;
  label?: string;
}

const BillingCycleToggle: React.FC<BillingCycleToggleProps> = ({
  billingCycle,
  onCycleChange,
  label = 'Billing Cycle',
}) => {
  const isMonthly = billingCycle === 'monthly';

  const toggleCycle = () => {
    onCycleChange(isMonthly ? 'annually' : 'monthly');
  };

  return (
    <div className="flex items-center justify-center space-x-3 p-4">
      <span
        className={`text-sm font-medium transition-colors ${
          isMonthly ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        Monthly
      </span>
      <button
        onClick={toggleCycle}
        aria-label={label}
        aria-checked={!isMonthly}
        role="switch"
        className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
        data-state={!isMonthly ? 'checked' : 'unchecked'}
      >
        <span className="sr-only">{label}</span>
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${
            !isMonthly ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      <span
        className={`text-sm font-medium transition-colors ${
          !isMonthly ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        Annually (Save 20%)
      </span>
    </div>
  );
};

// --- Component: PlanCard (Internal) ---

interface PlanCardProps {
  plan: PricingPlan;
  billingCycle: BillingCycle;
  onSelect: (planId: string) => void;
  isActive: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, billingCycle, onSelect, isActive }) => {
  const price =
    billingCycle === 'annually' ? Math.round(plan.price * 0.8) : plan.price;
  const cycleLabel = billingCycle === 'annually' ? '/yr' : '/mo';

  // Base card classes
  const baseClasses = 'flex flex-col rounded-lg border p-6 transition-all duration-300 shadow-md hover:shadow-lg h-full';

  // Conditional classes for active/recommended states (using shadcn/ui tokens)
  const activeClasses = isActive
    ? 'border-primary ring-2 ring-primary bg-accent/20'
    : 'border-border bg-card';
  
  const recommendedClasses = plan.isRecommended && !isActive
    ? 'border-primary/50'
    : '';

  // Button classes
  const buttonClasses = `w-full mt-auto rounded-md py-2 px-4 text-sm font-semibold transition-colors duration-300 ${
    isActive || plan.isRecommended
      ? 'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background'
      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background'
  } ${
    plan.disabled
      ? 'opacity-50 cursor-not-allowed'
      : ''
  }`;

  return (
    <div className={`${baseClasses} ${activeClasses} ${recommendedClasses}`}>
      {plan.isRecommended && (
        <div className="mb-4 self-start rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
          Recommended
        </div>
      )}
      <h3 className="text-2xl font-bold text-card-foreground">{plan.name}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
      <div className="my-6">
        <span className="text-4xl font-extrabold text-card-foreground">
          ${price}
        </span>
        <span className="text-lg font-medium text-muted-foreground">{cycleLabel}</span>
        {billingCycle === 'annually' && plan.price !== price && (
          <p className="mt-1 text-xs text-muted-foreground line-through">
            ${plan.price * 12} billed annually
          </p>
        )}
      </div>

      <ul className="space-y-3 mb-8 flex-grow">
        {plan.features.map((feature) => (
          <li key={feature.id} className="flex items-center">
            {feature.included ? (
              <Check className="h-4 w-4 text-primary mr-3 shrink-0" aria-hidden="true" />
            ) : (
              <X className="h-4 w-4 text-muted-foreground mr-3 shrink-0" aria-hidden="true" />
            )}
            <span
              className={`text-sm ${
                feature.included ? 'text-card-foreground' : 'text-muted-foreground'
              }`}
            >
              {feature.name}
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => !plan.disabled && onSelect(plan.id)}
        className={buttonClasses}
        disabled={plan.disabled}
        aria-label={`Select ${plan.name} plan`}
      >
        {plan.buttonText}
      </button>
    </div>
  );
};

// --- Component: PricingTable (Main) ---

/**
 * A responsive, enterprise-ready pricing comparison table component.
 */
const PricingTable: React.FC<PricingTableProps> = ({
  plans,
  billingCycle,
  onSelect,
  onCycleChange,
  cycleToggleLabel,
  activePlanId,
  className,
  ...props
}) => {
  return (
    <div className={`container mx-auto py-8 md:py-12 ${className}`} {...props}>
      {onCycleChange && (
        <BillingCycleToggle
          billingCycle={billingCycle}
          onCycleChange={onCycleChange}
          label={cycleToggleLabel}
        />
      )}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-2">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            billingCycle={billingCycle}
            onSelect={onSelect}
            isActive={plan.id === activePlanId}
          />
        ))}
      </div>
    </div>
  );
};



const MOCK_PLANS: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 19,
    description: 'Perfect for small teams and personal projects.',
    features: [
      { id: 'f1', name: '5 Projects', included: true },
      { id: 'f2', name: '10 GB Storage', included: true },
      { id: 'f3', name: 'Email Support', included: true },
      { id: 'f4', name: 'Dedicated Analyst', included: false },
      { id: 'f5', name: 'Priority Queue', included: false },
    ],
    buttonText: 'Get Started',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49,
    description: 'Scale your business with advanced features and tools.',
    features: [
      { id: 'f1', name: 'Unlimited Projects', included: true },
      { id: 'f2', name: '100 GB Storage', included: true },
      { id: 'f3', name: 'Priority Email Support', included: true },
      { id: 'f4', name: 'Dedicated Analyst', included: true },
      { id: 'f5', name: 'Priority Queue', included: false },
    ],
    isRecommended: true,
    buttonText: 'Start 14-Day Trial',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    description: 'Custom solutions and dedicated support for large organizations.',
    features: [
      { id: 'f1', name: 'Unlimited Projects', included: true },
      { id: 'f2', name: 'Unlimited Storage', included: true },
      { id: 'f3', name: '24/7 Phone Support', included: true },
      { id: 'f4', name: 'Dedicated Analyst', included: true },
      { id: 'f5', name: 'Priority Queue', included: true },
    ],
    buttonText: 'Contact Sales',
    disabled: false,
  },
];

const ExamplePricingTable = () => {
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    console.log(`Plan selected: ${planId} with cycle: ${cycle}`);
    setSelectedPlanId(planId);
    // Add navigation or checkout logic here
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h1>
      <PricingTable
        plans={MOCK_PLANS}
        billingCycle={cycle}
        onSelect={handleSelectPlan}
        onCycleChange={setCycle}
        activePlanId={selectedPlanId || MOCK_PLANS[1].id} // Default to Pro
      />
    </div>
  );
};

export default ExamplePricingTable;
