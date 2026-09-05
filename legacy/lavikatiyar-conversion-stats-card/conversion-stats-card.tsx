import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, ArrowRight } from "lucide-react";

import { cn } from "../_utils/cn"; // Your utility for merging class names
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "./card";
import { Button } from "./button";

// Define the type for each statistical item
interface StatItem {
  label: string;
  value: number;
  percentage: number;
  change: number;
  changeType: "increase" | "decrease";
  color: string; // Tailwind color class e.g., 'bg-emerald-500'
}

// Define the props for the main component
interface ConversionStatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  data: StatItem[];
  onActionClick?: () => void;
}

const ConversionStatsCard = React.forwardRef<
  HTMLDivElement,
  ConversionStatsCardProps
>(({ className, title, data, onActionClick, ...props }, ref) => {
  
  const totalPercentage = data.reduce((sum, item) => sum + item.percentage, 0);

  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
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
    <Card
      ref={ref}
      className={cn("w-full max-w-md", className)}
      {...props}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {onActionClick && (
            <Button variant="ghost" size="icon" onClick={onActionClick} aria-label="View details">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          className="flex flex-col gap-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Composite Progress Bar */}
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden flex" role="progressbar" aria-valuenow={totalPercentage} aria-valuemin={0} aria-valuemax={100}>
            {data.map((item, index) => (
              <motion.div
                key={index}
                className={cn("h-full", item.color)}
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 0.8, ease: "easeInOut", delay: index * 0.2 }}
              />
            ))}
          </div>

          {/* Stats Breakdown */}
          <div className="flex flex-col gap-4">
            {data.map((item, index) => {
              const TrendIcon = item.changeType === "increase" ? ArrowUp : ArrowDown;
              const trendColor = item.changeType === "increase" ? "text-emerald-500" : "text-red-500";
              const formattedValue = new Intl.NumberFormat('en-US').format(item.value);
              const formattedChange = new Intl.NumberFormat('en-US').format(item.change);

              return (
                <motion.div key={index} className="flex items-start justify-between" variants={itemVariants}>
                  <div className="flex items-center gap-3">
                    <span className={cn("h-6 w-1 rounded-full", item.color)} />
                    <div>
                      <p className="text-xl font-bold text-foreground">
                        {item.percentage.toFixed(1)}%
                      </p>
                      <div className={cn("flex items-center gap-1 text-xs", trendColor)}>
                        <TrendIcon className="h-3 w-3" />
                        <span>{formattedChange}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{formattedValue}</p>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
});

ConversionStatsCard.displayName = "ConversionStatsCard";

export { ConversionStatsCard };