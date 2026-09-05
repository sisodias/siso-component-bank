import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

// --- Internal Configuration ---
const SIZE = 100; // SVG viewBox size
const STROKE_WIDTH = 10;
const RADIUS = (SIZE / 2) - (STROKE_WIDTH / 2);
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// --- 📦 API (Props) Definition ---
export interface ProgressRingProps {
  /** The percentage value to display (0 to 100). */
  value: number;
  /** Optional size of the component (width and height in pixels). */
  size?: number;
  /** Optional stroke width of the ring. */
  strokeWidth?: number;
  /** Optional label text displayed below the percentage. */
  label?: React.ReactNode;
  /** Optional class name for the container. */
  className?: string;
  /** Optional class name for the percentage text. */
  textClassName?: string;
}

/**
 * A professional, animated circular progress indicator using Framer Motion.
 * Ideal for displaying utilization, completion, or loading status on dashboards.
 */
const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 120,
  strokeWidth = STROKE_WIDTH,
  label,
  className,
  textClassName,
}) => {
  // Clamp value between 0 and 100
  const clampedValue = Math.max(0, Math.min(100, value));

  // Recalculate based on custom props (if provided)
  const currentRadius = (SIZE / 2) - (strokeWidth / 2);
  const currentCircumference = 2 * Math.PI * currentRadius;

  // Calculate stroke-dashoffset for the progress visualization
  const strokeDashoffset = useMemo(() => {
    return currentCircumference - (clampedValue / 100) * currentCircumference;
  }, [clampedValue, currentCircumference]);

  const center = SIZE / 2;

  // Framer Motion variant for the animated circle stroke
  const circleVariants = {
    initial: { strokeDashoffset: currentCircumference },
    animate: {
      strokeDashoffset: strokeDashoffset,
      transition: {
        duration: 1.5, // Slower duration for a noticeable, smooth drawing effect
        ease: "easeInOut",
      },
    },
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-2",
        className
      )}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ? `${label} progress` : `Progress at ${clampedValue} percent`}
    >
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={size}
        height={size}
        className="-rotate-90 transform" // Start the progress ring at the top (12 o'clock)
      >
        {/* Background Circle (Track) */}
        <circle
          cx={center}
          cy={center}
          r={currentRadius}
          fill="transparent"
          stroke="hsl(var(--muted))" // Use shadcn/ui muted color for the track
          strokeWidth={strokeWidth}
        />

        {/* Foreground Circle (Animated Progress) */}
        <motion.circle
          cx={center}
          cy={center}
          r={currentRadius}
          fill="transparent"
          stroke="hsl(var(--primary))" // Use shadcn/ui primary color for the progress bar
          strokeWidth={strokeWidth}
          strokeLinecap="round" // Gives a smooth cap to the progress line
          strokeDasharray={currentCircumference}
          initial="initial"
          animate="animate"
          variants={circleVariants}
        />
      </svg>

      {/* Text Display (Positioned using Tailwind absolute on the container) */}
      <div className="absolute flex flex-col items-center justify-center text-foreground">
        <span
          className={cn(
            "text-2xl font-bold transition-colors duration-200",
            textClassName
          )}
        >
          {Math.round(clampedValue)}%
        </span>
        {label && (
          <span className="text-xs font-medium text-muted-foreground mt-1">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};


const ExampleUsage = () => {
  const [utilization, setUtilization] = React.useState(45);

  React.useEffect(() => {
    // Simulate data update
    const timer = setTimeout(() => {
      setUtilization(78);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-8 bg-background border rounded-lg max-w-4xl mx-auto shadow-md grid grid-cols-1 sm:grid-cols-3 gap-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Task Completion</h3>
        <ProgressRing
          value={utilization}
          size={100}
          label="Project Alpha"
        />
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Task Completion</h3>
        <ProgressRing
          value={92}
          size={100}
          label="Project Alpha"
        />
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Network Load</h3>
        <ProgressRing
          value={25}
          size={80}
          strokeWidth={8}
          label="Current Mbps"
        />
      </div>
    </div>
  );
};

export default ExampleUsage;