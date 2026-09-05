"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion, type ValueAnimationTransition } from "motion/react";
import { cn } from "../_utils/cn";

interface HighlightHoverProps {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  effect?: ValueAnimationTransition;
  highlightColor: string;
  barThickness?: number; // ratio relative to font size
  gapRatio?: number; // vertical gap relative to font size
}

export const Component = ({
  children,
  as: Tag = "span",
  className,
  effect = { type: "spring", stiffness: 260, damping: 24 },
  highlightColor,
  barThickness = 0.12,
  gapRatio = 0.03,
  ...rest
}: HighlightHoverProps) => {
  const ref = useRef<HTMLSpanElement>(null);

  const MotionTag = useMemo(() => motion.create(Tag), [Tag]);

  // Set dynamic CSS vars
  useEffect(() => {
    const applyVars = () => {
      if (ref.current) {
        const size = parseFloat(
          getComputedStyle(ref.current).fontSize
        );
        ref.current.style.setProperty("--hh-bar", `${size * barThickness}px`);
        ref.current.style.setProperty("--hh-gap", `${size * gapRatio}px`);
      }
    };
    applyVars();
    window.addEventListener("resize", applyVars);
    return () => window.removeEventListener("resize", applyVars);
  }, [barThickness, gapRatio]);

  const barAnim = {
    rest: { height: "var(--hh-bar)" },
    hover: { height: "100%", transition: effect },
  };

  const textAnim = {
    rest: { color: "currentColor" },
    hover: { color: highlightColor, transition: effect },
  };

  return (
    <MotionTag
      ref={ref}
      whileHover="hover"
      className={cn("relative inline-block cursor-pointer", className)}
      {...rest}
    >
      <motion.div
        aria-hidden="true"
        variants={barAnim}
        className="absolute w-full bg-current"
        style={{
          height: "var(--hh-bar)",
          bottom: "calc(-1 * var(--hh-gap))",
        }}
      />
      <motion.span variants={textAnim} className="relative text-current">
        {children}
      </motion.span>
    </MotionTag>
  );
};
