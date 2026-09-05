import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../_utils/cn"; // Assumes you have a 'cn' utility from shadcn

/**
 * @interface AnimatedProgressCardProps
 * @description Defines the props for the AnimatedProgressCard component.
 * @property {React.ReactNode} icon - The icon to be displayed at the top of the card.
 * @property {string} title - The main title or goal description.
 * @property {string} progressLabel - The label for the progress section (e.g., "Your Progress").
 * @property {string} progressSubLabel - A secondary label under the progress label (e.g., "Since 20 days ago").
 * @property {number} currentValue - The current value of the progress.
 * @property {number} maxValue - The maximum value for the progress calculation.
 * @property {string} [className] - Optional additional CSS classes for custom styling.
 */
export interface AnimatedProgressCardProps {
  icon: React.ReactNode;
  title: string;
  progressLabel: string;
  progressSubLabel: string;
  currentValue: number;
  maxValue: number;
  className?: string;
}

/**
 * A visually polished card for displaying progress with a smooth animation.
 * It's theme-adaptive, responsive, and reusable.
 */
export const AnimatedProgressCard = React.forwardRef<
  HTMLDivElement,
  AnimatedProgressCardProps
>(
  (
    {
      icon,
      title,
      progressLabel,
      progressSubLabel,
      currentValue,
      maxValue,
      className,
    },
    ref
  ) => {
    // Calculate the percentage, ensuring it doesn't exceed 100%
    const percentage = maxValue > 0 ? (currentValue / maxValue) * 100 : 0;
    const clampedPercentage = Math.min(percentage, 100);

    return (
      <div
        ref={ref}
        className={cn(
          "w-full max-w-sm rounded-xl border bg-primary p-6 text-primary-foreground shadow-lg",
          className
        )}
      >
        {/* Header section with icon and title */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20">
            {icon}
          </div>
          <p className="font-medium">{title}</p>
        </div>

        {/* Progress bar section with animation */}
        <div className="my-5">
          <div
            className="relative h-2 w-full overflow-hidden rounded-full bg-primary-foreground/20"
            role="progressbar"
            aria-valuenow={currentValue}
            aria-valuemin={0}
            aria-valuemax={maxValue}
            aria-label={title}
          >
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full bg-primary-foreground"
              initial={{ width: 0 }}
              animate={{ width: `${clampedPercentage}%` }}
              transition={{
                duration: 1.2,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>

        {/* Footer section with progress details */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/80">
              {progressLabel}
            </p>
            <p className="text-sm text-primary-foreground/60">
              {progressSubLabel}
            </p>
          </div>
          <p className="text-2xl font-bold">
            {currentValue}
            <span className="text-lg font-medium text-primary-foreground/80">
              {" "}
              / {maxValue}
            </span>
          </p>
        </div>
      </div>
    );
  }
);

AnimatedProgressCard.displayName = "AnimatedProgressCard";