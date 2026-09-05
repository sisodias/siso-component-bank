// components/ui/sleep-tracker-card.tsx
import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Your utility for merging Tailwind classes

// Define TypeScript types for props for type safety and clarity
type SleepStage = "Awake" | "REM" | "Core" | "Deep";

interface SleepGraphSegment {
  stage: SleepStage;
  duration: number; // Represents proportion, e.g., flex-grow value
  height: number; // Represents percentage height (0-100)
}

export interface SleepData {
  timeSlept: string;
  quality: number;
  changePercent: number;
  startTime: string;
  endTime: string;
  stages: Record<SleepStage, string>;
  graphData: SleepGraphSegment[];
}

interface SleepTrackerCardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: SleepData;
  icons: {
    sleep: React.ReactNode;
    moon: React.ReactNode;
    sun: React.ReactNode;
    arrowUp: React.ReactNode;
  };
}

// Color mapping for different sleep stages using HSL variables for theming
const stageColors: Record<SleepStage, string> = {
  Awake: "bg-orange-400",
  REM: "bg-sky-400",
  Core: "bg-blue-500",
  Deep: "bg-indigo-600",
};

// Main component definition
const SleepTrackerCard = React.forwardRef<
  HTMLDivElement,
  SleepTrackerCardProps
>(({ className, data, icons, ...props }, ref) => {
  const {
    timeSlept,
    quality,
    changePercent,
    startTime,
    endTime,
    stages,
    graphData,
  } = data;

  // Animation variants for the graph container and individual bars
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const barVariants = {
    hidden: { scaleY: 0, opacity: 0 },
    visible: {
      scaleY: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div
      ref={ref}
      className={cn(
        "w-full max-w-md rounded-2xl border bg-card p-6 text-card-foreground shadow-lg",
        className
      )}
      {...props}
    >
      {/* Header Section */}
      <div className="mb-6 flex items-center gap-3">
        {icons.sleep}
        <h2 className="text-lg font-semibold">Sleep</h2>
      </div>

      {/* Main Stats Section */}
      <div className="mb-6 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold">{timeSlept}</p>
          <p className="text-xs text-muted-foreground">Time Sleep</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{quality}%</p>
          <p className="text-xs text-muted-foreground">Quality</p>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1 text-green-500">
            {icons.arrowUp}
            <p className="text-2xl font-bold">{changePercent}%</p>
          </div>
          <p className="text-xs text-muted-foreground">than yesterday</p>
        </div>
      </div>

      {/* Animated Graph Section */}
      <div
        className="rounded-lg bg-muted/50 p-4"
        aria-label="Sleep stages graph"
        role="figure"
      >
        <motion.div
          className="flex h-24 w-full items-end justify-center gap-px"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {graphData.map((segment, index) => (
            <motion.div
              key={index}
              className={cn(
                "rounded-full",
                stageColors[segment.stage]
              )}
              style={{
                flexGrow: segment.duration,
                height: `${segment.height}%`,
              }}
              variants={barVariants}
              aria-label={`${segment.stage} sleep for a duration proportion of ${segment.duration}`}
            />
          ))}
        </motion.div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            {icons.moon}
            <span>{startTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>{endTime}</span>
            {icons.sun}
          </div>
        </div>
      </div>

      {/* Legend Section */}
      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
        {Object.entries(stages).map(([stage, duration]) => (
          <div key={stage} className="flex items-center gap-2">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                stageColors[stage as SleepStage]
              )}
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-medium">{stage}</p>
              <p className="text-xs text-muted-foreground">{duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
SleepTrackerCard.displayName = "SleepTrackerCard";

export { SleepTrackerCard };