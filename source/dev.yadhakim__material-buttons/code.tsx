'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import '../../index.css';

/* ─── Types ─── */
interface MousePos {
  x: number;
  y: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocityX: number;
  velocityY: number;
  life: number;
}

/* ─── Shared Mouse Hook ─── */
function useMouseTrack(ref: React.RefObject<HTMLButtonElement | null>) {
  const [pos, setPos] = useState<MousePos>({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, [ref]);

  return { pos, isHovered, setIsHovered, handleMove };
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   BUTTON 1 — LIQUID GLASS
   Iridescent glassmorphism with specular tracking
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function LiquidGlassButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { pos, isHovered, setIsHovered, handleMove } = useMouseTrack(ref);

  return (
    <button
      ref={ref}
      className="btn-base btn-liquid-glass"
      onMouseMove={handleMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--mx': pos.x,
        '--my': pos.y,
        '--active': isHovered ? 1 : 0,
      } as React.CSSProperties}
    >
      <span className="btn-liquid-glass__specular" />
      <span className="btn-liquid-glass__iridescence" />
      <span className="btn-liquid-glass__edge" />
      <span className="btn-liquid-glass__text">{children}</span>
    </button>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   BUTTON 2 — MOLTEN CORE
   Obsidian surface with glowing lava cracks
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function MoltenCoreButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { pos, isHovered, setIsHovered, handleMove } = useMouseTrack(ref);

  return (
    <button
      ref={ref}
      className="btn-base btn-molten"
      onMouseMove={handleMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--mx': pos.x,
        '--my': pos.y,
        '--active': isHovered ? 1 : 0,
      } as React.CSSProperties}
    >
      <span className="btn-molten__surface" />
      <span className="btn-molten__cracks" />
      <span className="btn-molten__glow" />
      <span className="btn-molten__heat-distort" />
      <span className="btn-molten__text">{children}</span>
    </button>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   BUTTON 3 — MAGNETIC PULSE
   Electromagnetic field rings that radiate on hover
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function MagneticPulseButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { pos, isHovered, setIsHovered, handleMove } = useMouseTrack(ref);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const rippleId = useRef(0);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const id = ++rippleId.current;
    setRipples((prev) => [
      ...prev,
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
    ]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 1000);
  }, []);

  return (
    <button
      ref={ref}
      className="btn-base btn-magnetic"
      onMouseMove={handleMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{
        '--mx': pos.x,
        '--my': pos.y,
        '--active': isHovered ? 1 : 0,
      } as React.CSSProperties}
    >
      <span className="btn-magnetic__field" />
      <span className="btn-magnetic__core" />
      {ripples.map((r) => (
        <span
          key={r.id}
          className="btn-magnetic__ripple"
          style={{ left: r.x, top: r.y }}
        />
      ))}
      <span className="btn-magnetic__text">{children}</span>
    </button>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   BUTTON 4 — EMBER
   Smoldering edges with floating spark particles
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function EmberButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { pos, isHovered, setIsHovered, handleMove } = useMouseTrack(ref);
  const [particles, setParticles] = useState<Particle[]>([]);
  const frameRef = useRef<number>(0);
  const particleId = useRef(0);

  useEffect(() => {
    if (!isHovered) {
      setParticles([]);
      return;
    }

    const spawn = () => {
      setParticles((prev) => {
        const alive = prev
          .map((p) => ({
            ...p,
            x: p.x + p.velocityX,
            y: p.y + p.velocityY,
            life: p.life - 0.02,
            opacity: Math.max(0, p.life - 0.02),
          }))
          .filter((p) => p.life > 0);

        if (Math.random() > 0.4) {
          const edge = Math.random();
          let x: number, y: number;
          if (edge < 0.25) { x = Math.random() * 100; y = 0; }
          else if (edge < 0.5) { x = Math.random() * 100; y = 100; }
          else if (edge < 0.75) { x = 0; y = Math.random() * 100; }
          else { x = 100; y = Math.random() * 100; }

          alive.push({
            id: ++particleId.current,
            x,
            y,
            size: 1.5 + Math.random() * 2.5,
            opacity: 0.8 + Math.random() * 0.2,
            velocityX: (Math.random() - 0.5) * 0.8,
            velocityY: -(0.3 + Math.random() * 1.2),
            life: 0.6 + Math.random() * 0.4,
          });
        }

        return alive;
      });

      frameRef.current = requestAnimationFrame(spawn);
    };

    frameRef.current = requestAnimationFrame(spawn);
    return () => cancelAnimationFrame(frameRef.current);
  }, [isHovered]);

  return (
    <button
      ref={ref}
      className="btn-base btn-ember"
      onMouseMove={handleMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--mx': pos.x,
        '--my': pos.y,
        '--active': isHovered ? 1 : 0,
      } as React.CSSProperties}
    >
      <span className="btn-ember__smolder" />
      <span className="btn-ember__glow" />
      <div className="btn-ember__particles">
        {particles.map((p) => (
          <span
            key={p.id}
            className="btn-ember__spark"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>
      <span className="btn-ember__text">{children}</span>
    </button>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   BUTTON 5 — VOID
   Gravitational singularity with event horizon glow
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function VoidButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { pos, isHovered, setIsHovered, handleMove } = useMouseTrack(ref);

  return (
    <button
      ref={ref}
      className="btn-base btn-void"
      onMouseMove={handleMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--mx': pos.x,
        '--my': pos.y,
        '--active': isHovered ? 1 : 0,
      } as React.CSSProperties}
    >
      <span className="btn-void__event-horizon" />
      <span className="btn-void__singularity" />
      <span className="btn-void__accretion" />
      <span className="btn-void__stars" />
      <span className="btn-void__text">{children}</span>
    </button>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   BUTTON 6 — PRISMATIC
   Light dispersion / rainbow refraction on movement
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function PrismaticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { pos, isHovered, setIsHovered, handleMove } = useMouseTrack(ref);

  return (
    <button
      ref={ref}
      className="btn-base btn-prismatic"
      onMouseMove={handleMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--mx': pos.x,
        '--my': pos.y,
        '--active': isHovered ? 1 : 0,
      } as React.CSSProperties}
    >
      <span className="btn-prismatic__surface" />
      <span className="btn-prismatic__rainbow" />
      <span className="btn-prismatic__flare" />
      <span className="btn-prismatic__text">{children}</span>
    </button>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN SHOWCASE COMPONENT
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function MaterialButtons() {
  return (
    <div className="material-buttons-showcase">
      <div className="showcase-grain" />

      <header className="showcase-header">
        <span className="showcase-eyebrow">Component Library</span>
        <h1 className="showcase-title">Material Buttons</h1>
        <p className="showcase-subtitle">
          Six handcrafted interactions. Each button simulates a physical phenomenon
          with cursor-tracking precision.
        </p>
      </header>

      <div className="showcase-grid">
        <div className="showcase-card">
          <span className="showcase-card__label">01 — Liquid Glass</span>
          <LiquidGlassButton>Get Started</LiquidGlassButton>
          <span className="showcase-card__hint">Iridescent specular tracking</span>
        </div>

        <div className="showcase-card">
          <span className="showcase-card__label">02 — Molten Core</span>
          <MoltenCoreButton>Explore</MoltenCoreButton>
          <span className="showcase-card__hint">Volcanic fracture glow</span>
        </div>

        <div className="showcase-card">
          <span className="showcase-card__label">03 — Magnetic Pulse</span>
          <MagneticPulseButton>Activate</MagneticPulseButton>
          <span className="showcase-card__hint">Electromagnetic field ripples</span>
        </div>

        <div className="showcase-card">
          <span className="showcase-card__label">04 — Ember</span>
          <EmberButton>Ignite</EmberButton>
          <span className="showcase-card__hint">Particle spark system</span>
        </div>

        <div className="showcase-card">
          <span className="showcase-card__label">05 — Void</span>
          <VoidButton>Enter</VoidButton>
          <span className="showcase-card__hint">Gravitational singularity</span>
        </div>

        <div className="showcase-card">
          <span className="showcase-card__label">06 — Prismatic</span>
          <PrismaticButton>Discover</PrismaticButton>
          <span className="showcase-card__hint">Light dispersion refraction</span>
        </div>
      </div>
    </div>
  );
}