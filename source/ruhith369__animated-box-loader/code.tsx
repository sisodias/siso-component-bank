"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedBoxLoaderProps {
  size?: number;
  primaryColor?: string;
  secondaryColor?: string;
  speed?: number; // seconds per animation loop
}

const AnimatedBoxLoader: React.FC<AnimatedBoxLoaderProps> = ({
  size = 150,
  primaryColor = "bg-sky-700 dark:bg-sky-400",
  secondaryColor = "bg-red-700 dark:bg-red-400",
  speed = 3,
}) => {
  const boxSize = size * 0.43;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Loader Base */}
      <div
        className={cn(
          "relative rounded-[39px] overflow-hidden",
          "bg-neutral-200 dark:bg-neutral-800 shadow-inner border border-neutral-300 dark:border-neutral-700 transition-colors"
        )}
        style={{ width: size, height: size }}
      >
        {/* Moving Boxes */}
        <div
          className={cn(
            "absolute rounded-[10px]",
            "animate-move",
            primaryColor,
            "transition-colors"
          )}
          style={{
            width: boxSize,
            height: boxSize,
            animationDuration: `${speed}s`,
          }}
        />
        <div
          className={cn(
            "absolute rounded-[10px]",
            "animate-move",
            secondaryColor,
            "transition-colors"
          )}
          style={{
            width: boxSize,
            height: boxSize,
            animationDelay: `${speed / 2}s`,
            animationDuration: `${speed}s`,
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedBoxLoader;
