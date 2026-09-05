"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, useCallback } from "react";

/* ─── Types ─────────────────────────────────────────────────── */

interface SplitFlapRow {
  /** Label text shown on the left side of the row */
  label: string;
  /** Value text shown on the right side of the row */
  value: string;
}

interface SplitFlapDisplayProps {
  /** Rows of label + value pairs to display on the board */
  rows?: SplitFlapRow[];
  /** Simple text mode – renders a single row of characters */
  text?: string;
  /** Total number of character cells per row (pads shorter strings with spaces) */
  columns?: number;
  /** Size variant controlling cell dimensions and typography */
  size?: "sm" | "md" | "lg";
  /** Accent color for the side indicator strips */
  accentColor?: string;
  /** Whether to show the green indicator strips on each row */
  showIndicators?: boolean;
  /** Stagger delay in ms between each character starting its flip (creates a wave) */
  staggerDelay?: number;
  /** Speed in ms for each individual character flip step */
  flipSpeed?: number;
  /** Additional CSS classes for the outer container */
  className?: string;
}

/* ─── Character Set ─────────────────────────────────────────── */

const CHARACTERS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$.,!?:;+-=%&#@";

function getNextChar(current: string): string {
  const idx = CHARACTERS.indexOf(current);
  if (idx === -1 || idx >= CHARACTERS.length - 1) return CHARACTERS[0] ?? " ";
  return CHARACTERS[idx + 1] ?? " ";
}

/* ─── Individual Flap Cell ──────────────────────────────────── */

