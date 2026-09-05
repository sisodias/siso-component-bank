import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Assumes you have a `cn` utility from shadcn

// Define the props for the PricingCard component for type-safety and reusability
interface PricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  cardTitle: string;
  joiningFeeOriginal: string;
  joiningFeeDiscounted: string;
  joiningFeeOffer: string;
  renewalFee: string;
  renewalFeeWaiver: string;
  decorativeImageUrl: string;
}

/**
 * A responsive and theme-adaptive pricing card component.
 * It uses framer-motion for a subtle hover animation.
 * All content is passed via props to maximize reusability.
 */
const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  (
    {
      className,
      cardTitle,
      joiningFeeOriginal,
      joiningFeeDiscounted,
      joiningFeeOffer,
      renewalFee,
      renewalFeeWaiver,
      decorativeImageUrl,
      ...props
    },
    ref
  ) => {
    // Animation variants for framer-motion
    const cardVariants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
      hover: { scale: 1.02, transition: { duration: 0.2 } },
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative flex w-full max-w-sm flex-col overflow-hidden rounded-xl border bg-card p-6 pb-32 text-card-foreground shadow-sm",
          className
        )}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        {...props}
      >
        <div className="flex-grow">
          {/* Card Title */}
          <h3 className="text-xl font-semibold">{cardTitle}</h3>

          {/* Joining Fee Section */}
          <div className="mt-6">
            <p className="text-sm text-muted-foreground">Joining fee</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-amber-400">
                {joiningFeeDiscounted}
              </span>
              <span className="text-lg font-medium text-muted-foreground line-through">
                {joiningFeeOriginal}
              </span>
            </div>
            <p className="mt-2 text-sm text-amber-400">{joiningFeeOffer}</p>
          </div>

          {/* Renewal Fee Section */}
          <div className="mt-6">
            <p className="text-sm text-muted-foreground">Renewal fee</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-amber-400">
              {renewalFee}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {renewalFeeWaiver}
            </p>
          </div>
        </div>

        {/* Decorative Image */}
        <div className="mt-8">
          <img
            src={decorativeImageUrl}
            alt="Decorative graphic"
            className="absolute bottom-0 right-0 w-3/4 h-auto object-cover pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </motion.div>
    );
  }
);
PricingCard.displayName = "PricingCard";

export { PricingCard };