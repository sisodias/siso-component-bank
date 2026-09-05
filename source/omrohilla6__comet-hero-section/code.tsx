"use client";

import { useMemo, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * CursorTrail Component - Magical comet-like cursor with colorful particle trail
 * SSR-safe with mounted state check for 21st.dev compatibility
 */
const CursorTrail = () => {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mousePos = useRef({ x: -100, y: -100 });
  const targetPos = useRef({ x: -100, y: -100 });
  const lastMoveTime = useRef(Date.now());
  const animationFrameId = useRef();

  // Mount check for SSR safety
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Don't run on server or before mount
    if (!mounted) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      if (typeof window === 'undefined') return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', resizeCanvas);
    }

    // Track mouse position
    const handleMouseMove = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      lastMoveTime.current = Date.now();
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Calculate movement speed
    let lastMouseX = 0;
    let lastMouseY = 0;
    let speed = 0;

    // Animation loop
    const animate = () => {
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth cursor following with easing
      const easing = 0.18;
      mousePos.current.x += (targetPos.current.x - mousePos.current.x) * easing;
      mousePos.current.y += (targetPos.current.y - mousePos.current.y) * easing;

      // Calculate speed
      const dx = mousePos.current.x - lastMouseX;
      const dy = mousePos.current.y - lastMouseY;
      speed = Math.sqrt(dx * dx + dy * dy);
      lastMouseX = mousePos.current.x;
      lastMouseY = mousePos.current.y;

      // Purple-focused colorful palette with vibrant variety
      const colorPalette = [
        { r: 168, g: 85, b: 247 },   // Primary Purple
        { r: 192, g: 132, b: 252 },  // Light Purple
        { r: 147, g: 51, b: 234 },   // Deep Purple
        { r: 236, g: 72, b: 153 },   // Pink accent
        { r: 59, g: 130, b: 246 },   // Blue accent
        { r: 34, g: 211, b: 238 },   // Cyan accent
        { r: 251, g: 146, b: 60 },   // Orange spark
      ];

      // Generate particles when cursor is active
      if (mousePos.current.x > 0 && mousePos.current.y > 0) {
        // More particles on movement, minimum when idle
        const baseParticleCount = 3;
        const speedBonus = Math.floor(speed * 0.8);
        const particleCount = baseParticleCount + speedBonus;

        for (let i = 0; i < particleCount; i++) {
          // Favor purple tones (70% purple, 30% other colors)
          const colorIndex = Math.random() < 0.7 
            ? Math.floor(Math.random() * 3)  // Purple tones (first 3)
            : Math.floor(Math.random() * colorPalette.length);  // All colors
          const randomColor = colorPalette[colorIndex];

          particles.current.push({
            x: mousePos.current.x + (Math.random() - 0.5) * 3,
            y: mousePos.current.y + (Math.random() - 0.5) * 3,
            opacity: 1,
            scale: 0.8 + Math.random() * 0.4,
            velocityX: (Math.random() - 0.5) * 1.2,
            velocityY: (Math.random() - 0.5) * 1.2 + Math.random() * 0.5,
            life: 1,
            maxLife: 35 + Math.random() * 25,
            color: randomColor,
          });
        }

        // Limit particle count for performance
        if (particles.current.length > 200) {
          particles.current = particles.current.slice(-200);
        }
      }

      // Update and draw particles
      particles.current = particles.current.filter((particle) => {
        particle.life--;
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.velocityX *= 0.97;
        particle.velocityY *= 0.97;

        const lifeRatio = particle.life / particle.maxLife;
        particle.opacity = lifeRatio * 0.9;
        particle.scale = lifeRatio * 1.4;

        if (particle.life <= 0) return false;

        // Draw particle with dreamy glow
        const size = 5 * particle.scale;
        const { r, g, b } = particle.color;

        // Outer soft glow
        const glowGradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          size * 3
        );

        glowGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${particle.opacity * 0.9})`);
        glowGradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${particle.opacity * 0.5})`);
        glowGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Bright inner core
        const coreGradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          size * 0.8
        );
        coreGradient.addColorStop(0, `rgba(255, 255, 255, ${particle.opacity * 0.8})`);
        coreGradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${particle.opacity * 0.7})`);
        coreGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${particle.opacity * 0.3})`);

        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size * 0.8, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      // Draw smaller cursor head
      if (mousePos.current.x > 0 && mousePos.current.y > 0) {
        const timeSinceMove = Date.now() - lastMoveTime.current;
        const isPulsing = timeSinceMove > 120;
        const pulseScale = isPulsing ? 1 + Math.sin(Date.now() * 0.006) * 0.12 : 1;

        // Smaller cursor size (reduced from 4 to 2.5)
        const cursorSize = (2.5 + speed * 0.15) * pulseScale;
        const speedBrightness = Math.min(speed / 12, 1);

        // Outer purple glow
        const glowGradient = ctx.createRadialGradient(
          mousePos.current.x,
          mousePos.current.y,
          0,
          mousePos.current.x,
          mousePos.current.y,
          cursorSize * 4
        );

        glowGradient.addColorStop(0, `rgba(192, 132, 252, ${0.9 + speedBrightness * 0.1})`);
        glowGradient.addColorStop(0.3, `rgba(168, 85, 247, ${0.6 + speedBrightness * 0.3})`);
        glowGradient.addColorStop(0.7, `rgba(147, 51, 234, ${0.3 + speedBrightness * 0.2})`);
        glowGradient.addColorStop(1, 'rgba(168, 85, 247, 0)');

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(mousePos.current.x, mousePos.current.y, cursorSize * 4, 0, Math.PI * 2);
        ctx.fill();

        // Bright white/purple core
        const coreGradient = ctx.createRadialGradient(
          mousePos.current.x,
          mousePos.current.y,
          0,
          mousePos.current.x,
          mousePos.current.y,
          cursorSize * 1.2
        );
        coreGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        coreGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
        coreGradient.addColorStop(1, 'rgba(192, 132, 252, 0.6)');

        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(mousePos.current.x, mousePos.current.y, cursorSize * 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Pulse ring effect when idle
        if (isPulsing) {
          const ringOpacity = 0.35 * (1 - (timeSinceMove % 1200) / 1200);
          const ringSize = cursorSize * 2 + (timeSinceMove % 1200) / 50;

          ctx.strokeStyle = `rgba(168, 85, 247, ${ringOpacity})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(mousePos.current.x, mousePos.current.y, ringSize, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup with window check for SSR
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', resizeCanvas);
        window.removeEventListener('mousemove', handleMouseMove);
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [mounted]);

  // Don't render canvas on server - prevents hydration mismatch
  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className="cursor-trail-canvas"
      aria-hidden="true"
      role="presentation"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
        filter: 'blur(0.4px)',
      }}
    />
  );
};

export const Component = ({
  title = 'Transform AI with Cosmic Intelligence.',
  subtitle = 'Build, automate, and scale on Comet.',
  animationSpeed = 'normal',
  showParticles = true,
  particleCount = 50,
  theme = {},
  className = '',
}) => {
  // Generate twinkling stars for background
  const twinklingStars = useMemo(() => {
    const starCount = 80; // Much more stars for rich starfield
    return Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.8 + 0.3, // 0.3px to 2.1px (smaller)
      duration: Math.random() * 3 + 2, // 2-5 seconds
      delay: Math.random() * 5, // Staggered start
    }));
  }, []);

  // Generate optimized particles with varied characteristics
  const particles = useMemo(() => {
    if (!showParticles) return [];
    return Array.from({ length: particleCount }, (_, i) => {
      const size = Math.random() * 2.5 + 0.8;
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size,
        duration: Math.random() * 4 + 2.5,
        delay: Math.random() * 3,
        opacity: Math.random() * 0.6 + 0.3,
      };
    });
  }, [particleCount, showParticles]);

  return (
    <>
      <style>{`
/* COMET HERO COMPONENT - Self-Contained Styles */

/* Scoped cursor hiding - only affects component */
.comet-hero-container * {
  cursor: none !important;
}

/* Container - Force GPU Composite Layer */
.comet-hero-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #050b14 0%, #0d1420 50%, #060d16 100%);
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

/* Animated Background Gradient */
.comet-hero-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 45%,
    rgba(30, 60, 120, 0.08) 0%,
    rgba(40, 70, 100, 0.05) 25%,
    rgba(50, 40, 80, 0.04) 45%,
    rgba(5, 10, 20, 0.02) 65%,
    rgba(5, 10, 20, 0) 85%
  );
  z-index: 1;
  transform: translateZ(0);
  animation: pulse-gradient 10s ease-in-out infinite;
}

@keyframes pulse-gradient {
  0%, 100% {
    opacity: 0.7;
    transform: translateZ(0) scale(1);
  }
  50% {
    opacity: 1;
    transform: translateZ(0) scale(1.08);
  }
}

/* Twinkling Stars Background */
.twinkling-stars-container {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

.twinkling-star {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 1) 30%,
    rgba(255, 255, 255, 0.85) 60%,
    transparent 100%
  );
  box-shadow: 
    0 0 8px rgba(255, 255, 255, 1),
    0 0 16px rgba(255, 255, 255, 0.9),
    0 0 24px rgba(255, 255, 255, 0.6);
  animation: star-twinkle infinite ease-in-out;
  will-change: opacity;
  transform: translateZ(0);
  filter: brightness(1.3);
}

