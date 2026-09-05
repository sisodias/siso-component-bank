import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Info, Bike, ArrowRight } from "lucide-react";
import { cn } from "../_utils/cn"; // Your shadcn/ui utility file
import { Button } from "./button"; // Your shadcn/ui button

// Define the props for the component
interface RoutePlannerCardProps {
  alertMessage?: string;
  durationInMinutes: number;
  distance: number;
  distanceUnit?: "mi" | "km";
  climb: number;
  climbUnit?: "ft" | "m";
  elevationData: number[];
  routeFeature: {
    icon: React.ReactNode;
    text: string;
  };
  onStart: () => void;
  className?: string;
}

/**
 * A responsive and theme-adaptive card for displaying route plans with an animated elevation graph.
 */
export const RoutePlannerCard = ({
  alertMessage,
  durationInMinutes,
  distance,
  distanceUnit = "mi",
  climb,
  climbUnit = "ft",
  elevationData,
  routeFeature,
  onStart,
  className,
}: RoutePlannerCardProps) => {

  // Normalize elevation data to a 0-1 range for bar height calculation
  const maxElevation = Math.max(...elevationData);
  const normalizedData = elevationData.map((point) => point / maxElevation);

  // Animation variants for the elevation graph container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02, // Stagger the animation of each bar
      },
    },
  };

  // Animation variants for each individual bar
  const barVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: "0%",
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
      className={cn(
        "w-full max-w-sm rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-5",
        className
      )}
      aria-labelledby="route-planner-title"
    >
      {/* Alert Message */}
      <AnimatePresence>
        {alertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 rounded-lg bg-secondary/50 p-3 text-sm font-medium text-secondary-foreground"
          >
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>{alertMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Route Info */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h2 id="route-planner-title" className="text-4xl font-bold">
            {durationInMinutes} Minutes
          </h2>
          <Info className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">
          {distance} {distanceUnit} &middot; {climb} {climbUnit} climb
        </p>
      </div>

      {/* Animated Elevation Graph */}
      <div className="w-full" aria-label="Route elevation profile">
        <motion.div
          className="flex h-16 w-full items-end gap-[2px]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {normalizedData.map((height, index) => (
            <motion.div
              key={index}
              className="flex-1 rounded-t-full bg-primary"
              style={{ height: `${height * 100}%` }}
              variants={barVariants}
              aria-hidden="true"
            />
          ))}
        </motion.div>
      </div>

      {/* Route Feature */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {routeFeature.icon}
        <span>{routeFeature.text}</span>
      </div>

      {/* Start Button */}
      <Button onClick={onStart} size="lg" className="w-full text-lg">
        Start <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
};