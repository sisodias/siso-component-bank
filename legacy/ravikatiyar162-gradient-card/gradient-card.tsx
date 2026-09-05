// components/ui/gradient-card.tsx

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { cn } from "../_utils/cn"; // Your shadcn/ui utility for merging classes

// Define variants for the card's overall style using cva
const cardVariants = cva(
  "relative flex flex-col justify-between h-full w-full overflow-hidden rounded-2xl p-8 shadow-sm transition-shadow duration-300 hover:shadow-lg",
  {
    variants: {
      gradient: {
        orange: "bg-gradient-to-br from-orange-100 to-amber-200/50",
        gray: "bg-gradient-to-br from-slate-100 to-slate-200/50",
        purple: "bg-gradient-to-br from-purple-100 to-indigo-200/50",
        green: "bg-gradient-to-br from-emerald-100 to-teal-200/50",
      },
    },
    defaultVariants: {
      gradient: "gray",
    },
  }
);

// Define the props interface for type safety and reusability
export interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  badgeText: string;
  badgeColor: string; // Expecting a hex color string, e.g., "#FF5733"
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  imageUrl: string;
}

const GradientCard = React.forwardRef<HTMLDivElement, GradientCardProps>(
  ({ className, gradient, badgeText, badgeColor, title, description, ctaText, ctaHref, imageUrl, ...props }, ref) => {
    
    // Animation variants for framer-motion
    const cardAnimation = {
      rest: { scale: 1, y: 0 },
      hover: { scale: 1.03, y: -4 },
    };

    const imageAnimation = {
      rest: { scale: 1, rotate: 0 },
      hover: { scale: 1.1, rotate: 3 },
    };

    return (
      <motion.div
        variants={cardAnimation}
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="h-full"
        ref={ref}
      >
        <div
          className={cn(cardVariants({ gradient }), className)}
          {...props}
        >
          {/* Decorative background image with animation */}
          <motion.img
            src={imageUrl}
            alt={`${title} background graphic`}
            variants={imageAnimation}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="absolute -right-1/4 -bottom-1/4 w-3/4 opacity-80 pointer-events-none dark:opacity-30"
          />

          {/* Card Content */}
          <div className="z-10 flex flex-col h-full">
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-background/50 px-3 py-1 text-sm font-medium text-foreground/80 backdrop-blur-sm w-fit">
              <span 
                className="h-2 w-2 rounded-full" 
                style={{ backgroundColor: badgeColor }}
              />
              {badgeText}
            </div>

            {/* Title and Description */}
            <div className="flex-grow">
              <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
              <p className="text-foreground/70 max-w-xs">{description}</p>
            </div>
            
            {/* Call to Action Link */}
            <a
              href={ctaHref}
              className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground"
            >
              {ctaText}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </motion.div>
    );
  }
);
GradientCard.displayName = "GradientCard";

export { GradientCard, cardVariants };