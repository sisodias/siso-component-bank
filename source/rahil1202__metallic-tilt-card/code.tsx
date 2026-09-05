'use client';

import React, { useEffect, useMemo, useRef } from 'react';

type Metal = 'gold' | 'silver' | 'bronze' | 'platinum';

export type MetallicTiltCardProps = {
  /** Metal finish */
  metal?: Metal;
  /** Card width in px (height follows aspect ratio 1.586) */
  width?: number;
  /** Corner radius in px */
  radius?: number;
  /** Max rotation in degrees (tilt) */
  maxRotation?: number;
  /** How far (px) the pointer can influence before easing back */
  influenceRadius?: number;
  /** Lerp easing (0..1), lower = smoother */
  ease?: number;
  /** Gradient follow factor (0..1) */
  lightFollow?: number;
  /** Force color mode, else follow system */
  mode?: 'light' | 'dark' | 'system';
  /** Extra class on wrapper */
  className?: string;
  /** ARIA label */
  ariaLabel?: string;
};

const METAL_BG: Record<Metal, string> = {
  gold: '#ffcc70',
  silver: '#dddde0',
  bronze: '#df9070',
  platinum: '#ffffff',
};

export default function MetallicTiltCard({
  metal = 'gold',
  width = 370,
  radius = 16,
  maxRotation = 40,
  influenceRadius = 500,
  ease = 0.08,
  lightFollow = 0.4,
  mode = 'system',
  className = '',
  ariaLabel = 'Metallic tilt card',
}: MetallicTiltCardProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // unique filter id per instance
  const ids = useMemo(() => {
    const k = Math.random().toString(36).slice(2, 8);
    return { noise: `noiseFilter-${k}` };
  }, []);

  // animation refs
  const current = useRef({ angle: 0, x: 0, y: 0 });
  const target = useRef({ angle: 0, x: 0, y: 0 });
  const currentG = useRef({ x: 50, y: 50 });
  const targetG = useRef({ x: 50, y: 50 });
  const rafRef = useRef<number | null>(null);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const applyVars = () => {
    const host = wrapRef.current;
    if (!host) return;
    host.style.setProperty('--gradient-rotation', `${current.current.angle}deg`);
    host.style.setProperty('--rotate-x', `${current.current.x}deg`);
    host.style.setProperty('--rotate-y', `${current.current.y}deg`);
    host.style.setProperty('--gradient-position-x', `${currentG.current.x}%`);
    host.style.setProperty('--gradient-position-y', `${currentG.current.y}%`);
  };

  const tick = () => {
    const t = ease;
    current.current.angle = lerp(current.current.angle, target.current.angle, t);
    current.current.x = lerp(current.current.x, target.current.x, t);
    current.current.y = lerp(current.current.y, target.current.y, t);
    currentG.current.x = lerp(currentG.current.x, targetG.current.x, t);
    currentG.current.y = lerp(currentG.current.y, targetG.current.y, t);

    applyVars();
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease]);

  const resetTargets = () => {
    target.current = { angle: 0, x: 0, y: 0 };
    targetG.current = { x: 50, y: 50 };
  };

  const handlePointer = (e: React.PointerEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    const inRange = dist < influenceRadius;
    const mult = Math.max(0.1, 1 - Math.min(1, dist / influenceRadius));

    const nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    if (inRange) {
      // gradient center (move opposite direction a bit)
      targetG.current.x = 50 - (nx - 0.5) * 100 * lightFollow;
      targetG.current.y = 50 - (ny - 0.5) * 100 * lightFollow;

      // tilt
      target.current.y = (nx - 0.5) * maxRotation * 2 * mult;
      target.current.x = (0.5 - ny) * maxRotation * 2 * mult;

      // conic rotation blending
      const angleTop = 120 * (1 - nx);
      const angleBottom = 120 * nx;
      target.current.angle = (angleTop * (1 - ny) + angleBottom * ny) * mult;
    } else {
      target.current.angle = 0;
    }
  };

  const wrapMode =
    mode === 'system' ? undefined : (mode as 'light' | 'dark'); // we add a data-theme attr

  const height = Math.round(width / 1.586);

  return (
    <div
      ref={wrapRef}
      data-theme={wrapMode}
      className={['metal-wrap', className].join(' ')}
      style={
        {
          '--bg-card': METAL_BG[metal],
          '--border-radius': `${radius}px`,
          '--noise-filter': `url(#${ids.noise})`,
        } as React.CSSProperties
      }
      aria-label={ariaLabel}
      role="region"
    >
      {/* Inline SVG defs for the noise filter (unique id per instance) */}
      <svg width="0" height="0" aria-hidden="true" focusable="false">
        <filter id={ids.noise} filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="linearRGB">
          <feTurbulence type="turbulence" baseFrequency="0.3" numOctaves="4" seed="15" stitchTiles="stitch" result="turbulence" />
          <feSpecularLighting surfaceScale="1" specularConstant="1.8" specularExponent="10" lightingColor="#7957A8" in="turbulence" result="specularLighting">
            <feDistantLight azimuth="3" elevation="50" />
          </feSpecularLighting>
          <feColorMatrix type="saturate" values="0" in="specularLighting" result="colormatrix" />
        </filter>
      </svg>

      <div
        ref={cardRef}
        className="card"
        style={{ width, height }}
        onPointerMove={handlePointer}
        onPointerLeave={resetTargets}
        onBlur={resetTargets}
      />

      <style jsx>{`
        .metal-wrap {
          --gradient-rotation: 0deg;
          --gradient-position-x: 50%;
          --gradient-position-y: 50%;
          --rotate-x: 0deg;
          --rotate-y: 0deg;

          display: grid;
          place-items: center;
          padding: 0;
          margin: 0;
          color-scheme: light dark;
        }

        /* Light/dark canvas around the card (optional) */
        .metal-wrap[data-theme='dark'] {
          background: #000;
        }
        .metal-wrap[data-theme='light'] {
          background: #fff;
        }

        .card {
          position: relative;
          border-radius: var(--border-radius);
          transform: rotateX(var(--rotate-x)) rotateY(var(--rotate-y));
          transform-style: preserve-3d;
          transition: transform 0.1s ease-out, box-shadow 0.2s ease-out;
          overflow: hidden;
          box-shadow: 0 10px 50px rgba(0, 0, 0, 0.25),
            inset -1px -1px 2px rgba(0, 0, 0, 0.3),
            inset 1px 1px 2px rgba(255, 255, 255, 0.3);
          background:
            radial-gradient(
              ellipse 160% 120% at var(--gradient-position-x) var(--gradient-position-y),
              transparent 0%,
              rgba(0, 0, 0, 1) 100%
            ),
            conic-gradient(
              from var(--gradient-rotation) at 50% 50%,
              rgba(0, 0, 0, 0.6) -120deg,
              rgba(255, 255, 255, 0.4) 9deg,
              rgba(0, 0, 0, 0.4) 60deg,
              rgba(0, 0, 0, 0.06) 107deg,
              rgba(0, 0, 0, 0.3) 131deg,
              rgba(0, 0, 0, 0) 188deg,
              rgba(0, 0, 0, 0.6) 240deg,
              rgba(255, 255, 255, 0.4) 367deg
            ),
            var(--bg-card);
        }

        .card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: var(--border-radius);
          filter: var(--noise-filter);
          opacity: 0.25;
          z-index: 1;
        }
        .card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: var(--border-radius);
          background: var(--bg-card);
          mix-blend-mode: color;
          z-index: 2;
        }
      `}</style>
    </div>
  );
}

export { MetallicTiltCard };
