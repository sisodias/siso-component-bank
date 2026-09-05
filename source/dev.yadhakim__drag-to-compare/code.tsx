'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import '../../index.css';

/* ─── Types ─── */
interface Feature {
  label: string;
  left: string;
  right: string;
  icon: string;
}

interface Spark {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  hue: number;
}

/* ─── Data ─── */
const LEFT_PLAN = {
  name: 'Essentials',
  price: '$29',
  period: '/mo',
  badge: 'Individual',
  tagline: 'Everything you need to start building.',
  cta: 'Start Free Trial',
};

const RIGHT_PLAN = {
  name: 'Enterprise',
  price: '$149',
  period: '/mo',
  badge: 'Teams',
  tagline: 'Unlimited power for serious teams.',
  cta: 'Contact Sales',
};

const FEATURES: Feature[] = [
  { label: 'Projects', left: '5 projects', right: 'Unlimited', icon: '◆' },
  { label: 'Storage', left: '10 GB', right: '1 TB', icon: '▲' },
  { label: 'Team Members', left: '1 seat', right: 'Unlimited', icon: '●' },
  { label: 'API Access', left: 'REST only', right: 'REST + GraphQL', icon: '◇' },
  { label: 'Analytics', left: 'Basic', right: 'Advanced + AI', icon: '■' },
  { label: 'Support', left: 'Email', right: '24/7 Priority', icon: '★' },
  { label: 'Uptime SLA', left: '99.5%', right: '99.99%', icon: '⬡' },
  { label: 'Custom Domain', left: '—', right: 'Included', icon: '◎' },
];

