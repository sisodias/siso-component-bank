"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

export interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one full loop. Lower is faster. */
  duration?: number;
  className?: string;
}

/**
 * Seamless, infinite horizontal marquee — ideal for logo clouds and badge
 * rows. Two identical tracks loop edge-to-edge; the edges fade out with a CSS
 * mask. Honors prefers-reduced-motion via framer-motion's MotionConfig.
 */
export default function Marquee({
  children,
  duration = 38,
  className = "",
}: MarqueeProps) {
  return (
    <div
      className={
        "group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] " +
        className
      }
    >
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          aria-hidden={i === 1}
          className="flex shrink-0 items-center gap-x-12 pr-12 sm:gap-x-16 sm:pr-16"
          animate={{ x: ["0%", "-100%"] }}
          transition={{ duration, ease: "linear", repeat: Infinity }}
        >
          {children}
        </motion.div>
      ))}
    </div>
  );
}
