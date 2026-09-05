import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Config {
  particleCount: number;
  particleRadius: number;
  maxSpeed: number;
  connectionDistance: number;
  mouseRadius: number;
  particleColor: string;
  lineColor: string;
  mouseLineColor: string;
}

export default function ParticleAnimation(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  const config: Config = {
    particleCount: 100,
    particleRadius: 2,
    maxSpeed: 0.8,
    connectionDistance: 120,
    mouseRadius: 150,
    particleColor: 'rgba(147, 51, 234, 0.8)',
    lineColor: 'rgba(147, 51, 234, 0.15)',
    mouseLineColor: 'rgba(236, 72, 153, 0.3)',
  };

  const initParticles = (width: number, height: number): Particle[] => {
    const particles: Particle[] = [];
    for (let i = 0; i < config.particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * config.maxSpeed,
        vy: (Math.random() - 0.5) * config.maxSpeed,
        radius: config.particleRadius,
      });
    }
    return particles;
  };

  const distance = (x1: number, y1: number, x2: number, y2: number): number => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const updateParticles = (particles: Particle[], width: number, height: number): void => {
    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > width) {
        particle.vx *= -1;
        particle.x = Math.max(0, Math.min(width, particle.x));
      }
      if (particle.y < 0 || particle.y > height) {
        particle.vy *= -1;
        particle.y = Math.max(0, Math.min(height, particle.y));
      }
    });
  };

  const draw = (
    ctx: CanvasRenderingContext2D,
    particles: Particle[],
    width: number,
    height: number,
    mouseX: number,
    mouseY: number
  ): void => {
    ctx.clearRect(0, 0, width, height);

    // Draw particle-to-particle connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = distance(
          particles[i].x,
          particles[i].y,
          particles[j].x,
          particles[j].y
        );

        if (dist < config.connectionDistance) {
          const opacity = (1 - dist / config.connectionDistance) * 0.3;
          ctx.strokeStyle = config.lineColor.replace('0.15', opacity.toString());
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw mouse connections
    particles.forEach((particle) => {
      const dist = distance(particle.x, particle.y, mouseX, mouseY);
      if (dist < config.mouseRadius) {
        const opacity = (1 - dist / config.mouseRadius) * 0.5;
        ctx.strokeStyle = config.mouseLineColor.replace('0.3', opacity.toString());
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
      }
    });

    // Draw particles
    particles.forEach((particle) => {
      const dist = distance(particle.x, particle.y, mouseX, mouseY);
      const isNearMouse = dist < config.mouseRadius;
      
      ctx.fillStyle = isNearMouse 
        ? 'rgba(236, 72, 153, 0.9)' 
        : config.particleColor;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();

      if (isNearMouse) {
        const glowRadius = particle.radius + 4;
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          particle.radius,
          particle.x,
          particle.y,
          glowRadius
        );
        gradient.addColorStop(0, 'rgba(236, 72, 153, 0.4)');
        gradient.addColorStop(1, 'rgba(236, 72, 153, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Mouse cursor glow
    if (mouseX > 0 && mouseY > 0) {
      const cursorGradient = ctx.createRadialGradient(
        mouseX,
        mouseY,
        0,
        mouseX,
        mouseY,
        40
      );
      cursorGradient.addColorStop(0, 'rgba(236, 72, 153, 0.2)');
      cursorGradient.addColorStop(1, 'rgba(236, 72, 153, 0)');
      ctx.fillStyle = cursorGradient;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 40, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const animate = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    updateParticles(particlesRef.current, canvas.width, canvas.height);
    draw(ctx, particlesRef.current, canvas.width, canvas.height, mousePosRef.current.x, mousePosRef.current.y);

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseLeave = (): void => {
    mousePosRef.current = { x: -1000, y: -1000 };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = (): void => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = initParticles(canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="relative w-screen h-screen m-0 p-0 overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@900&family=Rajdhani:wght@300;500&display=swap"
        rel="stylesheet"
      />
      
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full block pointer-events-none z-0"
      />

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 pointer-events-none px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <motion.h1
          className="text-5xl md:text-7xl font-black text-white mb-4 tracking-wider"
          style={{ 
            fontFamily: "'Orbitron', monospace",
            textShadow: '0 0 20px rgba(147, 51, 234, 0.5), 0 0 40px rgba(147, 51, 234, 0.3), 0 0 60px rgba(147, 51, 234, 0.2)'
          }}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, type: 'spring', stiffness: 50 }}
        >
          Particle Network
        </motion.h1>
        <motion.p
          className="text-lg md:text-2xl font-light text-white/70 tracking-wide"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, type: 'spring', stiffness: 50 }}
        >
          Move your mouse to interact with the particles
        </motion.p>
      </motion.div>
    </div>
  );
}