@keyframes star-twinkle {
  0%, 100% {
    opacity: 0.6;
    transform: translateZ(0) scale(1);
  }
  25% {
    opacity: 1;
    transform: translateZ(0) scale(1.2);
  }
  50% {
    opacity: 0.7;
    transform: translateZ(0) scale(0.9);
  }
  75% {
    opacity: 0.95;
    transform: translateZ(0) scale(1.1);
  }
}

/* Dynamic Vignette */
.comet-hero-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 0%,
    transparent 40%,
    rgba(10, 22, 40, 0.2) 70%,
    rgba(10, 22, 40, 0.6) 90%,
    rgba(10, 22, 40, 0.85) 100%
  );
  z-index: 2;
  transform: translateZ(0);
  pointer-events: none;
}

/* Radial Glow Effect */
.comet-hero-radial-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%) translateZ(0);
  background: radial-gradient(
    ellipse at center,
    rgba(59, 130, 246, 0.05) 0%,
    rgba(96, 165, 250, 0.03) 25%,
    transparent 50%
  );
  z-index: 2;
  pointer-events: none;
  opacity: 0.6;
}

/* Jupiter-like Planet */
.comet-hero-planet {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  transform: translate(-50%, -50%) translateZ(0);
  z-index: 5;
  pointer-events: none;
  filter: drop-shadow(0 0 70px rgba(249, 115, 22, 0.4))
          drop-shadow(0 0 110px rgba(251, 146, 60, 0.3))
          drop-shadow(0 0 150px rgba(251, 191, 36, 0.15));
  opacity: 1;
  animation: planet-float 20s ease-in-out infinite;
}

