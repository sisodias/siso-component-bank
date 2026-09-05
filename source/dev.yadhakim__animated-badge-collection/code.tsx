'use client';

import React, { useState, useEffect, useRef } from 'react';
import '../../index.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info';
}

// Holographic Shimmer Badge
const HolographicBadge: React.FC<BadgeProps> = ({ children, variant = 'info' }) => {
  const [rotation, setRotation] = useState(0);
  const badgeRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!badgeRef.current) return;
    const rect = badgeRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const angleX = (y - centerY) / centerY * 20;
    const angleY = (x - centerX) / centerX * 20;
    setRotation(angleY);
  };

  return (
    <div className="badge-container">
      <div
        ref={badgeRef}
        className={`holographic-badge holographic-${variant}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setRotation(0)}
        style={{ '--rotation': `${rotation}deg` } as React.CSSProperties}
      >
        <div className="holo-shine" />
        <div className="holo-layer-1" />
        <div className="holo-layer-2" />
        <span className="badge-text">{children}</span>
      </div>
    </div>
  );
};

// Constellation Badge
const ConstellationBadge: React.FC<BadgeProps> = ({ children, variant = 'info' }) => {
  const [stars, setStars] = useState<Array<{ x: number; y: number }>>([]);

  useEffect(() => {
    const newStars = [];
    for (let i = 0; i < 12; i++) {
      newStars.push({
        x: Math.random() * 100,
        y: Math.random() * 100
      });
    }
    setStars(newStars);
  }, []);

  return (
    <div className="badge-container">
      <div className={`constellation-badge constellation-${variant}`}>
        <svg className="constellation-canvas" viewBox="0 0 100 100">
          {/* Draw connections */}
          {stars.map((star, i) => {
            if (i === stars.length - 1) return null;
            return (
              <line
                key={i}
                className="constellation-line"
                x1={star.x}
                y1={star.y}
                x2={stars[i + 1].x}
                y2={stars[i + 1].y}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            );
          })}
          {/* Draw stars */}
          {stars.map((star, i) => (
            <circle
              key={i}
              className="constellation-star"
              cx={star.x}
              cy={star.y}
              r="1.5"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </svg>
        <span className="badge-text">{children}</span>
      </div>
    </div>
  );
};

// Carnival Marquee Badge
const MarqueeBadge: React.FC<BadgeProps> = ({ children, variant = 'info' }) => {
  const [bulbs] = useState(Array.from({ length: 20 }, (_, i) => i));

  return (
    <div className="badge-container">
      <div className={`marquee-badge marquee-${variant}`}>
        <div className="marquee-bulbs">
          {bulbs.map((i) => (
            <div
              key={i}
              className="marquee-bulb"
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
        <span className="badge-text">{children}</span>
      </div>
    </div>
  );
};

// Liquid Metal Badge
const LiquidBadge: React.FC<BadgeProps> = ({ children, variant = 'info' }) => {
  const [drops, setDrops] = useState<Array<{ id: number; x: number }>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDrops(prev => {
        const newDrops = [...prev.filter(d => Date.now() - d.id < 2000)];
        if (Math.random() > 0.6) {
          newDrops.push({ id: Date.now(), x: Math.random() * 100 });
        }
        return newDrops;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="badge-container">
      <div className={`liquid-badge liquid-${variant}`}>
        <div className="liquid-surface">
          {drops.map(drop => (
            <div
              key={drop.id}
              className="liquid-drop"
              style={{ left: `${drop.x}%` }}
            />
          ))}
        </div>
        <span className="badge-text">{children}</span>
      </div>
    </div>
  );
};

// Magic Orb Badge
const OrbBadge: React.FC<BadgeProps> = ({ children, variant = 'info' }) => {
  const [particles, setParticles] = useState<Array<{ id: number; angle: number }>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => {
        const newParticles = [...prev.filter(p => Date.now() - p.id < 1500)];
        newParticles.push({ id: Date.now(), angle: Math.random() * 360 });
        return newParticles;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="badge-container">
      <div className={`orb-badge orb-${variant}`}>
        <div className="orb-glow" />
        <div className="orb-core" />
        {particles.map(particle => (
          <div
            key={particle.id}
            className="orb-particle"
            style={{ '--angle': `${particle.angle}deg` } as React.CSSProperties}
          />
        ))}
        <span className="badge-text">{children}</span>
      </div>
    </div>
  );
};

// Target Lock Badge
const TargetBadge: React.FC<BadgeProps> = ({ children, variant = 'info' }) => {
  const [scanning, setScanning] = useState(true);

  return (
    <div className="badge-container">
      <div className={`target-badge target-${variant} ${scanning ? 'scanning' : ''}`}>
        <div className="target-corner target-tl" />
        <div className="target-corner target-tr" />
        <div className="target-corner target-bl" />
        <div className="target-corner target-br" />
        <div className="target-scan-line" />
        <div className="target-crosshair" />
        <span className="badge-text">{children}</span>
      </div>
    </div>
  );
};

// Origami Fold Badge
const OrigamiBadge: React.FC<BadgeProps> = ({ children, variant = 'info' }) => {
  const [folded, setFolded] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setFolded(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="badge-container">
      <div className={`origami-badge origami-${variant} ${folded ? 'folded' : ''}`}>
        <div className="origami-fold fold-1" />
        <div className="origami-fold fold-2" />
        <div className="origami-fold fold-3" />
        <span className="badge-text">{children}</span>
      </div>
    </div>
  );
};

// Neon Sign Badge
const NeonBadge: React.FC<BadgeProps> = ({ children, variant = 'info' }) => {
  const [flicker, setFlicker] = useState(false);

  useEffect(() => {
    const flickerInterval = setInterval(() => {
      if (Math.random() > 0.85) {
        setFlicker(true);
        setTimeout(() => setFlicker(false), 100);
      }
    }, 2000);
    return () => clearInterval(flickerInterval);
  }, []);

  return (
    <div className="badge-container">
      <div className={`neon-badge neon-${variant} ${flicker ? 'flicker' : ''}`}>
        <div className="neon-tube" />
        <div className="neon-glow-1" />
        <div className="neon-glow-2" />
        <span className="badge-text">{children}</span>
      </div>
    </div>
  );
};

// Main Showcase
export default function BadgeShowcase() {
  return (
    <div className="badge-showcase">
      <div className="badges-grid">
        <div className="badge-section">
          <h3 className="section-title">Holographic Shimmer</h3>
          <div className="badge-row">
            <HolographicBadge variant="success">Success</HolographicBadge>
            <HolographicBadge variant="warning">Warning</HolographicBadge>
            <HolographicBadge variant="error">Error</HolographicBadge>
            <HolographicBadge variant="info">Info</HolographicBadge>
          </div>
        </div>

        <div className="badge-section">
          <h3 className="section-title">Constellation</h3>
          <div className="badge-row">
            <ConstellationBadge variant="success">Success</ConstellationBadge>
            <ConstellationBadge variant="warning">Warning</ConstellationBadge>
            <ConstellationBadge variant="error">Error</ConstellationBadge>
            <ConstellationBadge variant="info">Info</ConstellationBadge>
          </div>
        </div>

        <div className="badge-section">
          <h3 className="section-title">Carnival Marquee</h3>
          <div className="badge-row">
            <MarqueeBadge variant="success">Success</MarqueeBadge>
            <MarqueeBadge variant="warning">Warning</MarqueeBadge>
            <MarqueeBadge variant="error">Error</MarqueeBadge>
            <MarqueeBadge variant="info">Info</MarqueeBadge>
          </div>
        </div>

        <div className="badge-section">
          <h3 className="section-title">Liquid Metal</h3>
          <div className="badge-row">
            <LiquidBadge variant="success">Success</LiquidBadge>
            <LiquidBadge variant="warning">Warning</LiquidBadge>
            <LiquidBadge variant="error">Error</LiquidBadge>
            <LiquidBadge variant="info">Info</LiquidBadge>
          </div>
        </div>

        <div className="badge-section">
          <h3 className="section-title">Magic Orb</h3>
          <div className="badge-row">
            <OrbBadge variant="success">Success</OrbBadge>
            <OrbBadge variant="warning">Warning</OrbBadge>
            <OrbBadge variant="error">Error</OrbBadge>
            <OrbBadge variant="info">Info</OrbBadge>
          </div>
        </div>

        <div className="badge-section">
          <h3 className="section-title">Target Lock</h3>
          <div className="badge-row">
            <TargetBadge variant="success">Success</TargetBadge>
            <TargetBadge variant="warning">Warning</TargetBadge>
            <TargetBadge variant="error">Error</TargetBadge>
            <TargetBadge variant="info">Info</TargetBadge>
          </div>
        </div>

        <div className="badge-section">
          <h3 className="section-title">Origami Fold</h3>
          <div className="badge-row">
            <OrigamiBadge variant="success">Success</OrigamiBadge>
            <OrigamiBadge variant="warning">Warning</OrigamiBadge>
            <OrigamiBadge variant="error">Error</OrigamiBadge>
            <OrigamiBadge variant="info">Info</OrigamiBadge>
          </div>
        </div>

        <div className="badge-section">
          <h3 className="section-title">Neon Sign</h3>
          <div className="badge-row">
            <NeonBadge variant="success">Success</NeonBadge>
            <NeonBadge variant="warning">Warning</NeonBadge>
            <NeonBadge variant="error">Error</NeonBadge>
            <NeonBadge variant="info">Info</NeonBadge>
          </div>
        </div>
      </div>
    </div>
  );
}