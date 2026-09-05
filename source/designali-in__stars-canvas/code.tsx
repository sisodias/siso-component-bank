'use client';
import { useEffect, useRef } from 'react';

interface StarsCanvasProps {
  transparent?: boolean;       // Background transparency
  maxStars?: number;           // Total number of stars
  hue?: number;                // Color hue for the stars
  brightness?: number;         // Overall star brightness (0–1)
  speedMultiplier?: number;    // Global animation speed multiplier
  twinkleIntensity?: number;   // How often stars twinkle
  className?: string;          // Custom class for the canvas
  paused?: boolean;            // Pause animation toggle
}

export function StarsCanvas({
  transparent = false,
  maxStars = 1200,
  hue = 217,
  brightness = 10,
  speedMultiplier = 1,
  twinkleIntensity = 20,
  className = '',
  paused = false,
}: StarsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    let stars: Star[] = [];
    let count = 0;

    // --- Cached gradient texture ---
    const canvas2 = document.createElement('canvas');
    const ctx2 = canvas2.getContext('2d')!;
    canvas2.width = 100;
    canvas2.height = 100;
    const half = canvas2.width / 2;
    const gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
    gradient2.addColorStop(0.025, '#fff');
    gradient2.addColorStop(0.1, `hsl(${hue}, 61%, 33%)`);
    gradient2.addColorStop(0.25, `hsl(${hue}, 64%, 6%)`);
    gradient2.addColorStop(1, 'transparent');
    ctx2.fillStyle = gradient2;
    ctx2.beginPath();
    ctx2.arc(half, half, half, 0, Math.PI * 2);
    ctx2.fill();

    // --- Utility functions ---
    const random = (min: number, max?: number) => {
      if (max === undefined) {
        max = min;
        min = 0;
      }
      if (min > max) [min, max] = [max, min];
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const maxOrbit = (x: number, y: number) => {
      const max = Math.max(x, y);
      const diameter = Math.round(Math.sqrt(max * max + max * max));
      return diameter / 2;
    };

    // --- Star class ---
    class Star {
      orbitRadius: number;
      radius: number;
      orbitX: number;
      orbitY: number;
      timePassed: number;
      speed: number;
      alpha: number;

      constructor() {
        this.orbitRadius = random(maxOrbit(w, h));
        this.radius = random(60, this.orbitRadius) / 12;
        this.orbitX = w / 2;
        this.orbitY = h / 2;
        this.timePassed = random(0, maxStars);
        this.speed = (random(this.orbitRadius) / 50000) * speedMultiplier;
        this.alpha = (random(2, 10) / 10) * brightness;
        count++;
        stars[count] = this;
      }

      draw() {
        const x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX;
        const y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY;
        const twinkle = random(twinkleIntensity);

        if (twinkle === 1 && this.alpha > 0) {
          this.alpha -= 0.05;
        } else if (twinkle === 2 && this.alpha < 1) {
          this.alpha += 0.05;
        }

        ctx.globalAlpha = this.alpha;
        ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
        this.timePassed += this.speed;
      }
    }

    for (let i = 0; i < maxStars; i++) new Star();

    // --- Animation loop ---
    const animate = () => {
      if (paused) return; // Skip if paused

      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = transparent ? 'hsla(217, 64%, 6%, 0)' : 'hsla(217, 64%, 6%, 1)';
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'lighter';
      for (let i = 1; i < stars.length; i++) {
        stars[i].draw();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    // --- Resize handling ---
    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationRef.current!);
      window.removeEventListener('resize', handleResize);
    };
  }, [transparent, maxStars, hue, brightness, speedMultiplier, twinkleIntensity, paused]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full ${className}`}
      style={{ display: 'block' }}
    />
  );
}