.planet-core {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: 
    radial-gradient(
      ellipse at 30% 25%,
      rgba(180, 100, 50, 0.2) 0%,
      transparent 40%
    ),
    radial-gradient(
      ellipse at 65% 70%,
      rgba(140, 70, 30, 0.25) 0%,
      transparent 35%
    ),
    radial-gradient(
      circle at 35% 35%,
      #7a4025 0%,
      #6b3410 10%,
      #5a2f0f 25%,
      #4a2810 40%,
      #3d1f0f 55%,
      #2e1808 75%,
      #1f1005 100%
    );
  box-shadow: 
    inset -40px -40px 100px rgba(0, 0, 0, 0.85),
    inset 30px 30px 80px rgba(180, 100, 50, 0.1),
    inset -10px -10px 60px rgba(100, 55, 25, 0.3),
    0 0 80px rgba(100, 55, 25, 0.2),
    0 0 120px rgba(120, 65, 35, 0.1);
  transform: translateZ(0);
  animation: planet-rotate 25s linear infinite;
}

.planet-atmosphere {
  position: absolute;
  inset: -25px;
  border-radius: 50%;
  background: 
    radial-gradient(
      ellipse at 30% 30%,
      rgba(220, 150, 90, 0.22) 0%,
      rgba(200, 130, 70, 0.18) 15%,
      transparent 45%
    ),
    radial-gradient(
      circle at 35% 35%,
      rgba(200, 130, 70, 0.18) 0%,
      rgba(190, 120, 65, 0.14) 25%,
      rgba(160, 90, 45, 0.09) 45%,
      transparent 70%
    );
  filter: blur(18px);
  opacity: 0.7;
  transform: translateZ(0);
  animation: atmosphere-pulse 8s ease-in-out infinite, atmosphere-rotate 30s linear infinite;
}

.planet-texture {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  opacity: 0.68;
  transform: translateZ(0);
  background-image: 
    radial-gradient(
      ellipse at 40% 45%,
      rgba(220, 140, 70, 0.25) 0%,
      rgba(200, 120, 60, 0.18) 8%,
      transparent 18%
    ),
    radial-gradient(
      ellipse at 70% 30%,
      rgba(200, 110, 60, 0.22) 0%,
      rgba(180, 100, 55, 0.16) 8%,
      transparent 15%
    ),
    radial-gradient(
      ellipse at 25% 65%,
      rgba(190, 100, 50, 0.24) 0%,
      rgba(170, 90, 50, 0.17) 7%,
      transparent 14%
    ),
    radial-gradient(
      ellipse at 82% 48%,
      rgba(210, 120, 60, 0.2) 0%,
      transparent 10%
    ),
    radial-gradient(
      ellipse at 15% 28%,
      rgba(220, 130, 65, 0.18) 0%,
      transparent 9%
    ),
    repeating-radial-gradient(
      ellipse at 50% 50%,
      transparent 0px,
      rgba(140, 75, 40, 0.24) 8px,
      rgba(120, 65, 35, 0.20) 10px,
      transparent 12px,
      transparent 22px,
      rgba(150, 80, 42, 0.22) 28px,
      rgba(130, 70, 38, 0.19) 30px,
      transparent 35px,
      transparent 45px
    ),
    conic-gradient(
      from 0deg at 50% 50%,
      transparent 0deg,
      rgba(140, 75, 40, 0.18) 20deg,
      transparent 40deg,
      transparent 80deg,
      rgba(150, 80, 42, 0.20) 100deg,
      transparent 120deg,
      transparent 160deg,
      rgba(130, 70, 38, 0.16) 180deg,
      transparent 200deg,
      transparent 240deg,
      rgba(145, 78, 40, 0.19) 260deg,
      transparent 280deg,
      transparent 320deg,
      rgba(140, 75, 40, 0.18) 340deg,
      transparent 360deg
    ),
    repeating-linear-gradient(
      47deg,
      transparent 0px,
      rgba(120, 65, 35, 0.08) 1px,
      transparent 2px,
      transparent 6px
    ),
    repeating-linear-gradient(
      -43deg,
      transparent 0px,
      rgba(110, 60, 30, 0.07) 1px,
      transparent 2px,
      transparent 8px
    );
  mix-blend-mode: soft-light;
  filter: blur(0.5px);
  animation: texture-shift 35s linear infinite;
}

