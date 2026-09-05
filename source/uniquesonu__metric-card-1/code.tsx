import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils"; // Assumes shadcn's utility for class merging
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, ArrowUp, ArrowDown, User, Target, CheckCircle, AlertTriangle } from 'lucide-react';

// Note: This component requires 'framer-motion'.

// --- Internal Data Structure ---
export type GoalStatus = 'above' | 'below' | 'met';

// --- Internal Configuration ---
const GOAL_COLORS: Record<GoalStatus, string> = {
  met: "text-green-500 dark:text-green-400",
  above: "text-blue-500 dark:text-blue-400",
  below: "text-red-500 dark:text-red-400",
};

// --- 📦 API (Props) Definition ---
export interface StackedValueMetricCardProps {
  /** The main metric value (large, primary focus). */
  primaryValue: string;
  /** The label for the primary metric. */
  primaryLabel: string;
  /** The secondary/contextual metric value (smaller, supportive focus). */
  secondaryValue: string;
  /** The label for the secondary metric (e.g., "Target", "Last Month"). */
  secondaryLabel: string;
  /** Optional icon for the card header. */
  icon?: React.ElementType;
  /** Status indicating relation to a goal/comparison. */
  goalStatus: GoalStatus;
  /** Optional class name for the card container. */
  className?: string;
}

/**
 * An visually enhanced, animated metric card for displaying primary data stacked with contextual secondary data.
 * Better design through clear visual hierarchy and subtle animation.
 */
const StackedValueMetricCard: React.FC<StackedValueMetricCardProps> = ({
  primaryValue,
  primaryLabel,
  secondaryValue,
  secondaryLabel,
  icon: IconComponent = DollarSign,
  goalStatus,
  className,
}) => {
  const goalColorClass = GOAL_COLORS[goalStatus] || GOAL_COLORS.above;
  const GoalIcon = goalStatus === 'met' ? CheckCircle : goalStatus === 'above' ? ArrowUp : ArrowDown; // CheckCircle from lucide-react

  // Framer Motion variants for the card lift
  const cardVariants = {
    initial: { y: 0 },
    hover: { y: -6, boxShadow: "0 15px 20px -5px rgb(0 0 0 / 0.15), 0 6px 10px -6px rgb(0 0 0 / 0.1)" },
  };

  // Framer Motion variants for the secondary value transition
  const secondaryValueVariants = {
    initial: { opacity: 0, x: 5 },
    animate: { opacity: 1, x: 0, transition: { type: 'tween', duration: 0.3 } },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      className={cn("h-full cursor-pointer rounded-lg", className)}
    >
      <Card className="h-full overflow-hidden transition-shadow duration-200">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{primaryLabel}</CardTitle>
          <IconComponent className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        </CardHeader>
        
        <CardContent className="p-4 pt-0 space-y-4">
          {/* Primary Value (Large and Prominent) */}
          <div className="text-4xl font-extrabold text-foreground leading-none">
            {primaryValue}
          </div>
          
          {/* Secondary Value and Context (Stacked) */}
          <div className="flex flex-col space-y-1 pt-2">
            <div className="flex items-center space-x-2">
              <GoalIcon className={cn("h-4 w-4 shrink-0", goalColorClass)} aria-hidden="true" />
              
              <AnimatePresence mode="wait">
                <motion.span
                  key={secondaryValue} // Key ensures animation runs on value change
                  variants={secondaryValueVariants}
                  initial="initial"
                  animate="animate"
                  className={cn("text-xl font-bold leading-none", goalColorClass)}
                >
                  {secondaryValue}
                </motion.span>
              </AnimatePresence>
            </div>
            
            <CardDescription className="text-xs text-muted-foreground ml-6">
              {secondaryLabel}
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};



const ExampleUsage = () => {
  return (
    <div className="p-8 bg-background border rounded-lg max-w-7xl mx-auto shadow-md">
      <h3 className="text-xl font-semibold text-foreground mb-6">Stacked Metric Card Demo (Enhanced Design)</h3>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Example 1: Revenue (Above Goal) */}
        <StackedValueMetricCard
          primaryValue="$25,450"
          primaryLabel="Total Revenue"
          secondaryValue="+5.2% vs Target"
          secondaryLabel="Above Monthly Goal"
          icon={DollarSign}
          goalStatus="above"
        />
        
        {/* Example 2: Users (Goal Met/On Track) */}
        <StackedValueMetricCard
          primaryValue="1,845"
          primaryLabel="Active Users"
          secondaryValue="95% Target Achieved"
          secondaryLabel="On Track for Q4 Goal"
          icon={User}
          goalStatus="met"
        />

        {/* Example 3: Error Rate (Below Goal - Failure) */}
        <StackedValueMetricCard
          primaryValue="1.25%"
          primaryLabel="Failure Rate"
          secondaryValue="+0.3% from Previous"
          secondaryLabel="Exceeds Maximum Tolerance"
          icon={AlertTriangle} // AlertTriangle from lucide-react
          goalStatus="below"
        />
      </div>
    </div>
  );
};


export default ExampleUsage;