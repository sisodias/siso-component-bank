import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

export const Component = () => {
  // State management
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(true);
  const [settings, setSettings] = useState({
    objectSpeed: 0.02,
    transparent: true,
    postProcessing: true,
    particlesEnabled: true,
    glowIntensity: 1,
    rotationSpeed: 1,
    autoRotate: false
  });

  // Refs
  const containerRef = useRef(null);
  const cubeRef = useRef(null);
  const animationFrameRef = useRef(null);
  const timeRef = useRef(0);
  const particlesRef = useRef([]);

  // Initialize particles
  useEffect(() => {
    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        z: Math.random() * 200 - 100,
        speed: Math.random() * 0.5 + 0.1,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.1
      });
    }
    particlesRef.current = particles;
    
    // Trigger load animation
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  // Mouse tracking with smoothing
  const smoothMousePosition = useRef({ x: 0, y: 0 });
  const targetMousePosition = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    targetMousePosition.current = {
      x: (clientX - innerWidth / 2) / (innerWidth / 2),
      y: (clientY - innerHeight / 2) / (innerHeight / 2)
    };
  }, []);

  // Smooth scroll handling
  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    setScrollProgress(Math.min(scrolled / maxScroll, 1));
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    timeRef.current += settings.objectSpeed;

    // Smooth mouse following
    smoothMousePosition.current.x += (targetMousePosition.current.x - smoothMousePosition.current.x) * 0.1;
    smoothMousePosition.current.y += (targetMousePosition.current.y - smoothMousePosition.current.y) * 0.1;

    setMousePosition({
      x: smoothMousePosition.current.x,
      y: smoothMousePosition.current.y
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [settings.objectSpeed]);

  // Setup event listeners and animation
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleMouseMove, handleScroll, animate]);

  // Calculate cube transformation
  const cubeTransform = useMemo(() => {
    const baseRotationX = -mousePosition.y * 20 * settings.rotationSpeed;
    const baseRotationY = mousePosition.x * 20 * settings.rotationSpeed;
    const scrollRotationX = scrollProgress * 180;
    const scrollRotationY = scrollProgress * 360;
    const autoRotationY = settings.autoRotate ? timeRef.current * 50 : 0;
    
    return `
      rotateX(${baseRotationX + scrollRotationX}deg) 
      rotateY(${baseRotationY + scrollRotationY + autoRotationY}deg)
      translateZ(${scrollProgress * 100}px)
      scale(${1 + scrollProgress * 0.2})
    `;
  }, [mousePosition, scrollProgress, settings.rotationSpeed, settings.autoRotate]);

  // Particle positions
  const particleElements = useMemo(() => {
    if (!settings.particlesEnabled) return null;
    
    return particlesRef.current.map((particle) => (
      <div
        key={particle.id}
        className="particle"
        style={{
          left: `${particle.x}%`,
          top: `${particle.y}%`,
          width: `${particle.size}px`,
          height: `${particle.size}px`,
          opacity: particle.opacity,
          transform: `translateZ(${particle.z}px)`,
          animationDelay: `${particle.id * 0.1}s`,
          animationDuration: `${20 / particle.speed}s`
        }}
      />
    ));
  }, [settings.particlesEnabled]);

  return (
    <div className={`cinematic-container ${isLoaded ? 'loaded' : ''}`} ref={containerRef}>
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .cinematic-container {
          position: relative;
          width: 100vw;
          min-height: 300vh;
          background: #0a0a0a;
          overflow: hidden;
          opacity: 0;
          transition: opacity 1.5s ease-out;
        }

        .cinematic-container.loaded {
          opacity: 1;
        }

        .hero-section {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 2000px;
          background: radial-gradient(ellipse at center, #1a1a1a 0%, #000000 100%);
          overflow: hidden;
        }

        /* Advanced post-processing layers */
        .post-processing {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 10;
        }

        .vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at center,
            transparent 0%,
            rgba(0,0,0,0.2) 50%,
            rgba(0,0,0,0.8) 100%
          );
          mix-blend-mode: multiply;
        }

        .film-grain {
          position: absolute;
          inset: -50%;
          background-image: 
            repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2px),
            repeating-linear-gradient(-45deg, transparent, transparent 1px, rgba(0,0,0,0.05) 1px, rgba(0,0,0,0.05) 2px);
          animation: grain 8s steps(10) infinite;
          opacity: ${settings.postProcessing ? 1 : 0};
          transition: opacity 0.3s ease;
        }

        @keyframes grain {
          0%, 100% { transform: translate(0, 0) scale(1); }
          10% { transform: translate(-5%, -10%) scale(1.01); }
          20% { transform: translate(-15%, 5%) scale(0.99); }
          30% { transform: translate(7%, -25%) scale(1.02); }
          40% { transform: translate(-5%, 25%) scale(0.98); }
          50% { transform: translate(-15%, 10%) scale(1.01); }
          60% { transform: translate(15%, 0%) scale(0.99); }
          70% { transform: translate(0%, 15%) scale(1.02); }
          80% { transform: translate(3%, 20%) scale(0.98); }
          90% { transform: translate(-10%, 10%) scale(1.01); }
        }

        .chromatic-aberration {
          position: absolute;
          inset: 0;
          opacity: ${settings.postProcessing ? 0.5 : 0};
          transition: opacity 0.3s ease;
        }

        .chromatic-aberration::before,
        .chromatic-aberration::after {
          content: '';
          position: absolute;
          inset: 0;
          background: inherit;
          mix-blend-mode: multiply;
        }

        .chromatic-aberration::before {
          filter: blur(20px);
          transform: translateX(2px) scaleX(1.01);
          background: linear-gradient(45deg, rgba(255,0,0,0.1) 0%, transparent 50%);
        }

        .chromatic-aberration::after {
          filter: blur(8px);
          transform: translateX(-2px) scaleX(1.01);
          background: linear-gradient(90deg, transparent 50%, rgba(0,255,255,0.1) 100%);
        }

        .scan-lines {
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.1) 2px,
            rgba(255,255,255,0.1) 4px
          );
          animation: scan 8s linear infinite;
          opacity: ${settings.postProcessing ? 0.3 : 0};
          transition: opacity 0.3s ease;
        }

        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(10px); }
        }

        /* Particle system */
        .particles-container {
          position: absolute;
          inset: 0;
          perspective: 1000px;
          transform-style: preserve-3d;
        }

        .particle {
          position: absolute;
          background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
          border-radius: 50%;
          animation: float-particle 20s linear infinite;
          filter: blur(0.5px);
        }

        @keyframes float-particle {
          0% { transform: translateY(100vh) translateZ(var(--z, 0px)); }
          100% { transform: translateY(-100vh) translateZ(var(--z, 0px)); }
        }

        /* Enhanced cube styling */
        .cube-container {
          position: relative;
          width: 400px;
          height: 400px;
          transform-style: preserve-3d;
          transition: transform 0.1s cubic-bezier(0.23, 1, 0.32, 1);
          filter: 'contrast(1.1) brightness(1.05)';
        }

        .cube {
          position: absolute;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          animation: float 6s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
          25% { transform: translateY(-10px) rotateX(1deg) rotateY(1deg); }
          50% { transform: translateY(-20px) rotateX(-1deg) rotateY(-1deg); }
          75% { transform: translateY(-10px) rotateX(1deg) rotateY(-1deg); }
        }

        .cube-face {
          position: absolute;
          width: 400px;
          height: 400px;
          background: ${settings.transparent 
            ? 'rgba(15, 15, 15, 0.85)' 
            : 'rgba(20, 20, 20, 0.95)'};
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 160px;
          color: rgba(255, 255, 255, 0.08);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-weight: 100;
          backdrop-filter: blur(20px) saturate(1.5);
          box-shadow: 
            inset 0 0 100px rgba(255, 255, 255, 0.02),
            0 0 50px rgba(0, 0, 0, 0.5),
            0 10px 30px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .cube-face::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(255,255,255,0.1) 0%,
            transparent 40%,
            transparent 60%,
            rgba(0,0,0,0.2) 100%
          );
          pointer-events: none;
        }

        .cube-face::after {
          content: '';
          position: absolute;
          inset: -50%;
          background: radial-gradient(
            circle at 30% 30%,
            rgba(255,255,255,0.2) 0%,
            transparent 50%
          );
          transform: rotate(45deg);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .cube-face:hover::after {
          opacity: 1;
        }

        .face-front { transform: translateZ(200px); }
        .face-back { transform: rotateY(180deg) translateZ(200px); }
        .face-right { transform: rotateY(90deg) translateZ(200px); }
        .face-left { transform: rotateY(-90deg) translateZ(200px); }
        .face-top { transform: rotateX(90deg) translateZ(200px); }
        .face-bottom { transform: rotateX(-90deg) translateZ(200px); }

        /* Enhanced glow effects */
        .glow-container {
          position: absolute;
          inset: -200px;
          transform-style: preserve-3d;
          pointer-events: none;
          opacity: ${settings.glowIntensity};
          transition: opacity 0.3s ease;
        }

        .glow-orb {
          position: absolute;
          width: 600px;
          height: 600px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(
            circle,
            rgba(100, 200, 255, 0.4) 0%,
            rgba(100, 200, 255, 0.2) 30%,
            transparent 70%
          );
          filter: blur(60px);
                    animation: pulse 4s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }

        .glow-orb-secondary {
          position: absolute;
          width: 800px;
          height: 800px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(
            circle,
            rgba(255, 100, 200, 0.3) 0%,
            rgba(255, 100, 200, 0.1) 30%,
            transparent 70%
          );
          filter: blur(80px);
          animation: pulse-secondary 6s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% { 
            opacity: 0.6; 
            transform: translate(-50%, -50%) scale(1) rotate(0deg); 
          }
          50% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1.2) rotate(180deg); 
          }
        }

        @keyframes pulse-secondary {
          0%, 100% { 
            opacity: 0.4; 
            transform: translate(-50%, -50%) scale(1.2) rotate(0deg); 
          }
          50% { 
            opacity: 0.8; 
            transform: translate(-50%, -50%) scale(0.9) rotate(-180deg); 
          }
        }

        /* Light streaks */
        .light-streaks {
          position: absolute;
          inset: 0;
          overflow: hidden;
          opacity: ${settings.postProcessing ? 0.6 : 0};
          transition: opacity 0.3s ease;
        }

        .light-streak {
          position: absolute;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.8) 50%,
            transparent 100%
          );
          filter: blur(1px);
          animation: streak 3s linear infinite;
        }

        .light-streak:nth-child(1) {
          top: 20%;
          width: 200px;
          animation-delay: 0s;
        }

        .light-streak:nth-child(2) {
          top: 50%;
          width: 300px;
          animation-delay: 1s;
        }

        .light-streak:nth-child(3) {
          top: 80%;
          width: 250px;
          animation-delay: 2s;
        }

        @keyframes streak {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(calc(100vw + 100%)); opacity: 0; }
        }

        /* Hero text styling */
        .hero-content {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 5;
        }

        .hero-title {
          position: absolute;
          left: 60px;
          bottom: 80px;
          font-size: 24px;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          letter-spacing: 4px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-weight: 800;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 1.5s ease-out 0.5s forwards;
        }

        .hero-subtitle {
          position: absolute;
          right: 60px;
          bottom: 80px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          letter-spacing: 4px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-weight: 300;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 1.5s ease-out 0.7s forwards;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Enhanced controls panel */
        .controls {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 20;
          background: rgba(10, 10, 10, 0.9);
          backdrop-filter: blur(20px) saturate(1.5);
          padding: 0;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          max-width: ${controlsOpen ? '300px' : '150px'};
        }

        .controls-header {
          padding: 15px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .controls-header:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .controls-title {
          color: rgba(255, 255, 255, 0.9);
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .controls-toggle {
          color: rgba(255, 255, 255, 0.6);
          font-size: 18px;
          transition: transform 0.3s ease;
          transform: rotate(${controlsOpen ? '45deg' : '0deg'});
        }

        .controls-body {
          padding: ${controlsOpen ? '20px' : '0'};
          max-height: ${controlsOpen ? '500px' : '0'};
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .control-group {
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .control-group:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .control-item {
          margin-bottom: 15px;
        }

        .control-label {
          display: block;
          color: rgba(255, 255, 255, 0.6);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .control-value {
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          font-weight: 500;
        }

        .slider {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          outline: none;
          -webkit-appearance: none;
          margin-top: 8px;
          cursor: pointer;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          background: rgba(100, 200, 255, 0.8);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          background: rgba(100, 200, 255, 1);
          transform: scale(1.2);
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 20px;
          margin-left: 10px;
          vertical-align: middle;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          inset: 0;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          transition: all 0.3s ease;
        }

        .toggle-slider::before {
          position: absolute;
          content: '';
          height: 14px;
          width: 14px;
          left: 3px;
          bottom: 3px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        input:checked + .toggle-slider {
          background: rgba(100, 200, 255, 0.6);
        }

        input:checked + .toggle-slider::before {
          transform: translateX(20px);
        }

        /* Content sections */
        .content-section {
          position: relative;
          margin-top: 100vh;
          min-height: 100vh;
          background: linear-gradient(180deg, #0a0a0a 0%, #050505 100%);
          padding: 120px 60px;
          z-index: 15;
        }

        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          margin-bottom: 60px;
          opacity: 0;
          transform: translateY(40px);
          animation: fadeInUp 1s ease-out forwards;
        }

        .section-title {
          font-size: 48px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 100;
          letter-spacing: -1px;
          margin-bottom: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .section-subtitle {
          font-size: 20px;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 300;
          line-height: 1.6;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
          margin-top: 80px;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 40px;
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(40px);
          animation: fadeInUp 1s ease-out forwards;
        }

        .feature-card:nth-child(1) { animation-delay: 0.1s; }
        .feature-card:nth-child(2) { animation-delay: 0.2s; }
        .feature-card:nth-child(3) { animation-delay: 0.3s; }

        .feature-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(100, 200, 255, 0.3);
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .feature-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, rgba(100, 200, 255, 0.2) 0%, rgba(255, 100, 200, 0.2) 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-bottom: 20px;
        }

        .feature-title {
          font-size: 24px;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 15px;
          font-weight: 300;
        }

        .feature-description {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.6;
        }

        /* Loading animation */
        .loading-overlay {
          position: fixed;
          inset: 0;
          background: #000;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: ${isLoaded ? 0 : 1};
          pointer-events: ${isLoaded ? 'none' : 'all'};
          transition: opacity 1s ease-out;
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-top-color: rgba(100, 200, 255, 0.8);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .cube-container {
            width: 250px;
            height: 250px;
          }

          .cube-face {
            width: 250px;
            height: 250px;
            font-size: 100px;
          }

          .face-front,
          .face-back,
          .face-right,
          .face-left,
          .face-top,
          .face-bottom {
            transform-origin: center;
          }

          .face-front { transform: translateZ(125px); }
          .face-back { transform: rotateY(180deg) translateZ(125px); }
          .face-right { transform: rotateY(90deg) translateZ(125px); }
          .face-left { transform: rotateY(-90deg) translateZ(125px); }
          .face-top { transform: rotateX(90deg) translateZ(125px); }
          .face-bottom { transform: rotateX(-90deg) translateZ(125px); }

          .hero-title,
          .hero-subtitle {
            left: 30px;
            right: 30px;
            bottom: 40px;
          }

          .controls {
            top: 10px;
            right: 10px;
            max-width: ${controlsOpen ? '280px' : '140px'};
          }

          .content-section {
            padding: 80px 30px;
          }
        }
      `}</style>

      {/* Loading overlay */}
      <div className="loading-overlay">
        <div className="loading-spinner" />
      </div>

      {/* Hero section */}
      <div className="hero-section">
        {/* Particle system */}
        <div className="particles-container">
                  </div>

        {/* Post-processing effects */}
        <div className="post-processing">
          <div className="vignette" />
          <div className="film-grain" />
          <div className="chromatic-aberration" />
          <div className="scan-lines" />
        </div>

        {/* Light streaks */}
        <div className="light-streaks">
          <div className="light-streak" />
          <div className="light-streak" />
          <div className="light-streak" />
        </div>

        {/* Glow effects */}
        <div className="glow-container">
          <div className="glow-orb" />
          <div className="glow-orb-secondary" />
        </div>

        {/* 3D Cube */}
        <div className="cube-container" ref={cubeRef} style={{ transform: cubeTransform }}>
          <div className="cube">
            <div className="cube-face face-front">•</div>
            <div className="cube-face face-back">•</div>
            <div className="cube-face face-right">BUY</div>
            <div className="cube-face face-left">ME</div>
            <div className="cube-face face-top"></div>
            <div className="cube-face face-bottom"></div>
          </div>
        </div>

        {/* Hero content */}
        <div className="hero-content">
          <h1 className="hero-title">SCROLL TO TRANSFORM THE CUBE.</h1>
          <h2 className="hero-subtitle">EMBRACE THE JOURNEY.</h2>
        </div>
      </div>

      {/* Controls panel */}
      <div className="controls">
        <div className="controls-header" onClick={() => setControlsOpen(!controlsOpen)}>
          <span className="controls-title">Controls</span>
          <span className="controls-toggle">+</span>
        </div>
        <div className="controls-body">
          <div className="control-group">
            <div className="control-item">
              <label className="control-label">
                Object Speed
                <span className="control-value" style={{ float: 'right' }}>
                  {settings.objectSpeed.toFixed(3)}
                </span>
              </label>
              <input
                type="range"
                className="slider"
                min="0"
                max="0.1"
                step="0.001"
                value={settings.objectSpeed}
                onChange={(e) => setSettings({ ...settings, objectSpeed: parseFloat(e.target.value) })}
              />
            </div>

            <div className="control-item">
              <label className="control-label">
                Rotation Speed
                <span className="control-value" style={{ float: 'right' }}>
                  {settings.rotationSpeed.toFixed(1)}x
                </span>
              </label>
              <input
                type="range"
                className="slider"
                min="0"
                max="3"
                step="0.1"
                value={settings.rotationSpeed}
                onChange={(e) => setSettings({ ...settings, rotationSpeed: parseFloat(e.target.value) })}
              />
            </div>

            <div className="control-item">
              <label className="control-label">
                Glow Intensity
                <span className="control-value" style={{ float: 'right' }}>
                  {Math.round(settings.glowIntensity * 100)}%
                </span>
              </label>
              <input
                type="range"
                className="slider"
                min="0"
                max="2"
                step="0.1"
                value={settings.glowIntensity}
                onChange={(e) => setSettings({ ...settings, glowIntensity: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="control-group">
            <div className="control-item">
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="control-label" style={{ margin: 0 }}>Transparent</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.transparent}
                    onChange={(e) => setSettings({ ...settings, transparent: e.target.checked })}
                  />
                  <span className="toggle-slider" />
                </label>
              </label>
            </div>

            <div className="control-item">
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="control-label" style={{ margin: 0 }}>Post Processing</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.postProcessing}
                    onChange={(e) => setSettings({ ...settings, postProcessing: e.target.checked })}
                  />
                  <span className="toggle-slider" />
                </label>
              </label>
            </div>

            <div className="control-item">
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="control-label" style={{ margin: 0 }}>Particles</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.particlesEnabled}
                    onChange={(e) => setSettings({ ...settings, particlesEnabled: e.target.checked })}
                  />
                  <span className="toggle-slider" />
                </label>
              </label>
            </div>

            <div className="control-item">
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="control-label" style={{ margin: 0 }}>Auto Rotate</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.autoRotate}
                    onChange={(e) => setSettings({ ...settings, autoRotate: e.target.checked })}
                  />
                  <span className="toggle-slider" />
                </label>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for icons (optional, can be replaced with actual icons)
const Icon = ({ children }) => (
  <span style={{ fontSize: '28px' }}>{children}</span>
);