// components/ui/minimal-steps-card.tsx

import React, { useMemo, useEffect } from 'react';
import { motion, useSpring, useTransform, Variants } from 'framer-motion';
import { cn } from "../_utils/cn";

// Define the structure for each data point
interface BarData {
  value: number;
}

// Define the component's props
export interface MinimalStepsCardProps {
  /** The main title of the card */
  title: string;
  /** The subtitle, usually a date */
  subtitle: string;
  /** The total number of steps to animate to */
  totalSteps: number;
  /** The unit label for the steps */
  stepsUnit?: string;
  /** A React node for the icon */
  icon: React.ReactNode;
  /** An array of numeric values for the bar chart */
  data: BarData[];
  /** Optional className for custom styling */
  className?: string;
}

/**
 * A minimalist, theme-adaptive card for displaying step data.
 * Features an animated counter and a vertical "fill" animation for the bar chart.
 * Note: Requires `framer-motion` to be installed.
 */
export const MinimalStepsCard = ({
  title,
  subtitle,
  totalSteps,
  stepsUnit = 'steps',
  icon,
  data = [],
  className,
}: MinimalStepsCardProps) => {
  // Memoize the max value to optimize performance
  const maxValue = useMemo(() => Math.max(...data.map(d => d.value), 1), [data]);

  // Animated number using useSpring for a smooth count-up effect
  const animatedSteps = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const displaySteps = useTransform(animatedSteps, (v) =>
    new Intl.NumberFormat('en-US').format(Math.round(v))
  );

  useEffect(() => {
    animatedSteps.set(totalSteps);
  }, [animatedSteps, totalSteps]);

  // Animation variants for the bar container to stagger each bar's animation
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  // Animation variants for each individual bar's fill effect
  const barVariants: Variants = {
    hidden: { height: '0%' },
    visible: (customHeight: string) => ({
      height: customHeight,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    }),
  };

  return (
    <div
      className={cn(
        'flex w-full max-w-md flex-col rounded-2xl border bg-card p-6 text-card-foreground',
        className
      )}
      role="figure"
      aria-label={`${title} for ${subtitle}: ${totalSteps} ${stepsUnit}`}
    >
      {/* Header Section */}
      <header className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          {icon}
        </div>
      </header>

      {/* Main Metric */}
      <div className="my-8" aria-live="polite">
        <motion.span className="text-5xl font-bold tracking-tight">
          {displaySteps}
        </motion.span>
        <span className="ml-2 text-xl text-muted-foreground">{stepsUnit}</span>
      </div>

      {/* Bar Chart Visualization */}
      <motion.div
        className="mt-auto flex h-32 w-full items-end gap-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-label="Daily steps bar chart"
      >
        {data.map((item, index) => {
          const barHeight = `${(item.value / maxValue) * 100}%`;
          return (
            <div
              key={index}
              className="relative h-full w-full rounded-t-sm"
              aria-label={`Day ${index + 1}: ${item.value} steps`}
            >
              {/* Background/Track for the bar */}
              <div className="absolute bottom-0 h-full w-full rounded-t-sm bg-muted/30" />
              {/* Animated fill element */}
              <motion.div
                className="absolute bottom-0 w-full rounded-t-sm bg-card-foreground"
                variants={barVariants}
                custom={barHeight} // Pass the final height to the variant
              />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};