import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../_utils/cn";
import { Card, CardContent, CardHeader } from "./card";
import { Button } from "./button";

// Defines the shape of a single expense item
export interface ExpenseItem {
  category: string;
  percentage: number;
  amount: number;
  color: string; // HSL color string e.g., "221.2 83.2% 53.3%"
}

// Defines the props for the WeeklyExpenseCard component
export interface WeeklyExpenseCardProps {
  title: string;
  dateRange: string;
  data: ExpenseItem[];
  currency?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

// Helper to format currency
const formatCurrency = (amount: number, currencySymbol: string) => {
  return `${currencySymbol}${amount.toFixed(2)}`;
};

/**
 * A responsive and theme-adaptive card for displaying expense summaries
 * with an animated donut chart and a clear, color-coded legend.
 */
export const WeeklyExpenseCard = ({
  title,
  dateRange,
  data,
  currency = "$",
  buttonText = "View Report",
  onButtonClick,
  className,
}: WeeklyExpenseCardProps) => {
  const totalAmount = React.useMemo(
    () => data.reduce((sum, item) => sum + item.amount, 0),
    [data]
  );

  // Donut chart properties
  const size = 180;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercentage = 0;

  return (
    <Card
      className={cn(
        "w-full max-w-sm overflow-hidden rounded-2xl bg-card p-4 font-sans",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between p-2">
        <div className="flex flex-col">
          <h3 className="text-xl font-bold tracking-tight text-card-foreground">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{dateRange}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onButtonClick}>
          {buttonText}
        </Button>
      </CardHeader>

      <CardContent className="p-2">
        {/* Animated Donut Chart */}
        <div className="relative my-6 flex h-48 w-full items-center justify-center">
          <AnimatePresence>
            <motion.svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.5 } }}
              className="-rotate-90"
            >
              {/* Background Circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke="hsl(var(--muted))"
                strokeWidth={strokeWidth}
              />

              {/* Data Segments */}
              {data.map((item) => {
                const segmentLength = (item.percentage / 100) * circumference;
                const offset =
                  (accumulatedPercentage / 100) * circumference;
                accumulatedPercentage += item.percentage;

                return (
                  <motion.circle
                    key={item.category}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={`hsl(${item.color})`}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circumference} ${circumference}`}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{
                      strokeDashoffset: [circumference, circumference - offset - segmentLength],
                      transition: { duration: 0.8, ease: "easeInOut" },
                    }}
                    strokeLinecap="round"
                  />
                );
              })}
            </motion.svg>
          </AnimatePresence>

          {/* Central Label */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-xs text-muted-foreground">Total Spent</span>
            <span className="text-2xl font-bold text-card-foreground">
              {formatCurrency(totalAmount, currency)}
            </span>
          </div>
        </div>

        {/* Legend Section */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          {data.map((item) => (
            <div
              key={item.category}
              className="flex h-24 flex-col justify-end rounded-2xl bg-muted/50 p-4"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: `hsl(${item.color})` }}
                  aria-hidden="true"
                />
                <p className="text-sm font-medium text-muted-foreground">
                  {item.category}
                </p>
              </div>
              <p className="mt-1 text-xl font-bold text-card-foreground">
                {formatCurrency(item.amount, currency)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};