// components/ui/weekly-date-picker.tsx
"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../_utils/cn"; // Your utility for merging class names
import { Button } from "./button"; // Assuming you have a Button component

// Helper function to get the start of the week (Sunday)
const getStartOfWeek = (date: Date): Date => {
  const newDate = new Date(date);
  const day = newDate.getDay();
  const diff = newDate.getDate() - day;
  return new Date(newDate.setDate(diff));
};

// Helper function to check if two dates are the same day
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

interface WeeklyDatePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date: Date;
  setDate: (date: Date) => void;
}

export const WeeklyDatePicker = React.forwardRef<
  HTMLDivElement,
  WeeklyDatePickerProps
>(({ className, date, setDate, ...props }, ref) => {
  // State to manage the currently displayed week
  const [displayDate, setDisplayDate] = useState(getStartOfWeek(date));
  // State to manage animation direction
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const weekDays = useMemo(() => {
    const start = getStartOfWeek(displayDate);
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
  }, [displayDate]);

  const handlePrevWeek = () => {
    setDirection("prev");
    setDisplayDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 7);
      return newDate;
    });
  };

  const handleNextWeek = () => {
    setDirection("next");
    setDisplayDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 7);
      return newDate;
    });
  };

  const animationVariants = {
    initial: (direction: "next" | "prev") => ({
      opacity: 0,
      x: direction === "next" ? 20 : -20,
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: (direction: "next" | "prev") => ({
      opacity: 0,
      x: direction === "next" ? -20 : 20,
      transition: { duration: 0.3, ease: "easeInOut" },
    }),
  };

  return (
    <div
      ref={ref}
      className={cn(
        "w-full max-w-sm rounded-xl border bg-card p-4 text-card-foreground shadow-sm",
        className
      )}
      {...props}
    >
      {/* Header with month/year and navigation */}
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-lg">
          {displayDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </p>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevWeek}
            aria-label="Previous week"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextWeek}
            aria-label="Next week"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Animated container for week days */}
      <div className="relative overflow-hidden h-[76px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={displayDate.toISOString()}
            className="grid grid-cols-7 gap-2 absolute w-full"
            custom={direction}
            variants={animationVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Day initials */}
            {weekDays.map((day) => (
              <div
                key={`initial-${day.toISOString()}`}
                className="text-center text-sm text-muted-foreground"
              >
                {day.toLocaleString("default", { weekday: "narrow" })}
              </div>
            ))}

            {/* Date buttons */}
            {weekDays.map((day) => {
              const isSelected = isSameDay(day, date);
              return (
                <button
                  key={`day-${day.toISOString()}`}
                  onClick={() => setDate(day)}
                  className={cn(
                    "flex items-center justify-center h-10 w-10 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "hover:bg-accent hover:text-accent-foreground",
                    {
                      "bg-primary text-primary-foreground hover:bg-primary/90":
                        isSelected,
                    }
                  )}
                  aria-pressed={isSelected}
                >
                  {String(day.getDate()).padStart(2, "0")}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
});

WeeklyDatePicker.displayName = "WeeklyDatePicker";