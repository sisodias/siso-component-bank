'use client';

import React, { useState, useEffect, useRef } from 'react';
import '../../index.css';

export default function CyberCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseLightRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);

  // Mouse follow light
  useEffect(() => {
    const card = cardRef.current;
    const mouseLight = mouseLightRef.current;
    if (!card || !mouseLight) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseLight.style.left = x + 'px';
      mouseLight.style.top = y + 'px';
    };

    card.addEventListener('mousemove', handleMouseMove);
    return () => card.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Random glitch burst
  useEffect(() => {
    const nameEl = nameRef.current;
    if (!nameEl) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        nameEl.style.transform = `translate(${(Math.random()-0.5)*4}px, ${(Math.random()-0.5)*2}px)`;
        setTimeout(() => {
          nameEl.style.transform = 'translate(0,0)';
        }, 80);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const nameText = 'Kai Nakamura';
  const letters = nameText.split('').map((char, i) => ({
    char,
    index: i,
    isSpace: char === ' '
  }));

  return (
    <div className="cyber-body">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="card" ref={cardRef}>
        <div className="grid-lines"></div>
        <div className="noise"></div>
        <div className="mouse-light" ref={mouseLightRef}></div>

        <div className="data-stream">0x4F2A ∿ FREQ:440Hz ∿ NODE:ACTIVE ∿ PKT:0xFF3C ∿ LAT:40.7128 ∿ SIG:●●●○ ∿ 0x4F2A ∿ FREQ:440Hz ∿ NODE:ACTIVE</div>
        <div className="data-stream">█▓▒░ STREAM.02 ░▒▓█ ∿ PING:12ms ∿ ROUTE:OPTIMAL ∿ HASH:a7f3b2 ∿ █▓▒░ STREAM.02 ░▒▓█ ∿ PING:12ms</div>
        <div className="data-stream">◈ SYS.NOMINAL ◈ UPTIME:99.97% ◈ MEM:OK ◈ CORE.TEMP:STABLE ◈ SYS.NOMINAL ◈ UPTIME:99.97%</div>

        <div className="card-inner">
          {/* Top */}
          <div className="top-row">
            <div className="avatar"></div>
            <div className="status-pill">
              <div className="status-dot"></div>
              <span className="status-text">Open to work</span>
            </div>
          </div>

          {/* Identity */}
          <div className="identity">
            <div className="name" data-text={nameText} ref={nameRef}>
              {letters.map((item, i) =>
                item.isSpace ? (
                  <span key={i}> </span>
                ) : (
                  <span key={i} className="letter" style={{ '--i': i } as React.CSSProperties}>
                    {item.char}
                  </span>
                )
              )}
            </div>
            <div className="tagline">
              building at the intersection of <span>design</span> × <span>code</span> × <span>chaos</span>
            </div>
          </div>

          {/* Bottom */}
          <div className="bottom-row">
            <div className="contact-links">
              <div className="link-chip">@kai.dev</div>
              <div className="link-chip">github/kainmk</div>
              <div className="link-chip">kai@void.studio</div>
            </div>
            <div className="coordinates">
              40.7128° N<br />
              74.0060° W
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}