// components/ui/pricing-table.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assuming you have a utility for class names
import { Check, Zap, Gem, Crown, Rocket } from 'lucide-react';

// Define the structure for a single pricing plan
export interface Plan {
  tier: string;
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  primaryCta: {
    text: string;
  };
  secondaryCta: string;
  icon: React.ReactNode;
  highlighted?: boolean;
  isMostPopular?: boolean;
  popularText?: string;
}

// Define the props for the PricingTable component
interface PricingTableProps {
  plans: Plan[];
}

// Animation variants for the container and individual cards
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
    },
  },
};

const PricingTable: React.FC<PricingTableProps> = ({ plans }) => {
  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Component Title */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">
          Your Direct Ticket to the <span className="text-primary">Financial Markets</span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          You can try Forecaster for free for 7 days! Just get started.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className={cn(
              'relative flex flex-col h-full rounded-2xl border p-6 transition-transform transform hover:scale-[1.02]',
              plan.highlighted
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-card-foreground',
            )}
          >
            {/* Most Popular Badge */}
            {plan.isMostPopular && (
               <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3">
                 <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg -rotate-12">
                   V
                 </div>
               </div>
            )}

            <div className="flex-1">
                {/* Plan Tier and Icon */}
                <div className="flex items-center gap-2 mb-4 font-semibold">
                    {plan.icon}
                    <span>{plan.tier}</span>
                </div>

                {/* Plan Title and Description */}
                <h3 className="text-2xl font-bold">{plan.title}</h3>
                <p className={cn(
                    "mt-2 text-sm",
                    plan.highlighted ? 'text-primary-foreground/80' : 'text-muted-foreground'
                )}>
                    {plan.description}
                </p>

                {/* Price */}
                <div className="mt-6 mb-8">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className={cn(
                        "text-lg",
                        plan.highlighted ? 'text-primary-foreground/80' : 'text-muted-foreground'
                    )}>
                       {plan.period}
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button className={cn(
                        "w-full py-3 px-6 rounded-lg font-semibold text-center transition-colors",
                         plan.highlighted
                           ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90'
                           : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    )}>
                        {plan.primaryCta.text}
                    </button>
                    <div className={cn(
                        "w-full py-3 px-6 rounded-lg text-sm text-center",
                        plan.highlighted
                           ? 'bg-primary/80'
                           : 'bg-secondary text-secondary-foreground'
                    )}>
                        {plan.secondaryCta}
                    </div>
                </div>

                {/* Features List */}
                <ul className="mt-8 space-y-4 text-sm">
                    {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default PricingTable;