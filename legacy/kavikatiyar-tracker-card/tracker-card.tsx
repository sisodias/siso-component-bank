"use client";

import * as React from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { cn } from "../_utils/cn";
import { Button } from "./button";

// Define the shape of a food suggestion object
interface Suggestion {
  name: string;
  calories: number;
}

// Define the props for the main component
export interface CalorieTrackerCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  currentCalories: number;
  goalCalories: number;
  suggestions: Suggestion[];
  onRecord?: () => void;
  className?: string;
}

const CalorieTrackerCard = React.forwardRef<
  HTMLDivElement,
  CalorieTrackerCardProps
>(
  (
    {
      className,
      icon,
      title,
      subtitle,
      currentCalories,
      goalCalories,
      suggestions,
      onRecord,
    },
    ref
  ) => {
    // Calculate progress percentage, ensuring it doesn't exceed 100
    const progressPercentage = Math.min((currentCalories / goalCalories) * 100, 100);

    // Animate the calorie count with a spring effect
    const animatedCalories = useSpring(0, {
      damping: 40,
      stiffness: 300,
    });
    
    // Transform the animated value to a rounded integer for display
    const displayCalories = useTransform(animatedCalories, (value) =>
      value.toFixed(0)
    );

    // Update the animation when the currentCalories prop changes
    React.useEffect(() => {
      animatedCalories.set(currentCalories);
    }, [currentCalories, animatedCalories]);

    return (
      <div
        ref={ref}
        className={cn(
          "w-full max-w-sm rounded-3xl bg-card p-6 text-card-foreground shadow-lg",
          "flex flex-col gap-6 border",
          className
        )}
      >
        {/* Card Header */}
        <header className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
              {icon}
            </div>
            <div>
              <h2 className="font-bold text-lg">{title}</h2>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <button className="text-muted-foreground">
            <ChevronUp className="h-5 w-5" />
          </button>
        </header>

        {/* Main Calorie Display */}
        <div className="flex flex-col gap-2">
            <div className="flex items-end gap-3">
                 <motion.p className="text-6xl font-bold tracking-tighter">
                    {displayCalories}
                </motion.p>
                <p className="mb-2 text-muted-foreground font-medium">
                    of {goalCalories}
                </p>
                <p className="mb-2 ml-auto font-medium">Calories</p>
            </div>
          {/* Progress Bar */}
            <div className="h-3 w-full overflow-hidden rounded-full bg-primary/10">
                <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                />
            </div>
        </div>
        
        {/* Food Suggestions Section */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold">Food suggestions</h3>
          <ul className="flex flex-col gap-2">
            {suggestions.map((item, index) => (
              <li key={index} className="flex justify-between text-sm">
                <p className="text-muted-foreground">{item.name}</p>
                <p className="font-medium">{item.calories} Kcal</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        <Button
          onClick={onRecord}
          className="w-full rounded-full py-6 text-base font-semibold"
        >
          + Record Your Consumptions
        </Button>
      </div>
    );
  }
);

CalorieTrackerCard.displayName = "CalorieTrackerCard";

export { CalorieTrackerCard };