.planet-surface-detail {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  opacity: 0.5;
  transform: translateZ(0);
  background-image: 
    radial-gradient(
      ellipse 45px 35px at 58% 52%,
      rgba(251, 146, 60, 0.25) 0%,
      rgba(249, 115, 22, 0.15) 40%,
      transparent 70%
    ),
    radial-gradient(
      ellipse 30px 25px at 28% 38%,
      rgba(180, 83, 9, 0.2) 0%,
      rgba(160, 82, 45, 0.1) 40%,
      transparent 70%
    ),
    radial-gradient(
      ellipse 35px 28px at 72% 68%,
      rgba(200, 100, 40, 0.18) 0%,
      rgba(180, 83, 9, 0.08) 40%,
      transparent 70%
    ),
    conic-gradient(
      from 45deg at 40% 40%,
      transparent 0deg,
      rgba(139, 69, 19, 0.08) 30deg,
      transparent 60deg,
      transparent 300deg,
      rgba(139, 69, 19, 0.08) 330deg,
      transparent 360deg
    );
  mix-blend-mode: multiply;
  filter: blur(1px);
  animation: surface-detail-rotate 45s linear infinite reverse;
}

.planet-rotation-markers {
  display: none;
}

.planet-shine-effect {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  overflow: hidden;
  transform: translateZ(0);
  opacity: 0.85;
  background-image: 
    radial-gradient(
      ellipse 80px 100px at 28% 22%,
      rgba(255, 255, 255, 0.35) 0%,
      rgba(255, 255, 255, 0.22) 20%,
      rgba(230, 170, 100, 0.14) 40%,
      transparent 65%
    ),
    radial-gradient(
      ellipse 50px 60px at 35% 35%,
      rgba(255, 255, 255, 0.28) 0%,
      rgba(210, 140, 80, 0.16) 30%,
      transparent 60%
    ),
    radial-gradient(
      ellipse 40px 35px at 65% 42%,
      rgba(220, 160, 100, 0.2) 0%,
      rgba(200, 140, 80, 0.14) 40%,
      transparent 70%
    ),
    radial-gradient(
      ellipse 35px 30px at 45% 68%,
      rgba(230, 170, 110, 0.18) 0%,
      transparent 60%
    ),
    radial-gradient(
      ellipse 120px 120px at 15% 50%,
      transparent 40%,
      rgba(210, 140, 80, 0.15) 60%,
      rgba(255, 255, 255, 0.22) 75%,
      transparent 85%
    );
  filter: blur(9px);
  mix-blend-mode: screen;
  animation: shine-pulse 6s ease-in-out infinite;
  pointer-events: none;
}

/* Orbital Stones */
.planet-orbit-container {
  position: absolute;
  inset: -80px;
  pointer-events: none;
  transform: translateZ(0);
}

.orbital-stone {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: 
    radial-gradient(
      ellipse at 35% 25%,
      rgba(255, 255, 255, 0.4) 0%,
      transparent 40%
    ),
    radial-gradient(
      circle at 30% 30%,
      rgba(200, 180, 160, 1) 0%,
      rgba(140, 120, 100, 0.95) 40%,
      rgba(100, 85, 70, 0.9) 70%,
      rgba(60, 50, 40, 0.85) 100%
    );
  box-shadow: 
    inset -3px -3px 6px rgba(0, 0, 0, 0.7),
    inset 2px 2px 3px rgba(255, 255, 255, 0.4),
    0 0 10px rgba(180, 160, 140, 0.5),
    0 3px 8px rgba(0, 0, 0, 0.6),
    0 0 20px rgba(251, 191, 36, 0.2);
  transform-origin: center center;
  will-change: transform;
  animation: stone-wobble 3s ease-in-out infinite;
  position: relative;
}

.orbital-stone::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: 
    repeating-linear-gradient(
      45deg,
      transparent 0px,
      rgba(100, 80, 60, 0.2) 1px,
      transparent 2px,
      transparent 3px
    );
  opacity: 0.6;
}

