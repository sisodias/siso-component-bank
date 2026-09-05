// components/PlasmaCursor.tsx
"use client";

import React, { useEffect, useMemo, useRef } from "react";

type PlasmaCursorProps = {
  /** Number of rows/cols (grid is rows x rows). Default: 13 */
  rows?: number;
  /** Base HSL hue (0–360). Default: 4 (warm red/orange) */
  hue?: number;
  /** Saturation (0–100). Default: 70 */
  saturation?: number;
  /** Lightness range for dots [min, max]. Default: [20, 80] */
  lightnessRange?: [number, number];
  /** Box-shadow strength range [min,max] in px. Default: [1, 8] */
  glowRange?: [number, number];
  /** Size of each dot in px (square). Default: 16 */
  dotSize?: number;
  /** Gap between dots in px. Default: 12 */
  gap?: number;
  /** Multiplier for how far dots travel toward the cursor. Default: 1 */
  travel?: number;
  /** How quickly the grid follows targets (0..1, higher = snappier). Default: 0.15 */
  followEase?: number;
  /** Auto motion when idle (true = oscillate center). Default: true */
  autoMotion?: boolean;
  /** Global animation speed multiplier. Default: 1 */
  speed?: number;
  /** Blend mode for overlapping lights. Default: "plus-lighter" */
  blendMode?: "plus-lighter" | "screen" | "lighten" | "normal";
  /** Extra classnames for the wrapper */
  className?: string;
};

