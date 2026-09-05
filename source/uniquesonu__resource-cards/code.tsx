import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils"; // Assumes shadcn's utility for class merging
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"
import { Zap, Server, HardDrive } from 'lucide-react';

// Note: This component requires 'framer-motion' and reuses the core logic of the ProgressRing.

// --- Internal Gauge Logic (Reusing ProgressRing concepts) ---
const SIZE = 200; // SVG viewBox size for better resolution
const STROKE_WIDTH = 18;
const RADIUS = (SIZE / 2) - (STROKE_WIDTH / 2);
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const getGaugeColor = (value: number): string => {
  if (value >= 90) return "text-red-500 dark:text-red-400";
  if (value >= 70) return "text-yellow-500 dark:text-yellow-400";
  return "text-green-500 dark:text-green-400";
};

interface GaugeProps {
  percentage: number;
  colorClass: string;
}

const UtilizationGaugeSVG: React.FC<GaugeProps> = React.memo(({ percentage, colorClass }) => {
  const clampedValue = Math.max(0, Math.min(100, percentage));
  const strokeDashoffset = CIRCUMFERENCE - (clampedValue / 100) * CIRCUMFERENCE;
  const center = SIZE / 2;

  // Framer Motion variants for the animated circle stroke
  const circleVariants = {
    initial: { strokeDashoffset: CIRCUMFERENCE },
    animate: {
      strokeDashoffset: strokeDashoffset,
      transition: {
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="-rotate-90 transform w-full h-full"
    >
      {/* Background Circle (Track) */}
      <circle
        cx={center}
        cy={center}
        r={RADIUS}
        fill="transparent"
        stroke="hsl(var(--muted))"
        strokeWidth={STROKE_WIDTH}
      />

      {/* Foreground Circle (Animated Progress) */}
      <motion.circle
        cx={center}
        cy={center}
        r={RADIUS}
        fill="transparent"
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        initial="initial"
        animate="animate"
        variants={circleVariants}
        // Apply color dynamically via Tailwind class
        className={cn("transition-colors duration-500", colorClass)}
      />
    </svg>
  );
});

UtilizationGaugeSVG.displayName = "UtilizationGaugeSVG";


// --- 📦 API (Props) Definition ---
export interface ResourceUtilizationGaugeProps {
  /** The current consumption value (e.g., 850). */
  currentUsage: number;
  /** The maximum capacity value (e.g., 1000). */
  maxCapacity: number;
  /** The unit of the resource (e.g., "Requests", "GB"). */
  unit: string;
  /** The title of the resource (e.g., "API Limit"). */
  title: string;
  /** Optional icon for the card header. */
  icon?: React.ElementType;
  /** Optional class name for the card container. */
  className?: string;
}

/**
 * An animated gauge component for visualizing resource utilization with status colors.
 * Ideal for displaying limits and capacities on the admin dashboard.
 */
const ResourceUtilizationGauge: React.FC<ResourceUtilizationGaugeProps> = ({
  currentUsage,
  maxCapacity,
  unit,
  title,
  icon: IconComponent = Zap,
  className,
}) => {
  const percentage = Math.round((currentUsage / maxCapacity) * 100);
  const colorClass = useMemo(() => getGaugeColor(percentage), [percentage]);

  // Framer Motion variants for subtle hover effect
  const cardVariants = {
    initial: { y: 0 },
    hover: { y: -4, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" },
  };
  
  // Use a dynamic stroke color inline for the SVG to work with Framer's color mapping
  const strokeColor = colorClass.includes('red') ? 'hsl(var(--destructive))' : 
                      colorClass.includes('yellow') ? 'hsl(var(--warning-text))' : 'hsl(var(--success-text))';

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn("h-full cursor-pointer rounded-lg", className)}
    >
      <Card className="h-full transition-colors duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <IconComponent className={cn("h-4 w-4", colorClass)} aria-hidden="true" />
        </CardHeader>
        
        <CardContent className="flex items-center justify-between gap-4 pt-4">
          {/* Gauge Visualization */}
          <div className="relative h-28 w-28 shrink-0">
            <UtilizationGaugeSVG percentage={percentage} colorClass={colorClass} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn("text-2xl font-bold transition-colors duration-500", colorClass)}>
                {percentage}%
              </span>
              <span className="text-xs text-muted-foreground mt-0.5">Used</span>
            </div>
          </div>
          
          {/* Metric Details */}
          <div className="flex flex-col space-y-2 flex-grow min-w-0">
            <div className="text-sm font-semibold text-foreground truncate">
              {currentUsage.toLocaleString()} <span className="text-muted-foreground font-normal">{unit}</span>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Current Usage
            </CardDescription>
            <Separator />
            <div className="text-sm font-semibold text-foreground truncate">
              {maxCapacity.toLocaleString()} <span className="text-muted-foreground font-normal">{unit}</span>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Total Capacity
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
      <h3 className="text-xl font-semibold text-foreground mb-6">Resource Limits & Utilization</h3>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* API Limit (High Usage - Red) */}
        <ResourceUtilizationGauge
          title="API Requests Limit"
          currentUsage={95000}
          maxCapacity={100000}
          unit="Requests"
          icon={Zap}
        />
        {/* Storage (Medium Usage - Yellow) */}
        <ResourceUtilizationGauge
          title="Cloud Storage"
          currentUsage={720}
          maxCapacity={1000}
          unit="GB"
          icon={HardDrive}
        />
        {/* User Seats (Low Usage - Green) */}
        <ResourceUtilizationGauge
          title="User Seats"
          currentUsage={25}
          maxCapacity={100}
          unit="Seats"
          icon={Server}
        />
      </div>
    </div>
  );
};

export default ExampleUsage;