"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const DEFAULT_COLORS = ["#8B5CF6", "#22C55E", "#F59E0B", "#06B6D4", "#EC4899"];

interface ParticleBurstProps {
  count?: number;
  centerX?: number;
  centerY?: number;
  colors?: string[];
  distance?: number;
  size?: number;
}

export default function ParticleBurst({
  count = 12,
  centerX = 0,
  centerY = 0,
  colors = DEFAULT_COLORS,
  distance = 100,
  size = 6,
}: ParticleBurstProps) {
  const prefersReduced = useReducedMotion();

  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        angle: (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5,
        dist: distance * (0.5 + Math.random() * 0.5),
        color: colors[i % colors.length],
        delay: Math.random() * 0.2,
      })),
    [count, distance, colors]
  );

  if (prefersReduced) return null;

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: size * (0.5 + Math.random() * 0.5),
            height: size * (0.5 + Math.random() * 0.5),
            backgroundColor: p.color,
            left: centerX,
            top: centerY,
          }}
          initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          animate={{
            opacity: 0,
            scale: 0,
            x: Math.cos(p.angle) * p.dist,
            y: Math.sin(p.angle) * p.dist,
          }}
          transition={{ duration: 0.7, delay: p.delay, ease: [0, 0, 0.2, 1] }}
        />
      ))}
    </div>
  );
}
