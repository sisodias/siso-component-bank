'use client';
import React, { useState, useEffect, useRef } from 'react';
import '../../index.css';

/* ─── Mini Visualizations ─── */
function PulseRing() {
  return (
    <div className="bento-viz bento-viz--pulse">
      {[0, 1, 2].map((i) => (
        <div key={i} className="bento-pulse-ring" style={{ animationDelay: `${i * 0.6}s` }} />
      ))}
      <div className="bento-pulse-dot" />
    </div>
  );
}

function BarChart() {
  const bars = [65, 40, 85, 55, 75, 45, 90, 60];
  return (
    <div className="bento-viz bento-viz--bars">
      {bars.map((h, i) => (
        <div
          key={i}
          className="bento-bar"
          style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }}
        />
      ))}
    </div>
  );
}

function OrbitDots() {
  return (
    <div className="bento-viz bento-viz--orbit">
      <div className="bento-orbit-center" />
      <div className="bento-orbit-ring bento-orbit-ring--1">
        <div className="bento-orbit-dot" />
      </div>
      <div className="bento-orbit-ring bento-orbit-ring--2">
        <div className="bento-orbit-dot bento-orbit-dot--sm" />
      </div>
    </div>
  );
}

function GridPattern() {
  return (
    <div className="bento-viz bento-viz--grid">
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className="bento-grid-cell"
          style={{ animationDelay: `${i * 0.05}s` }}
        />
      ))}
    </div>
  );
}

function WaveLines() {
  return (
    <svg className="bento-viz bento-viz--wave" viewBox="0 0 200 80" fill="none">
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          className="bento-wave-path"
          d={`M0 ${40 + i * 8} Q50 ${20 + i * 8} 100 ${40 + i * 8} Q150 ${60 + i * 8} 200 ${40 + i * 8}`}
          stroke="currentColor"
          strokeWidth="1.5"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}
    </svg>
  );
}

function CounterUp() {
  const [count, setCount] = useState(0);
  const target = 98.7;

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / 1500, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * target).toFixed(1)));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="bento-viz bento-viz--counter">
      <span className="bento-counter-num">{count}%</span>
      <span className="bento-counter-label">Uptime</span>
    </div>
  );
}

/* ─── Cell Data ─── */
interface BentoCell {
  title: string;
  description: string;
  span: string;
  viz: React.ReactNode;
}

const cells: BentoCell[] = [
  {
    title: 'Real-time Analytics',
    description: 'Live dashboards that update as your data streams in. No refresh needed.',
    span: 'bento-cell--wide',
    viz: <BarChart />,
  },
  {
    title: 'Global CDN',
    description: 'Deployed across 40+ edge locations worldwide.',
    span: 'bento-cell--tall',
    viz: <PulseRing />,
  },
  {
    title: 'Integrations',
    description: 'Connect with your existing stack in minutes.',
    span: '',
    viz: <OrbitDots />,
  },
  {
    title: 'Design Tokens',
    description: 'Systematic color, spacing, and typography primitives.',
    span: '',
    viz: <GridPattern />,
  },
  {
    title: 'Performance',
    description: 'Lighthouse scores that make your competitors nervous.',
    span: '',
    viz: <CounterUp />,
  },
  {
    title: 'Adaptive Layout',
    description: 'Fluid components that respond to any viewport.',
    span: 'bento-cell--wide',
    viz: <WaveLines />,
  },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function BentoGrid() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="bento-section">
      <div className="bento-grain" />

      <header className="bento-header">
        <span className="bento-header__eyebrow">
          <span className="bento-header__line" />
          Features
          <span className="bento-header__line" />
        </span>
        <h2 className="bento-header__title">
          Everything you need,<br /><em>nothing you don&rsquo;t</em>
        </h2>
        <p className="bento-header__sub">
          A purposefully curated set of tools designed to help you ship faster.
        </p>
      </header>

      <div className="bento-grid">
        {cells.map((cell, i) => (
          <div
            key={cell.title}
            className={`bento-cell ${cell.span} ${loaded ? 'bento-cell--visible' : ''}`}
            style={{ transitionDelay: `${0.1 + i * 0.08}s` }}
          >
            <div className="bento-cell__viz-area">
              {cell.viz}
            </div>
            <div className="bento-cell__content">
              <h3 className="bento-cell__title">{cell.title}</h3>
              <p className="bento-cell__desc">{cell.description}</p>
            </div>
            <div className="bento-cell__hover-accent" />
          </div>
        ))}
      </div>
    </section>
  );
}