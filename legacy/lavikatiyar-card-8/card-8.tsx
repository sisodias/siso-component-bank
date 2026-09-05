import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../_utils/cn"; // Your utility for merging class names
import { Button } from "./button";

interface SpendingLimitCardProps {
  /** The main title of the card */
  title: string;
  /** A subtitle or date range shown below the title */
  dateRange: string;
  /** The text displayed on the button */
  buttonText: string;
  /** The current amount spent */
  currentSpending: number;
  /** The total spending limit */
  limit: number;
  /** The currency symbol to display */
  currency?: string;
  /** The number of segments in the progress bar */
  segments?: number;
  /** NEW: CSS class for the filled part of the progress bar */
  filledColorClass?: string;
  /** NEW: CSS class for the unfilled part of the progress bar */
  unfilledColorClass?: string;
  /** Callback function when the button is clicked */
  onButtonClick?: () => void;
  /** Optional additional class names for the card container */
  className?: string;
}

/**
 * A color-agnostic card to display spending limits with an animated progress bar.
 * Colors are now passed in as props.
 */
export const SpendingLimitCard = ({
  title,
  dateRange,
  buttonText,
  currentSpending,
  limit,
  currency = "$",
  segments = 7,
  // NEW: Props now accept any CSS class. Default values are provided.
  filledColorClass = "bg-primary",
  unfilledColorClass = "bg-primary/20",
  onButtonClick,
  className,
}: SpendingLimitCardProps) => {
  const percentage = limit > 0 ? (currentSpending / limit) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return `${currency}${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border bg-card p-6 text-card-foreground shadow-sm",
        className
      )}
    >
      <header className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">{dateRange}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onButtonClick}>
          {buttonText}
        </Button>
      </header>

      <div className="mt-6">
        <p className="text-4xl font-bold tracking-tight">
          {formatCurrency(currentSpending)}
          <span className="ml-2 text-base font-medium text-muted-foreground">
            of {formatCurrency(limit)}
          </span>
        </p>
      </div>

      <div
        className="mt-4"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${title} progress`}
      >
        <motion.div
          className="flex w-full items-center gap-1.5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {Array.from({ length: segments }).map((_, index) => {
            const segmentFilled = percentage > (index / segments) * 100;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={cn(
                  "h-2.5 flex-1 rounded-full",
                  // UPDATED: Directly uses the props for coloring
                  segmentFilled ? filledColorClass : unfilledColorClass
                )}
              />
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};