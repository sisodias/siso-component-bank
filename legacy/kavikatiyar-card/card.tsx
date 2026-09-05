import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from "../_utils/cn"; // Assuming you have a lib/utils.ts for cn

// --- PROPS INTERFACE ---
// Defines the shape of data required by the component for type safety and clarity.
export interface AnalyticsCardProps {
  title: string;
  totalAmount: string;
  icon: React.ReactNode;
  data: {
    label: string;
    value: number;
  }[];
  className?: string;
}

/**
 * A responsive and theme-adaptive card for displaying analytics with an animated bar chart.
 * Built with TypeScript, Tailwind CSS, and Framer Motion.
 */
export const AnalyticsCard = ({
  title,
  totalAmount,
  icon,
  data = [],
  className,
}: AnalyticsCardProps) => {
  // Find the maximum value in the dataset to apply a distinct style.
  const maxValue = Math.max(...data.map((item) => item.value), 0);

  return (
    <div
      className={cn(
        'w-full max-w-sm rounded-2xl border bg-card p-6 text-card-foreground shadow-sm',
        className
      )}
    >
      {/* --- CARD HEADER --- */}
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-medium text-muted-foreground">{title}</h3>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50">
          {icon}
        </div>
      </div>

      {/* --- MAIN VALUE --- */}
      <div className="my-4">
        <h2 className="text-4xl font-bold tracking-tight">{totalAmount}</h2>
      </div>

      {/* --- ANIMATED BAR CHART --- */}
      <div className="grid grid-cols-3 gap-4" aria-label="Weekly analytics chart">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            {/* Bar container with striped background */}
            <div
              className="relative flex h-32 w-full items-end overflow-hidden rounded-lg bg-muted/60"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, transparent, transparent 4px, hsl(var(--muted)) 4px, hsl(var(--muted)) 8px)',
                backgroundSize: '16px 16px',
              }}
              role="presentation"
            >
              {/* Animated bar */}
              <motion.div
                className={cn(
                  'relative w-full rounded-t-md p-2',
                  // Highlight the bar with the maximum value
                  item.value === maxValue ? 'bg-primary' : 'bg-primary/40'
                )}
                initial={{ height: '0%' }}
                animate={{ height: `${item.value}%` }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1], // Expo ease-out
                }}
                aria-label={`${item.label}: ${item.value}%`}
                aria-valuenow={item.value}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                {/* Top handle and percentage text */}
                <div className="absolute left-1/2 top-1.5 h-1 w-1/3 -translate-x-1/2 rounded-full bg-background/50" />
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-semibold text-primary-foreground">
                  {item.value}%
                </span>
              </motion.div>
            </div>
            {/* Label below the bar */}
            <span className="text-sm text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};