.stone-1 { width: 10px; height: 10px; top: 50%; left: 50%; animation: orbit-1 12s linear infinite, stone-wobble 2.5s ease-in-out infinite; }
.stone-2 { width: 7px; height: 7px; top: 50%; left: 50%; animation: orbit-2 18s linear infinite, stone-wobble 3.2s ease-in-out infinite; }
.stone-3 { width: 6px; height: 6px; top: 50%; left: 50%; animation: orbit-3 24s linear infinite, stone-wobble 4s ease-in-out infinite; }
.stone-4 { width: 9px; height: 9px; top: 50%; left: 50%; animation: orbit-4 15s linear infinite reverse, stone-wobble 2.8s ease-in-out infinite; }
.stone-5 { width: 8px; height: 8px; top: 50%; left: 50%; animation: orbit-5 20s linear infinite, stone-wobble 3.5s ease-in-out infinite; }
.stone-6 { width: 5px; height: 5px; top: 50%; left: 50%; animation: orbit-6 28s linear infinite, stone-wobble 4.5s ease-in-out infinite; }
.stone-7 { width: 11px; height: 11px; top: 50%; left: 50%; animation: orbit-7 10s linear infinite, stone-wobble 2.3s ease-in-out infinite; }
.stone-8 { width: 7px; height: 7px; top: 50%; left: 50%; animation: orbit-8 22s linear infinite reverse, stone-wobble 3.8s ease-in-out infinite; }
.stone-9 { width: 9px; height: 9px; top: 50%; left: 50%; animation: orbit-9 16s linear infinite, stone-wobble 3.1s ease-in-out infinite; }
.stone-10 { width: 6px; height: 6px; top: 50%; left: 50%; animation: orbit-10 30s linear infinite, stone-wobble 4.2s ease-in-out infinite; }
.stone-11 { width: 7px; height: 7px; top: 50%; left: 50%; animation: orbit-11 14s linear infinite reverse, stone-wobble 2.9s ease-in-out infinite; }
.stone-12 { width: 8px; height: 8px; top: 50%; left: 50%; animation: orbit-12 13s linear infinite, stone-wobble 3.3s ease-in-out infinite; }
.stone-13 { width: 6px; height: 6px; top: 50%; left: 50%; animation: orbit-13 26s linear infinite, stone-wobble 4.1s ease-in-out infinite; }
.stone-14 { width: 9px; height: 9px; top: 50%; left: 50%; animation: orbit-14 17s linear infinite reverse, stone-wobble 3.4s ease-in-out infinite; }
.stone-15 { width: 10px; height: 10px; top: 50%; left: 50%; animation: orbit-15 11s linear infinite, stone-wobble 2.4s ease-in-out infinite; }
.stone-16 { width: 7px; height: 7px; top: 50%; left: 50%; animation: orbit-16 21s linear infinite, stone-wobble 3.7s ease-in-out infinite; }
.stone-17 { width: 5px; height: 5px; top: 50%; left: 50%; animation: orbit-17 27s linear infinite reverse, stone-wobble 4.3s ease-in-out infinite; }
.stone-18 { width: 8px; height: 8px; top: 50%; left: 50%; animation: orbit-18 12s linear infinite, stone-wobble 2.7s ease-in-out infinite; }

@keyframes orbit-1 { 0% { transform: translate(-50%, -50%) rotate(0deg) translateX(160px) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg) translateX(160px) rotate(-360deg); } }
@keyframes orbit-2 { 0% { transform: translate(-50%, -50%) rotate(45deg) translateX(195px) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(405deg) translateX(195px) rotate(-360deg); } }
@keyframes orbit-3 { 0% { transform: translate(-50%, -50%) rotate(120deg) translateX(220px) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(480deg) translateX(220px) rotate(-360deg); } }
@keyframes orbit-4 { 0% { transform: translate(-50%, -50%) rotate(180deg) translateX(170px) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(540deg) translateX(170px) rotate(-360deg); } }
@keyframes orbit-5 { 0% { transform: translate(-50%, -50%) rotate(270deg) translateX(185px) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(630deg) translateX(185px) rotate(-360deg); } }
@keyframes orbit-6 { 0% { transform: translate(-50%, -50%) rotate(315deg) translateX(210px) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(675deg) translateX(210px) rotate(-360deg); } }
@keyframes orbit-7 { 0% { transform: translate(-50%, -50%) rotate(90deg) translateX(150px) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(450deg) translateX(150px) rotate(-360deg); } }
@keyframes orbit-8 { 0% { transform: translate(-50%, -50%) rotate(200deg) translateX(205px) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(560deg) translateX(205px) rotate(-360deg); } }
@keyframes orbit-9 { 0% { transform: translate(-50%, -50%) rotate(150deg) translateX(175px) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(510deg) translateX(175px) rotate(-360deg); } }
@keyframes orbit-10 { 0% { transform: translate(-50%, -50%) rotate(240deg) translateX(230px) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(600deg) translateX(230px) rotate(-360deg); } }
@keyframes orbit-11 { 0% { transform: translate(-50%, -50%) rotate(60deg) translateX(180px) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(420deg) translateX(180px) rotate(-360deg); } }
@keyframes orbit-12 { 0% { transform: translate(-50%, -50%) rotate(300deg) translateX(165px) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(660deg) translateX(165px) rotate(-360deg); } }
@keyframes orbit-13 { 0% { transform: translate(-50%, -50%) rotate(135deg) translateX(215px) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(495deg) translateX(215px) rotate(-360deg); } }
@keyframes orbit-14 { 0% { transform: translate(-50%, -50%) rotate(225deg) translateX(175px) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(585deg) translateX(175px) rotate(-360deg); } }
@keyframes orbit-15 { 0% { transform: translate(-50%, -50%) rotate(30deg) translateX(155px) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(390deg) translateX(155px) rotate(-360deg); } }
@keyframes orbit-16 { 0% { transform: translate(-50%, -50%) rotate(330deg) translateX(190px) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(690deg) translateX(190px) rotate(-360deg); } }
@keyframes orbit-17 { 0% { transform: translate(-50%, -50%) rotate(105deg) translateX(225px) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(465deg) translateX(225px) rotate(-360deg); } }
@keyframes orbit-18 { 0% { transform: translate(-50%, -50%) rotate(285deg) translateX(168px) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(645deg) translateX(168px) rotate(-360deg); } }

@keyframes stone-wobble {
  0%, 100% { filter: brightness(1) drop-shadow(0 0 3px rgba(180, 160, 140, 0.6)); }
  25% { filter: brightness(1.3) drop-shadow(0 0 5px rgba(255, 255, 255, 0.8)); }
  50% { filter: brightness(0.85) drop-shadow(0 0 2px rgba(180, 160, 140, 0.4)); }
  75% { filter: brightness(1.15) drop-shadow(0 0 4px rgba(251, 191, 36, 0.7)); }
}

