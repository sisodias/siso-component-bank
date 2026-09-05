import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../_utils/cn"; // Your shadcn/ui utility for classnames
import { Card, CardContent, CardHeader } from "./card"; // Assuming you have shadcn/ui Card

// Define the props for the component
interface ProductOnboardingCardProps {
  mainIcon: React.ReactNode;
  title: string;
  description: string;
  cardIcon: React.ReactNode;
  cardHeaderLabel: string;
  cardTitle: string;
  cardDescription: string;
  buttonText: string;
  onButtonClick?: () => void;
  className?: string;
}

/**
 * A visually engaging card for product feature definition or onboarding steps.
 * Features a staggered entrance animation for all its elements.
 */
export const ProductOnboardingCard = React.forwardRef<
  HTMLDivElement,
  ProductOnboardingCardProps
>(
  (
    {
      mainIcon,
      title,
      description,
      cardIcon,
      cardHeaderLabel,
      cardTitle,
      cardDescription,
      buttonText,
      onButtonClick,
      className,
    },
    ref
  ) => {
    // Animation variants for the container and its children
    const containerVariants = {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.1,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 12,
        },
      },
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center gap-6 text-center max-w-md w-full p-4",
          className
        )}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Icon with Gradient */}
        <motion.div
          variants={itemVariants}
          className="rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 p-3 shadow-lg"
        >
          {mainIcon}
        </motion.div>

        {/* Main Title */}
        <motion.h2
          variants={itemVariants}
          className="text-3xl font-bold text-foreground"
        >
          {title}
        </motion.h2>

        {/* Main Description */}
        <motion.p
          variants={itemVariants}
          className="text-muted-foreground max-w-xs"
        >
          {description}
        </motion.p>

        {/* Inner Card */}
        <motion.div variants={itemVariants} className="w-full">
          <Card className="text-left shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              {cardIcon}
              <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                {cardHeaderLabel}
              </span>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold text-card-foreground">
                {cardTitle}
              </h3>
              <p className="text-sm text-muted-foreground">
                {cardDescription}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Button */}
        <motion.button
          variants={itemVariants}
          onClick={onButtonClick}
          className="w-full max-w-xs rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 px-8 py-3 font-semibold text-white shadow-lg transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 focus-visible:ring-offset-background"
        >
          {buttonText}
        </motion.button>
      </motion.div>
    );
  }
);

ProductOnboardingCard.displayName = "ProductOnboardingCard";