"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

/* ─── Types ─── */

interface BentoCell {
  title: string;
  description: string;
  visual: ReactNode;
  span?: "default" | "wide" | "tall";
}

interface LivingBentoProps {
  cells?: BentoCell[];
  className?: string;
}

/* ─── Cell Container ─── */

function Cell({
  cell,
  index,
}: {
  cell: BentoCell;
  index: number;
}) {
  const spanClass =
    cell.span === "wide"
      ? "md:col-span-2"
      : cell.span === "tall"
        ? "md:row-span-2"
        : "";

  return (
    <motion.div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6",
        "min-h-[260px]",
        spanClass
      )}
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.4, 0, 1],
      }}
    >
      {/* Visual — fills upper area */}
      <div className="flex-1 flex items-center justify-center mb-4 min-h-[120px]">
        {cell.visual}
      </div>

      {/* Text — anchored at bottom */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">
          {cell.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {cell.description}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── VISUAL 1: Self-Drawing Line Chart ─── */

function ChartVisual() {
  const points = "0,50 20,35 40,45 60,20 80,30 100,8 120,15 140,5";
  return (
    <svg viewBox="-4 -4 148 58" className="w-full max-w-[200px]" fill="none">
      <motion.polyline
        points={points}
        stroke="hsl(var(--primary))"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
      />
      <motion.polyline
        points={points}
        stroke="hsl(var(--primary))"
        strokeWidth={0}
        fill="hsl(var(--primary) / 0.05)"
        strokeLinejoin="round"
        style={{ transform: "translateY(0)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0.5, 0] }}
        transition={{ duration: 4.5, repeat: Infinity }}
      />
      {/* Dot that follows end */}
      <motion.circle
        r="4"
        fill="hsl(var(--primary))"
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: "100%" }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
        style={{ offsetPath: `path('M0,50 L20,35 L40,45 L60,20 L80,30 L100,8 L120,15 L140,5')` }}
      />
    </svg>
  );
}

/* ─── VISUAL 2: Orbiting Dots Ring ─── */

function OrbitVisual() {
  const count = 8;
  return (
    <div className="relative size-32">
      {/* Center pulse */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-4 rounded-full bg-primary"
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Ring */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: count }).map((_, i) => {
          const angle = (i / count) * 360;
          const rad = (angle * Math.PI) / 180;
          const x = 50 + 42 * Math.cos(rad);
          const y = 50 + 42 * Math.sin(rad);
          return (
            <motion.div
              key={i}
              className="absolute size-2.5 rounded-full bg-primary"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                translate: "-50% -50%",
              }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: (i / count) * 1.5,
              }}
            />
          );
        })}
      </motion.div>
      {/* Outer ring trace */}
      <svg className="absolute inset-0 size-full" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="42"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          opacity={0.1}
        />
      </svg>
    </div>
  );
}

/* ─── VISUAL 3: Auto-Typing Code Block ─── */

