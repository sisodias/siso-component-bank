'use client';

import React, { useState, useRef, useEffect } from 'react';
import '../../index.css';
interface GlitchPosition {
  x: number;
  y: number;
  active: boolean;
}

export default function NeoTokyoCard() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [glitch, setGlitch] = useState<GlitchPosition>({ x: 0, y: 0, active: false });
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isHovered) return;

    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitch({
          x: Math.random() * 100,
          y: Math.random() * 100,
          active: true
        });
        setTimeout(() => setGlitch(prev => ({ ...prev, active: false })), 100);
      }
    }, 800);

    return () => clearInterval(glitchInterval);
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePos({ x, y });
  };

  return (
    <div className="neo-container">
      {/* Scanlines overlay */}
      <div className="scanlines" />
      
      {/* Animated ticker */}
      <div className="ticker-wrapper">
        <div className="ticker">
          <span>EXCLUSIVE RELEASE</span>
          <span>•</span>
          <span>LIMITED EDITION</span>
          <span>•</span>
          <span>CYBERPUNK 2026</span>
          <span>•</span>
          <span>EXCLUSIVE RELEASE</span>
          <span>•</span>
          <span>LIMITED EDITION</span>
          <span>•</span>
          <span>CYBERPUNK 2026</span>
          <span>•</span>
        </div>
      </div>

      <div 
        ref={cardRef}
        className={`neo-card ${isHovered ? 'hovered' : ''} ${glitch.active ? 'glitching' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          '--mouse-x': `${mousePos.x}%`,
          '--mouse-y': `${mousePos.y}%`
        } as React.CSSProperties}
      >
        {/* Glitch layers */}
        {glitch.active && (
          <>
            <div className="glitch-layer glitch-red" />
            <div className="glitch-layer glitch-blue" />
          </>
        )}

        {/* Image section */}
        <div className="image-section">
          <div className="image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=90"
              alt="Futuristic sneaker"
              className={`product-image ${imageLoaded ? 'loaded' : ''}`}
              onLoad={() => setImageLoaded(true)}
            />
            <div className="image-overlay" />
            
            {/* Corner brackets */}
            <div className="bracket bracket-tl" />
            <div className="bracket bracket-tr" />
            <div className="bracket bracket-bl" />
            <div className="bracket bracket-br" />
          </div>

          {/* Status badge */}
          <div className="status-badge">
            <div className="pulse-dot" />
            <span>IN STOCK</span>
          </div>

          {/* Serial number */}
          <div className="serial">SN: NK-2026-X7</div>
        </div>

        {/* Content section */}
        <div className="content-section">
          <div className="content-wrapper">
            {/* Collection tag */}
            <div className="collection-tag">
              <span className="tag-icon">◆</span>
              NEO COLLECTION
            </div>

            {/* Product title */}
            <h2 className="product-title">
              <span className="title-main">AIRMAX</span>
              <span className="title-sub">CYBERPUNK EDITION</span>
            </h2>

            {/* Specs grid */}
            <div className="specs-grid">
              <div className="spec-item">
                <div className="spec-label">MATERIAL</div>
                <div className="spec-value">SYNTHETIC</div>
              </div>
              <div className="spec-item">
                <div className="spec-label">WEIGHT</div>
                <div className="spec-value">310G</div>
              </div>
              <div className="spec-item">
                <div className="spec-label">RELEASE</div>
                <div className="spec-value">02/2026</div>
              </div>
              <div className="spec-item">
                <div className="spec-label">UNITS</div>
                <div className="spec-value">1,000</div>
              </div>
            </div>

            {/* Price section */}
            <div className="price-section">
              <div className="price-main">
                <span className="currency">$</span>
                <span className="amount">299</span>
              </div>
              <div className="price-old">$399</div>
            </div>

            {/* Size selector */}
            <div className="size-selector">
              <div className="size-label">SELECT SIZE</div>
              <div className="size-grid">
                {[7, 8, 9, 10, 11, 12].map((size) => (
                  <button 
                    key={size} 
                    className={`size-btn ${size === 10 ? 'selected' : ''} ${size === 7 ? 'sold-out' : ''}`}
                    disabled={size === 7}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="cta-section">
              <button className="cta-primary">
                <span className="btn-text">ADD TO CART</span>
                <span className="btn-icon">→</span>
              </button>
              <button className="cta-secondary">
                <svg className="heart-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </button>
            </div>

            {/* Features list */}
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-check">✓</span>
                Air cushioning technology
              </div>
              <div className="feature-item">
                <span className="feature-check">✓</span>
                Reflective neon accents
              </div>
              <div className="feature-item">
                <span className="feature-check">✓</span>
                Free worldwide shipping
              </div>
            </div>
          </div>
        </div>

        {/* Cursor follower */}
        {isHovered && (
          <div 
            className="cursor-follower"
            style={{
              left: `${mousePos.x}%`,
              top: `${mousePos.y}%`
            }}
          />
        )}

        {/* Border glow */}
        <div className="border-glow" />
      </div>

      {/* Bottom info bar */}
      <div className="info-bar">
        <div className="info-item">
          <img 
            src="https://images.unsplash.com/photo-1556656793-08538906a9f8?w=100&q=80" 
            alt="Designer"
            className="designer-avatar"
          />
          <div>
            <div className="info-label">DESIGNED BY</div>
            <div className="info-value">Jane Doe</div>
          </div>
        </div>
        <div className="info-item">
          <div className="rating-stars">★★★★★</div>
          <div>
            <div className="info-label">RATING</div>
            <div className="info-value">4.9/5 (2.1K)</div>
          </div>
        </div>
        <div className="info-item">
          <div className="authenticity-badge">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                fill="currentColor"
              />
            </svg>
          </div>
          <div>
            <div className="info-label">VERIFIED</div>
            <div className="info-value">AUTHENTIC</div>
          </div>
        </div>
      </div>
    </div>
  );
}