@keyframes planet-float {
  0%, 100% { transform: translate(-50%, -50%) translateZ(0) scale(1); }
  50% { transform: translate(-50%, -48%) translateZ(0) scale(1.03); }
}

@keyframes planet-rotate {
  0% { transform: translateZ(0) rotate(0deg); }
  100% { transform: translateZ(0) rotate(360deg); }
}

@keyframes atmosphere-pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 0.9; }
}

@keyframes atmosphere-rotate {
  0% { transform: translateZ(0) rotate(0deg) scale(1); }
  25% { transform: translateZ(0) rotate(90deg) scale(1.02); }
  50% { transform: translateZ(0) rotate(180deg) scale(1.05); }
  75% { transform: translateZ(0) rotate(270deg) scale(1.02); }
  100% { transform: translateZ(0) rotate(360deg) scale(1); }
}

@keyframes texture-shift {
  0% { transform: translateZ(0) translateX(0) rotate(0deg); }
  100% { transform: translateZ(0) translateX(15px) rotate(360deg); }
}

@keyframes surface-detail-rotate {
  0% { transform: translateZ(0) rotate(0deg); }
  100% { transform: translateZ(0) rotate(360deg); }
}

@keyframes shine-pulse {
  0% { opacity: 0.6; transform: translateZ(0) scale(1) translateX(0); }
  25% { opacity: 1; transform: translateZ(0) scale(1.05) translateX(2px); }
  50% { opacity: 0.7; transform: translateZ(0) scale(0.98) translateX(-1px); }
  75% { opacity: 0.95; transform: translateZ(0) scale(1.02) translateX(1px); }
  100% { opacity: 0.6; transform: translateZ(0) scale(1) translateX(0); }
}

/* Particles */
.comet-hero-particles {
  position: absolute;
  inset: 0;
  z-index: 6;
  pointer-events: none;
  transform: translateZ(0);
}

