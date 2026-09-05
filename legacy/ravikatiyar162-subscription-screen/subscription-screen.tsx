// components/ui/subscription-screen.tsx
import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";

import { cn } from "../_utils/cn"; // Assuming you have a cn utility from shadcn
import { Button } from "./button"; // Assuming shadcn Button
import { RadioGroup, RadioGroupItem } from "./radio-group"; // Assuming shadcn RadioGroup
import { Label } from "./label"; // Assuming shadcn Label

// Define the types for the component props
interface Feature {
  icon: React.ReactNode;
  text: string;
}

interface PricingOption {
  id: string;
  price: string;
  period: string;
  badge?: string;
}

interface SubscriptionScreenProps {
  backgroundImageSrc: string;
  headerImageSrc: string;
  appName: string;
  planType: string;
  features: Feature[];
  pricingOptions: PricingOption[];
  defaultPlanId: string;
  subscribeButtonText: string;
  footerText: string;
  onClose: () => void;
  onSubscribe: (planId: string) => void;
}

export const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({
  backgroundImageSrc,
  headerImageSrc,
  appName,
  planType,
  features,
  pricingOptions,
  defaultPlanId,
  subscribeButtonText,
  footerText,
  onClose,
  onSubscribe,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>(defaultPlanId);

  return (
    <div className="relative flex h-full w-full max-w-md flex-col items-center justify-end overflow-hidden rounded-2xl bg-background shadow-2xl">
      {/* Background Image */}
      <img
        src={backgroundImageSrc}
        alt="Background"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-20 rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-white"
        onClick={onClose}
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </Button>

      {/* Main Content */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
        className="relative z-10 flex w-full flex-col items-center rounded-t-3xl bg-background/80 px-6 pt-8 pb-6 backdrop-blur-xl"
      >
        {/* Header Image */}
        <motion.img
          src={headerImageSrc}
          alt="Header Graphic"
          className="absolute -top-20 h-32 w-32"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
        />

        {/* Title */}
        <div className="mt-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            {appName} <span className="font-medium text-primary">{planType}</span>
          </h1>
        </div>

        {/* Features List */}
        <ul className="mt-6 space-y-3 self-start">
          {features.map((feature, index) => (
            <motion.li
              key={index}
              className="flex items-center gap-3 text-sm text-muted-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1, ease: "easeOut" }}
            >
              {feature.icon}
              <span>{feature.text}</span>
            </motion.li>
          ))}
        </ul>
        
        {/* Pricing Options */}
        <RadioGroup
          value={selectedPlan}
          onValueChange={setSelectedPlan}
          className="mt-8 w-full space-y-3"
        >
          {pricingOptions.map((option) => (
            <div key={option.id} className="relative">
              <RadioGroupItem value={option.id} id={option.id} className="peer sr-only" />
              <Label
                htmlFor={option.id}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-lg border-2 border-transparent bg-muted/50 p-4 transition-all hover:bg-muted",
                  "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border border-muted-foreground peer-data-[state=checked]:border-primary">
                    <AnimatePresence>
                      {selectedPlan === option.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="h-3 w-3 rounded-full bg-primary"
                        />
                      )}
                    </AnimatePresence>
                  </div>
                  <span className="font-semibold text-foreground">{option.price}</span>
                  <span className="text-sm text-muted-foreground">{option.period}</span>
                </div>
                {option.badge && (
                  <div className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    {option.badge}
                  </div>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {/* Action Button */}
        <Button
          size="lg"
          className="mt-8 w-full text-lg"
          onClick={() => onSubscribe(selectedPlan)}
        >
          {subscribeButtonText}
        </Button>
        
        {/* Footer Text */}
        <p className="mt-4 text-center text-xs text-muted-foreground">
          {footerText}
        </p>
      </motion.div>
    </div>
  );
};