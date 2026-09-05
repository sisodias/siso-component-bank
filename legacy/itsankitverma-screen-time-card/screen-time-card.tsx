"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../_utils/cn";

interface AppUsage {
  icon: React.ReactNode;
  name: string;
  duration: string;
  color?: string;
}

interface ScreenTimeCardProps {
  totalHours: number;
  totalMinutes: number;
  barData: number[]; // Array of usage values for each time period
  timeLabels?: string[]; // e.g., ["5 AM", "11 AM", "5 PM"]
  topApps: AppUsage[];
  className?: string;
}

/**
 * A screen time card component that displays usage statistics with an animated bar graph.
 */
export const ScreenTimeCard = ({
  totalHours,
  totalMinutes,
  barData,
  timeLabels = ["5 AM", "11 AM", "5 PM"],
  topApps,
  className,
}: ScreenTimeCardProps) => {
  // Normalize bar data to 0-1 range for height calculation
  const maxValue = Math.max(...barData);
  const normalizedData = barData.map((value) => value / maxValue);

  // Animation variants for bars
  const barVariants = {
    hidden: { scaleY: 0 },
    visible: (i: number) => ({
      scaleY: 1,
      transition: {
        delay: i * 0.02,
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    }),
  };

  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20 text-card-foreground shadow-lg px-5 py-4 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex gap-12">
        {/* Left side - Main graph */}
        <div className="flex-1">
          {/* Total time display */}
          <div className="mb-3 text-3xl font-semibold">
            {totalHours}h {totalMinutes}m
          </div>

          {/* Bar graph */}
          <div className="relative">
            {/* Y-axis labels */}
            <div className="absolute -right-11 top-0 flex h-32 flex-col justify-between text-xs text-muted-foreground">
              <span>2h</span>
              <span>1h</span>
              <span>0</span>
            </div>

            {/* Horizontal guide lines */}
            <div className="absolute inset-0 flex h-32 flex-col justify-between pointer-events-none">
              <div className="h-px border-t border-dashed border-border/50" />
              <div className="h-px border-t border-dashed border-border/50" />
              <div className="h-px border-t border-dashed border-border/50" />
            </div>

            {/* Bars */}
            <div className="mb-1.5 flex h-32 items-end gap-[3px] relative z-10">
              {normalizedData.map((height, index) => {
                // Determine bar color - highlight certain bars
                const isHighlighted = height > 0.6;
                const barColor = isHighlighted
                  ? "bg-gradient-to-t from-primary to-primary/80"
                  : "bg-muted dark:bg-muted/50";

                return (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={barVariants}
                    initial="hidden"
                    animate="visible"
                    className={cn(
                      "flex-1 rounded-t-sm origin-bottom",
                      barColor
                    )}
                    style={{ height: `${height * 100}%` }}
                  />
                );
              })}
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between text-xs text-muted-foreground">
              {timeLabels.map((label, index) => (
                <span key={index}>{label}</span>
              ))}
              <span>0</span>
            </div>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="w-px bg-border self-stretch relative left-6" />

        {/* Right side - Top apps */}
        <div className="flex flex-col gap-3.5 justify-center">
          {topApps.map((app, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-6 w-6 items-center justify-center text-foreground">
                {app.icon}
              </div>
              <span className="text-sm whitespace-nowrap">{app.duration}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
