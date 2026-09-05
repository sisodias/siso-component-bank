"use client";

import { cn } from "@/lib/utils";
import { motion, useAnimationControls } from "framer-motion";
import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  gap?: number;
  fade?: boolean;
}

export function Component({
  children,
  className,
  speed = 30,
  direction = "left",
  pauseOnHover = true,
  gap = 40,
  fade = true,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const controls = useAnimationControls();
  const [hovered, setHovered] = useState(false);

  const measure = useCallback(() => {
    if (innerRef.current) {
      const firstSet = innerRef.current.children[0] as HTMLElement;
      if (firstSet) {
        setContentWidth(firstSet.offsetWidth + gap);
      }
    }
  }, [gap]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (innerRef.current) ro.observe(innerRef.current);
    return () => ro.disconnect();
  }, [measure, children]);

  useEffect(() => {
    if (!contentWidth) return;

    const dist = contentWidth;
    const dur = dist / speed;

    controls.start({
      x: direction === "left" ? -dist : dist,
      transition: {
        duration: dur,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
      },
    });
  }, [contentWidth, speed, direction, controls]);

  useEffect(() => {
    if (!contentWidth) return;
    if (hovered && pauseOnHover) {
      controls.stop();
    } else {
      const dist = contentWidth;
      const dur = dist / speed;
      controls.start({
        x: direction === "left" ? -dist : dist,
        transition: {
          duration: dur,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      });
    }
  }, [hovered, pauseOnHover, contentWidth, speed, direction, controls]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Fade edges */}
      {fade && (
        <>
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-background to-transparent" />
        </>
      )}

      <motion.div
        ref={innerRef}
        className="flex w-max"
        animate={controls}
        initial={{ x: direction === "right" ? -(contentWidth || 0) : 0 }}
        style={{ gap }}
      >
        {/* Original content */}
        <div className="flex shrink-0 items-center" style={{ gap }}>
          {children}
        </div>
        {/* Duplicate for seamless loop */}
        <div className="flex shrink-0 items-center" style={{ gap }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}