"use client";

import { cn } from "@/lib/utils";
import { useRef, useEffect, useCallback, type ReactNode } from "react";

interface MagneticLinesProps {
  children?: ReactNode;
  className?: string;
  lineColor?: string;
  lineLength?: number;
  lineWidth?: number;
  spacing?: number;
  mouseRadius?: number;
  mouseForce?: number;
  waveSpeed?: number;
  waveAmplitude?: number;
  fade?: boolean;
}

export function Component({
  children,
  className,
  lineColor = "rgba(140, 180, 255, ALPHA)",
  lineLength = 18,
  lineWidth = 1.5,
  spacing = 28,
  mouseRadius = 250,
  mouseForce = 1,
  waveSpeed = 0.8,
  waveAmplitude = 0.4,
  fade = true,
}: MagneticLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    timeRef.current += 0.012;
    const t = timeRef.current;

    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const mouseActive = mouseRef.current.active;

    // Auto cursor when idle — slow orbit
    let effectX = mx;
    let effectY = my;
    let effectActive = mouseActive;

    if (!mouseActive) {
      effectX = w / 2 + Math.sin(t * 0.4) * w * 0.25;
      effectY = h / 2 + Math.cos(t * 0.3) * h * 0.2;
      effectActive = true;
    }

    const cols = Math.ceil(w / spacing) + 1;
    const rows = Math.ceil(h / spacing) + 1;
    const offsetX = (w - (cols - 1) * spacing) / 2;
    const offsetY = (h - (rows - 1) * spacing) / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = offsetX + col * spacing;
        const y = offsetY + row * spacing;

        const dx = effectX - x;
        const dy = effectY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let angle: number;
        let alpha: number;
        let len = lineLength;

        if (effectActive && dist < mouseRadius) {
          // Point toward mouse
          const magnetAngle = Math.atan2(dy, dx);

          // Wind/wave base angle
          const windAngle =
            Math.sin(t * waveSpeed + col * 0.15 + row * 0.1) *
            waveAmplitude;

          // Blend: closer to mouse = stronger magnet pull
          const influence =
            Math.pow(1 - dist / mouseRadius, 1.5) * mouseForce;
          angle = windAngle * (1 - influence) + magnetAngle * influence;

          // Closer lines are brighter and longer
          alpha = 0.15 + influence * 0.65;
          len = lineLength + influence * 8;
        } else {
          // Gentle wave
          angle =
            Math.sin(t * waveSpeed + col * 0.15 + row * 0.1) *
            waveAmplitude;
          alpha = 0.12;
        }

        // Fade edges
        if (fade) {
          const edgeX = Math.min(x, w - x) / (w * 0.15);
          const edgeY = Math.min(y, h - y) / (h * 0.15);
          const edgeFade = Math.min(1, Math.min(edgeX, edgeY));
          alpha *= edgeFade;
        }

        const halfLen = len / 2;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(x - cosA * halfLen, y - sinA * halfLen);
        ctx.lineTo(x + cosA * halfLen, y + sinA * halfLen);
        ctx.strokeStyle = lineColor.replace("ALPHA", alpha.toFixed(3));
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.stroke();
      }
    }

    // Subtle glow at mouse position
    if (effectActive) {
      const glowRadius = mouseRadius * 0.6;
      const glow = ctx.createRadialGradient(
        effectX,
        effectY,
        0,
        effectX,
        effectY,
        glowRadius
      );
      glow.addColorStop(0, "rgba(100, 160, 255, 0.03)");
      glow.addColorStop(1, "rgba(100, 160, 255, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(
        effectX - glowRadius,
        effectY - glowRadius,
        glowRadius * 2,
        glowRadius * 2
      );
    }

    animRef.current = requestAnimationFrame(draw);
  }, [
    lineColor,
    lineLength,
    lineWidth,
    spacing,
    mouseRadius,
    mouseForce,
    waveSpeed,
    waveAmplitude,
    fade,
  ]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
    mouseRef.current.active = true;
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