"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TriangleLoaderProps {
  size?: number;          // SVG viewbox size
  color?: string;         // Stroke color
  strokeWidth?: number;   // Stroke width
  polygons?: number;      // Number of triangles
  speed?: number;         // Animation duration (seconds)
  className?: string;
}

const TriangleLoader: React.FC<TriangleLoaderProps> = ({
  size = 1000,
  color = "text-yellow-400",
  strokeWidth = 16,
  polygons = 10,
  speed = 10,
  className,
}) => {
  const points = "500,200 759,650 241,650";

  return (
    <div className={cn("relative w-full h-full flex items-center justify-center", className)}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
        {Array.from({ length: polygons }).map((_, i) => (
          <polygon
            key={i}
            points={points}
            className={cn("poly")}
            style={{
              "--i": i,
              stroke: `currentColor`,
              strokeWidth: strokeWidth,
              animationDuration: `${speed}s`,
            } as React.CSSProperties}
          />
        ))}
      </svg>
    </div>
  );
};

export default TriangleLoader;