.comet-particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0.8) 30%,
    transparent 70%
  );
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.9),
              0 0 12px rgba(59, 130, 246, 0.5);
  pointer-events: none;
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* Text Elements */
.gradient-text {
  background: linear-gradient(
    135deg,
    #f97316 0%,
    #fb923c 30%,
    #ec4899 70%,
    #f472b6 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
  position: relative;
  display: inline-block;
  text-shadow: none;
  letter-spacing: -0.015em;
}

.gradient-text::before {
  content: '';
  position: absolute;
  inset: -5px -8px;
  background: radial-gradient(
    ellipse at center,
    rgba(249, 115, 22, 0.15) 0%,
    rgba(236, 72, 153, 0.12) 60%,
    transparent 100%
  );
  border-radius: 8px;
  z-index: -1;
  filter: blur(12px);
  opacity: 0.6;
  animation: gradient-pulse 3.5s ease-in-out infinite;
}

@keyframes gradient-pulse {
  0%, 100% { opacity: 0.4; transform: scale(0.98); }
  50% { opacity: 0.8; transform: scale(1.01); }
}

.comet-label-container {
  position: absolute;
  top: 18%;
  left: 0;
  right: 0;
  z-index: 6;
  text-align: center;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.comet-label {
  position: relative;
  display: inline-block;
  padding: 0.15rem 0;
  cursor: pointer;
}

.comet-label:hover .comet-label-shine {
  animation: shine-sweep 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.comet-label-text {
  font-family: 'Plus Jakarta Sans', 'Sora', 'Inter', -apple-system, system-ui, sans-serif;
  font-size: clamp(1rem, 2vw, 1.5rem);
  font-weight: 700;
  letter-spacing: 0.4em;
  color: #ffffff;
  text-shadow: 
    0 0 25px rgba(168, 85, 247, 0.5),
    0 0 50px rgba(59, 130, 246, 0.3),
    0 2px 15px rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 2;
  display: inline-block;
}

.comet-label-shine {
  position: absolute;
  inset: -2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    transparent 40%,
    rgba(255, 255, 255, 0.6) 50%,
    rgba(168, 85, 247, 0.4) 52%,
    transparent 60%,
    transparent 100%
  );
  background-size: 300% 100%;
  background-position: 150% 0;
  animation: none;
  pointer-events: none;
  z-index: 3;
  mix-blend-mode: screen;
  border-radius: 6px;
  opacity: 0;
}

@keyframes shine-sweep {
  0% { background-position: 150% 0; opacity: 0; }
  10% { opacity: 1; }
  90% { background-position: -150% 0; opacity: 1; }
  100% { background-position: -150% 0; opacity: 0; }
}

.comet-main-heading-container {
  position: absolute;
  top: 40%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  z-index: 6;
  text-align: center;
  width: 100%;
  padding: 0 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.comet-main-heading {
  font-family: 'Plus Jakarta Sans', 'Sora', 'Inter', -apple-system, system-ui, sans-serif;
  font-size: clamp(1.75rem, 3.5vw, 3rem);
  font-weight: 500;
  line-height: 1.4;
  color: #f8fafc;
  letter-spacing: -0.015em;
  margin: 0;
  text-shadow: 0 2px 25px rgba(0, 0, 0, 0.6);
  transform: translateZ(0);
  text-align: center;
  max-width: 90%;
}

.heading-line-1 {
  display: inline-block;
}

.heading-line-2 {
  display: inline-block;
  padding-left: 0;
  margin-left: -1rem; 
  margin-top: 1rem; 
}

.comet-subtitle-bottom-right {
  position: absolute;
  bottom: 15%;
  left: 0;
  right: 0;
  z-index: 8;
  text-align: center;
  width: 100%;
  padding: 0 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.comet-subtitle-text {
  font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, system-ui, sans-serif;
  font-size: clamp(0.85rem, 1.3vw, 1.05rem);
  font-weight: 700;
  line-height: 1.5;
  color: #cbd5e1;
  letter-spacing: 0.02em;
  margin: 0;
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.7);
  transform: translateZ(0);
  text-align: center;
  max-width: 90%;
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .comet-label-container { top: 20%; }
  .comet-label-text { font-size: clamp(0.9rem, 2vw, 1.3rem); letter-spacing: 0.3em; }
  .comet-main-heading-container { top: 50%; padding: 0 1rem; }
  .comet-main-heading { max-width: 95%; font-size: clamp(1.5rem, 4vw, 2.5rem); line-height: 1.3; }
  .heading-line-2 { padding-left: clamp(0.75rem, 3vw, 2.5rem); }
  .comet-subtitle-bottom-right { bottom: 17%; padding: 0 1rem; }
  .comet-subtitle-text { max-width: 95%; font-size: clamp(0.8rem, 1.8vw, 0.98rem); }
  .comet-hero-planet { width: 240px; height: 240px; }
  .stone-1 { width: 8px; height: 8px; } .stone-2 { width: 6px; height: 6px; }
  .stone-3 { width: 5px; height: 5px; } .stone-4 { width: 7px; height: 7px; }
  .stone-5 { width: 6px; height: 6px; } .stone-6 { width: 4px; height: 4px; }
  .stone-7 { width: 9px; height: 9px; } .stone-8 { width: 6px; height: 6px; }
  .stone-9 { width: 7px; height: 7px; } .stone-10 { width: 5px; height: 5px; }
  .stone-11 { width: 6px; height: 6px; } .stone-12 { width: 7px; height: 7px; }
  .stone-13 { width: 5px; height: 5px; } .stone-14 { width: 8px; height: 8px; }
  .stone-15 { width: 9px; height: 9px; } .stone-16 { width: 6px; height: 6px; }
  .stone-17 { width: 4px; height: 4px; } .stone-18 { width: 7px; height: 7px; }
}

@media (max-width: 768px) {
  .comet-label-container { top: 22%; }
  .comet-label-text { font-size: clamp(0.85rem, 2.5vw, 1.1rem); letter-spacing: 0.25em; }
  .comet-main-heading-container { top: 50%; padding: 0 0.75rem; }
  .comet-main-heading { max-width: 96%; font-size: clamp(1.35rem, 5.5vw, 2.25rem); line-height: 1.25; }
  .heading-line-2 { padding-left: clamp(0.5rem, 2.5vw, 2rem); }
  .comet-subtitle-bottom-right { bottom: 20%; padding: 0 0.75rem; }
  .comet-subtitle-text { max-width: 96%; font-size: clamp(0.75rem, 2.2vw, 0.92rem); }
  .comet-hero-planet { width: 190px; height: 190px; }
  .stone-5, .stone-6, .stone-8, .stone-10, .stone-13, .stone-16, .stone-17 { display: none; }
  .stone-1 { width: 7px; height: 7px; } .stone-2 { width: 5px; height: 5px; }
  .stone-3 { width: 4px; height: 4px; } .stone-4 { width: 6px; height: 6px; }
  .stone-7 { width: 8px; height: 8px; } .stone-9 { width: 6px; height: 6px; }
  .stone-11 { width: 5px; height: 5px; } .stone-12 { width: 6px; height: 6px; }
  .stone-14 { width: 7px; height: 7px; } .stone-15 { width: 7px; height: 7px; }
  .stone-18 { width: 6px; height: 6px; }
  .comet-particle:nth-child(n + 30) { display: none; }
}

@media (max-width: 480px) {
  .comet-label-container { top: 25%; }
  .comet-label-text { font-size: clamp(0.7rem, 3vw, 0.95rem); letter-spacing: 0.2em; }
  .comet-main-heading-container { top: 50%; padding: 0 0.5rem; }
  .comet-main-heading { max-width: 98%; font-size: clamp(1.15rem, 6.5vw, 1.85rem); line-height: 1.2; }
  .heading-line-2 { padding-left: clamp(0.25rem, 2vw, 1.5rem); }
  .comet-subtitle-bottom-right { bottom: 23%; padding: 0 0.5rem; }
  .comet-subtitle-text { max-width: 98%; font-size: clamp(0.65rem, 2.5vw, 0.88rem); }
  .comet-hero-planet { width: 150px; height: 150px; }
  .stone-3, .stone-4, .stone-9, .stone-11, .stone-12, .stone-14, .stone-18 { display: none; }
  .stone-1 { width: 6px; height: 6px; } .stone-2 { width: 4px; height: 4px; }
  .stone-7 { width: 7px; height: 7px; } .stone-15 { width: 6px; height: 6px; }
  .comet-particle:nth-child(n + 20) { display: none; }
}

@media (max-width: 360px) {
  .comet-label-container { top: 27%; }
  .comet-label-text { font-size: clamp(0.65rem, 3.5vw, 0.85rem); letter-spacing: 0.15em; }
  .comet-main-heading-container { top: 50%; padding: 0 0.25rem; }
  .comet-main-heading { max-width: 100%; font-size: clamp(1rem, 7vw, 1.5rem); line-height: 1.15; }
  .heading-line-2 { padding-left: clamp(0.15rem, 1.5vw, 1rem); }
  .comet-subtitle-bottom-right { bottom: 25%; padding: 0 0.25rem; }
  .comet-subtitle-text { max-width: 100%; font-size: clamp(0.6rem, 3vw, 0.8rem); }
  .comet-hero-planet { width: 130px; height: 130px; }
  .orbital-stone { opacity: 0.6; }
  .stone-1, .stone-2 { width: 4px !important; height: 4px !important; }
  .comet-particle { opacity: 0.5 !important; }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .comet-particle, .comet-hero-gradient, .comet-hero-radial-glow,
  .comet-hero-planet, .planet-core, .planet-atmosphere, .planet-texture,
  .planet-surface-detail, .planet-shine-effect, .orbital-stone, .twinkling-star {
    animation: none !important;
  }
  .comet-particle { opacity: 0.4 !important; }
  .comet-hero-planet { opacity: 0.6 !important; }
  .orbital-stone { display: none; }
  * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
}

@media (prefers-contrast: high) {
  .comet-hero-title { text-shadow: none; font-weight: 600; color: #ffffff; }
  .gradient-text { -webkit-text-fill-color: #fbbf24; font-weight: 800; }
  .gradient-text::before { display: none; }
  .comet-label-text { text-shadow: 0 0 5px rgba(255, 255, 255, 0.8); }
  .comet-label-shine { display: none; }
  .comet-hero-subtitle-bottom { text-shadow: none; color: #e5e7eb; }
}

/* GPU Acceleration */
.comet-particle, .comet-hero-gradient, .comet-hero-radial-glow,
.orbital-stone, .twinkling-star {
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}
      `}</style>

      <div
        className={`comet-hero-container ${className}`}
        style={{
          backgroundColor: theme.backgroundColor || '#0a1628',
        }}
      >
        {/* Animated Background Gradient */}
        <div className="comet-hero-gradient" />

        {/* Twinkling Stars Background */}
        <div className="twinkling-stars-container">
          {twinklingStars.map((star) => (
            <div
              key={star.id}
              className="twinkling-star"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDuration: `${star.duration}s`,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Dynamic Vignette */}
        <div className="comet-hero-vignette" />

        {/* Radial Glow Effect */}
        <div className="comet-hero-radial-glow" />

        {/* COMET Label - Top Center */}
        <motion.div
          className="comet-label-container"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="comet-label">
            <span className="comet-label-text">COMET</span>
            <div className="comet-label-shine" />
          </div>
        </motion.div>

        {/* Main Heading - Between COMET and Planet */}
        <motion.div
          className="comet-main-heading-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="comet-main-heading">
            <span className="heading-line-1">Transform <span className="gradient-text">AI</span></span>
            <br />
            <span className="heading-line-2">with <span className="gradient-text">Cosmic</span> Intelligence</span>
          </h1>
        </motion.div>

        {/* Jupiter-like Planet Sphere */}
        <div className="comet-hero-planet">
          <div className="planet-core" />
          <div className="planet-atmosphere" />
          <div className="planet-texture" />
          <div className="planet-surface-detail" />
          <div className="planet-shine-effect" />
          <div className="planet-rotation-markers" />
          
          {/* Orbiting Asteroids/Stones */}
          <div className="planet-orbit-container">
            <div className="orbital-stone stone-1" />
            <div className="orbital-stone stone-2" />
            <div className="orbital-stone stone-3" />
            <div className="orbital-stone stone-4" />
            <div className="orbital-stone stone-5" />
            <div className="orbital-stone stone-6" />
            <div className="orbital-stone stone-7" />
            <div className="orbital-stone stone-8" />
            <div className="orbital-stone stone-9" />
            <div className="orbital-stone stone-10" />
            <div className="orbital-stone stone-11" />
            <div className="orbital-stone stone-12" />
            <div className="orbital-stone stone-13" />
            <div className="orbital-stone stone-14" />
            <div className="orbital-stone stone-15" />
            <div className="orbital-stone stone-16" />
            <div className="orbital-stone stone-17" />
            <div className="orbital-stone stone-18" />
          </div>
        </div>

        {/* Enhanced Particles */}
        {showParticles && (
          <div className="comet-hero-particles">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="comet-particle"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                }}
                animate={{
                  opacity: [particle.opacity * 0.3, particle.opacity, particle.opacity * 0.3],
                  scale: [1, 1.3, 1],
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        )}

        {/* Subtitle - Bottom Center */}
        <motion.div
          className="comet-subtitle-bottom-right"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="comet-subtitle-text">
            {subtitle}
          </p>
        </motion.div>

        {/* Magical Cursor Trail Effect */}
        <CursorTrail />
      </div>
    </>
  );
};