function FlapCell({
  targetChar,
  size = "md",
  delay = 0,
  flipSpeed = 35,
}: {
  targetChar: string;
  size?: "sm" | "md" | "lg";
  delay?: number;
  flipSpeed?: number;
}) {
  const [displayChar, setDisplayChar] = useState(" ");
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipPhase, setFlipPhase] = useState<"idle" | "top-down" | "bottom-up">("idle");
  const prevCharRef = useRef(" ");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    cleanup();
    const target = targetChar.toUpperCase();

    if (displayChar === target) {
      setIsFlipping(false);
      setFlipPhase("idle");
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setIsFlipping(true);

      intervalRef.current = setInterval(() => {
        setDisplayChar((prev) => {
          const next = getNextChar(prev);
          // Trigger flip animation phases
          setFlipPhase("top-down");
          setTimeout(() => setFlipPhase("bottom-up"), flipSpeed * 0.4);
          setTimeout(() => setFlipPhase("idle"), flipSpeed * 0.8);

          prevCharRef.current = prev;

          if (next === target) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setTimeout(() => {
              setIsFlipping(false);
              setFlipPhase("idle");
            }, flipSpeed);
          }
          return next;
        });
      }, flipSpeed);
    }, delay);

    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetChar]);

  const sizeMap = {
    sm: { cell: "w-[26px] h-[38px] text-[16px]", gap: "gap-[1px]" },
    md: { cell: "w-[38px] h-[54px] text-[24px]", gap: "gap-[1px]" },
    lg: { cell: "w-[52px] h-[72px] text-[34px]", gap: "gap-[2px]" },
  };

  const s = sizeMap[size];

  return (
    <div
      className={cn(
        "relative select-none font-mono font-bold",
        s.cell
      )}
      style={{ perspective: "400px" }}
    >
      {/* ── Static top half ──────────────── */}
      <div
        className="absolute inset-x-0 top-0 h-1/2 overflow-hidden rounded-t-[3px]"
        style={{
          background: "linear-gradient(180deg, #1e1e1e 0%, #181818 100%)",
          borderBottom: "none",
        }}
      >
        <span
          className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-[48%] text-[#e8e6e3] drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]"
          style={{ fontFamily: "'SF Mono', 'Fira Code', 'Courier New', monospace" }}
        >
          {displayChar}
        </span>
      </div>

      {/* ── Static bottom half ───────────── */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden rounded-b-[3px]"
        style={{
          background: "linear-gradient(180deg, #151515 0%, #111111 100%)",
        }}
      >
        <span
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[48%] text-[#d4d2cf] drop-shadow-[0_-1px_1px_rgba(0,0,0,0.6)]"
          style={{ fontFamily: "'SF Mono', 'Fira Code', 'Courier New', monospace" }}
        >
          {displayChar}
        </span>
      </div>

      {/* ── Flipping top panel ───────────── */}
      {isFlipping && flipPhase === "top-down" && (
        <div
          className="absolute inset-x-0 top-0 h-1/2 overflow-hidden rounded-t-[3px] z-10"
          style={{
            background: "linear-gradient(180deg, #222 0%, #1a1a1a 100%)",
            transformOrigin: "bottom center",
            animation: `flapTopDown ${flipSpeed * 0.4}ms ease-in forwards`,
          }}
        >
          <span
            className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-[48%] text-[#e8e6e3]"
            style={{ fontFamily: "'SF Mono', 'Fira Code', 'Courier New', monospace" }}
          >
            {prevCharRef.current}
          </span>
        </div>
      )}

      {/* ── Flipping bottom panel ────────── */}
      {isFlipping && flipPhase === "bottom-up" && (
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden rounded-b-[3px] z-10"
          style={{
            background: "linear-gradient(180deg, #181818 0%, #111 100%)",
            transformOrigin: "top center",
            animation: `flapBottomUp ${flipSpeed * 0.4}ms ease-out forwards`,
          }}
        >
          <span
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[48%] text-[#d4d2cf]"
            style={{ fontFamily: "'SF Mono', 'Fira Code', 'Courier New', monospace" }}
          >
            {displayChar}
          </span>
        </div>
      )}

      {/* ── Center divider line ──────────── */}
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
        style={{
          height: "2px",
          background: "linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.9) 100%)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.04)",
        }}
      />

      {/* ── Subtle inner shadow overlay ──── */}
      <div
        className="absolute inset-0 rounded-[3px] z-20 pointer-events-none"
        style={{
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5), inset 0 -1px 2px rgba(0,0,0,0.3)",
        }}
      />
    </div>
  );
}

/* ─── Indicator Strip (green side bar) ──────────────────────── */

function IndicatorStrip({
  color = "#22c55e",
  size = "md",
}: {
  color?: string;
  size?: "sm" | "md" | "lg";
}) {
  const heightMap = { sm: "h-[38px]", md: "h-[54px]", lg: "h-[72px]" };
  return (
    <div
      className={cn("w-[6px] rounded-[2px] flex-shrink-0 self-stretch", heightMap[size])}
      style={{
        background: `linear-gradient(180deg, ${color} 0%, ${color}99 40%, ${color}66 60%, ${color}99 100%)`,
        boxShadow: `0 0 8px ${color}44, inset 0 1px 2px rgba(255,255,255,0.2)`,
      }}
    />
  );
}

/* ─── Row Component ─────────────────────────────────────────── */

function FlapRow({
  text,
  columns,
  size = "md",
  accentColor = "#22c55e",
  showIndicators = true,
  staggerDelay = 30,
  flipSpeed = 35,
}: {
  text: string;
  columns: number;
  size?: "sm" | "md" | "lg";
  accentColor?: string;
  showIndicators?: boolean;
  staggerDelay?: number;
  flipSpeed?: number;
}) {
  const padded = text.toUpperCase().padEnd(columns, " ").substring(0, columns);

  return (
    <div className="flex items-center gap-1.5">
      {showIndicators && <IndicatorStrip color={accentColor} size={size} />}
      <div className="flex gap-[3px]">
        {padded.split("").map((char, i) => (
          <FlapCell
            key={i}
            targetChar={char}
            size={size}
            delay={i * staggerDelay}
            flipSpeed={flipSpeed}
          />
        ))}
      </div>
      {showIndicators && <IndicatorStrip color={accentColor} size={size} />}
    </div>
  );
}

/* ─── Keyframes (injected once) ─────────────────────────────── */

const KEYFRAMES_ID = "split-flap-keyframes";

function useInjectKeyframes() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(KEYFRAMES_ID)) return;

    const style = document.createElement("style");
    style.id = KEYFRAMES_ID;
    style.textContent = `
      @keyframes flapTopDown {
        0%   { transform: rotateX(0deg); }
        100% { transform: rotateX(-90deg); }
      }
      @keyframes flapBottomUp {
        0%   { transform: rotateX(90deg); }
        100% { transform: rotateX(0deg); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      const el = document.getElementById(KEYFRAMES_ID);
      if (el) el.remove();
    };
  }, []);
}

/* ─── Main Export ────────────────────────────────────────────── */

export function SplitFlapDisplay({
  rows,
  text,
  columns = 14,
  size = "md",
  accentColor = "#22c55e",
  showIndicators = true,
  staggerDelay = 30,
  flipSpeed = 35,
  className,
}: SplitFlapDisplayProps) {
  useInjectKeyframes();

  // Simple single-row text mode
  if (text && !rows) {
    return (
      <div
        className={cn(
          "inline-flex flex-col gap-2 p-4 rounded-2xl",
          className
        )}
        style={{
          background: "linear-gradient(145deg, #0c0c0c 0%, #080808 50%, #0a0a0a 100%)",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <FlapRow
          text={text}
          columns={columns}
          size={size}
          accentColor={accentColor}
          showIndicators={showIndicators}
          staggerDelay={staggerDelay}
          flipSpeed={flipSpeed}
        />
      </div>
    );
  }

  // Multi-row board mode
  return (
    <div
      className={cn(
        "inline-flex flex-col gap-2 p-5 rounded-2xl",
        className
      )}
      style={{
        background: "linear-gradient(145deg, #0c0c0c 0%, #080808 50%, #0a0a0a 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow:
          "0 25px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {(rows ?? []).map((row, idx) => {
        const combined = `${row.label}${" ".repeat(Math.max(1, columns - row.label.length - row.value.length))}${row.value}`;
        return (
          <FlapRow
            key={idx}
            text={combined}
            columns={columns}
            size={size}
            accentColor={accentColor}
            showIndicators={showIndicators}
            staggerDelay={staggerDelay}
            flipSpeed={flipSpeed}
          />
        );
      })}
    </div>
  );
}

export default SplitFlapDisplay;
