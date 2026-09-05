"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * IrisLensCard
 * - Unique, non‑WebGL liquid “lens” effect using layered gradients
 * - Cursor‑tracked highlights + spectral ridges (screen blend)
 * - True 3D tilt (content stays crisp; no scaling on text)
 */
export interface IrisLensCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Max tilt in degrees */
  tilt?: number;
  /** Elevation of content plane (px) for subtle parallax */
  contentDepth?: number;
  /** How strong the lens appears (0..1) */
  lensStrength?: number;
  /** Whether to add a subtle holographic ring */
  holoEdge?: boolean;
  /** Utility classes for height / radius if you want to override defaults */
  heightClass?: string;
  radiusClass?: string;
}

export function IrisLensCard({
  className,
  children,
  tilt = 16,
  contentDepth = 26,
  lensStrength = 1,
  holoEdge = true,
  heightClass = "h-[320px]",
  radiusClass = "rounded-2xl",
  ...props
}: IrisLensCardProps) {
  const reduce = useReducedMotion();
  const rootRef = React.useRef<HTMLDivElement>(null);

  // normalized pointer (-0.5..0.5)
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);

  // Smooth rotations
  const rx = useSpring(0, { stiffness: 260, damping: 26, mass: 0.7 });
  const ry = useSpring(0, { stiffness: 260, damping: 26, mass: 0.7 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const host = rootRef.current;
    if (!host) return;
    const r = host.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;   // 0..1
    const py = (e.clientY - r.top) / r.height;  // 0..1
    // store as CSS vars for gradient centers
    host.style.setProperty("--mx", `${(px * 100).toFixed(3)}%`);
    host.style.setProperty("--my", `${(py * 100).toFixed(3)}%`);

    const cx = px - 0.5;
    const cy = py - 0.5;
    nx.set(cx);
    ny.set(cy);

    if (!reduce) {
      rx.set(-(cy * 2) * tilt);
      ry.set((cx * 2) * tilt);
    }
  };

  const onLeave = () => {
    nx.set(0); ny.set(0);
    rx.set(0); ry.set(0);
    const host = rootRef.current;
    if (!host) return;
    host.style.setProperty("--mx", `50%`);
    host.style.setProperty("--my", `50%`);
  };

  return (
    <div
      ref={rootRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn("relative isolate w-full [perspective:1200px]", className)}
      style={
        {
          ["--mx" as any]: "50%",
          ["--my" as any]: "50%",
          ["--lens-alpha" as any]: String(Math.max(0, Math.min(1, lensStrength))),
        } as React.CSSProperties
      }
      {...props}
    >
      <motion.div
        className={cn("relative w-full", heightClass, radiusClass)}
        style={{ transformStyle: "preserve-3d", rotateX: rx, rotateY: ry }}
      >
        {/* Base frosted plate (below content) */}
        <Card
          className={cn(
            "absolute inset-0 overflow-hidden",
            radiusClass,
            "border border-white/15 bg-white/8 backdrop-blur-2xl",
            "shadow-[0_14px_60px_-18px_rgba(0,0,0,0.45)]",
            "dark:border-white/10 dark:bg-white/5"
          )}
          style={{ transform: "translateZ(0px)" }}
        >
          {/* Soft inner vignette */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 120% at 50% 38%, transparent 45%, rgba(0,0,0,0.16))",
            }}
          />

          {/* --- Lens: layered highlights (beneath content), cursor‑tracked --- */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[-15%] mix-blend-screen opacity-[calc(0.55*var(--lens-alpha))]"
            style={{
              // Multiple overlapping highlights, all centered at --mx/--my
              background: `
                radial-gradient(420px 300px at var(--mx) var(--my), rgba(255,255,255,0.26), rgba(255,255,255,0.06) 45%, transparent 65%),
                radial-gradient(220px 160px at calc(var(--mx) + 6%) calc(var(--my) + 2%), rgba(255,255,255,0.16), rgba(255,255,255,0.04) 48%, transparent 68%),
                radial-gradient(160px 120px at calc(var(--mx) - 8%) calc(var(--my) - 4%), rgba(255,255,255,0.18), rgba(255,255,255,0.04) 50%, transparent 72%)
              `,
              transform: "translateZ(14px)",
              filter: "saturate(1.2) contrast(1.05)",
            }}
          />

          {/* Spectral ridges (subtle diffraction look) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[-8%] mix-blend-screen opacity-[calc(0.35*var(--lens-alpha))]"
            style={{
              background: `
                repeating-conic-gradient(
                  from 0deg at var(--mx) var(--my),
                  rgba(255,255,255,0.14) 0deg 2deg,
                  rgba(255,255,255,0.00) 2deg 6deg
                )
              `,
              maskImage:
                "radial-gradient(90% 90% at var(--mx) var(--my), black 35%, transparent 80%)",
              transform: "translateZ(18px)",
              filter: "blur(0.4px)",
            }}
          />

          {/* Optional holo edge piping (masked to border only) */}
          {holoEdge && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-80"
              style={{
                padding: 1,
                borderRadius: "inherit",
                background:
                  "conic-gradient(from 0deg at 50% 50%, #7dd3fc, #f0abfc, #a7f3d0, #7dd3fc)",
                WebkitMask:
                  "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                animation: "iris-spin 14s linear infinite",
              }}
            />
          )}
        </Card>

        {/* Content plane (kept crisp; no scaling) */}
        <div
          className={cn(
            "relative z-10 h-full w-full p-6",
            radiusClass,
            "[-webkit-font-smoothing:antialiased] [text-rendering:optimizeLegibility]"
          )}
          style={{
            transform: `translateZ(${Math.max(10, contentDepth)}px)`,
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          {/* No extra Card wrapper: text stays as-is */}
          {children}
        </div>
      </motion.div>

      {/* Local keyframes */}
      <style>{`
        @keyframes iris-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default IrisLensCard;
