"use client";

import { cn } from "@/lib/utils";
import { useRef, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════ */

interface ClothProps {
  className?: string;
  /** Grid columns */
  cols?: number;
  /** Grid rows */
  rows?: number;
  /** Spacing between points */
  spacing?: number;
  /** Gravity force */
  gravity?: number;
  /** Wind strength */
  wind?: number;
  /** Damping (0-1, higher = less energy loss) */
  damping?: number;
  /** Constraint solver iterations (higher = stiffer fabric) */
  iterations?: number;
  /** Tear distance multiplier (how far before it rips) */
  tearDistance?: number;
  /** Mouse grab radius */
  grabRadius?: number;
  /** Cloth color */
  color?: string;
  /** Cloth highlight color */
  highlightColor?: string;
  /** Pin top row */
  pinTop?: boolean;
  /** Enable tearing */
  tearable?: boolean;
}

/* ═══════════════════════════════════════════════════════════
   POINT MASS
   ═══════════════════════════════════════════════════════════ */

class Point {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  origX: number;
  origY: number;
  pinned: boolean;
  mass: number;
  accX: number;
  accY: number;
  idx: number;

  constructor(x: number, y: number, pinned = false, idx = 0) {
    this.x = x;
    this.y = y;
    this.prevX = x;
    this.prevY = y;
    this.origX = x;
    this.origY = y;
    this.pinned = pinned;
    this.mass = 1;
    this.accX = 0;
    this.accY = 0;
    this.idx = idx;
  }

  addForce(fx: number, fy: number) {
    this.accX += fx / this.mass;
    this.accY += fy / this.mass;
  }

  update(dt: number, damping: number) {
    if (this.pinned) return;

    // Verlet integration
    const vx = (this.x - this.prevX) * damping;
    const vy = (this.y - this.prevY) * damping;

    this.prevX = this.x;
    this.prevY = this.y;

    this.x += vx + this.accX * dt * dt;
    this.y += vy + this.accY * dt * dt;

    this.accX = 0;
    this.accY = 0;
  }

  constrain(w: number, h: number) {
    if (this.pinned) return;

    // Bounce off walls
    if (this.x < 0) {
      this.x = 0;
      this.prevX = this.x + (this.x - this.prevX) * 0.5;
    }
    if (this.x > w) {
      this.x = w;
      this.prevX = this.x + (this.x - this.prevX) * 0.5;
    }
    if (this.y < 0) {
      this.y = 0;
      this.prevY = this.y + (this.y - this.prevY) * 0.5;
    }
    if (this.y > h) {
      this.y = h;
      this.prevY = this.y + (this.y - this.prevY) * 0.5;
    }
  }
}

/* ═══════════════════════════════════════════════════════════
   CONSTRAINT (SPRING)
   ═══════════════════════════════════════════════════════════ */

class Constraint {
  p1: Point;
  p2: Point;
  restLength: number;
  tearLength: number;
  active: boolean;

  constructor(p1: Point, p2: Point, tearMultiplier: number) {
    this.p1 = p1;
    this.p2 = p2;
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    this.restLength = Math.sqrt(dx * dx + dy * dy);
    this.tearLength = this.restLength * tearMultiplier;
    this.active = true;
  }

  solve() {
    if (!this.active) return;

    const dx = this.p2.x - this.p1.x;
    const dy = this.p2.y - this.p1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist === 0) return;

    // Check for tearing
    if (dist > this.tearLength) {
      this.active = false;
      return;
    }

    // Satisfy constraint
    const diff = (this.restLength - dist) / dist;
    const offsetX = dx * diff * 0.5;
    const offsetY = dy * diff * 0.5;

    if (!this.p1.pinned) {
      this.p1.x -= offsetX;
      this.p1.y -= offsetY;
    }
    if (!this.p2.pinned) {
      this.p2.x += offsetX;
      this.p2.y += offsetY;
    }
  }
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */

export function Component({
  className,
  cols = 50,
  rows = 30,
  spacing = 10,
  gravity = 800,
  wind = 0,
  damping = 0.98,
  iterations = 5,
  tearDistance = 2.2,
  grabRadius = 60,
  color = "rgba(120, 160, 255, ALPHA)",
  highlightColor = "rgba(200, 220, 255, ALPHA)",
  pinTop = true,
  tearable = true,
}: ClothProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const constraintsRef = useRef<Constraint[]>([]);
  const mouseRef = useRef({
    x: 0, y: 0, px: 0, py: 0,
    down: false, grabbed: null as Point | null,
  });
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0 });
  const initRef = useRef(false);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    sizeRef.current = { w: w * dpr, h: h * dpr };

    const cw = sizeRef.current.w;
    const ch = sizeRef.current.h;

    // Center the cloth
    const totalW = (cols - 1) * spacing * dpr;
    const startX = (cw - totalW) / 2;
    const startY = ch * 0.08;

    const points: Point[] = [];
    const constraints: Constraint[] = [];

    // Create points
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = startX + col * spacing * dpr;
        const y = startY + row * spacing * dpr;
        const pin = pinTop && row === 0 && col % 3 === 0;
        const idx = row * cols + col;
        points.push(new Point(x, y, pin, idx));
      }
    }

    // Create constraints (horizontal + vertical + diagonal for stability)
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const idx = row * cols + col;

        // Right neighbor
        if (col < cols - 1) {
          constraints.push(
            new Constraint(points[idx], points[idx + 1], tearable ? tearDistance : 999)
          );
        }

        // Bottom neighbor
        if (row < rows - 1) {
          constraints.push(
            new Constraint(points[idx], points[idx + cols], tearable ? tearDistance : 999)
          );
        }
      }
    }

    pointsRef.current = points;
    constraintsRef.current = constraints;
    initRef.current = true;
  }, [cols, rows, spacing, pinTop, tearable, tearDistance]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!initRef.current) {
      init();
    }

    const { w, h } = sizeRef.current;
    if (w === 0) {
      animRef.current = requestAnimationFrame(draw);
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const dt = 1 / 60;
    timeRef.current += dt;
    const t = timeRef.current;

    const points = pointsRef.current;
    const constraints = constraintsRef.current;

    // ── Forces ──

    for (const p of points) {
      // Gravity
      p.addForce(0, gravity * dpr);

      // Wind (oscillating)
      const windForce = (wind + Math.sin(t * 2 + p.origY * 0.01) * 30) * dpr;
      p.addForce(windForce, Math.sin(t * 3 + p.origX * 0.005) * 15 * dpr);
    }

    // ── Mouse interaction ──

    const m = mouseRef.current;
    if (m.down && m.grabbed) {
      m.grabbed.x = m.x * dpr;
      m.grabbed.y = m.y * dpr;
    } else if (m.down) {
      // Find nearest point to grab
      let nearest: Point | null = null;
      let nearDist = grabRadius * dpr;

      for (const p of points) {
        if (p.pinned) continue;
        const dx = p.x - m.x * dpr;
        const dy = p.y - m.y * dpr;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < nearDist) {
          nearDist = dist;
          nearest = p;
        }
      }

      if (nearest) {
        m.grabbed = nearest;
      }
    }

    // ── Update points ──

    for (const p of points) {
      p.update(dt, damping);
      p.constrain(w, h);
    }

    // ── Solve constraints ──

    for (let i = 0; i < iterations; i++) {
      for (const c of constraints) {
        c.solve();
      }
    }

    // ── Render ──

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // Build alive lookup for fast rendering
    const aliveSet = new Set<string>();
    for (const c of constraints) {
      if (!c.active) continue;
      aliveSet.add(`${c.p1.idx}-${c.p2.idx}`);
      aliveSet.add(`${c.p2.idx}-${c.p1.idx}`);
    }

    // Draw fabric as filled triangles
    for (let row = 0; row < rows - 1; row++) {
      for (let col = 0; col < cols - 1; col++) {
        const i = row * cols + col;
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + cols];
        const p4 = points[i + cols + 1];

        if (!aliveSet.has(`${i}-${i + 1}`) || !aliveSet.has(`${i}-${i + cols}`)) continue;

        // Compute stretch for coloring
        const dx1 = p2.x - p1.x;
        const dy1 = p2.y - p1.y;
        const dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
        const stretch = dist1 / (spacing * dpr);

        // Normal for shading (fake light from top-left)
        const nx = (p2.y - p1.y) - (p3.y - p1.y);
        const ny = (p3.x - p1.x) - (p2.x - p1.x);
        const nLen = Math.sqrt(nx * nx + ny * ny) + 0.001;
        const shade = Math.max(0.3, Math.min(1, (nx / nLen + ny / nLen) * 0.5 + 0.7));

        // Stretched = redder, relaxed = bluer
        let alpha = shade * 0.85;
        let fillColor: string;

        if (stretch > 1.5) {
          // Stretched — warm color
          const t = Math.min(1, (stretch - 1.5) / 0.5);
          const r = Math.round(120 + t * 135);
          const g = Math.round(160 - t * 100);
          const b = Math.round(255 - t * 200);
          fillColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        } else {
          fillColor = color.replace("ALPHA", alpha.toFixed(3));
        }

        // Triangle 1: p1, p2, p3
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();

        // Triangle 2: p2, p4, p3
        ctx.beginPath();
        ctx.moveTo(p2.x, p2.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();
      }
    }

    // Draw constraint lines (subtle mesh)
    ctx.lineWidth = 0.5;
    for (const c of constraints) {
      if (!c.active) continue;

      const stretch = Math.sqrt(
        (c.p2.x - c.p1.x) ** 2 + (c.p2.y - c.p1.y) ** 2
      ) / c.restLength;

      let lineAlpha = 0.08;
      if (stretch > 1.4) lineAlpha = 0.15 + (stretch - 1.4) * 0.3;

      ctx.beginPath();
      ctx.moveTo(c.p1.x, c.p1.y);
      ctx.lineTo(c.p2.x, c.p2.y);
      ctx.strokeStyle = highlightColor.replace("ALPHA", lineAlpha.toFixed(3));
      ctx.stroke();
    }

    // Draw pinned points
    for (const p of points) {
      if (!p.pinned) continue;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = highlightColor.replace("ALPHA", "0.6");
      ctx.fill();
    }

    animRef.current = requestAnimationFrame(draw);
  }, [
    init, gravity, wind, damping, iterations, spacing,
    grabRadius, color, highlightColor, cols, rows,
  ]);

  useEffect(() => {
    init();
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [init, draw]);

  // Resize
  useEffect(() => {
    const onResize = () => {
      initRef.current = false;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── Pointer handlers ──

  const getPos = useCallback((e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const pos = getPos(e);
    mouseRef.current = { ...mouseRef.current, x: pos.x, y: pos.y, px: pos.x, py: pos.y, down: true, grabbed: null };
  }, [getPos]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const pos = getPos(e);
    mouseRef.current.px = mouseRef.current.x;
    mouseRef.current.py = mouseRef.current.y;
    mouseRef.current.x = pos.x;
    mouseRef.current.y = pos.y;
  }, [getPos]);

  const onPointerUp = useCallback(() => {
    // Throw — give grabbed point velocity from mouse movement
    const m = mouseRef.current;
    if (m.grabbed && !m.grabbed.pinned) {
      const dpr = window.devicePixelRatio || 1;
      m.grabbed.prevX = m.grabbed.x - (m.x - m.px) * dpr * 1.5;
      m.grabbed.prevY = m.grabbed.y - (m.y - m.py) * dpr * 1.5;
    }
    m.down = false;
    m.grabbed = null;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full h-full cursor-grab active:cursor-grabbing", className)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    />
  );
}