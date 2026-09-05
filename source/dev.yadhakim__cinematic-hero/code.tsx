'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../../index.css';

function AnimatedHeadline() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const words = ['Build', 'something', 'people', 'actually', 'remember.'];

  return (
    <h1 className="hero-headline">
      {words.map((word, i) => (
        <span
          key={i}
          className={`hero-word ${revealed ? 'hero-word--visible' : ''}`}
          style={{ transitionDelay: `${0.15 + i * 0.1}s` }}
        >
          {word === 'remember.' ? <em>{word}</em> : word}
        </span>
      ))}
    </h1>
  );
}

/* ─── Floating Orbs (Parallax Depth) ─── */
function DepthOrbs({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const orbs = [
    { size: 320, x: 15, y: 20, depth: 0.03, color: 'rgba(200, 170, 120, 0.07)' },
    { size: 200, x: 75, y: 65, depth: 0.05, color: 'rgba(140, 160, 180, 0.06)' },
    { size: 260, x: 60, y: 15, depth: 0.02, color: 'rgba(180, 150, 130, 0.05)' },
    { size: 150, x: 25, y: 70, depth: 0.04, color: 'rgba(160, 180, 160, 0.06)' },
  ];

  return (
    <div className="hero-orbs">
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="hero-orb"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            transform: `translate(${(mouseX - 0.5) * orb.depth * 100}px, ${(mouseY - 0.5) * orb.depth * 100}px)`,
          }}
        />
      ))}
    </div>
  );
}

function ScrollIndicator() {
  return (
    <div className="hero-scroll-indicator">
      <div className="hero-scroll-line">
        <div className="hero-scroll-dot" />
      </div>
      <span className="hero-scroll-text">Scroll to explore</span>
    </div>
  );
}


export default function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [loaded, setLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero-section"
      onMouseMove={handleMouseMove}
    >
      <div className="hero-grain" />
      <DepthOrbs mouseX={mousePos.x} mouseY={mousePos.y} />

      {/* Grid lines for depth */}
      <div className="hero-grid-lines">
        <div className="hero-grid-line hero-grid-line--v1" />
        <div className="hero-grid-line hero-grid-line--v2" />
        <div className="hero-grid-line hero-grid-line--h1" />
      </div>

      {/* Content */}
      <div className="hero-content">
        {/* Badge */}
        <div className={`hero-badge ${loaded ? 'hero-badge--visible' : ''}`}>
          <span className="hero-badge__dot" />
          <span className="hero-badge__text">Now available — Version 4.0</span>
        </div>

        {/* Headline */}
        <AnimatedHeadline />

        {/* Subtitle */}
        <p className={`hero-subtitle ${loaded ? 'hero-subtitle--visible' : ''}`}>
          The design system that bridges the gap between ambition and execution.
          Refined components, purposeful motion, zero compromise.
        </p>

        {/* CTAs */}
        <div className={`hero-ctas ${loaded ? 'hero-ctas--visible' : ''}`}>
          <button className="hero-cta hero-cta--primary">
            <span>Start Building</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <button className="hero-cta hero-cta--secondary">
            View Components
          </button>
        </div>

        {/* Social proof */}
        <div className={`hero-proof ${loaded ? 'hero-proof--visible' : ''}`}>
          <div className="hero-proof__avatars">
            {['EM', 'JW', 'AO', 'SC', 'LF'].map((initials, i) => (
              <div
                key={i}
                className="hero-proof__avatar"
                style={{ zIndex: 5 - i }}
              >
                {initials}
              </div>
            ))}
          </div>
          <div className="hero-proof__info">
            <div className="hero-proof__stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#d4a855" stroke="none">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="hero-proof__text">Trusted by 12,000+ developers</span>
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}