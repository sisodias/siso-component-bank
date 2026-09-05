"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AuroraHeroProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Injects the CSS keyframes for the aurora animation.
 */
const AuroraAnimation = () => (
  <style>
    {`
      @keyframes aurora-1 {
        0% { transform: translate(0%, 0%) scale(1); }
        25% { transform: translate(20%, -20%) scale(1.2); }
        50% { transform: translate(-20%, 20%) scale(0.8); }
        75% { transform: translate(10%, -10%) scale(1.1); }
        100% { transform: translate(0%, 0%) scale(1); }
      }
      @keyframes aurora-2 {
        0% { transform: translate(0%, 0%) scale(1); }
        25% { transform: translate(-20%, 20%) scale(1.1); }
        50% { transform: translate(20%, -20%) scale(0.9); }
        75% { transform: translate(-10%, 10%) scale(1.2); }
        100% { transform: translate(0%, 0%) scale(1); }
      }
    `}
  </style>
);

export const AuroraHero = ({ children, className }: AuroraHeroProps) => {
  return (
    <div className="h-full w-full">
      <AuroraAnimation />
      <div
        className={cn(
          "relative flex h-screen w-full flex-col items-center justify-center overflow-hidden rounded-md bg-background antialiased",
          className
        )}
      >
        {/* The Aurora Background */}
        <div className="absolute inset-0 z-0">
          {/* Main Aurora Blob 1 (Primary Color) */}
          <div className="absolute -top-1/4 left-1/4 h-96 w-96 animate-[aurora-1_20s_ease-in-out_infinite] rounded-full bg-primary/30 opacity-20 blur-3xl filter dark:opacity-50" />
          {/* Main Aurora Blob 2 (Secondary/Muted Color) */}
          <div className="absolute -bottom-1/4 right-1/4 h-96 w-96 animate-[aurora-2_20s_ease-in-out_infinite] rounded-full bg-muted-foreground/30 opacity-10 blur-3xl filter dark:opacity-30" />
        </div>

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
};