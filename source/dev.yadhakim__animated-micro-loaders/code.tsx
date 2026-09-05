"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LoaderProps {
  size?: number;
  color?: string;
  className?: string;
}

/* ─── 1. ORBIT ─── 3 dots chasing in a circle */
export function OrbitLoader({ size = 40, color = "currentColor", className }: LoaderProps) {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: size * 0.18,
            height: size * 0.18,
            backgroundColor: color,
            top: "50%",
            left: "50%",
            marginTop: -(size * 0.09),
            marginLeft: -(size * 0.09),
          }}
          animate={{
            rotate: 360,
            x: [0, size * 0.35, 0, -(size * 0.35), 0],
            y: [-(size * 0.35), 0, size * 0.35, 0, -(size * 0.35)],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.25,
          }}
        />
      ))}
    </div>
  );
}

/* ─── 2. PULSE RINGS ─── concentric expanding rings */
export function PulseRingLoader({ size = 40, color = "currentColor", className }: LoaderProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2"
          style={{ borderColor: color }}
          animate={{
            width: [size * 0.15, size],
            height: [size * 0.15, size],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 0.6,
          }}
        />
      ))}
      <div
        className="rounded-full"
        style={{ width: size * 0.15, height: size * 0.15, backgroundColor: color }}
      />
    </div>
  );
}

/* ─── 3. BOUNCE DOTS ─── 4 dots bouncing in sequence */
export function BounceDotsLoader({ size = 40, color = "currentColor", className }: LoaderProps) {
  const dotSize = size * 0.18;
  const gap = size * 0.06;
  return (
    <div className={cn("flex items-end justify-center", className)} style={{ width: size, height: size, gap }}>
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{ width: dotSize, height: dotSize, backgroundColor: color }}
          animate={{ y: [0, -(size * 0.45), 0] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: [0.32, 0.72, 0, 1],
            delay: i * 0.12,
          }}
        />
      ))}
    </div>
  );
}

/* ─── 4. SPINNING BARS ─── 8 bars fading in rotation */
export function SpinningBarsLoader({ size = 40, color = "currentColor", className }: LoaderProps) {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: size * 0.08,
            height: size * 0.25,
            backgroundColor: color,
            left: "50%",
            top: "15%",
            marginLeft: -(size * 0.04),
            transformOrigin: `50% ${size * 0.35}px`,
            transform: `rotate(${i * 45}deg)`,
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}

/* ─── 5. WAVE BARS ─── audio-style oscillating bars */
export function WaveBarsLoader({ size = 40, color = "currentColor", className }: LoaderProps) {
  const barW = size * 0.1;
  const heights = [0.3, 0.6, 1, 0.6, 0.3];
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      style={{ width: size, height: size, gap: size * 0.05 }}
    >
      {heights.map((h, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{ width: barW, backgroundColor: color }}
          animate={{ height: [size * 0.15, size * h, size * 0.15] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.08,
          }}
        />
      ))}
    </div>
  );
}

/* ─── 6. DNA HELIX ─── two sets of dots crossing paths */
export function HelixLoader({ size = 40, color = "currentColor", className }: LoaderProps) {
  const count = 6;
  const dotSize = size * 0.12;
  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={`a${i}`}
          className="absolute rounded-full"
          style={{
            width: dotSize,
            height: dotSize,
            backgroundColor: color,
          }}
          animate={{
            x: [-(size * 0.3), size * 0.3, -(size * 0.3)],
            y: 0,
            scale: [0.6, 1, 0.6],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: (i / count) * 1.4,
          }}
        />
      ))}
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={`b${i}`}
          className="absolute rounded-full"
          style={{
            width: dotSize,
            height: dotSize,
            backgroundColor: color,
            opacity: 0.4,
          }}
          animate={{
            x: [size * 0.3, -(size * 0.3), size * 0.3],
            y: 0,
            scale: [1, 0.6, 1],
            opacity: [1, 0.3, 1],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: (i / count) * 1.4,
          }}
        />
      ))}
    </div>
  );
}

