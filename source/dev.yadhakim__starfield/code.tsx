"use client";

import { cn } from "@/lib/utils";
import { useRef, useEffect, useCallback, type ReactNode } from "react";

interface StarfieldProps {
  children?: ReactNode;
  className?: string;
  /** Number of stars */
  starCount?: number;
  /** Base travel speed */
  speed?: number;
  /** Star color */
  starColor?: string;
  /** Max trail length multiplier */
  trailFactor?: number;
  /** Background color */
  backgroundColor?: string;
  /** Mouse steer sensitivity (0 = disabled) */
  steerStrength?: number;
  /** Min star size */
  minSize?: number;
  /** Max star size */
  maxSize?: number;
}

interface Star {
  x: number;
  y: number;
  z: number;
  pz: number;
  size: number;
  brightness: number;
}

export function Component({
  children,
  className,
  starCount = 600,
  speed = 1.5,
  starColor = "255,255,255",
  trailFactor = 0.8,
  backgroundColor = "#030712",
  steerStrength = 0.3,
  minSize = 0.5,
  maxSize = 2.5,
}: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: false });
  const animRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });
  const initDone = useRef(false);

  const createStar = useCallback((w: number, h: number, farSpawn = false): Star => {
    return {
      x: (Math.random() - 0.5) * w * 2,
      y: (Math.random() - 0.5) * h * 2,
      z: farSpawn ? Math.random() * 1500 + 500 : Math.random() * 2000,
      pz: 0,
      size: minSize + Math.random() * (maxSize - minSize),
      brightness: 0.3 + Math.random() * 0.7,
    };
  }, [minSize, maxSize]);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth * dpr;
    const h = canvas.clientHeight * dpr;
    canvas.width = w;
    canvas.height = h;
    sizeRef.current = { w, h };

    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push(createStar(w, h));
    }
    starsRef.current = stars;
    initDone.current = true;
  }, [starCount, createStar]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!initDone.current) init();

    const { w, h } = sizeRef.current;
    if (w === 0) {
      animRef.current = requestAnimationFrame(draw);
      return;
    }

    // Clear with solid bg (no fade — we redraw every star)
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, w, h);

    // Vanishing point — follows mouse or centers
    let vpX = w / 2;
    let vpY = h / 2;

    if (mouseRef.current.active && steerStrength > 0) {
      vpX = w * (0.5 + (mouseRef.current.x - 0.5) * steerStrength);
      vpY = h * (0.5 + (mouseRef.current.y - 0.5) * steerStrength);
    }

    const stars = starsRef.current;

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      // Save previous z for trail
      s.pz = s.z;

      // Move star closer
      s.z -= speed * 8;

      // Reset if too close or behind camera
      if (s.z <= 1) {
        const ns = createStar(w, h, true);
        s.x = ns.x;
        s.y = ns.y;
        s.z = ns.z;
        s.pz = s.z;
        s.size = ns.size;
        s.brightness = ns.brightness;
        continue;
      }

      // Project current position
      const sx = (s.x / s.z) * (w * 0.5) + vpX;
      const sy = (s.y / s.z) * (h * 0.5) + vpY;

      // Project previous position (for trail)
      const px = (s.x / s.pz) * (w * 0.5) + vpX;
      const py = (s.y / s.pz) * (h * 0.5) + vpY;

      // Off screen check
      if (sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) continue;

      // Depth-based properties
      const depthNorm = 1 - s.z / 2000; // 0=far, 1=close
      const alpha = Math.min(1, depthNorm * 1.5) * s.brightness;
      const dotSize = s.size * (0.3 + depthNorm * 2);

      // Trail line
      const trailDx = sx - px;
      const trailDy = sy - py;
      const trailLen = Math.sqrt(trailDx * trailDx + trailDy * trailDy);

      if (trailLen > 1 && trailFactor > 0) {
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = `rgba(${starColor},${alpha * 0.5 * trailFactor})`;
        ctx.lineWidth = dotSize * 0.6;
        ctx.stroke();
      }

      // Star dot
      ctx.beginPath();
      ctx.arc(sx, sy, dotSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${starColor},${alpha})`;
      ctx.fill();

      // Bright core for close stars
      if (depthNorm > 0.7) {
        ctx.beginPath();
        ctx.arc(sx, sy, dotSize * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${starColor},${Math.min(1, alpha * 1.5)})`;
        ctx.fill();
      }
    }

    // Center glow
    const glowR = Math.min(w, h) * 0.15;
    const glow = ctx.createRadialGradient(vpX, vpY, 0, vpX, vpY, glowR);
    glow.addColorStop(0, "rgba(100,150,255,0.02)");
    glow.addColorStop(1, "rgba(100,150,255,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    animRef.current = requestAnimationFrame(draw);
  }, [init, speed, starColor, trailFactor, backgroundColor, steerStrength, createStar]);

  useEffect(() => {
    init();
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [init, draw]);

  useEffect(() => {
    const onResize = () => { initDone.current = false; };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
      active: true,
    };
  }, []);

  const onMouseLeave = useCallback(() => {
    mouseRef.current.active = false;
  }, []);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}