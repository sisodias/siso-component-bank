import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, TrendingUp } from "lucide-react";

import { cn } from "../_utils/cn";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";

// Prop definition for individual data points
interface ActivityDataPoint {
  day: string;
  value: number;
}

// Prop definition for the component
interface ActivityChartCardProps {
  title?: string;
  totalValue: string;
  data: ActivityDataPoint[];
  className?: string;
  dropdownOptions?: string[];
}

/**
 * A responsive and animated card component to display weekly activity data.
 * Features a bar chart animated with Framer Motion and supports shadcn theming.
 */
export const ActivityChartCard = ({
  title = "Activity",
  totalValue,
  data,
  className,
  dropdownOptions = ["Weekly", "Monthly", "Yearly"],
}: ActivityChartCardProps) => {
  const [selectedRange, setSelectedRange] = React.useState(
    dropdownOptions[0] || ""
  );

  // Find the maximum value in the data to normalize bar heights
  const maxValue = React.useMemo(() => {
    return data.reduce((max, item) => (item.value > max ? item.value : max), 0);
  }, [data]);

  // Framer Motion variants for animations
  const chartVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Animate each child (bar) with a delay
      },
    },
  };

  const barVariants = {
    hidden: { scaleY: 0, opacity: 0, transformOrigin: "bottom" },
    visible: {
      scaleY: 1,
      opacity: 1,
      transformOrigin: "bottom",
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1], // Cubic bezier for a smooth bounce effect
      },
    },
  };

  return (
    <Card
      className={cn("w-full max-w-md", className)}
      aria-labelledby="activity-card-title"
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle id="activity-card-title">{title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-sm"
                aria-haspopup="true"
              >
                {selectedRange}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {dropdownOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onSelect={() => setSelectedRange(option)}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          {/* Total Value */}
          <div className="flex flex-col">
            <p className="text-5xl font-bold tracking-tighter text-foreground">
              {totalValue}
            </p>
            <CardDescription className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              +12% from last week
            </CardDescription>
          </div>

          {/* Bar Chart */}
          <motion.div
            key={selectedRange} // Re-trigger animation when range changes
            className="flex h-28 w-full items-end justify-between gap-2"
            variants={chartVariants}
            initial="hidden"
            animate="visible"
            aria-label="Activity chart"
          >
            {data.map((item, index) => (
              <div
                key={index}
                className="flex h-full w-full flex-col items-center justify-end gap-2"
                role="presentation"
              >
                <motion.div
                  className="w-full rounded-md bg-primary"
                  style={{
                    height: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                  }}
                  variants={barVariants}
                  aria-label={`${item.day}: ${item.value} hours`}
                />
                <span className="text-xs text-muted-foreground">
                  {item.day}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};