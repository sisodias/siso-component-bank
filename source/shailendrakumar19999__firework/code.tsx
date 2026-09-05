"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const rand = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

const randInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min) + min);

const randColor = (): string => `hsl(${randInt(0, 360)}, 100%, 50%)`;

// Pre-calculate constants
const TWO_PI = Math.PI * 2;
const STAR_SPIKES = 5;
const STAR_ANGLE = Math.PI / STAR_SPIKES;

// Star path cache
const starPathCache = new Map<string, Path2D>();

function getStarPath(size: number): Path2D {
  const key = size.toFixed(2);
  let path = starPathCache.get(key);
  
  if (!path) {
    path = new Path2D();
    const outerRadius = size;
    const innerRadius = size * 0.5;
    
    path.moveTo(0, -outerRadius);
    
    for (let i = 0; i < STAR_SPIKES; i++) {
      const angle1 = (i * 2 + 1) * STAR_ANGLE;
      const angle2 = (i * 2 + 2) * STAR_ANGLE;
      
      path.lineTo(
        Math.cos(angle1 - Math.PI / 2) * innerRadius,
        Math.sin(angle1 - Math.PI / 2) * innerRadius
      );
      path.lineTo(
        Math.cos(angle2 - Math.PI / 2) * outerRadius,
        Math.sin(angle2 - Math.PI / 2) * outerRadius
      );
    }
    
    path.closePath();
    
    // Limit cache size to prevent memory leak
    if (starPathCache.size > 100) {
      const firstKey = starPathCache.keys().next().value;
      if (firstKey) starPathCache.delete(firstKey);
    }
    
    starPathCache.set(key, path);
  }
  
  return path;
}

type ParticleType = {
  x: number;
  y: number;
  color: string;
  vx: number;
  vy: number;
  gravity: number;
  friction: number;
  alpha: number;
  decay: number;
  size: number;
  alive: boolean;
  starPath: Path2D;
  update: () => void;
  reset: (x: number, y: number, color: string, speed: number, direction: number, size: number) => void;
};

// Object pool for particles
class ParticlePool {
  private pool: ParticleType[] = [];
  private activeParticles: Set<ParticleType> = new Set();
  
  acquire(
    x: number,
    y: number,
    color: string,
    speed: number,
    direction: number,
    gravity: number,
    friction: number,
    size: number
  ): ParticleType {
    let particle = this.pool.pop();
    
    if (!particle) {
      particle = {
        x: 0,
        y: 0,
        color: '',
        vx: 0,
        vy: 0,
        gravity,
        friction,
        alpha: 1,
        decay: 0,
        size: 0,
        alive: true,
        starPath: new Path2D(),
        update() {
          this.vx *= this.friction;
          this.vy = this.vy * this.friction + this.gravity;
          this.x += this.vx;
          this.y += this.vy;
          this.alpha -= this.decay;
          
          if (this.alpha <= 0) {
            this.alive = false;
          }
        },
        reset(x: number, y: number, color: string, speed: number, direction: number, size: number) {
          this.x = x;
          this.y = y;
          this.color = color;
          this.vx = Math.cos(direction) * speed;
          this.vy = Math.sin(direction) * speed;
          this.alpha = 1;
          this.decay = rand(0.005, 0.02);
          this.size = size;
          this.alive = true;
          this.starPath = getStarPath(size);
        }
      };
    }
    
    particle.reset(x, y, color, speed, direction, size);
    particle.gravity = gravity;
    particle.friction = friction;
    this.activeParticles.add(particle);
    
    return particle;
  }
  
  release(particle: ParticleType): void {
    if (this.activeParticles.has(particle)) {
      this.activeParticles.delete(particle);
      this.pool.push(particle);
    }
  }
  
  releaseAll(): void {
    this.activeParticles.forEach(p => this.pool.push(p));
    this.activeParticles.clear();
  }
}

type FireworkType = {
  x: number;
  y: number;
  targetY: number;
  color: string;
  speed: number;
  size: number;
  angle: number;
  vx: number;
  vy: number;
  trail: Float32Array;
  trailIndex: number;
  trailLength: number;
  exploded: boolean;
  update: () => boolean;
  explode: () => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
};

function createFirework(
  x: number,
  y: number,
  targetY: number,
  color: string,
  speed: number,
  size: number,
  particleSpeed: { min: number; max: number } | number,
  particleSize: { min: number; max: number } | number,
  particlePool: ParticlePool,
  onExplode: (particles: ParticleType[]) => void
): FireworkType {
  const angle = -Math.PI / 2 + rand(-0.3, 0.3);
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;
  const trailLength = randInt(10, 25);
  const trail = new Float32Array(trailLength * 2); // x,y pairs
  
  return {
    x,
    y,
    targetY,
    color,
    speed,
    size,
    angle,
    vx,
    vy,
    trail,
    trailIndex: 0,
    trailLength,
    exploded: false,
    update() {
      // Update trail with circular buffer
      this.trail[this.trailIndex * 2] = this.x;
      this.trail[this.trailIndex * 2 + 1] = this.y;
      this.trailIndex = (this.trailIndex + 1) % this.trailLength;
      
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.02;
      
      if (this.vy >= 0 || this.y <= this.targetY) {
        this.explode();
        return false;
      }
      return true;
    },
    explode() {
      const numParticles = randInt(50, 150);
      const particles: ParticleType[] = [];
      
      for (let i = 0; i < numParticles; i++) {
        const particleAngle = rand(0, TWO_PI);
        const localParticleSpeed = getValueByRange(particleSpeed);
        const localParticleSize = getValueByRange(particleSize);
        
        particles.push(
          particlePool.acquire(
            this.x,
            this.y,
            this.color,
            localParticleSpeed,
            particleAngle,
            0.05,
            0.98,
            localParticleSize
          )
        );
      }
      onExplode(particles);
    },
    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.size;
      ctx.lineCap = "round";
      ctx.beginPath();
      
      // Draw trail efficiently
      let started = false;
      for (let i = 0; i < this.trailLength; i++) {
        const idx = ((this.trailIndex - i - 1 + this.trailLength) % this.trailLength) * 2;
        const px = this.trail[idx];
        const py = this.trail[idx + 1];
        
        if (px === 0 && py === 0) continue;
        
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
      
      if (started) {
        ctx.lineTo(this.x, this.y);
      }
      
      ctx.stroke();
      ctx.restore();
    },
  };
}

