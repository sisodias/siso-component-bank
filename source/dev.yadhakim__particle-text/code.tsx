"use client";

import { cn } from "@/lib/utils";
import { useRef, useEffect, useCallback } from "react";

interface ParticleTextProps {
  text?: string;
  className?: string;
  fontSize?: number;
  fontFamily?: string;
  particleSize?: number;
  particleColor?: string;
  particleGap?: number;
  mouseRadius?: number;
  mouseForce?: number;
  returnSpeed?: number;
  friction?: number;
}

interface Particle {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

function sampleTextPixels(
  text: string,
  fontSize: number,
  fontFamily: string,
  gap: number,
  maxWidth: number,
  maxHeight: number
): { x: number; y: number }[] {
  const offscreen = document.createElement("canvas");
  offscreen.width = maxWidth;
  offscreen.height = maxHeight;
  const ctx = offscreen.getContext("2d");
  if (!ctx) return [];

  ctx.fillStyle = "#fff";
  ctx.font = `bold ${fontSize}px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Handle multi-line
  const lines = text.split("\n");
  const lineHeight = fontSize * 1.15;
  const totalHeight = lines.length * lineHeight;
  const startY = maxHeight / 2 - totalHeight / 2 + lineHeight / 2;

  lines.forEach((line, i) => {
    ctx.fillText(line, maxWidth / 2, startY + i * lineHeight);
  });

  const imageData = ctx.getImageData(0, 0, maxWidth, maxHeight);
  const points: { x: number; y: number }[] = [];

  for (let y = 0; y < maxHeight; y += gap) {
    for (let x = 0; x < maxWidth; x += gap) {
      const idx = (y * maxWidth + x) * 4;
      if (imageData.data[idx + 3] > 128) {
        points.push({ x, y });
      }
    }
  }

  return points;
}

export function Component({
  text = "PARTICLE",
  className,
  fontSize = 120,
  fontFamily = "system-ui, -apple-system, sans-serif",
  particleSize = 2,
  particleColor = "rgba(180, 210, 255, ALPHA)",
  particleGap = 4,
  mouseRadius = 100,
  mouseForce = 8,
  returnSpeed = 0.06,
  friction = 0.85,
}: ParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const animRef = useRef<number>(0);
  const initializedRef = useRef(false);
  const autoTimeRef = useRef(0);

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    const points = sampleTextPixels(text, fontSize, fontFamily, particleGap, w, h);

    particlesRef.current = points.map((p) => ({
      homeX: p.x,
      homeY: p.y,
      // Start scattered
      x: p.x + (Math.random() - 0.5) * w * 1.5,
      y: p.y + (Math.random() - 0.5) * h * 1.5,
      vx: 0,
      vy: 0,
      size: particleSize + Math.random() * 0.8,
      alpha: 0.4 + Math.random() * 0.6,
    }));

    initializedRef.current = true;
  }, [text, fontSize, fontFamily, particleGap, particleSize]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    if (!initializedRef.current) {
      initParticles();
    }

    ctx.clearRect(0, 0, w, h);

    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const mouseActive = mouseRef.current.active;

    // Auto-scatter simulation when no mouse interaction
    autoTimeRef.current += 0.01;
    const autoT = autoTimeRef.current;
    let autoMX = -9999;
    let autoMY = -9999;

    if (!mouseActive) {
      // Circular sweep every 8 seconds
      const cycle = autoT % 8;
      if (cycle > 2 && cycle < 5) {
        const progress = (cycle - 2) / 3;
        autoMX = w * 0.15 + progress * w * 0.7;
        autoMY = h * 0.5 + Math.sin(progress * Math.PI * 2) * h * 0.15;
      }
    }

    const effectMX = mouseActive ? mx : autoMX;
    const effectMY = mouseActive ? my : autoMY;

    const particles = particlesRef.current;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Mouse repulsion
      const dx = p.x - effectMX;
      const dy = p.y - effectMY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouseRadius && dist > 0) {
        const force = (mouseRadius - dist) / mouseRadius;
        const angle = Math.atan2(dy, dx);
        p.vx += Math.cos(angle) * force * mouseForce;
        p.vy += Math.sin(angle) * force * mouseForce;
      }

      // Spring back to home
      const hx = p.homeX - p.x;
      const hy = p.homeY - p.y;
      p.vx += hx * returnSpeed;
      p.vy += hy * returnSpeed;

      // Friction
      p.vx *= friction;
      p.vy *= friction;

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Distance from home for glow effect
      const homeDist = Math.sqrt(hx * hx + hy * hy);
      const displaced = Math.min(1, homeDist / 80);

      // Draw
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size + displaced * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = particleColor.replace(
        "ALPHA",
        (p.alpha * (0.6 + displaced * 0.4)).toFixed(2)
      );
      ctx.fill();

      // Connection lines to nearby particles when displaced
      if (displaced > 0.2) {
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdist = cdx * cdx + cdy * cdy;
          if (cdist < 900) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = particleColor.replace(
              "ALPHA",
              (0.06 * (1 - cdist / 900)).toFixed(3)
            );
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    animRef.current = requestAnimationFrame(draw);
  }, [
    initParticles,
    particleColor,
    mouseRadius,
    mouseForce,
    returnSpeed,
    friction,
  ]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  // Reinit on text change
  useEffect(() => {
    initializedRef.current = false;
  }, [text, fontSize]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
    mouseRef.current.active = true;
  }, []);

  const onMouseLeave = useCallback(() => {
    mouseRef.current.active = false;
    mouseRef.current.x = -9999;
    mouseRef.current.y = -9999;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full h-full", className)}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    />
  );
}