/* ─── 3D Tilt Hook ─── */
function useTilt(ref: React.RefObject<HTMLDivElement | null>) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      setTilt({ rx: -y * 10, ry: x * 10 });
    },
    [ref]
  );
  const reset = useCallback(() => setTilt({ rx: 0, ry: 0 }), []);
  return { tilt, handleMove, reset };
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function InteractiveComparison() {
  const arenaRef = useRef<HTMLDivElement>(null);
  const [rift, setRift] = useState(0.5);
  const [dragging, setDragging] = useState(false);
  const [arenaH, setArenaH] = useState(500);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [picked, setPicked] = useState<'left' | 'right' | null>(null);
  const sparkId = useRef(0);
  const frame = useRef(0);

  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const lt = useTilt(leftRef);
  const rt = useTilt(rightRef);

  /* Measure */
  useEffect(() => {
    const m = () => {
      if (arenaRef.current) setArenaH(arenaRef.current.getBoundingClientRect().height);
    };
    m();
    window.addEventListener('resize', m);
    return () => window.removeEventListener('resize', m);
  }, []);

  /* Spark system */
  useEffect(() => {
    if (!dragging && sparks.length === 0) return;
    const tick = () => {
      setSparks((prev) => {
        let alive = prev
          .map((s) => ({ ...s, x: s.x + s.vx, y: s.y + s.vy, vy: s.vy + 0.015, life: s.life - 0.016 }))
          .filter((s) => s.life > 0);
        if (dragging && arenaRef.current) {
          const w = arenaRef.current.getBoundingClientRect().width;
          for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) {
            alive.push({
              id: ++sparkId.current,
              x: rift * w,
              y: Math.random() * arenaH,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 3,
              life: 0.4 + Math.random() * 0.6,
              size: 1.5 + Math.random() * 3,
              hue: Math.random() > 0.5 ? 195 + Math.random() * 30 : 12 + Math.random() * 20,
            });
          }
        }
        return alive;
      });
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [dragging, rift, arenaH, sparks.length]);

  /* Pointer handlers */
  const onDown = useCallback((e: React.PointerEvent) => {
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || !arenaRef.current) return;
      const r = arenaRef.current.getBoundingClientRect();
      setRift(Math.max(0.18, Math.min(0.82, (e.clientX - r.left) / r.width)));
    },
    [dragging]
  );

  const onUp = useCallback(() => setDragging(false), []);

  const lO = 0.55 + rift * 0.45;
  const rO = 0.55 + (1 - rift) * 0.45;

  return (
    <div className="rift-comparison">
      <div className="rift-grain" />

      {/* Header */}
      <header className="rift-header">
        <span className="rift-eyebrow">Interactive Comparison</span>
        <h1 className="rift-title">
          Choose Your <span className="rift-title-accent">Universe</span>
        </h1>
        <p className="rift-sub">Drag the rift to explore each dimension. Click a card to commit.</p>
      </header>

      {/* Arena */}
      <div
        ref={arenaRef}
        className="rift-arena"
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
      >
        {/* Backgrounds */}
        <div className="rift-atmo rift-atmo--left" style={{ clipPath: `inset(0 ${(1 - rift) * 100}% 0 0)`, opacity: lO }} />
        <div className="rift-atmo rift-atmo--right" style={{ clipPath: `inset(0 0 0 ${rift * 100}%)`, opacity: rO }} />

        {/* Left Card */}
        <div className="rift-side rift-side--left" style={{ width: `${rift * 100}%`, opacity: lO }}>
          <div
            ref={leftRef}
            className={`rift-card rift-card--cold ${picked === 'left' ? 'picked' : ''}`}
            style={{ transform: `perspective(900px) rotateX(${lt.tilt.rx}deg) rotateY(${lt.tilt.ry}deg)` }}
            onMouseMove={lt.handleMove}
            onMouseLeave={lt.reset}
            onClick={() => setPicked(picked === 'left' ? null : 'left')}
          >
            <div className="rift-card__shine rift-card__shine--cold" />
            <span className="rift-card__badge">{LEFT_PLAN.badge}</span>
            <h2 className="rift-card__name">{LEFT_PLAN.name}</h2>
            <div className="rift-card__price-row">
              <span className="rift-card__price rift-card__price--cold">{LEFT_PLAN.price}</span>
              <span className="rift-card__period">{LEFT_PLAN.period}</span>
            </div>
            <p className="rift-card__tagline">{LEFT_PLAN.tagline}</p>
            <button className="rift-cta rift-cta--cold">{LEFT_PLAN.cta}</button>
          </div>
        </div>

        {/* Right Card */}
        <div className="rift-side rift-side--right" style={{ width: `${(1 - rift) * 100}%`, opacity: rO }}>
          <div
            ref={rightRef}
            className={`rift-card rift-card--hot ${picked === 'right' ? 'picked' : ''}`}
            style={{ transform: `perspective(900px) rotateX(${rt.tilt.rx}deg) rotateY(${rt.tilt.ry}deg)` }}
            onMouseMove={rt.handleMove}
            onMouseLeave={rt.reset}
            onClick={() => setPicked(picked === 'right' ? null : 'right')}
          >
            <div className="rift-card__shine rift-card__shine--hot" />
            <span className="rift-card__badge rift-card__badge--hot">{RIGHT_PLAN.badge}</span>
            <h2 className="rift-card__name">{RIGHT_PLAN.name}</h2>
            <div className="rift-card__price-row">
              <span className="rift-card__price rift-card__price--hot">{RIGHT_PLAN.price}</span>
              <span className="rift-card__period">{RIGHT_PLAN.period}</span>
            </div>
            <p className="rift-card__tagline">{RIGHT_PLAN.tagline}</p>
            <button className="rift-cta rift-cta--hot">{RIGHT_PLAN.cta}</button>
          </div>
        </div>

        {/* Rift Divider */}
        <div className={`rift-divider ${dragging ? 'active' : ''}`} style={{ left: `${rift * 100}%` }} onPointerDown={onDown}>
          <div className="rift-divider__line" />
          <div className="rift-divider__energy" />
          <div className="rift-divider__handle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 12H4M4 12L7 9M4 12L7 15" />
              <path d="M16 12H20M20 12L17 9M20 12L17 15" />
            </svg>
          </div>
          <div className="rift-divider__glow" />
        </div>

        {/* Sparks */}
        <div className="rift-sparks">
          {sparks.map((s) => (
            <div
              key={s.id}
              className="rift-spark"
              style={{
                left: s.x,
                top: s.y,
                width: s.size,
                height: s.size,
                opacity: s.life,
                background: `hsl(${s.hue},80%,65%)`,
                boxShadow: `0 0 ${s.size * 3}px hsl(${s.hue},90%,55%)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Feature Rows */}
      <div className="rift-features">
        <div className="rift-features__head">
          <span className="rift-features__col-name" style={{ opacity: lO }}>{LEFT_PLAN.name}</span>
          <span className="rift-features__col-center">Features</span>
          <span className="rift-features__col-name" style={{ opacity: rO }}>{RIGHT_PLAN.name}</span>
        </div>

        {FEATURES.map((f, i) => (
          <div
            key={f.label}
            className={`rift-row ${hoveredRow === i ? 'hovered' : ''}`}
            style={{ animationDelay: `${i * 0.06}s` }}
            onMouseEnter={() => setHoveredRow(i)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            <span className="rift-row__left" style={{ opacity: lO }}>{f.left}</span>
            <span className="rift-row__center">
              <span className="rift-row__icon">{f.icon}</span>
              {f.label}
            </span>
            <span className="rift-row__right" style={{ opacity: rO }}>{f.right}</span>
            <div className="rift-row__bar">
              <div className="rift-row__fill rift-row__fill--cold" style={{ width: `${rift * 100}%` }} />
              <div className="rift-row__fill rift-row__fill--hot" style={{ width: `${(1 - rift) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Verdict */}
      <div className="rift-verdict">
        <div className="rift-verdict__dot" style={{ transform: `translateX(${(rift - 0.5) * 200}px)` }} />
        <span className="rift-verdict__text">
          {rift < 0.4 ? `Enterprise dominates` : rift > 0.6 ? `Essentials leads` : `Perfectly balanced`}
        </span>
      </div>
    </div>
  );
}