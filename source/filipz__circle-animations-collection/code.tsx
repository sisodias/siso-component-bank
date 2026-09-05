'use client';

import React, { useRef, useEffect, useState } from 'react';

// TYPE DEFINITIONS for animation logic
type GetForegroundColor = () => string;

type AnimationFunction = (
  ctx: CanvasRenderingContext2D,
  getForegroundColor: GetForegroundColor
) => () => void;

// PROPS INTERFACE
interface CircleAnimationProps {
  title: string;
  animationId: string;
  className?: string;
}

// CORNER ICON COMPONENT
const CornerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <polygon
      points="448,224 288,224 288,64 224,64 224,224 64,224 64,288 224,288 224,448 288,448 288,288 448,288"
      fill="currentColor"
    />
  </svg>
);

// MAIN REUSABLE COMPONENT
export const CircleAnimation: React.FC<CircleAnimationProps> = ({ title, animationId, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [foregroundColor, setForegroundColor] = useState('0 0% 98%');

  useEffect(() => {
    if (typeof window !== 'undefined' && containerRef.current) {
      const fgColor = getComputedStyle(containerRef.current).getPropertyValue('--foreground').trim();
      if (fgColor) {
        setForegroundColor(fgColor);
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setupFunction = animationMap[animationId];
    if (!setupFunction) {
      console.error(`Animation with id "${animationId}" not found.`);
      return;
    }
    
    const getFg = () => foregroundColor;
    const cleanup = setupFunction(ctx, getFg);
    
    return cleanup;
  }, [animationId, foregroundColor]);

  const Corner = ({ position, rotation, delay }: { position: string; rotation?: string; delay: string }) => (
    <div
      className={`corner absolute z-10 h-4 w-4 text-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${position}`}
      style={{ transitionDelay: delay, transform: rotation }}
    >
      <CornerIcon />
    </div>
  );

  return (
    <div
      className={`group relative flex h-[220px] w-[220px] flex-col items-center overflow-visible border border-foreground/10 bg-black/50 p-2.5 transition-colors duration-300 hover:border-foreground/30 ${className || ''}`}
      ref={containerRef}
    >
      <Corner position="top-[-8px] left-[-8px]" delay="0s" />
      <Corner position="top-[-8px] right-[-8px]" rotation="rotate(90deg)" delay="0.1s" />
      <Corner position="bottom-[-8px] left-[-8px]" rotation="rotate(-90deg)" delay="0.2s" />
      <Corner position="bottom-[-8px] right-[-8px]" rotation="rotate(180deg)" delay="0.3s" />
      
      <div className="mb-[10px] text-center text-xs uppercase tracking-[0.5px]">{title}</div>
      <div className="relative flex h-[180px] w-[180px] items-center justify-center">
        {animationId === 'pendulum-wave' && (
          <div style={{
            position: 'absolute',
            width: '120px',
            height: '1px',
            left: '30px',
            top: '0px',
            backgroundColor: `hsla(${foregroundColor}, 0.15)`,
          }} />
        )}
        <canvas
          ref={canvasRef}
          width="180"
          height="180"
          className="absolute left-0 top-0"
        />
      </div>
    </div>
  );
};


// SELF-CONTAINED ANIMATION LOGIC (UNCHANGED)

function createAnimationLoop(
  drawFrame: (ctx: CanvasRenderingContext2D, time: number, getForegroundColor: GetForegroundColor) => void
): AnimationFunction {
  return (ctx, getForegroundColor) => {
    let animationFrameId: number;
    let lastTime = 0;
    let time = 0;

    const animate = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      time += deltaTime * 0.001;
      
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      drawFrame(ctx, time, getForegroundColor);
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  };
}

const setupRadialPulse = createAnimationLoop((ctx, time, getForegroundColor) => {
    const fg = getForegroundColor();
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const maxRadius = 75;
    const ringCount = 8;
    const dotsPerRing = 12;
    const pulseSpeed = 0.35;

    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${fg}, 0.9)`;
    ctx.fill();

    for (let i = 0; i < ringCount; i++) {
        const pulsePhase = (time * pulseSpeed + i / ringCount) % 1;
        const ringRadius = pulsePhase * maxRadius;
        if (ringRadius < 5) continue;
        const opacity = 1 - pulsePhase;
        for (let j = 0; j < dotsPerRing; j++) {
            const angle = (j / dotsPerRing) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * ringRadius;
            const y = centerY + Math.sin(angle) * ringRadius;
            const dotSize = 2.5 * (1 - pulsePhase * 0.5);
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${fg}, ${opacity})`;
            ctx.fill();
        }
    }
});

