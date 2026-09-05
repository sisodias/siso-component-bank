"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, Transition } from "motion/react";
import { cn } from "@/lib/utils";

interface TypewriterLoopProps {
  LeadText?: string;
  morphingText?: string[];
  className?: string;
  interval?: number;
  transition?: Transition;
  LeadTextClassName?: string;
  morphingTextClassName?: string;
  backgroundClassName?: string;
  cursorClassName?: string;
  staticColor?: "violet" | "blue" | "emerald" | "amber" | "rose" | "fuchsia";
  darkGradientBackgroundLock?: boolean; // New prop
}

const TypewriterLoop = ({
  LeadText = "Design",
  morphingText = ["Limitless", "Timeless", "Flawless"],
  className,
  interval = 4000,
  transition = { duration: 0.8, ease: "easeInOut" },
  LeadTextClassName,
  morphingTextClassName,
  backgroundClassName,
  cursorClassName,
  staticColor,
  darkGradientBackgroundLock = false, // New prop with default false
}: TypewriterLoopProps) => {
  const [index, setIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);

  const gradientColors = [
    "from-violet-400 to-violet-800 dark:from-violet-400 dark:to-violet-600",
    "from-blue-400 to-blue-800 dark:from-blue-400 dark:to-blue-600",
    "from-emerald-400 to-emerald-800 dark:from-emerald-400 dark:to-emerald-600",
    "from-amber-400 to-amber-800 dark:from-amber-400 dark:to-amber-600",
    "from-rose-400 to-rose-800 dark:from-rose-400 dark:to-rose-600",
    "from-fuchsia-400 to-fuchsia-800 dark:from-fuchsia-400 dark:to-fuchsia-600",
  ];

  const backgroundColors = [
    "from-transparent via-purple-200/30 to-purple-200 dark:from-transparent dark:via-violet-950/30 dark:to-violet-950/60",
    "from-transparent via-blue-200/30 to-blue-200 dark:from-transparent dark:via-blue-950/30 dark:to-blue-950/60",
    "from-transparent via-emerald-200/30 to-emerald-200 dark:from-transparent dark:via-emerald-950/30 dark:to-emerald-950/60",
    "from-transparent via-amber-200/30 to-amber-200 dark:from-transparent dark:via-amber-950/30 dark:to-amber-950/60",
    "from-transparent via-rose-200/30 to-rose-200 dark:from-transparent dark:via-rose-950/30 dark:to-rose-950/60",
    "from-transparent via-fuchsia-200/30 to-fuchsia-200 dark:from-transparent dark:via-fuchsia-950/30 dark:to-fuchsia-950/60",
  ];

  // Dark-only background colors (no light mode variants)
  const darkOnlyBackgroundColors = [
    "from-transparent via-violet-950/30 to-violet-950/60",
    "from-transparent via-blue-950/30 to-blue-950/60",
    "from-transparent via-emerald-950/30 to-emerald-950/60",
    "from-transparent via-amber-950/30 to-amber-950/60",
    "from-transparent via-rose-950/30 to-rose-950/60",
    "from-transparent via-fuchsia-950/30 to-fuchsia-950/60",
  ];

  const cursorColors = [
    "bg-violet-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-fuchsia-500",
  ];

  // Color mapping for static colors
  const staticGradientMap = {
    violet:
      "from-violet-400 to-violet-800 dark:from-violet-400 dark:to-violet-600",
    blue: "from-blue-400 to-blue-800 dark:from-blue-400 dark:to-blue-600",
    emerald:
      "from-emerald-400 to-emerald-800 dark:from-emerald-400 dark:to-emerald-600",
    amber: "from-amber-400 to-amber-800 dark:from-amber-400 dark:to-amber-600",
    rose: "from-rose-400 to-rose-800 dark:from-rose-400 dark:to-rose-600",
    fuchsia:
      "from-fuchsia-400 to-fuchsia-800 dark:from-fuchsia-400 dark:to-fuchsia-600",
  };

  const staticBackgroundMap = {
    violet:
      "from-transparent via-purple-200/30 to-purple-200 dark:from-transparent dark:via-violet-950/30 dark:to-violet-950/60",
    blue: "from-transparent via-blue-200/30 to-blue-200 dark:from-transparent dark:via-blue-950/30 dark:to-blue-950/60",
    emerald:
      "from-transparent via-emerald-200/30 to-emerald-200 dark:from-transparent dark:via-emerald-950/30 dark:to-emerald-950/60",
    amber:
      "from-transparent via-amber-200/30 to-amber-200 dark:from-transparent dark:via-amber-950/30 dark:to-amber-950/60",
    rose: "from-transparent via-rose-200/30 to-rose-200 dark:from-transparent dark:via-rose-950/30 dark:to-rose-950/60",
    fuchsia:
      "from-transparent via-fuchsia-200/30 to-fuchsia-200 dark:from-transparent dark:via-fuchsia-950/30 dark:to-fuchsia-950/60",
  };

  // Dark-only static background map
  const staticDarkOnlyBackgroundMap = {
    violet: "from-transparent via-violet-950/30 to-violet-950/60",
    blue: "from-transparent via-blue-950/30 to-blue-950/60",
    emerald: "from-transparent via-emerald-950/30 to-emerald-950/60",
    amber: "from-transparent via-amber-950/30 to-amber-950/60",
    rose: "from-transparent via-rose-950/30 to-rose-950/60",
    fuchsia: "from-transparent via-fuchsia-950/30 to-fuchsia-950/60",
  };

  const staticCursorMap = {
    violet: "bg-violet-500",
    blue: "bg-blue-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    fuchsia: "bg-fuchsia-500",
  };

  // Determine which gradient to use
  const getGradientColor = () => {
    if (staticColor) {
      return staticGradientMap[staticColor];
    }
    return gradientColors[colorIndex];
  };

  const getBackgroundColor = () => {
    // If dark lock is enabled, use dark-only backgrounds
    if (darkGradientBackgroundLock) {
      if (staticColor) {
        return staticDarkOnlyBackgroundMap[staticColor];
      }
      return darkOnlyBackgroundColors[colorIndex];
    }

    // Otherwise use normal backgrounds with both light and dark variants
    if (staticColor) {
      return staticBackgroundMap[staticColor];
    }
    return backgroundColors[colorIndex];
  };

  const getCursorColor = () => {
    if (staticColor) {
      return staticCursorMap[staticColor];
    }
    return cursorColors[colorIndex];
  };

  // Pre-calculate next index
  useEffect(() => {
    setNextIndex((index + 1) % morphingText.length);
  }, [index, morphingText.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % morphingText.length);
    }, interval);
    return () => clearInterval(timer);
  }, [morphingText.length, interval]);

  const handleExitComplete = useCallback(() => {
    // Only cycle colors if staticColor is not provided
    if (!staticColor) {
      setColorIndex((prev) => (prev + 1) % gradientColors.length);
    }
  }, [gradientColors.length, staticColor]);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-start w-fit gap-x-2 md:gap-x-3 gap-y-1 text-3xl md:text-7xl font-medium tracking-tight",
        className,
      )}
    >
      <span
        className={cn("whitespace-nowrap text-foreground", LeadTextClassName)}
      >
        {LeadText}
      </span>
      <div className="relative flex items-center">
        <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
          <motion.div
            key={morphingText[index]}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={transition}
            className="overflow-hidden whitespace-nowrap relative"
          >
            {/* Background gradient box */}
            <div
              className={cn(
                "absolute inset-0",
                "bg-gradient-to-r",
                getBackgroundColor(),
                backgroundClassName,
              )}
            />

            <span
              className={cn(
                "relative bg-clip-text text-transparent",
                "bg-gradient-to-r",
                getGradientColor(),
                "pr-1",
                morphingTextClassName,
              )}
            >
              {morphingText[index]}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Cursor Line */}
        <motion.div
          key={staticColor ? `cursor-${staticColor}` : `cursor-${colorIndex}`}
          className={cn(
            "w-[3px] md:w-[4px] h-[1.10em] sm:h-[1em]",
            getCursorColor(),
            cursorClassName,
          )}
          animate={{ opacity: [1, 0.5] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>
    </div>
  );
};

export default TypewriterLoop;
