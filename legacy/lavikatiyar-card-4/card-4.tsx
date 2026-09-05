"use client";

import * as React from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { cn } from "../_utils/cn"; // Assuming you have a `cn` utility

// Props interface for type safety and reusability
interface AnimatedStatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  primaryValue: number;
  secondaryValue: number;
  secondaryLabel: string;
  icon: React.ReactNode;
}

const AnimatedStatsCard = React.forwardRef<HTMLDivElement, AnimatedStatsCardProps>(
  (
    {
      title,
      primaryValue,
      secondaryValue,
      secondaryLabel,
      icon,
      className,
      ...props
    },
    ref
  ) => {
    const cardRef = React.useRef<HTMLDivElement>(null);
    const isInView = useInView(cardRef, { once: true, margin: "-100px" });

    // Spring animation for a more natural number count-up
    const spring = useSpring(0, {
      damping: 50,
      stiffness: 200,
      mass: 1,
    });
    
    // Transform the motion value to format it with one decimal place
    const displayValue = useTransform(spring, (current) => current.toFixed(1));

    // Update spring value when component is in view
    React.useEffect(() => {
      if (isInView) {
        spring.set(primaryValue);
      }
    }, [isInView, primaryValue, spring]);


    return (
      <div
        ref={cardRef}
        className={cn(
          // CHANGE: Simplified background and text color for better contrast
          "relative flex w-full max-w-sm flex-col overflow-hidden rounded-2xl p-6",
          "bg-primary text-primary-foreground", // Ensures high contrast
          "shadow-lg transition-all hover:shadow-2xl",
          // Subtle dot pattern using the foreground color for visibility
          "before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary-foreground)/0.05)_2%,transparent_2%)] before:bg-[length:20px_20px]",
          className
        )}
        {...props}
      >
        {/* Card Header */}
        <div className="flex items-center justify-between">
          {/* Ensure child text elements use the correct foreground color */}
          <h2 className="text-lg font-medium text-primary-foreground/90">{title}</h2>
          <div className="rounded-full bg-primary-foreground/10 p-2">{icon}</div>
        </div>

        {/* Main Content */}
        <div className="z-10 flex flex-1 items-end justify-between gap-4 pt-8">
          {/* Animated Primary Value */}
          <div className="flex items-baseline" aria-live="polite">
            <motion.h1 className="text-6xl font-bold tracking-tighter">
              {displayValue}
            </motion.h1>
          </div>
          {/* Horizontal Line */}
          <div className="mb-4 h-1 w-full flex-1 rounded-full bg-primary-foreground/20" />
          {/* Secondary Value */}
          <div className="flex flex-col items-center text-right">
            <span className="text-4xl font-semibold tracking-tight">
              {secondaryValue}
            </span>
            <span className="text-sm font-light text-primary-foreground/80">
              {secondaryLabel}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

AnimatedStatsCard.displayName = "AnimatedStatsCard";

export { AnimatedStatsCard };