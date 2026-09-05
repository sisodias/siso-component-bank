import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';

import { cn } from "../_utils/cn"; // Your utility for merging class names
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./card";
import { Button } from "./button";

// Type definition for each data point in the chart
export interface ChartDataPoint {
  label: string;
  currentValue: number; // Value for the primary bar (e.g., this week)
  previousValue: number; // Value for the secondary bar (e.g., last week)
}

// Props for the ActivityStatsCard component
export interface ActivityStatsCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The main title of the card */
  title: string;
  /** A React node for the icon, e.g., <Run /> */
  icon: React.ReactNode;
  /** The primary metric to display, e.g., "48,75 KM" */
  mainValue: string;
  /** The percentage change value (positive or negative) */
  changeValue: number;
  /** The description for the change, e.g., "vs last week" */
  changeDescription: string;
  /** Array of data points for the bar chart */
  chartData: ChartDataPoint[];
  /** Optional click handler for the action button */
  onActionClick?: () => void;
  /** Optional class names to style the primary chart bar */
  primaryBarClassName?: string;
  /** Optional class names to style the secondary chart bar */
  secondaryBarClassName?: string;
}

const ActivityStatsCard = React.forwardRef<
  HTMLDivElement,
  ActivityStatsCardProps
>(
  (
    {
      className,
      title,
      icon,
      mainValue,
      changeValue,
      changeDescription,
      chartData,
      onActionClick,
      primaryBarClassName,   // <-- New prop
      secondaryBarClassName, // <-- New prop
      ...props
    },
    ref
  ) => {
    // ... (rest of the component logic remains the same)
    const ChangeIndicator =
      changeValue > 0 ? ArrowUpRight : ArrowDownRight;
    const changeColor =
      changeValue > 0
        ? 'text-green-500'
        : changeValue < 0
        ? 'text-red-500'
        : 'text-muted-foreground';

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.08,
          delayChildren: 0.2,
        },
      },
    };

    const barVariants = {
      hidden: { height: '0%', opacity: 0 },
      visible: (height: number) => ({
        height: `${height}%`,
        opacity: 1,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 25,
        },
      }),
    };


    return (
      <Card
        className={cn('w-full max-w-sm overflow-hidden', className)}
        ref={ref}
        {...props}
      >
        <CardHeader className="pb-4">
          {/* ... CardHeader JSX ... */}
           <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-primary">{icon}</div>
              <CardTitle className="text-lg font-medium">{title}</CardTitle>
            </div>
            {onActionClick && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onActionClick}
                aria-label="View details"
              >
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
           {/* ... CardContent main value and change indicator JSX ... */}
            <p className="text-4xl font-bold tracking-tight text-card-foreground">
                {mainValue}
            </p>
            <div className={`flex items-center gap-1 text-sm ${changeColor}`}>
                <ChangeIndicator className="h-4 w-4" />
                <span>
                {Math.abs(changeValue)}%{' '}
                <span className="text-muted-foreground">{changeDescription}</span>
                </span>
            </div>

          {/* Bar Chart Section */}
          <div className="mt-6 h-32 w-full">
            <AnimatePresence>
              <motion.div
                key="chart"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex h-full w-full items-end justify-between gap-2"
              >
                {chartData.map((point) => (
                  <div
                    key={point.label}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >
                    <div className="relative flex h-full w-full items-end justify-center gap-1.5">
                      {/* Current Value Bar with new custom class */}
                      <motion.div
                        custom={point.currentValue}
                        variants={barVariants}
                        className={cn(
                          'w-full rounded-sm bg-primary', // Default class
                          primaryBarClassName           // Override class
                        )}
                        aria-valuenow={point.currentValue}
                        aria-label={`Current value: ${point.currentValue}`}
                        role="progressbar"
                      />
                      {/* Previous Value Bar with new custom class */}
                      <motion.div
                        custom={point.previousValue}
                        variants={barVariants}
                        className={cn(
                          'w-full rounded-sm bg-muted', // Default class
                          secondaryBarClassName         // Override class
                        )}
                        aria-valuenow={point.previousValue}
                        aria-label={`Previous value: ${point.previousValue}`}
                        role="progressbar"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {point.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    );
  }
);
ActivityStatsCard.displayName = 'ActivityStatsCard';

export { ActivityStatsCard };