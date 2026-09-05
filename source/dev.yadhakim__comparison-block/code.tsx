"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useCallback } from "react";
import { Check, Crown } from "lucide-react";

interface ComparisonAttribute {
  label: string;
  sideA: { value: string; score: number };
  sideB: { value: string; score: number };
}

interface ComparisonSide {
  name: string;
  description?: string;
  badge?: string;
  image?: string;
  highlights?: string[];
}

interface ComparisonBlockProps {
  sideA: ComparisonSide;
  sideB: ComparisonSide;
  attributes: ComparisonAttribute[];
  className?: string;
  accentA?: string;
  accentB?: string;
}

function ScoreRing({
  score,
  color,
  delay = 0.2,
}: {
  score: number;
  color: string;
  delay?: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative size-12">
        <svg viewBox="0 0 36 36" className="size-12 -rotate-90">
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-border"
          />
          <motion.circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ strokeDasharray: "0 94.2" }}
            animate={{ strokeDasharray: `${(score / 100) * 94.2} 94.2` }}
            transition={{ duration: 1, ease: "easeOut", delay }}
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-xs font-bold"
          style={{ color }}
        >
          {score}
        </span>
      </div>
      <span className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground">
        avg score
      </span>
    </div>
  );
}

export function Component({
  sideA,
  sideB,
  attributes,
  className,
  accentA = "hsl(30, 30%, 55%)",
  accentB = "hsl(160, 30%, 40%)",
}: ComparisonBlockProps) {
  const [selected, setSelected] = useState<"a" | "b" | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const winsA = useMemo(
    () => attributes.filter((a) => a.sideA.score > a.sideB.score).length,
    [attributes]
  );
  const winsB = useMemo(
    () => attributes.filter((a) => a.sideB.score > a.sideA.score).length,
    [attributes]
  );
  const avgA = useMemo(
    () =>
      Math.round(
        attributes.reduce((s, a) => s + a.sideA.score, 0) / attributes.length
      ),
    [attributes]
  );
  const avgB = useMemo(
    () =>
      Math.round(
        attributes.reduce((s, a) => s + a.sideB.score, 0) / attributes.length
      ),
    [attributes]
  );

  return (
    <div className={cn("w-full max-w-4xl mx-auto px-4 py-16", className)}>
      {/* Panels */}
      <div className="flex flex-col md:flex-row gap-0 relative mb-12">
        {/* Side A */}
        <motion.div
          className={cn(
            "relative flex-1 cursor-pointer rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none border border-border bg-card p-6 transition-shadow overflow-hidden",
            selected === "a" && "ring-2 shadow-lg z-10",
            selected === "b" && "opacity-50"
          )}
          style={{ ringColor: selected === "a" ? accentA : undefined }}
          animate={{
            flex: selected === "a" ? 1.6 : selected === "b" ? 0.7 : 1,
          }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          onClick={() => setSelected((s) => (s === "a" ? null : "a"))}
        >
          {sideA.badge && (
            <span
              className="inline-block text-[11px] font-semibold tracking-widest uppercase px-2.5 py-0.5 rounded-full border mb-4"
              style={{
                color: accentA,
                backgroundColor: `${accentA}15`,
                borderColor: `${accentA}30`,
              }}
            >
              {sideA.badge}
            </span>
          )}

          {sideA.image && (
            <div className="mb-4 overflow-hidden rounded-xl aspect-video">
              <img
                src={sideA.image}
                alt={sideA.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <h3 className="text-xl font-bold tracking-tight text-foreground mb-1">
            {sideA.name}
          </h3>
          {sideA.description && (
            <p className="text-sm text-muted-foreground mb-4">
              {sideA.description}
            </p>
          )}

          <AnimatePresence>
            {selected !== "b" && sideA.highlights && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2 overflow-hidden"
              >
                {sideA.highlights.map((h) => (
                  <div
                    key={h}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="size-3.5 shrink-0" style={{ color: accentA }} />
                    <span>{h}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-5">
            <ScoreRing score={avgA} color={accentA} delay={0.2} />
          </div>
        </motion.div>

        {/* VS Badge */}
        <div className="flex items-center justify-center z-20 -my-4 md:my-0 md:-mx-4">
          <span className="size-8 rounded-full border bg-background flex items-center justify-center text-xs font-medium text-muted-foreground italic">
            vs
          </span>
        </div>

        {/* Side B */}
        <motion.div
          className={cn(
            "relative flex-1 cursor-pointer rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none border border-border bg-card p-6 transition-shadow overflow-hidden",
            selected === "b" && "ring-2 shadow-lg z-10",
            selected === "a" && "opacity-50"
          )}
          style={{ ringColor: selected === "b" ? accentB : undefined }}
          animate={{
            flex: selected === "b" ? 1.6 : selected === "a" ? 0.7 : 1,
          }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          onClick={() => setSelected((s) => (s === "b" ? null : "b"))}
        >
          {sideB.badge && (
            <span
              className="inline-block text-[11px] font-semibold tracking-widest uppercase px-2.5 py-0.5 rounded-full border mb-4"
              style={{
                color: accentB,
                backgroundColor: `${accentB}15`,
                borderColor: `${accentB}30`,
              }}
            >
              {sideB.badge}
            </span>
          )}

          {sideB.image && (
            <div className="mb-4 overflow-hidden rounded-xl aspect-video">
              <img
                src={sideB.image}
                alt={sideB.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <h3 className="text-xl font-bold tracking-tight text-foreground mb-1">
            {sideB.name}
          </h3>
          {sideB.description && (
            <p className="text-sm text-muted-foreground mb-4">
              {sideB.description}
            </p>
          )}

          <AnimatePresence>
            {selected !== "a" && sideB.highlights && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2 overflow-hidden"
              >
                {sideB.highlights.map((h) => (
                  <div
                    key={h}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="size-3.5 shrink-0" style={{ color: accentB }} />
                    <span>{h}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-5">
            <ScoreRing score={avgB} color={accentB} delay={0.3} />
          </div>
        </motion.div>
      </div>

      {/* Attributes Table */}
      <div className="space-y-1">
        <div className="grid grid-cols-[1fr_1.2fr_1fr] gap-3 px-2 pb-3 border-b border-border">
          <span
            className="text-[11px] font-semibold tracking-widest uppercase"
            style={{ color: accentA }}
          >
            {sideA.name}
          </span>
          <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground text-center">
            Attribute
          </span>
          <span
            className="text-[11px] font-semibold tracking-widest uppercase text-right"
            style={{ color: accentB }}
          >
            {sideB.name}
          </span>
        </div>

        {attributes.map((attr, i) => {
          const winner =
            attr.sideA.score > attr.sideB.score
              ? "a"
              : attr.sideB.score > attr.sideA.score
                ? "b"
                : "tie";
          const total = attr.sideA.score + attr.sideB.score;
          const aPct = (attr.sideA.score / total) * 100;

          return (
            <motion.div
              key={attr.label}
              className={cn(
                "grid grid-cols-[1fr_1.2fr_1fr] gap-3 items-center px-2 py-3 rounded-lg transition-colors",
                hoveredRow === i && "bg-muted/50"
              )}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onMouseEnter={() => setHoveredRow(i)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <div className="flex items-center gap-2">
                {winner === "a" && (
                  <span
                    className="size-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: accentA }}
                  />
                )}
                <span
                  className={cn(
                    "text-sm tabular-nums",
                    winner === "a"
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {attr.sideA.value}
                </span>
              </div>

              <div className="flex flex-col items-center gap-1.5">
                <span className="text-sm font-medium text-foreground">
                  {attr.label}
                </span>
                <div className="w-full h-1 rounded-full bg-muted overflow-hidden relative">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ backgroundColor: accentA }}
                    initial={{ width: "50%" }}
                    animate={{ width: `${aPct}%` }}
                    transition={{
                      duration: 0.8,
                      ease: [0.32, 0.72, 0, 1],
                      delay: 0.2 + i * 0.04,
                    }}
                  />
                  <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-background z-10" />
                </div>
              </div>

              <div className="flex items-center gap-2 justify-end">
                <span
                  className={cn(
                    "text-sm tabular-nums",
                    winner === "b"
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {attr.sideB.value}
                </span>
                {winner === "b" && (
                  <span
                    className="size-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: accentB }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Verdict */}
      <motion.div
        className="flex items-center gap-4 mt-8 pt-6 border-t border-border"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="flex flex-col items-center min-w-[48px]">
          <span
            className="text-2xl font-bold tabular-nums"
            style={{ color: accentA }}
          >
            {winsA}
          </span>
          <span className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground">
            wins
          </span>
        </div>

        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden flex gap-0.5">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: accentA }}
            initial={{ width: 0 }}
            animate={{ width: `${(winsA / attributes.length) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
          />
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: accentB }}
            initial={{ width: 0 }}
            animate={{ width: `${(winsB / attributes.length) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
          />
        </div>

        <div className="flex flex-col items-center min-w-[48px]">
          <span
            className="text-2xl font-bold tabular-nums"
            style={{ color: accentB }}
          >
            {winsB}
          </span>
          <span className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground">
            wins
          </span>
        </div>
      </motion.div>

      <motion.p
        className="text-center text-sm text-muted-foreground mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {winsB > winsA ? (
          <>
            <Crown className="inline size-3.5 mr-1" style={{ color: accentB }} />
            <span className="font-medium text-foreground">{sideB.name}</span>{" "}
            leads in {winsB} of {attributes.length} categories
          </>
        ) : winsA > winsB ? (
          <>
            <Crown className="inline size-3.5 mr-1" style={{ color: accentA }} />
            <span className="font-medium text-foreground">{sideA.name}</span>{" "}
            leads in {winsA} of {attributes.length} categories
          </>
        ) : (
          "Both approaches are evenly matched"
        )}
      </motion.p>
    </div>
  );
}