function PlasmaCursor({
  rows = 7,
  hue = 4,
  saturation = 70,
  lightnessRange = [20, 80],
  glowRange = [1, 8],
  dotSize = 16,
  gap = 12,
  travel = 1,
  followEase = 0.15,
  autoMotion = true,
  speed = 1,
  blendMode = "plus-lighter",
  className = "",
}: PlasmaCursorProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const dotsRef = useRef<HTMLDivElement[]>([]);
  const centerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cursorRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const lastPulseRef = useRef<number>(0);

  // Build grid once
  const total = rows * rows;
  const centerIdx = useMemo(() => {
    const mid = (rows - 1) / 2;
    return { cx: mid, cy: mid };
  }, [rows]);

  // Precompute per-cell weights (distance from center) to emulate stagger
  const weights = useMemo(() => {
    const w: number[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < rows; x++) {
        const dx = x - centerIdx.cx;
        const dy = y - centerIdx.cy;
        const dist = Math.hypot(dx, dy);
        w.push(dist);
      }
    }
    const max = Math.max(...w) || 1;
    return w.map((d) => d / max); // 0..1
  }, [rows, centerIdx]);

  // Create dots DOM
  useEffect(() => {
    const grid = gridRef.current!;
    dotsRef.current = [];
    grid.innerHTML = "";

    for (let i = 0; i < total; i++) {
      const d = document.createElement("div");
      d.style.width = `${dotSize}px`;
      d.style.height = `${dotSize}px`;
      d.style.borderRadius = `${dotSize / 2}px`;
      d.style.mixBlendMode = blendMode as any;
      d.style.willChange = "transform";
      d.style.position = "relative";
      grid.appendChild(d);
      dotsRef.current.push(d);
    }
  }, [rows, total, dotSize, blendMode]);

  // Layout grid size
  const gridSize = useMemo(() => {
    const size = rows * dotSize + (rows - 1) * gap;
    return size;
  }, [rows, dotSize, gap]);

  // Coloring, shadows, starting scale/opacity
  useEffect(() => {
    const [lMin, lMax] = lightnessRange;
    const [gMin, gMax] = glowRange;

    dotsRef.current.forEach((el, i) => {
      const w = weights[i]; // 0..1 from center to edges
      const inv = 1 - w;
      const light = lerp(lMax, lMin, w);
      const glow = Math.round(lerp(gMax, gMin, w));
      el.style.background = `hsl(${hue} ${saturation}% ${light}%)`;
      el.style.boxShadow = `0 0 ${glow}px 0 hsl(${hue} ${saturation}% ${light}%)`;
      // subtle initial scale/opacity gradient
      el.style.opacity = String(lerp(1, 0.25, w));
      el.style.transform = `translate3d(0,0,0) scale(${lerp(1.15, 0.85, w)})`;
    });
  }, [weights, hue, saturation, lightnessRange, glowRange]);

  // Center calculations
  useEffect(() => {
    const updateCenter = () => {
      const wrap = wrapperRef.current!;
      const rect = wrap.getBoundingClientRect();
      centerRef.current.x = rect.left + rect.width / 2;
      centerRef.current.y = rect.top + rect.height / 2;
    };
    updateCenter();
    const ro = new ResizeObserver(updateCenter);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    window.addEventListener("resize", updateCenter);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateCenter);
    };
  }, []);

  // Pointer tracking with idle automotion
  useEffect(() => {
    let idle = true;
    let idleTimer: number | undefined;

    const setIdle = () => {
      idle = true;
    };
    const wake = () => {
      idle = false;
      if (idleTimer) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(setIdle, 1500);
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      const p =
        "touches" in e ? e.touches[0] : (e as MouseEvent);
      cursorRef.current.x = p.clientX - centerRef.current.x;
      cursorRef.current.y = p.clientY - centerRef.current.y;
      wake();
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("touchmove", onMove, { passive: true });

    // RAF loop
    const loop = (t: number) => {
      rafRef.current = requestAnimationFrame(loop);
      const time = t * 0.001 * (speed || 1);

      // auto motion center when idle
      if (autoMotion && idle) {
        const vw = (wrapperRef.current?.clientWidth || 0) * 0.5;
        const vh = (wrapperRef.current?.clientHeight || 0) * 0.5;
        targetRef.current.x =
          Math.sin(time * 0.7) * vw * 0.35 + Math.cos(time * 0.13) * vw * 0.15;
        targetRef.current.y =
          Math.cos(time * 0.9) * vh * 0.25 + Math.sin(time * 0.5) * vh * 0.15;
      } else {
        targetRef.current.x = cursorRef.current.x;
        targetRef.current.y = cursorRef.current.y;
      }

      // occasional pulse (every ~2.4s)
      if (time - lastPulseRef.current > 2.4 / (speed || 1)) {
        lastPulseRef.current = time;
        pulse(dotsRef.current, weights);
      }

      // move each dot toward target with center-out lag
      const tx = targetRef.current.x * (travel || 1);
      const ty = targetRef.current.y * (travel || 1);

      dotsRef.current.forEach((el, i) => {
        const w = weights[i]; // 0..1
        // center reaches sooner; edges lag more
        const ease = clamp(followEase * (1 - w * 0.8), 0.05, 0.25);
        // store current offset on the element
        const curr = (el as any).__p || { x: 0, y: 0, s: 1 };
        const nx = curr.x + (tx - curr.x) * ease;
        const ny = curr.y + (ty - curr.y) * ease;
        const scale = 1 + (1 - w) * 0.05 * Math.sin(time * 2 + w * Math.PI);

        (el as any).__p = { x: nx, y: ny, s: scale };
        el.style.transform = `translate3d(${nx}px, ${ny}px, 0) scale(${scale})`;
      });
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("touchmove", onMove);
      if (idleTimer) window.clearTimeout(idleTimer);
    };
  }, [autoMotion, followEase, travel, speed]);

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
    >
      <div
        ref={gridRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: `${gridSize}px`,
          height: `${gridSize}px`,
          display: "grid",
          gridTemplateColumns: `repeat(${rows}, ${dotSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${dotSize}px)`,
          gap: `${gap}px`,
          alignItems: "center",
          justifyItems: "center",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* ---------- helpers ---------- */
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
function pulse(dots: HTMLDivElement[], weights: number[]) {
  // quick micro-pulse: center first, edges last
  dots.forEach((el, i) => {
    const w = weights[i]; // 0..1
    el.animate(
      [
        { transform: `${el.style.transform}` },
        { transform: `${el.style.transform} scale(${1.15 + (1 - w) * 0.15})` },
        { transform: `${el.style.transform}` },
      ],
      {
        duration: 600,
        delay: w * 250,
        easing: "cubic-bezier(.4,0,.2,1)",
      }
    );
  });
}

export {PlasmaCursor}