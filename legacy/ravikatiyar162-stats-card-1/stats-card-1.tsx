// components/ui/stats-card.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { cn } from "../_utils/cn";

/**
 * Props for the StatsCard component.
 * @param {string} title - The title of the statistic (e.g., "Total Revenue").
 * @param {string} value - The main value to display (e.g., "₹4,52,318").
 * @param {React.ReactNode} icon - The icon to display in the card header.
 * @param {string} change - The change percentage or value (e.g., "+20.1%").
 * @param {'positive' | 'negative'} changeType - Determines the color of the change text.
 * @param {string} [className] - Optional additional class names for the card.
 */
interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  changeType: 'positive' | 'negative';
  className?: string;
}

/**
 * A responsive card component for displaying key statistics with a trend indicator.
 */
export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  change,
  changeType,
  className,
}) => {
  const changeColor = changeType === 'positive'
    ? 'text-emerald-600 dark:text-emerald-500'
    : 'text-destructive';

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {/* Icon is passed as a child */}
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <p className={cn("text-xs text-muted-foreground mt-1", changeColor)}>
          {change} from last month
        </p>
      </CardContent>
    </Card>
  );
};