"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

const MASK_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0id2hpdGUiLz48L3N2Zz4=";

export const MaskContainer = ({
  children,
  revealText,
  size = 10,
  revealSize = 600,
  className,
}: {
  children?: string | React.ReactNode;
  revealText?: string | React.ReactNode;
  size?: number;
  revealSize?: number;
  className?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    el.addEventListener("mousemove", handler);
    return () => el.removeEventListener("mousemove", handler);
  }, []);

  const maskSize = isHovered ? revealSize : size;
  const mx = (mousePosition.x ?? 0) - maskSize / 2;
  const my = (mousePosition.y ?? 0) - maskSize / 2;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-screen w-full bg-white dark:bg-black transition-colors duration-300",
        className
      )}
    >
      {/* Revealed overlay — black in light mode, white in dark mode */}
      <motion.div
        className="absolute inset-0 flex h-full w-full items-center justify-center bg-black dark:bg-white"
        style={{
          WebkitMaskImage: `url("${MASK_DATA_URL}")`,
          WebkitMaskRepeat: "no-repeat",
          maskImage: `url("${MASK_DATA_URL}")`,
          maskRepeat: "no-repeat",
        }}
        animate={{
          WebkitMaskPosition: `${mx}px ${my}px`,
          WebkitMaskSize: `${maskSize}px`,
          maskPosition: `${mx}px ${my}px`,
          maskSize: `${maskSize}px`,
        }}
        transition={{
          maskSize: { duration: 0.3, ease: "easeInOut" },
          WebkitMaskSize: { duration: 0.3, ease: "easeInOut" },
          maskPosition: { duration: 0.05, ease: "linear" },
          WebkitMaskPosition: { duration: 0.05, ease: "linear" },
        }}
      >
        <div className="absolute inset-0 z-0 h-full w-full bg-black opacity-50 dark:bg-white dark:opacity-50" />
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative z-20 mx-auto max-w-4xl text-center text-4xl font-bold text-white dark:text-black"
        >
          {children}
        </div>
      </motion.div>

      {/* Base layer */}
      <div className="flex h-full w-full items-center justify-center">
        {revealText}
      </div>
    </div>
  );
};
