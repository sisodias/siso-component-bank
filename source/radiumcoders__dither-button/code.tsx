"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, useEffect, useRef } from "react";

const PIXEL_SIZE = 4;

const MIN_PIXEL_SIZE = 1;
const MAX_PIXEL_SIZE = 32;

const BAYER: ReadonlyArray<ReadonlyArray<number>> = [
  [16, 8, 14, 6],
  [5, 12, 2, 10],
  [13, 4, 15, 7],
  [1, 9, 3, 11],
];

function parseRgb(input: string): [number, number, number] {
  const match = input.match(/\d+(?:\.\d+)?/g);
  if (!match || match.length < 3) return [0, 0, 0];
  return [Number(match[0]), Number(match[1]), Number(match[2])];
}

function parseHex(input: string): [number, number, number] | null {
  const hex = input.trim().replace(/^#/, "");
  if (hex.length === 3) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    if ([r, g, b].some(Number.isNaN)) return null;
    return [r, g, b];
  }
  if (hex.length === 6) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    if ([r, g, b].some(Number.isNaN)) return null;
    return [r, g, b];
  }
  return null;
}

export type DitherButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  ditherColor?: string;
  ditherOpacity?: number;
  ditherSize?: number;
};

function DitherButton({
  children,
  className,
  ditherColor = "#999999",
  ditherOpacity = 1,
  ditherSize = PIXEL_SIZE,
  ...props
}: DitherButtonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorOverrideRef = useRef<[number, number, number] | null>(null);
  const pixelSizeRef = useRef<number>(PIXEL_SIZE);

  useEffect(() => {
    colorOverrideRef.current = ditherColor ? parseHex(ditherColor) : null;
  }, [ditherColor]);

  useEffect(() => {
    const clamped = Math.max(
      MIN_PIXEL_SIZE,
      Math.min(MAX_PIXEL_SIZE, Math.round(ditherSize)),
    );
    pixelSizeRef.current = clamped;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.floor(rect.width / clamped));
    const h = Math.max(1, Math.floor(rect.height / clamped));
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;
  }, [ditherSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let rafId = 0;
    const start = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ps = pixelSizeRef.current;
      const w = Math.max(1, Math.floor(rect.width / ps));
      const h = Math.max(1, Math.floor(rect.height / ps));
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = (timeSec: number) => {
      const w = canvas.width;
      const h = canvas.height;

      const computed = getComputedStyle(canvas);
      const override = colorOverrideRef.current;
      const [fr, fg, fb] = override ?? parseRgb(computed.color);
      const [br, bg, bb] = parseRgb(
        computed.getPropertyValue("background-color") || "rgb(255,255,255)",
      );

      const angle = Math.sin(timeSec * 0.4545) * 0.112;
      const dx = -Math.sin(angle);
      const dy = Math.cos(angle);

      const img = ctx.createImageData(w, h);
      const data = img.data;
      const cx = w / 2;
      const cy = h / 2;

      for (let py = 0; py < h; py++) {
        for (let px = 0; px < w; px++) {
          const ps = pixelSizeRef.current;
          const posX = (px - cx) * ps;
          const posY = (py - cy) * ps;
          const value =
            Math.sin((posX * dx + posY * dy) * 0.048 - timeSec * 1.412) * 0.5 +
            0.5;
          const threshold = BAYER[py & 3][px & 3] / 17;
          const on = value < threshold;
          const i = (py * w + px) * 4;
          if (on) {
            data[i] = fr;
            data[i + 1] = fg;
            data[i + 2] = fb;
            data[i + 3] = 255;
          } else {
            data[i] = br;
            data[i + 1] = bg;
            data[i + 2] = bb;
            data[i + 3] = 255;
          }
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    if (reduceMotion) {
      draw(0);
      return () => ro.disconnect();
    }

    const loop = (now: number) => {
      draw((now - start) / 1000);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <button
      {...props}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-md border-2 border-foreground bg-background px-7 py-3 font-mono text-sm font-bold uppercase tracking-wider text-foreground transition-transform active:translate-y-0.5 active:scale-[0.99]",
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{ opacity: ditherOpacity }}
        className="pointer-events-none absolute inset-0 size-full text-foreground [image-rendering:pixelated]"
      />
      <span className="relative z-10 [text-shadow:1px_1px_0_var(--color-background),-1px_1px_0_var(--color-background),1px_-1px_0_var(--color-background),-1px_-1px_0_var(--color-background),0_2px_0_var(--color-background),0_-2px_0_var(--color-background),2px_0_0_var(--color-background),-2px_0_0_var(--color-background)]">
        {children}
      </span>
    </button>
  );
}

export default DitherButton;
