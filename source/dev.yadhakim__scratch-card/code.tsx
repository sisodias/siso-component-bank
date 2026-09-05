"use client";

import { cn } from "@/lib/utils";
import {
  useRef,
  useEffect,
  useCallback,
  useState,
  type ReactNode,
} from "react";

interface ScratchCardProps {
  children: ReactNode;
  className?: string;
  /** Surface color / gradient start */
  surfaceFrom?: string;
  /** Surface gradient end */
  surfaceTo?: string;
  /** Scratch brush radius */
  brushSize?: number;
  /** Percentage revealed to trigger onComplete */
  completeThreshold?: number;
  /** Called when reveal exceeds threshold */
  onComplete?: () => void;
  /** Called with current reveal percentage */
  onReveal?: (percent: number) => void;
  /** Surface pattern overlay */
  pattern?: "dots" | "crosshatch" | "none";
  /** Show scratch particles */
  particles?: boolean;
  /** Border radius in px */
  radius?: number;
}

interface ScratchParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
}

export function Component({
  children,
  className,
  surfaceFrom = "#a0a0a0",
  surfaceTo = "#c8c8c8",
  brushSize = 28,
  completeThreshold = 60,
  onComplete,
  onReveal,
  pattern = "crosshatch",
  particles = true,
  radius = 16,
}: ScratchCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const scratchingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const [completed, setCompleted] = useState(false);
  const completedRef = useRef(false);
  const particlesRef = useRef<ScratchParticle[]>([]);
  const revealRef = useRef(0);

  // Draw the metallic surface
  const drawSurface = useCallback(() => {
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

    // Metallic gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, surfaceFrom);
    grad.addColorStop(0.3, surfaceTo);
    grad.addColorStop(0.5, surfaceFrom);
    grad.addColorStop(0.7, surfaceTo);
    grad.addColorStop(1, surfaceFrom);

    // Rounded rect clip
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, radius);
    ctx.clip();

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Pattern overlay
    if (pattern === "dots") {
      ctx.fillStyle = "rgba(0,0,0,0.06)";
      for (let y = 0; y < h; y += 8) {
        for (let x = (y % 16 === 0 ? 0 : 4); x < w; x += 8) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (pattern === "crosshatch") {
      ctx.strokeStyle = "rgba(0,0,0,0.04)";
      ctx.lineWidth = 0.5;
      for (let i = -h; i < w + h; i += 6) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + h, h);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(i + h, 0);
        ctx.lineTo(i, h);
        ctx.stroke();
      }
    }

    // Shimmer
    const shimmer = ctx.createLinearGradient(0, 0, w, 0);
    shimmer.addColorStop(0, "rgba(255,255,255,0)");
    shimmer.addColorStop(0.4, "rgba(255,255,255,0.08)");
    shimmer.addColorStop(0.5, "rgba(255,255,255,0.15)");
    shimmer.addColorStop(0.6, "rgba(255,255,255,0.08)");
    shimmer.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = shimmer;
    ctx.fillRect(0, 0, w, h);

    // "Scratch here" text
    ctx.font = "13px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillText("Scratch to reveal", w / 2, h / 2);
  }, [surfaceFrom, surfaceTo, pattern, radius]);

  useEffect(() => {
    drawSurface();
  }, [drawSurface]);

  // Calculate reveal percentage
  const calcReveal = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let transparent = 0;
    const total = data.length / 4;

    // Sample every 20th pixel for performance
    for (let i = 3; i < data.length; i += 80) {
      if (data[i] === 0) transparent++;
    }

    return (transparent / (total / 20)) * 100;
  }, []);

  // Scratch at position
  const scratch = useCallback(
    (x: number, y: number) => {
      const canvas = canvasRef.current;
      if (!canvas || completedRef.current) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const sx = x * dpr;
      const sy = y * dpr;
      const r = brushSize * dpr;

      ctx.globalCompositeOperation = "destination-out";

      // Main erase circle
      ctx.beginPath();
      ctx.arc(sx, sy, r / 2, 0, Math.PI * 2);
      ctx.fill();

      // Connect to last position for smooth strokes
      const last = lastPosRef.current;
      const dx = sx - last.x * dpr;
      const dy = sy - last.y * dpr;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 2) {
        ctx.lineWidth = r;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(last.x * dpr, last.y * dpr);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }

      ctx.globalCompositeOperation = "source-over";

      // Spawn particles
      if (particles) {
        const colors = [surfaceFrom, surfaceTo, "#d0d0d0", "#909090"];
        for (let i = 0; i < 3; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1 + Math.random() * 3;
          particlesRef.current.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1,
            size: 1 + Math.random() * 3,
            life: 0,
            maxLife: 20 + Math.random() * 20,
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }
        // Cap particles
        if (particlesRef.current.length > 100) {
          particlesRef.current = particlesRef.current.slice(-60);
        }
      }

      // Check reveal
      const pct = calcReveal();
      revealRef.current = pct;
      onReveal?.(pct);

      if (pct >= completeThreshold && !completedRef.current) {
        completedRef.current = true;
        setCompleted(true);
        onComplete?.();

        // Auto-clear remaining surface
        setTimeout(() => {
          if (!canvas) return;
          const c = canvas.getContext("2d");
          if (!c) return;
          c.clearRect(0, 0, canvas.width, canvas.height);
        }, 400);
      }

      lastPosRef.current = { x, y };
    },
    [brushSize, particles, surfaceFrom, surfaceTo, calcReveal, completeThreshold, onComplete, onReveal]
  );

  // Particle animation
  const drawParticles = useCallback(() => {
    if (!particles || particlesRef.current.length === 0) return;

    const container = containerRef.current;
    if (!container) return;

    // We draw particles on a separate overlay to not interfere with erasing
    let overlay = container.querySelector(
      "canvas[data-particles]"
    ) as HTMLCanvasElement | null;

    if (!overlay) {
      overlay = document.createElement("canvas");
      overlay.setAttribute("data-particles", "true");
      overlay.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:30";
      container.appendChild(overlay);
    }

    const dpr = window.devicePixelRatio || 1;
    const w = overlay.clientWidth;
    const h = overlay.clientHeight;
    if (overlay.width !== w * dpr || overlay.height !== h * dpr) {
      overlay.width = w * dpr;
      overlay.height = h * dpr;
    }

    const ctx = overlay.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const alive: ScratchParticle[] = [];
    for (const p of particlesRef.current) {
      p.life++;
      if (p.life > p.maxLife) continue;

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // gravity

      const alpha = 1 - p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);

      alive.push(p);
    }

    ctx.globalAlpha = 1;
    particlesRef.current = alive;
  }, [particles]);

  // Animation loop for particles
  useEffect(() => {
    const loop = () => {
      drawParticles();
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [drawParticles]);

  // Pointer handlers
  const getPos = useCallback((e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      scratchingRef.current = true;
      const pos = getPos(e);
      lastPosRef.current = pos;
      scratch(pos.x, pos.y);
    },
    [getPos, scratch]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!scratchingRef.current) return;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    },
    [getPos, scratch]
  );

  const onPointerUp = useCallback(() => {
    scratchingRef.current = false;
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden select-none", className)}
      style={{ borderRadius: radius }}
    >
      {/* Hidden content underneath */}
      <div className="relative z-0 w-full h-full">{children}</div>

      {/* Scratch surface */}
      <canvas
        ref={canvasRef}
        className={cn(
          "absolute inset-0 z-20 w-full h-full touch-none",
          completed ? "pointer-events-none" : "cursor-crosshair"
        )}
        style={{
          borderRadius: radius,
          transition: completed ? "opacity 0.4s ease" : undefined,
          opacity: completed ? 0 : 1,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      />
    </div>
  );
}