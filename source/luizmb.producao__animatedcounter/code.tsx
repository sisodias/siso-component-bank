"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export interface AnimatedCounterProps {
  /** Target number to count up to. */
  value: number;
  duration?: number;
  delay?: number;
  /** Maps the in-flight numeric value to the string shown on screen. */
  format?: (value: number) => string;
  className?: string;
}

/**
 * Counts up to `value` once it scrolls into view, then stops. Honors
 * reduced-motion by jumping straight to the final value. Great for stats,
 * pricing and KPI reveals. Self-contained — only depends on framer-motion.
 */
export default function AnimatedCounter({
  value,
  duration = 1.1,
  delay = 0,
  format = (v) => Math.round(v).toString(),
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      delay,
      ease: EASE,
      onUpdate: setDisplay,
    });
    return () => controls.stop();
  }, [inView, value, duration, delay, reduce]);

  return (
    <span ref={ref} className={className}>
      {format(display)}
    </span>
  );
}
