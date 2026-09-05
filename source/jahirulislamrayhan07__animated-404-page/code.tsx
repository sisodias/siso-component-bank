"use client";

import Link from "next/link";
import React, { useEffect, useId, useRef, useState } from 'react';
import { useAnimationFrame } from 'framer-motion';

const WORD = '404';

// 3-level amplitude ramp — 1 level/sec up, 2.5/sec down.
const LEVEL_COUNT       = 1;
const LEVEL_RAMP        = 1.0;
const LEVEL_DECAY       = 2.5;
const MAX_SCALE         = 36;
const OSCILLATION_HZ    = 0.09;
const REST_FREQ         = 0.001;
const HOVER_FREQ        = 0.009;
const RIPPLE_PHASE_RATE = 0.9;

const FAN_FULL_RATE = (Math.PI * 2) / 0.6;
const FAN_REDUCED_RATE = (Math.PI * 2) / 2.0;

export function Component() {
  const bg = '#09090b';
  const fg = '#ffffff';
  const fanStroke = '#ffffff';

  const uid = useId().replace(/:/g, '-');
  const filterId = `ripple-${uid}`;
  const turbRef  = useRef<SVGFETurbulenceElement>(null);
  const dispRef  = useRef<SVGFEDisplacementMapElement>(null);
  const bladesRef = useRef<SVGGElement>(null);

  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const [fanOn, setFanOn] = useState(false);
  const fanOnRef = useRef(false);
  useEffect(() => { fanOnRef.current = fanOn; }, [fanOn]);

  const levelRef      = useRef(0);
  const fanAngleRef   = useRef(0);
  const ripplePhaseRef = useRef(0);
  const lastTimeRef   = useRef<number | null>(null);
  const textSvgRef    = useRef<SVGSVGElement>(null);

  useAnimationFrame((t) => {
    const turb  = turbRef.current;
    const disp  = dispRef.current;
    const blades = bladesRef.current;
    if (!turb || !disp) return;

    const last = lastTimeRef.current;
    const dt = last == null ? 0 : Math.max(0, Math.min(0.05, (t - last) / 1000));
    lastTimeRef.current = t;

    if (fanOnRef.current) {
      levelRef.current = Math.min(LEVEL_COUNT, levelRef.current + LEVEL_RAMP * dt);
    } else {
      levelRef.current = Math.max(0, levelRef.current - LEVEL_DECAY * dt);
    }

    const intensity = levelRef.current / LEVEL_COUNT;

    const secs = t / 1000;
    const breath = Math.sin(secs * Math.PI * 2 * OSCILLATION_HZ);

    const peakScale = reducedMotion ? 14 : MAX_SCALE;
    const scale = intensity * peakScale;
    const freq  = Math.max(0.002,
      REST_FREQ + (HOVER_FREQ - REST_FREQ) * intensity + 0.004 * breath * intensity
    );

    ripplePhaseRef.current += intensity * RIPPLE_PHASE_RATE * dt;
    const p = ripplePhaseRef.current;
    const liveFreqX = Math.max(0.002, freq + 0.007 * Math.sin(p) * intensity);
    const liveFreqY = Math.max(0.002, 0.028 + 0.012 * Math.sin(p * 1.4 + 1) * intensity);
    turb.setAttribute('baseFrequency', `${liveFreqX} ${liveFreqY}`);
    disp.setAttribute('scale', String(scale));

    const textSvgEl = textSvgRef.current;
    if (textSvgEl) {
      const skew = reducedMotion ? 0 : intensity * 13;
      textSvgEl.style.transform = `skewX(${skew}deg)`;
    }

    if (blades) {
      const rate = reducedMotion ? FAN_REDUCED_RATE : FAN_FULL_RATE;
      fanAngleRef.current += rate * intensity * dt;
      if (fanAngleRef.current > Math.PI * 2) fanAngleRef.current -= Math.PI * 2;
      blades.style.transform = `rotate(${(fanAngleRef.current * 180) / Math.PI}deg)`;
    }
  });

  const toggleFan = () => setFanOn((v) => !v);

  const fan = (
    <div
      role="button"
      aria-label="Toggle fan"
      aria-pressed={fanOn}
      tabIndex={0}
      onClick={toggleFan}
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleFan(); } }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        cursor: 'pointer',
        outline: 'none',
        flexShrink: 0,
        userSelect: 'none',
        touchAction: 'manipulation',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        style={{
          display: 'block',
          transform: 'perspective(220px) rotateY(38deg)',
          width: 'clamp(56px, 11vw, 112px)',
          height: 'clamp(56px, 11vw, 112px)',
        }}
      >
        <circle cx="50" cy="50" r="38" fill="none" stroke={fanStroke} strokeWidth="2" opacity="0.85" />
        <circle cx="50" cy="50" r="30" fill="none" stroke={fanStroke} strokeWidth="1" opacity="0.35" />
        <circle cx="50" cy="50" r="22" fill="none" stroke={fanStroke} strokeWidth="1" opacity="0.25" />
        <g ref={bladesRef} style={{ transformBox: 'view-box', transformOrigin: '50px 50px', willChange: 'transform' }}>
          {[0, 120, 240].map((angle) => (
            <path
              key={angle}
              d="M50 50 C 56 34, 64 28, 70 26 C 66 34, 60 42, 50 50 Z"
              fill={fanStroke}
              opacity="0.9"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
        </g>
        <circle cx="50" cy="50" r="4.5" fill={fanStroke} />
        <circle cx="50" cy="50" r="1.6" fill={bg} />
      </svg>
      <span
        style={{
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: '0.18em',
          color: fanOn ? '#22C55E' : '#EF4444',
          opacity: 1,
          transition: 'color 0.4s, opacity 0.4s',
        }}
      >
        {fanOn ? 'ON' : 'OFF'}
      </span>
    </div>
  );

  const textSvg = (
    <svg
      ref={textSvgRef}
      role="img"
      aria-label={WORD}
      viewBox="0 0 500 180"
      preserveAspectRatio="xMidYMid meet"
      style={{
        width: 'min(65vw, 500px)',
        height: 'auto',
        maxHeight: '70vh',
        overflow: 'visible',
      }}
    >
      <defs>
        <filter id={filterId} x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence ref={turbRef} type="fractalNoise" baseFrequency={REST_FREQ} numOctaves={1} seed={4} result="noise" />
          <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="noise" scale={0} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter={`url(#${filterId})`} fill={fg}>
        <text
          x="250"
          y="150"
          textAnchor="middle"
          style={{
            fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
            fontWeight: 900,
            fontSize: 180,
            letterSpacing: '-0.04em',
            userSelect: 'none',
          }}
        >
          {WORD}
        </text>
      </g>
    </svg>
  );

  return (
    <main className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#09090b] px-6 py-24 text-center sm:py-32 lg:px-8">
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[400px] w-[400px] rounded-full bg-[#a78bfa]/5 blur-[120px] sm:h-[600px] sm:w-[600px]" />
      </div>

      <div className="flex flex-col items-center max-w-4xl w-full z-10">
        <div className="flex flex-row items-center justify-center gap-4 sm:gap-8 w-full mb-8 scale-90 sm:scale-100">
          {fan}
          {textSvg}
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl max-w-3xl leading-[1.15]">
          This page seems to have slipped through a time portal.
        </h1>
        
        <p className="mt-6 text-base font-medium text-gray-400 sm:text-lg md:text-xl max-w-2xl leading-relaxed">
          We apologize for any disruption to the space-time continuum. Feel free to journey back to our homepage.
        </p>

        <div className="mt-12 flex items-center justify-center w-full">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-[#d2ff80] px-10 py-4.5 text-sm sm:text-base font-semibold text-black shadow-lg hover:bg-[#c2f26d] active:scale-98 transition-all duration-200 cursor-pointer"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </main>
  );
}

