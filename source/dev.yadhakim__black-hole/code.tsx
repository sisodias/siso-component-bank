"use client";

import { cn } from "@/lib/utils";
import { useRef, useEffect, useCallback, type ReactNode } from "react";

interface BlackHoleProps {
  children?: ReactNode;
  className?: string;
  /** Number of background stars */
  starCount?: number;
  /** Black hole mass (affects lensing radius) */
  mass?: number;
  /** Accretion disk enabled */
  accretionDisk?: boolean;
  /** Accretion disk color inner */
  diskColorHot?: string;
  /** Accretion disk color outer */
  diskColorCool?: string;
  /** Disk rotation speed */
  diskSpeed?: number;
  /** Number of disk particles */
  diskParticles?: number;
  /** Background color */
  backgroundColor?: string;
  /** Mouse controls black hole position */
  interactive?: boolean;
  /** Lensing strength */
  lensingPower?: number;
}

interface Star {
  ox: number; // original x (0-1)
  oy: number; // original y (0-1)
  size: number;
  brightness: number;
  color: number; // temperature (0=cool blue, 1=warm yellow)
}

interface DiskParticle {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  brightness: number;
  offset: number; // vertical wobble
}

export function Component({
  children,
  className,
  starCount = 500,
  mass = 1,
  accretionDisk = true,
  diskColorHot = "255,200,100",
  diskColorCool = "255,80,20",
  diskSpeed = 1,
  diskParticles = 300,
  backgroundColor = "#000000",
  interactive = true,
  lensingPower = 1,
}: BlackHoleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const diskRef = useRef<DiskParticle[]>([]);
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: false });
  const timeRef = useRef(0);
  const posRef = useRef({ x: 0.5, y: 0.5 }); // smoothed BH position

  // Init stars
  useEffect(() => {
    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        ox: Math.random(),
        oy: Math.random(),
        size: 0.3 + Math.random() * 2,
        brightness: 0.2 + Math.random() * 0.8,
        color: Math.random(),
      });
    }
    starsRef.current = stars;

    // Disk particles
    if (accretionDisk) {
      const dp: DiskParticle[] = [];
      for (let i = 0; i < diskParticles; i++) {
        const r = 0.08 + Math.random() * 0.12;
        dp.push({
          angle: Math.random() * Math.PI * 2,
          radius: r,
          speed: (0.3 / (r * r)) * 0.001 * diskSpeed,
          size: 0.5 + Math.random() * 2,
          brightness: 0.3 + Math.random() * 0.7,
          offset: (Math.random() - 0.5) * 0.01,
        });
      }
      diskRef.current = dp;
    }
  }, [starCount, accretionDisk, diskParticles, diskSpeed]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    const w = Math.floor(cw * dpr);
    const h = Math.floor(ch * dpr);

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    timeRef.current += 0.016;
    const t = timeRef.current;

    // Smooth black hole position toward mouse
    const target = mouseRef.current.active && interactive
      ? { x: mouseRef.current.x, y: mouseRef.current.y }
      : { x: 0.5 + Math.sin(t * 0.15) * 0.05, y: 0.5 + Math.cos(t * 0.2) * 0.03 };

    posRef.current.x += (target.x - posRef.current.x) * 0.05;
    posRef.current.y += (target.y - posRef.current.y) * 0.05;

    const bhx = posRef.current.x * w;
    const bhy = posRef.current.y * h;
    const minDim = Math.min(w, h);
    const eventHorizonR = minDim * 0.06 * mass;
    const photonSphereR = eventHorizonR * 1.5;
    const lensingR = minDim * 0.35 * mass * lensingPower;

    // Clear
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, w, h);

    // ── Draw lensed stars ──
    const stars = starsRef.current;

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      let sx = s.ox * w;
      let sy = s.oy * h;

      // Gravitational lensing
      const dx = sx - bhx;
      const dy = sy - bhy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < lensingR && dist > 1) {
        const normDist = dist / lensingR;

        // Einstein ring deflection
        // Stars close to BH get pushed outward around it
        const deflection = (1 - normDist) * (1 - normDist);
        const angle = Math.atan2(dy, dx);

        // Tangential displacement — creates the ring effect
        const tangentStrength = deflection * lensingR * 0.4;
        const radialPush = deflection * lensingR * 0.15;

        sx += Math.cos(angle) * radialPush + Math.cos(angle + Math.PI * 0.5) * tangentStrength * Math.sin(angle * 2 + t * 0.3);
        sy += Math.sin(angle) * radialPush + Math.sin(angle + Math.PI * 0.5) * tangentStrength * Math.sin(angle * 2 + t * 0.3);

        // Amplification — stars near Einstein ring get brighter
        const amplification = 1 + deflection * 3;

        // Don't draw inside event horizon
        const newDx = sx - bhx;
        const newDy = sy - bhy;
        const newDist = Math.sqrt(newDx * newDx + newDy * newDy);
        if (newDist < eventHorizonR) continue;

        // Color by temperature
        const r = s.color > 0.5 ? 255 : 180 + s.color * 150;
        const g = s.color > 0.5 ? 200 + (1 - s.color) * 55 : 200;
        const b = s.color < 0.5 ? 255 : 200 + (1 - s.color) * 55;
        const alpha = Math.min(1, s.brightness * amplification);

        const drawSize = s.size * dpr * (1 + deflection * 1.5);

        ctx.beginPath();
        ctx.arc(sx, sy, drawSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${alpha})`;
        ctx.fill();

        // Bloom on bright amplified stars
        if (amplification > 2) {
          ctx.beginPath();
          ctx.arc(sx, sy, drawSize * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${alpha * 0.1})`;
          ctx.fill();
        }
      } else {
        // Normal star
        const r = s.color > 0.5 ? 255 : 180 + s.color * 150;
        const g = 200;
        const b = s.color < 0.5 ? 255 : 200;
        const twinkle = 0.7 + Math.sin(t * 1.5 + i * 3.7) * 0.3;

        ctx.beginPath();
        ctx.arc(sx, sy, s.size * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.round(r)},${g},${Math.round(b)},${s.brightness * twinkle})`;
        ctx.fill();
      }
    }

    // ── Accretion disk (behind BH) ──
    if (accretionDisk) {
      const dp = diskRef.current;

      // Sort by "y" relative to BH to draw back-to-front
      const sorted = dp
        .map((p, idx) => {
          p.angle += p.speed;
          const px = bhx + Math.cos(p.angle) * p.radius * w;
          // Elliptical — seen at an angle
          const rawY = Math.sin(p.angle) * p.radius * w * 0.3 + p.offset * w;
          const py = bhy + rawY;
          return { p, px, py, rawY, idx };
        })
        .sort((a, b) => a.rawY - b.rawY);

      for (const { p, px, py, rawY } of sorted) {
        // Skip particles behind the event horizon (in front of BH visually)
        const pdx = px - bhx;
        const pdy = py - bhy;
        const pDist = Math.sqrt(pdx * pdx + pdy * pdy);

        // Behind the BH — draw before BH
        const isBehind = rawY < 0;

        if (!isBehind && pDist < eventHorizonR * 0.9) continue;

        // Color by radius — inner is hotter
        const heat = 1 - ((p.radius - 0.08) / 0.12);
        const r = heat > 0.5 ? 255 : Math.round(200 + heat * 110);
        const g = Math.round(80 + heat * 150);
        const b = Math.round(20 + heat * 40);

        // Doppler — approaching side brighter
        const doppler = 1 + Math.cos(p.angle) * 0.4;
        const alpha = p.brightness * doppler * (0.4 + heat * 0.6);

        const size = p.size * dpr * (0.5 + heat * 1);

        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, alpha)})`;
        ctx.fill();
      }
    }

    // ── Event horizon (pure black) ──
    ctx.beginPath();
    ctx.arc(bhx, bhy, eventHorizonR, 0, Math.PI * 2);
    ctx.fillStyle = "#000000";
    ctx.fill();

    // ── Photon sphere ring ──
    const ringGrad = ctx.createRadialGradient(
      bhx, bhy, eventHorizonR * 0.95,
      bhx, bhy, photonSphereR * 1.3
    );
    ringGrad.addColorStop(0, "rgba(255,180,80,0)");
    ringGrad.addColorStop(0.3, "rgba(255,160,60,0.12)");
    ringGrad.addColorStop(0.6, "rgba(255,120,40,0.06)");
    ringGrad.addColorStop(1, "rgba(255,80,20,0)");

    ctx.beginPath();
    ctx.arc(bhx, bhy, photonSphereR * 1.3, 0, Math.PI * 2);
    ctx.fillStyle = ringGrad;
    ctx.fill();

    // ── Inner glow at edge of event horizon ──
    const edgeGrad = ctx.createRadialGradient(
      bhx, bhy, eventHorizonR * 0.9,
      bhx, bhy, eventHorizonR * 1.15
    );
    edgeGrad.addColorStop(0, "rgba(0,0,0,1)");
    edgeGrad.addColorStop(0.5, "rgba(255,150,50,0.15)");
    edgeGrad.addColorStop(1, "rgba(255,100,30,0)");

    ctx.beginPath();
    ctx.arc(bhx, bhy, eventHorizonR * 1.15, 0, Math.PI * 2);
    ctx.fillStyle = edgeGrad;
    ctx.fill();

    // ── Space distortion rings (subtle) ──
    for (let ring = 0; ring < 3; ring++) {
      const rr = photonSphereR * (1.5 + ring * 0.8);
      const wobble = Math.sin(t * 0.5 + ring) * 2;
      ctx.beginPath();
      ctx.arc(bhx + wobble, bhy, rr, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(100,150,255,${0.03 - ring * 0.008})`;
      ctx.lineWidth = 1 * dpr;
      ctx.stroke();
    }

    animRef.current = requestAnimationFrame(draw);
  }, [mass, accretionDisk, backgroundColor, interactive, lensingPower, diskSpeed]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

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