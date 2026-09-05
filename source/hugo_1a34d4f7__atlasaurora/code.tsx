"use client";

import * as React from "react";

export interface AtlasAuroraProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Three drifting colour fields. Any valid CSS color. */
  colors?: [string, string, string];
  /** Overall opacity of the aurora layer (0–1). */
  intensity?: number;
  /** Blur radius of the colour fields, in px. */
  blur?: number;
  /** Pause all motion (also auto-paused under prefers-reduced-motion). */
  paused?: boolean;
  /** Content rendered above the aurora. */
  children?: React.ReactNode;
}

/**
 * AtlasAurora — a calm, premium animated background.
 *
 * Three large, slow-drifting blurred colour fields plus a gentle diagonal
 * sweep, blended with `screen` so they add light on a dark surface. Fully
 * self-contained: keyframes are injected inline, so it needs no global CSS
 * and no animation library. Honors `prefers-reduced-motion`.
 *
 * @example
 * <AtlasAurora className="min-h-screen">
 *   <h1>Your hero</h1>
 * </AtlasAurora>
 */
export default function AtlasAurora({
  colors = [
    "oklch(0.8 0.16 142 / 0.42)", // lime
    "oklch(0.76 0.13 44 / 0.4)", //  warm amber
    "oklch(0.62 0.13 300 / 0.32)", // violet
  ],
  intensity = 1,
  blur = 64,
  paused = false,
  children,
  style,
  ...rest
}: AtlasAuroraProps) {
  const playState = paused ? "paused" : "running";
  const [lime, warm, violet] = colors;

  return (
    <div
      {...rest}
      style={{ position: "relative", overflow: "hidden", ...style }}
    >
      <style>{KEYFRAMES}</style>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: intensity,
          isolation: "isolate",
          WebkitMaskImage:
            "linear-gradient(180deg, #000 60%, transparent 100%)",
          maskImage: "linear-gradient(180deg, #000 60%, transparent 100%)",
        }}
      >
        <Blob
          color={lime}
          blur={blur}
          playState={playState}
          style={{ width: 760, height: 620, top: -180, right: -110 }}
          anim="atlas-aurora-a 27s ease-in-out infinite"
        />
        <Blob
          color={warm}
          blur={blur}
          playState={playState}
          style={{ width: 680, height: 560, top: -130, left: -170 }}
          anim="atlas-aurora-b 33s ease-in-out infinite"
        />
        <Blob
          color={violet}
          blur={blur}
          playState={playState}
          style={{ width: 720, height: 600, top: 250, left: "36%" }}
          anim="atlas-aurora-c 30s ease-in-out infinite"
        />
        <span
          style={{
            position: "absolute",
            top: -120,
            left: "-20%",
            right: "-20%",
            height: 620,
            filter: `blur(${blur}px)`,
            opacity: 0.9,
            mixBlendMode: "screen",
            background: `radial-gradient(58% 100% at 28% 6%, ${lime}, transparent 70%), radial-gradient(48% 100% at 74% 0%, ${violet}, transparent 72%)`,
            animation: "atlas-aurora-sweep 26s ease-in-out infinite",
            animationPlayState: playState,
          }}
        />
      </div>
      {children != null && (
        <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      )}
    </div>
  );
}

function Blob({
  color,
  blur,
  anim,
  playState,
  style,
}: {
  color: string;
  blur: number;
  anim: string;
  playState: string;
  style: React.CSSProperties;
}) {
  return (
    <span
      style={{
        position: "absolute",
        borderRadius: "50%",
        filter: `blur(${blur}px)`,
        mixBlendMode: "screen",
        willChange: "transform",
        background: `radial-gradient(circle at 50% 50%, ${color}, transparent 66%)`,
        animation: anim,
        animationPlayState: playState,
        ...style,
      }}
    />
  );
}

const KEYFRAMES = `
@keyframes atlas-aurora-a {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-7%, 9%) scale(1.12); }
}
@keyframes atlas-aurora-b {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(9%, 6%) scale(1.1); }
}
@keyframes atlas-aurora-c {
  0%, 100% { transform: translate(0, 0) scale(1.05); }
  50% { transform: translate(-6%, -9%) scale(0.9); }
}
@keyframes atlas-aurora-sweep {
  0%, 100% { transform: translateX(-4%); }
  50% { transform: translateX(5%); }
}
@media (prefers-reduced-motion: reduce) {
  [style*="atlas-aurora-"] { animation: none !important; }
}
`;
