import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assuming you have a utility for classnames
import { Button } from '@/components/ui/button'; // Assuming shadcn button

// --- ICONS ---
const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={cn('w-5 h-5', className)}
  >
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
      clipRule="evenodd"
    />
  </svg>
);

// --- CVA VARIANTS FOR THE CARD ---
const cardVariants = cva(
  'relative flex flex-col p-8 rounded-2xl border shadow-sm transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-card border-border',
        popular:
          'bg-card border-primary shadow-lg shadow-primary/10 -translate-y-2',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

// --- PROPS INTERFACE ---
export interface PricingCardProps extends VariantProps<typeof cardVariants> {
  className?: string;
  planName: string;
  description: string;
  price: number;
  billingCycle: string;
  features: string[];
  buttonText: string;
  isCurrentPlan?: boolean;
  icon?: React.ReactNode;
}

// --- COMPONENT DEFINITION ---
const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  (
    {
      className,
      variant,
      planName,
      description,
      price,
      billingCycle,
      features,
      buttonText,
      isCurrentPlan = false,
      icon,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={cn(cardVariants({ variant }), className)}
        {...props}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      >
        {/* Popular Badge */}
        {variant === 'popular' && (
          <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full">
            POPULAR
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          {icon && (
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold text-card-foreground">{planName}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        {/* Price */}
        <div className="my-6">
          <span className="text-5xl font-bold">${price}</span>
          <span className="text-muted-foreground">{billingCycle}</span>
        </div>

        {/* Button */}
        <Button
          className="w-full"
          size="lg"
          variant={isCurrentPlan ? 'secondary' : variant === 'popular' ? 'default' : 'outline'}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? 'Current plan' : buttonText}
        </Button>

        {/* Features */}
        <ul className="mt-8 space-y-4 text-sm text-muted-foreground flex-1">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    );
  }
);

PricingCard.displayName = 'PricingCard';

export { PricingCard };