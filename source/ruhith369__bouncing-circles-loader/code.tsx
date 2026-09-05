// components/BouncingCirclesLoader.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BouncingCirclesLoaderProps {
  size?: number;              // Total loader width/height
  circleSize?: number;        // Size of individual circle
  circleCount?: number;       // Number of circles
  color?: string;             // Tailwind background color for circles
  speed?: number;             // Animation duration in seconds
  className?: string;
}

const BouncingCirclesLoader: React.FC<BouncingCirclesLoaderProps> = ({
  size = 100,
  circleSize = 20,
  circleCount = 10,
  color = "bg-gray-800 dark:bg-gray-200",
  speed = 1.2,
  className,
}) => {
  const circles = Array.from({ length: circleCount });

  return (
    <div
      className={cn("relative flex flex-wrap justify-center items-center", className)}
      style={{ width: size, height: size }}
    >
      {circles.map((_, i) => (
        <div
          key={i}
          className={cn("rounded-full", color)}
          style={{
            width: circleSize,
            height: circleSize,
            margin: 2,
            animation: `bounce ${speed}s infinite ease-in-out`,
            animationDelay: `${-i * 0.1}s`,
          }}
        />
      ))}

      {/* Keyframes injected inline */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default BouncingCirclesLoader;
