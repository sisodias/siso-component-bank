"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type RefObject,
  type ReactNode,
} from "react";

interface BeamConfig {
  from: RefObject<HTMLElement | null>;
  to: RefObject<HTMLElement | null>;
  curvature?: number;
  duration?: number;
  delay?: number;
  pathColor?: string;
  glowColor?: string;
  glowWidth?: number;
  reverse?: boolean;
}

interface AnimatedBeamsProps {
  children: ReactNode;
  className?: string;
  beams: BeamConfig[];
}

function calculatePath(
  fromEl: HTMLElement,
  toEl: HTMLElement,
  container: HTMLElement,
  curvature: number
): string {
  const containerRect = container.getBoundingClientRect();
  const fromRect = fromEl.getBoundingClientRect();
  const toRect = toEl.getBoundingClientRect();

  const x1 = fromRect.left + fromRect.width / 2 - containerRect.left;
  const y1 = fromRect.top + fromRect.height / 2 - containerRect.top;
  const x2 = toRect.left + toRect.width / 2 - containerRect.left;
  const y2 = toRect.top + toRect.height / 2 - containerRect.top;

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  const dx = x2 - x1;
  const dy = y2 - y1;

  // perpendicular offset for curvature
  const cx = midX + -dy * curvature;
  const cy = midY + dx * curvature;

  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

function Beam({
  path,
  duration,
  delay,
  pathColor,
  glowColor,
  glowWidth,
  reverse,
  id,
}: {
  path: string;
  duration: number;
  delay: number;
  pathColor: string;
  glowColor: string;
  glowWidth: number;
  reverse: boolean;
  id: string;
}) {
  return (
    <>
      {/* Base dim path */}
      <path
        d={path}
        fill="none"
        stroke={pathColor}
        strokeWidth={1}
        strokeDasharray="4 4"
        opacity={0.15}
      />

      {/* Animated glow along path */}
      <motion.path
        d={path}
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth={glowWidth}
        strokeLinecap="round"
        initial={{ pathLength: 0, pathOffset: reverse ? 1 : 0 }}
        animate={{
          pathLength: [0, 0.15, 0],
          pathOffset: reverse ? [1, 0.4, 0] : [0, 0.6, 1],
        }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 0.5,
        }}
      />

      {/* Gradient for the glow */}
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={glowColor} stopOpacity="0" />
          <stop offset="40%" stopColor={glowColor} stopOpacity="0.8" />
          <stop offset="60%" stopColor={glowColor} stopOpacity="1" />
          <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
        </linearGradient>
      </defs>
    </>
  );
}

export function Component({ children, className, beams }: AnimatedBeamsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<string[]>([]);

  const updatePaths = useCallback(() => {
    if (!containerRef.current) return;
    const newPaths = beams.map((beam) => {
      if (!beam.from.current || !beam.to.current) return "";
      return calculatePath(
        beam.from.current,
        beam.to.current,
        containerRef.current!,
        beam.curvature ?? 0
      );
    });
    setPaths(newPaths);
  }, [beams]);

  useEffect(() => {
    updatePaths();
    const ro = new ResizeObserver(updatePaths);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", updatePaths);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updatePaths);
    };
  }, [updatePaths]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {children}

      <svg className="pointer-events-none absolute inset-0 size-full" style={{ overflow: "visible" }}>
        {paths.map((path, i) => {
          if (!path) return null;
          const beam = beams[i];
          return (
            <Beam
              key={i}
              id={`beam-grad-${i}`}
              path={path}
              duration={beam.duration ?? 3}
              delay={beam.delay ?? i * 0.6}
              pathColor={beam.pathColor ?? "currentColor"}
              glowColor={beam.glowColor ?? "#3B82F6"}
              glowWidth={beam.glowWidth ?? 3}
              reverse={beam.reverse ?? false}
            />
          );
        })}
      </svg>
    </div>
  );
}