/* ─── 7. RADAR ─── rotating sweep with trailing fade */
export function RadarLoader({ size = 40, color = "currentColor", className }: LoaderProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <div
        className="absolute rounded-full border"
        style={{ width: size * 0.9, height: size * 0.9, borderColor: color, opacity: 0.15 }}
      />
      <div
        className="absolute rounded-full border"
        style={{ width: size * 0.55, height: size * 0.55, borderColor: color, opacity: 0.1 }}
      />
      <div
        className="rounded-full"
        style={{ width: size * 0.12, height: size * 0.12, backgroundColor: color, opacity: 0.5 }}
      />
      <motion.div
        className="absolute"
        style={{
          width: size * 0.45,
          height: 2,
          backgroundColor: color,
          left: "50%",
          top: "50%",
          transformOrigin: "0% 50%",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{ width: size * 0.9, height: size * 0.9 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div
          style={{
            width: "50%",
            height: "50%",
            borderRadius: "100% 0 0 0",
            background: `conic-gradient(from 0deg, transparent, ${color}30)`,
            opacity: 0.6,
          }}
        />
      </motion.div>
    </div>
  );
}

/* ─── 8. MORPH ─── shape morphing square → circle loop */
export function MorphLoader({ size = 40, color = "currentColor", className }: LoaderProps) {
  return (
    <div className={cn("flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <motion.div
        style={{ width: size * 0.55, height: size * 0.55, backgroundColor: color }}
        animate={{
          borderRadius: ["15%", "50%", "50%", "15%", "15%"],
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 0.85, 1, 0.85, 1],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ─── 9. PENDULUM ─── swinging dots */
export function PendulumLoader({ size = 40, color = "currentColor", className }: LoaderProps) {
  const dotSize = size * 0.16;
  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <div
        className="flex justify-between items-center"
        style={{ width: size * 0.7 }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="rounded-full"
            style={{ width: dotSize, height: dotSize, backgroundColor: color }}
            animate={
              i === 0
                ? { x: [0, -(size * 0.18), 0], scale: [1, 1.3, 1] }
                : i === 4
                  ? { x: [0, size * 0.18, 0], scale: [1, 1.3, 1] }
                  : {}
            }
            transition={{
              duration: 0.7,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: i === 4 ? 0.35 : 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── 10. STACKER ─── blocks stacking up then collapsing */
export function StackerLoader({ size = 40, color = "currentColor", className }: LoaderProps) {
  const blockH = size * 0.14;
  const blockW = size * 0.5;
  return (
    <div className={cn("flex flex-col items-center justify-end", className)} style={{ width: size, height: size, gap: size * 0.04 }}>
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="rounded-sm"
          style={{ width: blockW, height: blockH, backgroundColor: color }}
          animate={{
            opacity: [0, 1, 1, 0],
            scaleX: [0.3, 1, 1, 0.3],
            y: [-(size * 0.1), 0, 0, size * 0.05],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2,
            times: [0, 0.3, 0.7, 1],
          }}
        />
      ))}
    </div>
  );
}

/* ─── 11. CLOCK ─── minimal spinning clock hands */
export function ClockLoader({ size = 40, color = "currentColor", className }: LoaderProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <div
        className="absolute rounded-full border-2"
        style={{ width: size * 0.85, height: size * 0.85, borderColor: color, opacity: 0.2 }}
      />
      <div
        className="rounded-full"
        style={{ width: size * 0.1, height: size * 0.1, backgroundColor: color }}
      />
      {/* minute hand */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 2,
          height: size * 0.3,
          backgroundColor: color,
          bottom: "50%",
          left: "50%",
          marginLeft: -1,
          transformOrigin: "50% 100%",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      {/* hour hand */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 2.5,
          height: size * 0.2,
          backgroundColor: color,
          opacity: 0.6,
          bottom: "50%",
          left: "50%",
          marginLeft: -1.25,
          transformOrigin: "50% 100%",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/* ─── 12. BREATHING ─── expanding circle with soft glow */
export function BreathingLoader({ size = 40, color = "currentColor", className }: LoaderProps) {
  return (
    <div className={cn("flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <motion.div
        className="absolute rounded-full"
        style={{ backgroundColor: color, opacity: 0.08 }}
        animate={{
          width: [size * 0.3, size * 0.9, size * 0.3],
          height: [size * 0.3, size * 0.9, size * 0.3],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{ backgroundColor: color, opacity: 0.15 }}
        animate={{
          width: [size * 0.25, size * 0.6, size * 0.25],
          height: [size * 0.25, size * 0.6, size * 0.25],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="rounded-full"
        style={{ backgroundColor: color }}
        animate={{
          width: [size * 0.2, size * 0.35, size * 0.2],
          height: [size * 0.2, size * 0.35, size * 0.2],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ─── Demo Component ─── */

const ALL_LOADERS = [
  { name: "Orbit", Loader: OrbitLoader },
  { name: "Pulse Ring", Loader: PulseRingLoader },
  { name: "Bounce", Loader: BounceDotsLoader },
  { name: "Spinner", Loader: SpinningBarsLoader },
  { name: "Wave", Loader: WaveBarsLoader },
  { name: "Helix", Loader: HelixLoader },
  { name: "Radar", Loader: RadarLoader },
  { name: "Morph", Loader: MorphLoader },
  { name: "Pendulum", Loader: PendulumLoader },
  { name: "Stacker", Loader: StackerLoader },
  { name: "Clock", Loader: ClockLoader },
  { name: "Breathing", Loader: BreathingLoader },
];

export function Component() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-14">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
          Animated Micro-Loaders
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          12 hypnotic loading animations — drop any into your app. Customizable size and color.
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8 justify-items-center">
        {ALL_LOADERS.map(({ name, Loader }) => (
          <div key={name} className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center size-20 rounded-2xl border border-border bg-card">
              <Loader size={36} />
            </div>
            <span className="text-[11px] font-medium text-muted-foreground tracking-wide text-center leading-tight">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}