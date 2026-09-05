"use client";

import { cn } from "@/lib/utils";
import { useRef, useEffect, useCallback, type ReactNode } from "react";

interface GravityParticlesProps {
  children?: ReactNode;
  className?: string;
  /** Number of particles */
  count?: number;
  /** Gravity strength */
  gravity?: number;
  /** Trail length (number of past positions stored) */
  trailLength?: number;
  /** Particle colors */
  colors?: string[];
  /** Min particle size */
  minSize?: number;
  /** Max particle size */
  maxSize?: number;
  /** Mouse influence radius */
  mouseRadius?: number;
  /** Background color */
  backgroundColor?: string;
  /** Damping — slight energy loss to prevent chaos (0-1) */
  damping?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  trail: { x: number; y: number }[];
  mass: number;
}

function hexToRgba(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

const DEFAULT_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#06b6d4", "#10b981", "#f59e0b"];

export function Component({
  children,
  className,
  count = 300,
  gravity = 1200,
  trailLength = 12,
  colors = DEFAULT_COLORS,
  minSize = 1,
  maxSize = 3,
  mouseRadius = 9999,
  backgroundColor = "#030712",
  damping = 0.997,
}: GravityParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0 });
  const initDone = useRef(false);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth * dpr;
    const h = canvas.clientHeight * dpr;
    canvas.width = w;
    canvas.height = h;
    sizeRef.current = { w, h };

    const cx = w / 2;
    const cy = h / 2;

    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      // Spawn in a ring around center with orbital velocity
      const angle = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * Math.min(w, h) * 0.35;
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;

      // Give orbital velocity (perpendicular to radius)
      const speed = 1.5 + Math.random() * 2.5;
      const vx = -Math.sin(angle) * speed;
      const vy = Math.cos(angle) * speed;

      particles.push({
        x, y, vx, vy,
        size: minSize + Math.random() * (maxSize - minSize),
        color: colors[Math.floor(Math.random() * colors.length)],
        trail: [],
        mass: 0.5 + Math.random() * 1.5,
      });
    }

    particlesRef.current = particles;
    initDone.current = true;
  }, [count, colors, minSize, maxSize]);

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

    const dpr = window.devicePixelRatio || 1;
    timeRef.current += 0.016;
    const t = timeRef.current;

    // Fade background for natural trail effect
    ctx.fillStyle = backgroundColor;
    ctx.globalAlpha = 0.15;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;

    // Attractor position
    let ax: number, ay: number;
    if (mouseRef.current.active) {
      ax = mouseRef.current.x * dpr;
      ay = mouseRef.current.y * dpr;
    } else {
      // Auto orbit — attractor moves in a figure-8
      ax = w / 2 + Math.sin(t * 0.3) * w * 0.15;
      ay = h / 2 + Math.sin(t * 0.6) * h * 0.1;
    }

    // Subtle glow at attractor
    const glowR = 60 * dpr;
    const glow = ctx.createRadialGradient(ax, ay, 0, ax, ay, glowR);
    glow.addColorStop(0, "rgba(120, 160, 255, 0.06)");
    glow.addColorStop(1, "rgba(120, 160, 255, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(ax - glowR, ay - glowR, glowR * 2, glowR * 2);

    const particles = particlesRef.current;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Store trail
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > trailLength) p.trail.shift();

      // Gravity toward attractor
      const dx = ax - p.x;
      const dy = ay - p.y;
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq);

      if (dist > 5 && dist < mouseRadius * dpr) {
        // Gravitational acceleration: F = G*m / r^2, capped at close range
        const safeDist = Math.max(30, dist);
        const force = gravity / (safeDist * safeDist) * p.mass;
        const angle = Math.atan2(dy, dx);
        p.vx += Math.cos(angle) * force;
        p.vy += Math.sin(angle) * force;
      }

      // Damping
      p.vx *= damping;
      p.vy *= damping;

      // Speed cap to prevent escape
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 15) {
        p.vx = (p.vx / speed) * 15;
        p.vy = (p.vy / speed) * 15;
      }

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < -50) p.x = w + 50;
      if (p.x > w + 50) p.x = -50;
      if (p.y < -50) p.y = h + 50;
      if (p.y > h + 50) p.y = -50;

      // Draw trail
      if (p.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (let j = 1; j < p.trail.length; j++) {
          ctx.lineTo(p.trail[j].x, p.trail[j].y);
        }
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = hexToRgba(p.color, 0.15 + (speed / 15) * 0.15);
        ctx.lineWidth = p.size * 0.5;
        ctx.stroke();
      }

      // Draw particle
      const brightness = 0.5 + (speed / 15) * 0.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(p.color, brightness);
      ctx.fill();
    }

    animRef.current = requestAnimationFrame(draw);
  }, [init, gravity, trailLength, mouseRadius, backgroundColor, damping]);

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
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
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