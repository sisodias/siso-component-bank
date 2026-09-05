import { useEffect, useRef } from "react";

export type Direction = "implode" | "burst" | "diag" | "fall";

export type Palette = {
  name: string;
  colors: [number, number, number][];
};

/**
 * Built-in vibrant palettes for the PixelOrb.
 * Each palette has 3 stops interpolated across the orb's energy field.
 */
export const PALETTES: Palette[] = [
  { name: "Ember", colors: [[26, 4, 22], [192, 30, 70], [255, 132, 168]] },
  { name: "Lime",  colors: [[18, 56, 12], [142, 205, 38], [228, 244, 96]] },
  { name: "Bloom", colors: [[58, 12, 64], [210, 50, 165], [255, 148, 222]] },
  { name: "Solar", colors: [[58, 8, 12], [228, 80, 28], [248, 215, 78]] },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function getColor(palette: Palette, energy: number) {
  const e = Math.max(0, Math.min(1, energy));
  const c = palette.colors;
  if (e < 0.5) {
    const t = e * 2;
    return [
      Math.round(lerp(c[0][0], c[1][0], t)),
      Math.round(lerp(c[0][1], c[1][1], t)),
      Math.round(lerp(c[0][2], c[1][2], t)),
    ];
  }
  const t = (e - 0.5) * 2;
  return [
    Math.round(lerp(c[1][0], c[2][0], t)),
    Math.round(lerp(c[1][1], c[2][1], t)),
    Math.round(lerp(c[1][2], c[2][2], t)),
  ];
}

function getEnergy(
  nx: number,
  ny: number,
  time: number,
  direction: Direction,
  originX: number,
  originY: number,
) {
  const cx = 0.5 + originX;
  const cy = 0.5 + originY;
  const dx = nx - cx;
  const dy = ny - cy;
  const dist = Math.min(1.2, Math.sqrt(dx * dx + dy * dy) / 0.5);

  let base = 0.4 + dist * 0.5;
  let phase = -dist * 5 + time * 2.6;

  if (direction === "burst") {
    base = 1 - dist * 0.6;
    phase = dist * 5 - time * 2.6;
  }
  if (direction === "diag") {
    const ev = (nx + (1 - ny)) / 2 + (originX - originY) * 0.5;
    base = ev;
    phase = ev * 8 + time * 2.4;
  }
  if (direction === "fall") {
    const ey = 1 - ny + originY;
    base = ey - (nx - 0.5) * originX * 0.9;
    phase = ey * 5 + time * 2.4;
  }

  return (
    base * 0.55 +
    Math.sin(phase) * 0.32 +
    Math.sin(nx * 6.1 + time * 1.1) * 0.09 +
    Math.cos(ny * 5.3 + time * 0.95) * 0.09
  );
}

export interface PixelOrbProps {
  /** Direction the energy field flows from. */
  direction?: Direction;
  /** Pixel grid resolution per side. Higher = smoother, slower. */
  grid?: number;
  /** Speed of the orbiting energy origin. */
  orbitSpeed?: number;
  /** Color palette to render. Pick from PALETTES or supply your own. */
  palette?: Palette;
  /** Phase offset so multiple orbs aren't perfectly synced. */
  seed?: number;
  /** Square render size in CSS pixels. */
  size?: number;
  /** Speed of the energy field's pulse. */
  speed?: number;
}

/**
 * A small animated pixel orb rendered to a canvas.
 * The orb's vibrant palette is intentional and stays consistent
 * across light and dark themes.
 */
export function PixelOrb({
  direction = "implode",
  grid = 6,
  orbitSpeed = 4,
  palette = PALETTES[0],
  seed = 0,
  size = 28,
  speed = 5,
}: PixelOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    let frameId = 0;
    let lastTime: number | null = null;
    let elapsed = seed * 0.35;
    let orbitTime = seed * 0.8;

    const frame = (time: number) => {
      if (lastTime === null) lastTime = time;
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      elapsed += dt * speed;
      orbitTime += dt * orbitSpeed;

      const originX = Math.cos(orbitTime + seed) * 0.12;
      const originY = Math.sin(orbitTime + seed) * 0.12;
      const pixel = canvas.width / grid;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let y = 0; y < grid; y++) {
        for (let x = 0; x < grid; x++) {
          const nx = x / (grid - 1);
          const ny = y / (grid - 1);
          const c = getColor(
            palette,
            getEnergy(nx, ny, elapsed, direction, originX, originY),
          );
          ctx.fillStyle = `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
          ctx.fillRect(x * pixel, y * pixel, pixel + 0.6, pixel + 0.6);
        }
      }

      frameId = requestAnimationFrame(frame);
    };

    frameId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameId);
  }, [direction, grid, orbitSpeed, palette, seed, size, speed]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      aria-hidden="true"
      className="pointer-events-none block shrink-0 rounded-full ring-1 ring-border"
      style={{ width: size, height: size }}
    />
  );
}

export interface AgentThinkingBadgeProps {
  /** Text shown next to the orb. */
  label?: string;
  /** Color palette for the orb. Defaults to "Ember". */
  palette?: Palette;
}

/**
 * A status pill showing a single AI agent in a "thinking" state.
 * Theme-aware: shell adapts to light/dark, orb stays vibrant.
 */
export function AgentThinkingBadge({
  label = "Agent Thinking",
  palette = PALETTES[0],
}: AgentThinkingBadgeProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className="inline-flex h-[41px] items-center gap-2 rounded-full border border-border bg-background px-1.5 py-1 pr-3 text-foreground shadow-sm"
    >
      <PixelOrb palette={palette} />
      <span className="whitespace-nowrap font-mono text-xs font-semibold tracking-[-0.02em]">
        {label}
      </span>
    </div>
  );
}

export interface AgentsThinkingBadgeProps {
  /** Text shown next to the orbs. */
  label?: string;
  /** Number of stacked agent orbs (1–6). */
  count?: number;
}

/**
 * A status pill showing multiple AI agents working together.
 * Each orb cycles through PALETTES and animates in with a stagger.
 */
export function AgentsThinkingBadge({
  label = "Agents thinking",
  count = 4,
}: AgentsThinkingBadgeProps) {
  const safeCount = Math.max(1, Math.min(6, count));
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className="inline-flex h-[41px] items-center gap-2 rounded-full border border-border bg-background px-1.5 py-1 pr-3 text-foreground shadow-sm"
    >
      <div className="flex h-[29px] items-center">
        {Array.from({ length: safeCount }).map((_, i) => (
          <div
            key={i}
            style={{
              marginLeft: i === 0 ? 0 : -12,
              zIndex: i + 1,
              animation: `orb-enter 300ms ${i * 110}ms both`,
            }}
          >
            <PixelOrb palette={PALETTES[i % PALETTES.length]} seed={i + 1} />
          </div>
        ))}
      </div>
      <span className="whitespace-nowrap font-mono text-xs font-semibold tracking-[-0.02em]">
        {label}
      </span>
    </div>
  );
}