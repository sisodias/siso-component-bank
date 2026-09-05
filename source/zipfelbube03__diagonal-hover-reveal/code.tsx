"use client";

import {
  useState,
  useRef,
  useCallback,
  type ReactNode,
  type CSSProperties,
} from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DiagonalRevealProps {
  /**
   * The "after" (new/enhanced) layer.
   * Shown on the **left** side of the divider.
   * Must fill its container (position: absolute + inset: 0 is applied).
   */
  after: ReactNode;

  /**
   * The "before" (old/plain) layer.
   * Shown on the **right** side of the divider.
   * Must fill its container (position: absolute + inset: 0 is applied).
   */
  before: ReactNode;

  /** Caption text rendered below the slider. */
  caption?: string;

  /**
   * Diagonal angle in degrees.
   * Higher = steeper cut. 0 = vertical straight line.
   * @default 18
   */
  angle?: number;

  /**
   * Resting position of the divider (0–100).
   * The line snaps back here when the mouse leaves.
   * @default 50
   */
  rest?: number;

  /**
   * Accent color for the diagonal divider line.
   * Accepts any CSS color string.
   * @default "#8b5cf6"
   */
  lineColor?: string;

  /** Width of the divider line in px. @default 2.5 */
  lineWidth?: number;

  /**
   * Fixed height of the component in px.
   * Required because both layers are position: absolute.
   * @default 480
   */
  height?: number;

  /** Border radius in px. @default 20 */
  borderRadius?: number;

  /** Background color of the outer container. @default "#f3f3f3" */
  background?: string;

  /** Show the "← DRAG →" hint at the bottom. @default true */
  showHint?: boolean;

  /** Custom hint text. @default "← drag →" */
  hintText?: string;

  /** Snap-back transition duration in ms. @default 500 */
  snapDuration?: number;

  /** Extra className on the outermost wrapper. */
  className?: string;

  /** Extra style on the outermost wrapper. */
  style?: CSSProperties;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function DiagonalReveal({
  after,
  before,
  caption,
  angle = 18,
  rest = 50,
  lineColor = "#8b5cf6",
  lineWidth = 2.5,
  height = 480,
  borderRadius = 20,
  background = "#f3f3f3",
  showHint = true,
  hintText = "← drag →",
  snapDuration = 500,
  className,
  style,
}: DiagonalRevealProps) {
  const [pos, setPos] = useState(rest);
  const [hovering, setHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // How far the clip-path top/bottom edges are offset from `pos`
  // to create the diagonal. Expressed in % of container width.
  const skew = Math.tan((angle * Math.PI) / 180) * 50;

  const snapEasing = `cubic-bezier(0.16, 1, 0.3, 1)`;
  const snapTransition = `${snapDuration}ms ${snapEasing}`;

  const calcPosition = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return pos;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((clientX - rect.left) / rect.width) * 100;
      return Math.max(1, Math.min(99, pct));
    },
    [pos],
  );

  // ── Clip-path for the "after" layer (left side) ──
  const clipPath = `polygon(0 0, ${pos + skew}% 0, ${pos - skew}% 100%, 0 100%)`;

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        ...style,
      }}
    >
      {/* ── Slider container ── */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          height,
          borderRadius,
          border: "1px solid rgba(0,0,0,0.07)",
          background,
          overflow: "hidden",
          cursor: "ew-resize",
          userSelect: "none",
          touchAction: "none",
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseMove={(e) => setPos(calcPosition(e.clientX))}
        onMouseLeave={() => {
          setHovering(false);
          setPos(rest);
        }}
      >
        {/* Before layer — full, sits behind */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          {before}
        </div>

        {/* After layer — diagonally clipped */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            clipPath,
            transition: hovering ? "none" : `clip-path ${snapTransition}`,
          }}
        >
          {after}
        </div>

        {/* Diagonal accent line (SVG so it matches clip-path exactly) */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 2,
            pointerEvents: "none",
            // The SVG line coordinates are in %, so we transition
            // by re-rendering — but the snap-back needs a CSS transition.
            // We apply it on the parent SVG as a catch-all.
            transition: hovering ? "none" : `all ${snapTransition}`,
          }}
        >
          <line
            x1={`${pos + skew}%`}
            y1="0"
            x2={`${pos - skew}%`}
            y2="100%"
            stroke={lineColor}
            strokeWidth={lineWidth}
            style={{ filter: `drop-shadow(0 0 8px ${lineColor}30)` }}
          />
        </svg>

        {/* Hint label */}
        {showHint && (
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 3,
              pointerEvents: "none",
              opacity: hovering ? 0 : 1,
              transition: "opacity 400ms ease",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "5px 16px",
                borderRadius: 99,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#aaa",
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(6px)",
              }}
            >
              {hintText}
            </span>
          </div>
        )}
      </div>

      {/* Caption */}
      {caption && (
        <p
          style={{
            fontSize: 14,
            color: "#888",
            textAlign: "center",
            margin: 0,
          }}
        >
          {caption}
        </p>
      )}
    </div>
  );
}