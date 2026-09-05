// components/ui/fare-selector.tsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "../_utils/cn"; // Make sure you have this utility from shadcn
import { Button } from "./button"; // Assuming you have a Button component
import { CheckCircle2, Circle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Define the types for the component props
export interface FareDetail {
  label: string;
  value: string;
  icon: LucideIcon;
}

export interface FareOption {
  id: string;
  title: string;
  price: number;
  offerText?: string;
  details: FareDetail[];
  isPopular?: boolean; // You can use this for a "Most Popular" badge
}

export interface FareSelectorProps {
  fares: FareOption[];
  initialSelectedId?: string;
  onSelect: (selectedFare: FareOption | null) => void;
  onContinue: (selectedFare: FareOption) => void;
  priceFormatter?: (price: number) => string;
}

// Default price formatter
const defaultPriceFormatter = (price: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

/**
 * A responsive and animated fare selector component for comparing options.
 * It uses shadcn/ui conventions and framer-motion for smooth animations.
 */
export const FareSelector: React.FC<FareSelectorProps> = ({
  fares,
  initialSelectedId,
  onSelect,
  onContinue,
  priceFormatter = defaultPriceFormatter,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId || fares[0]?.id || null);

  const handleSelect = (fare: FareOption) => {
    setSelectedId(fare.id);
    onSelect(fare);
  };

  const selectedFare = useMemo(() => {
    return fares.find(fare => fare.id === selectedId) || null;
  }, [selectedId, fares]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 bg-transparent">
      {/* Flight Info Header - Can be passed as a prop or child */}
      <div className="mb-8">
         {/* Placeholder for flight details header like in the screenshot */}
      </div>

      {/* Fare Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fares.map((fare) => {
          const isSelected = fare.id === selectedId;
          return (
            <div
              key={fare.id}
              onClick={() => handleSelect(fare)}
              className={cn(
                "relative rounded-xl border-2 bg-card text-card-foreground shadow-sm transition-all duration-300 cursor-pointer hover:shadow-lg",
                isSelected ? "border-primary shadow-primary/20" : "border-border hover:border-primary/50"
              )}
            >
              {/* Animated selection indicator */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    layoutId="selected-indicator"
                    className="absolute -top-3 -right-3 bg-primary rounded-full p-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="p-6">
                <h3 className="text-lg font-bold text-foreground">{fare.title}</h3>
                <p className="text-3xl font-bold my-2">{priceFormatter(fare.price)}</p>
                {fare.offerText && <p className="text-sm text-green-600 dark:text-green-400">{fare.offerText}</p>}

                <Button
                  variant={isSelected ? 'default' : 'outline'}
                  className="w-full mt-4"
                  aria-pressed={isSelected}
                >
                  {isSelected ? 'Selected' : 'Select'}
                </Button>
              </div>

              {/* Details List */}
              <div className="border-t border-border px-6 py-4">
                <ul className="space-y-3 text-sm">
                  {fare.details.map((detail, index) => (
                    <li key={index} className="flex items-center justify-between text-muted-foreground">
                      <div className="flex items-center">
                        <detail.icon className="h-4 w-4 mr-2 text-primary" />
                        <span>{detail.label}</span>
                      </div>
                      <span className="font-medium text-foreground">{detail.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer / Continue Section */}
      <AnimatePresence>
        {selectedFare && (
           <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-between rounded-lg border bg-card p-4 shadow-sm"
          >
            <div className='text-center sm:text-left mb-4 sm:mb-0'>
              <p className="text-2xl font-bold">{priceFormatter(selectedFare.price)}</p>
              <p className="text-sm text-green-600 dark:text-green-400">{selectedFare.offerText}</p>
            </div>
            <Button size="lg" onClick={() => onContinue(selectedFare)} className="w-full sm:w-auto">
              Continue
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};