function getValueByRange(range: { min: number; max: number } | number): number {
  if (typeof range === "number") {
    return range;
  }
  return rand(range.min, range.max);
}

function getColor(color: string | string[] | undefined): string {
  if (Array.isArray(color)) {
    return color[randInt(0, color.length)] ?? randColor();
  }
  return color ?? randColor();
}

type FireworksBackgroundProps = Omit<React.ComponentProps<"div">, "color"> & {
  canvasProps?: React.ComponentProps<"canvas">;
  population?: number;
  color?: string | string[];
  fireworkSpeed?: { min: number; max: number } | number;
  fireworkSize?: { min: number; max: number } | number;
  particleSpeed?: { min: number; max: number } | number;
  particleSize?: { min: number; max: number } | number;
};

function FireworksBackground({
  ref,
  className,
  canvasProps,
  population = 1,
  color,
  fireworkSpeed = { min: 4, max: 8 },
  fireworkSize = { min: 2, max: 5 },
  particleSpeed = { min: 2, max: 7 },
  particleSize = { min: 1, max: 5 },
  ...props
}: FireworksBackgroundProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const particlePoolRef = React.useRef<ParticlePool>(new ParticlePool());
  
  React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const particlePool = particlePoolRef.current;
    
    let maxX = window.innerWidth;
    let ratio = container.offsetHeight / container.offsetWidth;
    let maxY = maxX * ratio;
    canvas.width = maxX;
    canvas.height = maxY;

    const setCanvasSize = () => {
      maxX = window.innerWidth;
      ratio = container.offsetHeight / container.offsetWidth;
      maxY = maxX * ratio;
      canvas.width = maxX;
      canvas.height = maxY;
    };
    window.addEventListener("resize", setCanvasSize);

    const explosions: ParticleType[] = [];
    const fireworks: FireworkType[] = [];

    const handleExplosion = (particles: ParticleType[]) => {
      explosions.push(...particles);
    };

    const launchFirework = () => {
      const x = rand(maxX * 0.1, maxX * 0.9);
      const y = maxY;
      const targetY = rand(maxY * 0.1, maxY * 0.4);
      const fireworkColor = getColor(color);
      const speed = getValueByRange(fireworkSpeed);
      const size = getValueByRange(fireworkSize);
      
      fireworks.push(
        createFirework(
          x,
          y,
          targetY,
          fireworkColor,
          speed,
          size,
          particleSpeed,
          particleSize,
          particlePool,
          handleExplosion
        )
      );
      
      const timeout = rand(300, 800) / population;
      setTimeout(launchFirework, timeout);
    };

    launchFirework();

    let animationFrameId: number;
    const animate = () => {
      // Clear with black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, maxX, maxY);

      // Draw all fireworks
      for (let i = fireworks.length - 1; i >= 0; i--) {
        const firework = fireworks[i];
        if (!firework?.update()) {
          fireworks.splice(i, 1);
        } else {
          firework.draw(ctx);
        }
      }

      // Batch draw particles
      for (let i = explosions.length - 1; i >= 0; i--) {
        const particle = explosions[i];
        if (!particle) continue;
        
        particle.update();
        
        if (particle.alive) {
          ctx.save();
          ctx.globalAlpha = particle.alpha;
          ctx.fillStyle = particle.color;
          ctx.translate(particle.x, particle.y);
          ctx.fill(particle.starPath);
          ctx.restore();
        } else {
          particlePool.release(particle);
          explosions.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleClick = (event: MouseEvent) => {
      const x = event.clientX;
      const y = maxY;
      const targetY = event.clientY;
      const fireworkColor = getColor(color);
      const speed = getValueByRange(fireworkSpeed);
      const size = getValueByRange(fireworkSize);
      
      fireworks.push(
        createFirework(
          x,
          y,
          targetY,
          fireworkColor,
          speed,
          size,
          particleSpeed,
          particleSize,
          particlePool,
          handleExplosion
        )
      );
    };

    container.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      container.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationFrameId);
      particlePool.releaseAll();
    };
  }, [
    population,
    color,
    fireworkSpeed,
    fireworkSize,
    particleSpeed,
    particleSize,
  ]);

  return (
    <div
      ref={containerRef}
      data-slot="fireworks-background"
      className={cn("relative size-full overflow-hidden", className)}
      {...props}
    >
      <canvas
        {...canvasProps}
        ref={canvasRef}
        className={cn("absolute inset-0 size-full", canvasProps?.className)}
      />
    </div>
  );
}

export { FireworksBackground, type FireworksBackgroundProps };