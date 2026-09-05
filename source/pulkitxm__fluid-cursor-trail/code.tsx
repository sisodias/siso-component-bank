"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface FluidCursorTrailProps {
  className?: string;
  color?: string;
  particleCount?: number;
  particleSize?: number;
  velocity?: number;
  gravity?: number;
  fadeSpeed?: number;
  zIndex?: number;
  bound?: boolean;
}

export function FluidCursorTrail({
  className,
  color = "#8b5cf6",
  particleCount = 3,
  particleSize = 4,
  velocity = 4,
  gravity = 0.2,
  fadeSpeed = 0.02,
  zIndex = 9999,
  bound = false,
}: FluidCursorTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = bound ? containerRef.current : null;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const resize = () => {
      if (bound && container) {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resize();
    window.addEventListener("resize", resize);
    let resizeObs: ResizeObserver | undefined;
    if (bound && container) {
      resizeObs = new ResizeObserver(resize);
      resizeObs.observe(container);
    }

    const handleMouse = (e: MouseEvent) => {
      let x: number;
      let y: number;
      if (bound && container) {
        const rect = container.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
          return;
        }
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      } else {
        x = e.clientX;
        y = e.clientY;
      }
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          life: 1,
          vx: (Math.random() - 0.5) * velocity,
          vy: (Math.random() - 0.5) * velocity,
          x,
          y,
        });
      }
    };
    window.addEventListener("mousemove", handleMouse);

    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const next: typeof particlesRef.current = [];
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= fadeSpeed;
        p.vy += gravity;
        if (p.life > 0) {
          next.push(p);
          ctx.globalAlpha = p.life;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, particleSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      particlesRef.current = next;
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      resizeObs?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      cancelAnimationFrame(raf);
    };
  }, [bound, color, particleCount, particleSize, velocity, gravity, fadeSpeed]);

  const canvas = (
    <canvas
      ref={canvasRef}
      className={cn(
        "pointer-events-none cursor-none",
        bound ? "absolute inset-0 size-full" : "fixed inset-0",
        !bound && className,
      )}
      style={{ pointerEvents: "none", zIndex }}
      title="Fluid cursor trail"
    >
      Decorative cursor trail
    </canvas>
  );

  if (bound) {
    return (
      <div ref={containerRef} className={cn("absolute inset-0 overflow-hidden", className)}>
        {canvas}
      </div>
    );
  }

  return canvas;
}

export default FluidCursorTrail;