const setupOrbitalPulse = createAnimationLoop((ctx, time, getForegroundColor) => {
    const fg = getForegroundColor();
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const maxRadius = 75;
    const orbits = [{radius: 15, dotCount: 6}, {radius: 25, dotCount: 10}, {radius: 35, dotCount: 14}, {radius: 45, dotCount: 18}, {radius: 55, dotCount: 22}, {radius: 65, dotCount: 26}];
    const pulseFrequency = 0.5;
    const pulseAmplitude = 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${fg}, 0.9)`;
    ctx.fill();

    orbits.forEach((orbit) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, orbit.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${fg}, 0.05)`;
        ctx.lineWidth = 1;
        ctx.stroke();
        const normalizedRadius = orbit.radius / maxRadius;
        const pulseDelay = normalizedRadius * 1.5;
        const pulsePhase = (time * pulseFrequency - pulseDelay) % 1;
        const pulseEffect = Math.sin(pulsePhase * Math.PI) * pulseAmplitude;
        const finalPulseEffect = pulseEffect > 0 ? pulseEffect : 0;
        for (let i = 0; i < orbit.dotCount; i++) {
            const angle = (i / orbit.dotCount) * Math.PI * 2;
            const pulsedRadius = orbit.radius + finalPulseEffect;
            const x = centerX + Math.cos(angle) * pulsedRadius;
            const y = centerY + Math.sin(angle) * pulsedRadius;
            const dotSize = 2 + (finalPulseEffect / pulseAmplitude) * 1.5;
            const opacity = 0.7 + (finalPulseEffect / pulseAmplitude) * 0.3;
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${fg}, ${opacity})`;
            ctx.fill();
        }
    });
});

const setupPendulumWave = createAnimationLoop((ctx, time, getForegroundColor) => {
    const fg = getForegroundColor();
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const pendulumCount = 15;
    const baseFrequency = 0.5;
    const pendulumLength = 90;
    const maxAngle = Math.PI / 12;

    const angle = Math.sin(time * baseFrequency * Math.PI) * maxAngle;
    for (let i = 0; i < pendulumCount; i++) {
        const pendulumX = centerX - pendulumCount * 4 + i * 8;
        const pendulumY = centerY - pendulumLength;
        const bobX = pendulumX + Math.sin(angle) * pendulumLength;
        const bobY = pendulumY + Math.cos(angle) * pendulumLength;
        ctx.beginPath();
        ctx.moveTo(pendulumX, pendulumY);
        ctx.lineTo(bobX, bobY);
        ctx.strokeStyle = `hsla(${fg}, 0.4)`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(bobX, bobY, 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${fg}, 0.9)`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(pendulumX, pendulumY, 1, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${fg}, 0.5)`;
        ctx.fill();
    }
});

const setupPulseWave = createAnimationLoop((ctx, time, getForegroundColor) => {
    const fg = getForegroundColor();
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const dotRings = [{radius: 15, count: 6}, {radius: 30, count: 12}, {radius: 45, count: 18}, {radius: 60, count: 24}, {radius: 75, count: 30}];

    ctx.beginPath();
    ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${fg}, 0.9)`;
    ctx.fill();

    dotRings.forEach((ring, ringIndex) => {
        for (let i = 0; i < ring.count; i++) {
            const angle = (i / ring.count) * Math.PI * 2;
            const radiusPulse = Math.sin(time * 2 - ringIndex * 0.4) * 3;
            const x = centerX + Math.cos(angle) * (ring.radius + radiusPulse);
            const y = centerY + Math.sin(angle) * (ring.radius + radiusPulse);
            const opacityWave = 0.4 + Math.sin(time * 2 - ringIndex * 0.4 + i * 0.2) * 0.6;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${fg}, ${opacityWave})`;
            ctx.fill();
        }
    });
});

const setupConcentricRings = createAnimationLoop((ctx, time, getForegroundColor) => {
    const fg = getForegroundColor();
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const ringCount = 5;
    const maxRadius = 75;

    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${fg}, 0.9)`;
    ctx.fill();

    for (let r = 0; r < ringCount; r++) {
        const radius = ((r + 1) / ringCount) * maxRadius;
        const dotCount = 6 + r * 6;
        const phaseOffset = r % 2 === 0 ? time * 0.2 : -time * 0.2;
        const ringPhase = time + r * 0.7;
        for (let i = 0; i < dotCount; i++) {
            const angle = (i / dotCount) * Math.PI * 2 + phaseOffset;
            const radiusPulse = Math.sin(ringPhase) * 3;
            const finalRadius = radius + radiusPulse;
            const x = centerX + Math.cos(angle) * finalRadius;
            const y = centerY + Math.sin(angle) * finalRadius;
            const baseSize = 2 + r / (ringCount - 1);
            const sizePulse = Math.sin(ringPhase) * baseSize * 0.7 + baseSize;
            const opacityPulse = 0.6 + Math.sin(ringPhase) * 0.4;
            ctx.beginPath();
            ctx.arc(x, y, sizePulse, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${fg}, ${opacityPulse})`;
            ctx.fill();
        }
    }
});

const setupSequentialPulse = createAnimationLoop((ctx, time, getForegroundColor) => {
    const fg = getForegroundColor();
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const radius = 70;
    const dotCount = 16;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${fg}, 0.9)`;
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(${fg}, 0.05)`;
    ctx.lineWidth = 1;
    ctx.stroke();

    for (let i = 0; i < dotCount; i++) {
        const angle = (i / dotCount) * Math.PI * 2;
        const pulsePhase = (time * 0.5 + i / dotCount) % 1;
        const pulseFactor = Math.sin(pulsePhase * Math.PI * 2);
        const size = 2 + pulseFactor * 2;
        const finalRadius = radius + pulseFactor * 5;
        const x = centerX + Math.cos(angle) * finalRadius;
        const y = centerY + Math.sin(angle) * finalRadius;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `hsla(${fg}, ${0.1 + pulseFactor * 0.2})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${fg}, 0.9)`;
        ctx.fill();
    }
});

const setupOscillatingDots = createAnimationLoop((ctx, time, getForegroundColor) => {
    const fg = getForegroundColor();
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const dotCount = 20;
    const rowCount = 5;
    const spacing = 15;

    for (let row = 0; row < rowCount; row++) {
        const y = centerY - ((rowCount - 1) / 2) * spacing + row * spacing;
        for (let i = 0; i < dotCount; i++) {
            const baseX = centerX - ((dotCount - 1) / 2) * 8 + i * 8;
            const amplitude = 4 + row * 2;
            const frequency = 1 + row * 0.2;
            const phaseOffset = row * 0.5;
            const offset = Math.sin(time * frequency + i * 0.2 + phaseOffset) * amplitude;
            const finalY = y + offset;
            ctx.beginPath();
            ctx.arc(baseX, finalY, 2, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${fg}, 0.9)`;
            ctx.fill();
        }
    }
});

