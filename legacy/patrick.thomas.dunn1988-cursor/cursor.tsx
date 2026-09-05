"use client";

import { useEffect, useRef } from "react";
import { cn } from "../_utils/cn";

// ---- ENGINE TYPES ----
interface CursorFXConfig {
  canvas: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null;
  performance: { targetFPS: number; adaptiveQuality: boolean; qualityLevel: string };
  physics: { damping: number; friction: number; gravity: number; strength: number };
  intensity: number;
}

interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; life: number; color: string;
}

interface Trail {
  x: number; y: number; size: number;
  opacity: number; life: number; color: string;
}

interface MousePosition {
  x: number; y: number; vx: number; vy: number; lastX: number; lastY: number;
}

interface CursorPosition {
  x: number; y: number; vx: number; vy: number;
}

interface PerformanceMetrics {
  fps: number; frameTime: number; qualityLevel: string; particleCount: number;
}

interface Preset { name: string; description: string; effects: string[]; }

// ---- ENGINE CLASS ----
class CursorFXEngine {
  config: CursorFXConfig;
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  isRunning = false;
  lastTime = 0;
  frameCount = 0;
  fps = 60;
  frameTime = 16.67;
  qualityLevel: string;
  particleCount = 0;
  mouse: MousePosition;
  cursor: CursorPosition;
  particles: Particle[] = [];
  trails: Trail[] = [];
  effects = new Set<string>();

  constructor(config: Partial<CursorFXConfig> = {}) {
    this.config = {
      canvas: null,
      context: null,
      performance: { targetFPS: 60, adaptiveQuality: true, qualityLevel: "high" },
      physics: { damping: 0.9, friction: 0.08, gravity: 0.1, strength: 0.5 },
      intensity: 0.5,
      ...config,
    };
    this.canvas = this.config.canvas;
    this.ctx = this.config.context;
    this.qualityLevel = this.config.performance.qualityLevel;
    this.mouse = { x: 0, y: 0, vx: 0, vy: 0, lastX: 0, lastY: 0 };
    this.cursor = { x: 0, y: 0, vx: 0, vy: 0 };
    this.init();
  }

  init() {
    if (this.canvas && this.ctx) {
      this.bindEvents();
      this.effects.add("taperedLightTrails");
      this.effects.add("magneticParticleSwarm");
      this.effects.add("glassRefraction");
    }
  }

  bindEvents() {
    document.addEventListener("mousemove", (e) => {
      this.mouse.lastX = this.mouse.x;
      this.mouse.lastY = this.mouse.y;
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.vx = this.mouse.x - this.mouse.lastX;
      this.mouse.vy = this.mouse.y - this.mouse.lastY;
    });
    document.addEventListener("mouseleave", () => (this.config.intensity = 0.5));
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.animate();
    }
  }

  animate(currentTime = 0) {
    if (!this.isRunning) return;
    if (this.lastTime > 0) {
      this.frameTime = currentTime - this.lastTime;
      this.fps = 1000 / this.frameTime;
    }
    this.lastTime = currentTime;
    this.frameCount++;

    this.updatePhysics();
    this.updateEffects();
    this.render();

    requestAnimationFrame((t) => this.animate(t));
  }

  updatePhysics() {
    const damping = this.config.physics.damping;
    this.cursor.vx += (this.mouse.x - this.cursor.x) * this.config.physics.strength * 0.1;
    this.cursor.vy += (this.mouse.y - this.cursor.y) * this.config.physics.strength * 0.1;
    this.cursor.vx *= damping;
    this.cursor.vy *= damping;
    this.cursor.x += this.cursor.vx;
    this.cursor.y += this.cursor.vy;

    this.particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      p.vx *= damping; p.vy *= damping;
      p.life -= 1;
      if (p.life <= 0) this.particles.splice(i, 1);
    });

    this.trails.forEach((t, i) => {
      t.life -= 1;
      if (t.life <= 0) this.trails.splice(i, 1);
    });
  }

  updateEffects() {
    if (this.effects.has("taperedLightTrails")) this.createTrailParticle();
    if (this.effects.has("magneticParticleSwarm")) this.createMagneticParticle();
  }

  createTrailParticle() {
    const speed = Math.sqrt(this.mouse.vx ** 2 + this.mouse.vy ** 2);
    const intensity = Math.min(speed * 0.1, 1) * this.config.intensity;
    if (intensity > 0.1) {
      this.trails.push({
        x: this.cursor.x,
        y: this.cursor.y,
        size: 8 * intensity,
        opacity: 0.8 * intensity,
        life: 20,
        color: `hsl(${200 + speed * 10}, 70%, 60%)`,
      });
    }
  }

  createMagneticParticle() {
    if (this.particles.length < 100) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 100;
      const x = this.cursor.x + Math.cos(angle) * distance;
      const y = this.cursor.y + Math.sin(angle) * distance;
      this.particles.push({
        x, y,
        vx: (this.cursor.x - x) * 0.02,
        vy: (this.cursor.y - y) * 0.02,
        size: 3 + Math.random() * 4,
        life: 60 + Math.random() * 60,
        color: `hsl(${180 + Math.random() * 60}, 70%, 60%)`,
      });
    }
  }

  render() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.fillStyle = "rgba(0,0,0,0.1)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.trails.forEach((t) => {
      this.ctx!.globalAlpha = t.opacity;
      this.ctx!.fillStyle = t.color;
      this.ctx.beginPath();
      this.ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    this.particles.forEach((p) => {
      this.ctx!.globalAlpha = p.life / 120;
      this.ctx!.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    this.ctx!.fillStyle = "rgba(255,255,255,0.9)";
    this.ctx.shadowColor = "rgba(100,150,255,0.8)";
    this.ctx.shadowBlur = 20;
    this.ctx.beginPath();
    this.ctx.arc(this.cursor.x, this.cursor.y, 8, 0, Math.PI * 2);
    this.ctx.fill();
  }

  getPerformanceMetrics(): PerformanceMetrics {
    return {
      fps: this.fps,
      frameTime: this.frameTime,
      qualityLevel: this.qualityLevel,
      particleCount: this.particles.length + this.trails.length,
    };
  }
}

// ---- REACT COMPONENT ----
export const Component = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const engine = new CursorFXEngine({ canvas, context: ctx });
    engine.start();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    return () => {
      engine.isRunning = false;
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className={cn("relative w-full h-screen bg-black")}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute top-4 left-4 text-white z-10">
        <h1 className="text-xl font-bold">Cursor FX Engine</h1>
        <p className="text-sm opacity-70">Move your mouse</p>
      </div>
    </div>
  );
};
