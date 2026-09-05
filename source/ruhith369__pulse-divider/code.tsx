"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PulseDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  glow?: boolean;
  gradient?: boolean;
  color?: string;
  orientation?: "horizontal" | "vertical";
  thickness?: number;
}

export const PulseDivider = ({
  label,
  glow = true,
  gradient = true,
  color,
  orientation = "horizontal",
  thickness = 2,
  className,
  ...props
}: PulseDividerProps) => {
  const isHorizontal = orientation === "horizontal";

  const baseStyle = cn(
    "relative flex items-center justify-center w-full overflow-hidden",
    isHorizontal ? "flex-row" : "flex-col h-full",
    className
  );

  const lineBase = cn(
    "relative flex-grow rounded-full",
    gradient
      ? "bg-gradient-to-r from-primary/70 via-primary/40 to-primary/70 dark:from-primary/50 dark:via-primary/30 dark:to-primary/50"
      : "bg-muted-foreground/40"
  );

  return (
    <div className={baseStyle} {...props}>
      {/* Left/Top line */}
      <motion.div
        className={lineBase}
        style={{
          height: isHorizontal ? thickness : "100%",
          width: isHorizontal ? "100%" : thickness,
          boxShadow: glow
            ? `0 0 10px ${color || "rgb(var(--primary))"}, 0 0 20px ${
                color || "rgb(var(--primary))"
              }`
            : undefined,
          backgroundColor: gradient ? undefined : color,
        }}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      ></motion.div>

      {label && (
        <span className="mx-4 px-3 py-1 text-xs font-medium text-muted-foreground bg-background/80 backdrop-blur-md border border-border/50 rounded-full shadow-sm">
          {label}
        </span>
      )}

      {/* Right/Bottom line */}
      <motion.div
        className={lineBase}
        style={{
          height: isHorizontal ? thickness : "100%",
          width: isHorizontal ? "100%" : thickness,
          boxShadow: glow
            ? `0 0 10px ${color || "rgb(var(--primary))"}, 0 0 20px ${
                color || "rgb(var(--primary))"
              }`
            : undefined,
          backgroundColor: gradient ? undefined : color,
        }}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      ></motion.div>
    </div>
  );
};