const setupPulsingGrid = createAnimationLoop((ctx, time) => {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const gridSize = 5;
    const spacing = 15;
    const breathingFactor = Math.sin(time * 0.5) * 0.2 + 1.0;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fill();

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (row === Math.floor(gridSize / 2) && col === Math.floor(gridSize / 2)) continue;

            const baseX = (col - (gridSize - 1) / 2) * spacing;
            const baseY = (row - (gridSize - 1) / 2) * spacing;
            const distance = Math.sqrt(baseX * baseX + baseY * baseY);
            const maxDistance = (spacing * Math.sqrt(2) * (gridSize - 1)) / 2;
            const normalizedDistance = distance / maxDistance;
            const angle = Math.atan2(baseY, baseX);
            
            const radialWave = Math.sin(((time - normalizedDistance) % 1) * Math.PI * 2) * 4;
            const breathingX = baseX * breathingFactor;
            const breathingY = baseY * breathingFactor;
            const waveX = centerX + breathingX + Math.cos(angle) * radialWave;
            const waveY = centerY + breathingY + Math.sin(angle) * radialWave;
            
            const baseSize = 1.5 + (1 - normalizedDistance) * 1.5;
            const pulseFactor = Math.sin(time * 2 + normalizedDistance * 5) * 0.6 + 1;
            const size = baseSize * pulseFactor;
            
            const blueAmount = Math.sin(time * 1.0 + normalizedDistance * 3) * 0.3 + 0.3;
            const whiteness = 1 - blueAmount;
            const r = Math.floor(255 * whiteness + 200 * blueAmount);
            const g = Math.floor(255 * whiteness + 220 * blueAmount);
            const b = 255;
            
            const opacity = 0.5 + Math.sin(time * 1.5 + angle * 3) * 0.2 + normalizedDistance * 0.3;
            
            ctx.beginPath();
            ctx.arc(waveX, waveY, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            ctx.fill();
        }
    }
});