function CodeVisual() {
  const lines = [
    { indent: 0, text: "const app = create({", color: "text-foreground" },
    { indent: 1, text: 'name: "my-app",', color: "text-primary" },
    { indent: 1, text: "deploy: true,", color: "text-primary" },
    { indent: 1, text: "edge: true,", color: "text-primary" },
    { indent: 0, text: "});", color: "text-foreground" },
    { indent: 0, text: "", color: "" },
    { indent: 0, text: "app.launch();", color: "text-foreground" },
  ];

  const [visibleChars, setVisibleChars] = useState(0);
  const totalChars = lines.reduce((sum, l) => sum + l.text.length, 0);

  useEffect(() => {
    const id = setInterval(() => {
      setVisibleChars((v) => {
        if (v >= totalChars + 20) return 0;
        return v + 1;
      });
    }, 60);
    return () => clearInterval(id);
  }, [totalChars]);

  let charCount = 0;

  return (
    <div className="w-full max-w-[220px] rounded-lg bg-muted/50 border border-border p-3 font-mono text-[11px] leading-5">
      {lines.map((line, li) => {
        const lineStart = charCount;
        charCount += line.text.length;
        const visible = Math.max(
          0,
          Math.min(line.text.length, visibleChars - lineStart)
        );
        return (
          <div key={li} style={{ paddingLeft: line.indent * 16 }}>
            <span className={line.color}>
              {line.text.slice(0, visible)}
            </span>
            {visibleChars >= lineStart &&
              visibleChars < lineStart + line.text.length && (
                <motion.span
                  className="inline-block w-[6px] h-3.5 bg-primary ml-px align-middle"
                  animate={{ opacity: [1, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── VISUAL 4: Color Gradient Morph ─── */

function GradientVisual() {
  return (
    <div className="relative size-28 rounded-2xl overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
            "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
            "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
            "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
            "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), transparent 60%)",
        }}
        animate={{
          backgroundPosition: ["30% 30%", "70% 70%", "30% 30%"],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ─── VISUAL 5: Radar Ping ─── */

function RadarVisual() {
  return (
    <div className="relative size-32">
      <svg viewBox="0 0 100 100" className="size-full">
        {/* Rings */}
        {[15, 30, 45].map((r) => (
          <circle
            key={r}
            cx="50"
            cy="50"
            r={r}
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
            opacity={0.08}
          />
        ))}
        {/* Crosshairs */}
        <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.3" opacity={0.06} />
        <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.3" opacity={0.06} />

        {/* Sweep */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "50px 50px" }}
        >
          <line x1="50" y1="50" x2="50" y2="5" stroke="hsl(var(--primary))" strokeWidth="1" opacity={0.6} />
          {/* Sweep tail using a wedge */}
          <path
            d="M50 50 L50 5 A45 45 0 0 0 17 17 Z"
            fill="hsl(var(--primary) / 0.06)"
          />
        </motion.g>

        {/* Blips */}
        {[
          { cx: 35, cy: 30, d: 0 },
          { cx: 65, cy: 25, d: 1 },
          { cx: 70, cy: 60, d: 2 },
          { cx: 30, cy: 65, d: 0.5 },
        ].map((blip, i) => (
          <motion.circle
            key={i}
            cx={blip.cx}
            cy={blip.cy}
            r="2"
            fill="hsl(var(--primary))"
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: blip.d,
              times: [0, 0.1, 0.5, 1],
            }}
          />
        ))}
      </svg>
      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rounded-full bg-primary" />
    </div>
  );
}

/* ─── VISUAL 6: Stacking Layers ─── */

function LayersVisual() {
  const layers = [0, 1, 2, 3];
  return (
    <div className="relative h-28 w-40 flex items-center justify-center" style={{ perspective: 400 }}>
      {layers.map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-lg border border-border bg-card shadow-sm"
          style={{
            width: `${100 - i * 10}%`,
            height: 36,
            zIndex: layers.length - i,
          }}
          animate={{
            y: [i * 6, i * 14, i * 6],
            rotateX: [0, 8, 0],
            opacity: [1 - i * 0.15, 1 - i * 0.05, 1 - i * 0.15],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1,
          }}
        >
          {/* Fake content lines */}
          <div className="flex items-center gap-2 p-2">
            <div className="size-3 rounded bg-primary/20" />
            <div className="h-1.5 flex-1 rounded-full bg-foreground/5" />
            <div className="h-1.5 w-8 rounded-full bg-foreground/5" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Default Cells ─── */

const DEFAULT_CELLS: BentoCell[] = [
  {
    title: "Real-time Analytics",
    description: "Watch your metrics update live with zero latency.",
    visual: <ChartVisual />,
    span: "wide",
  },
  {
    title: "Edge Network",
    description: "Deployed across 150+ global points of presence.",
    visual: <RadarVisual />,
  },
  {
    title: "Developer First",
    description: "Ship with a few lines of code. Zero config needed.",
    visual: <CodeVisual />,
    span: "wide",
  },
  {
    title: "Orchestration",
    description: "Automated pipelines that scale with your workload.",
    visual: <OrbitVisual />,
  },
  {
    title: "Adaptive Theming",
    description: "Dynamic color system that matches your brand.",
    visual: <GradientVisual />,
  },
  {
    title: "Version Control",
    description: "Every change tracked, every deploy reversible.",
    visual: <LayersVisual />,
  },
];

/* ─── Main Block ─── */

export function Component({
  cells = DEFAULT_CELLS,
  className,
}: LivingBentoProps) {
  return (
    <section
      className={cn("w-full bg-background px-6 py-16 md:py-24", className)}
    >
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cells.map((cell, i) => (
            <Cell key={i} cell={cell} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}