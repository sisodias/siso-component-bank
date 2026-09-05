'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface AurigaHeroProps {
  darkCarImage?: string;
  ignitedCarImage?: string;
}

// Named export (for { AurigaHero } imports)
export function AurigaHero({
  darkCarImage = "https://d2nk5vmpy9.ufs.sh/f/PT3I6Zf4oEnUDS3VaCBBjFDndN4W5Zz0rPVbJkp9isw2GT8K",
  ignitedCarImage = "https://d2nk5vmpy9.ufs.sh/f/PT3I6Zf4oEnUSTgDmFpaXFY9idfwKUcpgnyA0G4Tl6WmejL5",
}: AurigaHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  const [mousePos, setMousePos] = useState({ x: -999, y: -999 });
  const [smoothPos, setSmoothPos] = useState({ x: -999, y: -999 });
  const [intensity, setIntensity] = useState(0);
  const [targetIntensity, setTargetIntensity] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [spotlightRadius, setSpotlightRadius] = useState(160);

  // Scale the spotlight radius to the viewport so it feels right on small screens
  useEffect(() => {
    const updateRadius = () => {
      const w = window.innerWidth;
      if (w < 480) setSpotlightRadius(90);
      else if (w < 768) setSpotlightRadius(120);
      else setSpotlightRadius(160);
    };
    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  const updatePointer = useCallback(
    (clientX: number, clientY: number) => {
      setMousePos({ x: clientX, y: clientY });
      setTargetIntensity(1);
      if (!hasEntered) {
        setSmoothPos({ x: clientX, y: clientY });
        setHasEntered(true);
      }
    },
    [hasEntered]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!heroRef.current) return;
      updatePointer(e.clientX, e.clientY);
    },
    [updatePointer]
  );

  // Touch support so the spotlight works on phones/tablets
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!heroRef.current) return;
      const t = e.touches[0];
      if (t) updatePointer(t.clientX, t.clientY);
    },
    [updatePointer]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const t = e.touches[0];
      if (t) updatePointer(t.clientX, t.clientY);
    },
    [updatePointer]
  );

  const handleMouseEnter = useCallback(() => {
    setTargetIntensity(1);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTargetIntensity(0);
  }, []);

  const toggleReveal = () => {
    setIsLocked(prev => !prev);
    if (!isLocked && revealRef.current) {
      revealRef.current.style.maskImage = 'none';
      revealRef.current.style.webkitMaskImage = 'none';
      revealRef.current.style.opacity = '1';
    } else if (revealRef.current) {
      setHasEntered(false);
      setIntensity(0);
      setTargetIntensity(0);
      revealRef.current.style.opacity = '0';
    }
  };

  // Animation
  useEffect(() => {
    let raf: number;
    const animate = () => {
      if (!isLocked) {
        setSmoothPos(p => ({
          x: p.x + (mousePos.x - p.x) * 0.12,
          y: p.y + (mousePos.y - p.y) * 0.12,
        }));

        setIntensity(p => Math.max(0, Math.min(1, p + (targetIntensity - p) * 0.09)));
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [mousePos, targetIntensity, isLocked]);

  // Spotlight mask
  useEffect(() => {
    const el = revealRef.current;
    if (!el || isLocked || intensity < 0.01 || !hasEntered) {
      if (el) {
        el.style.opacity = '0';
        el.style.maskImage = 'none';
        el.style.webkitMaskImage = 'none';
      }
      return;
    }

    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;

    const relX = smoothPos.x - rect.left;
    const relY = smoothPos.y - rect.top;

    const mask = `radial-gradient(circle ${spotlightRadius}px at ${relX}px ${relY}px, 
      rgba(255,255,255,${intensity}) 0%, 
      rgba(255,255,255,${intensity * 0.9}) 35%, 
      rgba(255,255,255,${intensity * 0.6}) 60%, 
      rgba(255,255,255,${intensity * 0.25}) 78%, 
      transparent 100%)`;

    el.style.maskImage = mask;
    el.style.webkitMaskImage = mask;
    el.style.opacity = '1';
  }, [smoothPos, intensity, isLocked, hasEntered, spotlightRadius]);

  const navItems = ['Models', 'Configurator', 'Heritage', 'Ownership', 'Book a Drive'];

  return (
    <div className="relative min-h-[100svh] bg-black overflow-hidden font-sans">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 sm:w-[26px] sm:h-[26px]"
              viewBox="0 0 256 256"
              fill="#000"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
            </svg>
          </div>
          <span className="text-white text-2xl sm:text-3xl font-serif italic">Auriga</span>
        </div>

        {/* Desktop nav pill */}
        <div className="hidden lg:flex bg-white/10 backdrop-blur-xl border border-white/30 rounded-full px-2 py-1.5">
          {navItems.map((label, i) => (
            <button
              key={i}
              className={`px-4 xl:px-6 py-2.5 text-sm font-medium rounded-full transition-colors ${
                i === 0 ? 'bg-white/20 text-white' : 'text-white/80 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <button className="hidden lg:block bg-white hover:bg-gray-100 text-black font-semibold px-6 xl:px-8 py-3 xl:py-3.5 rounded-full text-sm transition">
          Reserve Yours
        </button>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileNavOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={mobileNavOpen}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 text-white"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileNavOpen ? (
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu panel */}
      {mobileNavOpen && (
        <div className="fixed top-16 sm:top-20 left-4 right-4 z-40 lg:hidden bg-black/80 backdrop-blur-xl border border-white/20 rounded-3xl p-3 flex flex-col gap-1">
          {navItems.map((label, i) => (
            <button
              key={i}
              onClick={() => setMobileNavOpen(false)}
              className={`w-full text-left px-5 py-3 text-base font-medium rounded-2xl transition-colors ${
                i === 0 ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
          <button className="mt-2 w-full bg-white hover:bg-gray-100 text-black font-semibold px-6 py-3.5 rounded-2xl text-sm transition">
            Reserve Yours
          </button>
        </div>
      )}

      {/* Hero */}
      <div
        ref={heroRef}
        className="relative h-[100svh] w-full touch-none"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* Dark Base Car */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{ backgroundImage: `url(${darkCarImage})` }}
        />

        {/* Ignited Reveal Layer */}
        <div
          ref={revealRef}
          className="absolute inset-0 bg-cover bg-center transition-opacity"
          style={{ backgroundImage: `url(${ignitedCarImage})` }}
        />

        {/* Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-4 sm:px-6">
          <h1 className="text-white text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif tracking-tighter leading-[0.95]">
            <span className="italic block">Unleash the</span>
            <span className="block -mt-1 sm:-mt-2">raging storm</span>
          </h1>
        </div>

        {/* Copy + CTA */}
        <div className="absolute bottom-24 sm:bottom-20 left-4 right-4 sm:left-auto sm:right-10 sm:max-w-xs z-20 text-center sm:text-left">
          <p className="text-white/80 text-sm mb-4 sm:mb-6 leading-relaxed max-w-md mx-auto sm:max-w-none">
            Configure your own beast from the ground up, choosing every detail from the roar of the engine to the stitching of the seats.
          </p>
          <button
            onClick={toggleReveal}
            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 active:scale-95 transition-all px-8 sm:px-10 py-4 rounded-full text-white font-medium text-sm"
          >
            {isLocked ? 'Extinguish' : 'Ignite Now'}
          </button>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />
      </div>
    </div>
  );
}

// Also support default export
export default AurigaHero;