const setupSpiralGalaxy: AnimationFunction = (ctx) => {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const particleCount = 200;
    const maxRadius = 75;
    const spiralArms = 3;
    const rotationSpeed = 0.1;
    const particles = Array.from({ length: particleCount }, () => {
        const distance = Math.pow(Math.random(), 0.5) * maxRadius;
        const armIndex = Math.floor(Math.random() * spiralArms);
        const armOffset = (armIndex / spiralArms) * Math.PI * 2;
        const spiralAngle = Math.log(distance / 5) / 0.2;
        return {
            distance: distance,
            angle: spiralAngle + armOffset,
            armIndex: armIndex,
            size: 1 + Math.random() * 1.5,
            opacity: 0.3 + Math.random() * 0.7,
            speedFactor: 0.8 + Math.random() * 0.4,
            color: { r: 220 + Math.floor(Math.random() * 35), g: 220 + Math.floor(Math.random() * 35), b: 255 }
        };
    });

    let animationFrameId: number;
    let lastTime = 0;
    let time = 0;

    const animate = (timestamp: number) => {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        time += deltaTime * 0.001;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();

        for (const p of particles) {
            const rotationFactor = 1 / Math.sqrt(p.distance / 10);
            p.angle += rotationSpeed * rotationFactor * p.speedFactor * deltaTime * 0.05;

            const x = centerX + Math.cos(p.angle) * p.distance;
            const y = centerY + Math.sin(p.angle) * p.distance;
            const pulseFactor = Math.sin((time * 0.5 + p.armIndex / spiralArms) * Math.PI * 2) * 0.3 + 0.7;
            const finalOpacity = p.opacity * pulseFactor;

            ctx.beginPath();
            ctx.arc(x, y, p.size * pulseFactor, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${finalOpacity})`;
            ctx.fill();

            if (p.size > 1.8) {
                const trailLength = p.distance * 0.15;
                const trailAngle = p.angle - 0.1 * rotationFactor;
                const trailX = centerX + Math.cos(trailAngle) * (p.distance - trailLength);
                const trailY = centerY + Math.sin(trailAngle) * (p.distance - trailLength);
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(trailX, trailY);
                ctx.strokeStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${finalOpacity * 0.3})`;
                ctx.lineWidth = p.size * 0.5;
                ctx.stroke();
            }
        }
        animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
};


const animationMap: Record<string, AnimationFunction> = {
  'radial-pulse': setupRadialPulse,
  'orbital-pulse': setupOrbitalPulse,
  'pendulum-wave': setupPendulumWave,
  'pulse-wave': setupPulseWave,
  'concentric-rings': setupConcentricRings,
  'sequential-pulse': setupSequentialPulse,
  'oscillating-dots': setupOscillatingDots,
  'pulsing-grid': setupPulsingGrid,
  'spiral-galaxy': setupSpiralGalaxy,
};