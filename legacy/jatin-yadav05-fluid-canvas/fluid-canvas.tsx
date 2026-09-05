'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';

interface FluidCanvasProps {
  width?: number;
  height?: number;
  viscosity?: number;
  className?: string;
}

export const FluidCanvas: React.FC<FluidCanvasProps> = ({
  width = 600,
  height = 400,
  viscosity = 0.00008,
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number|null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });

  const gridRef = useRef({
    size: 128,
    velocityX: new Float32Array(128 * 128),
    velocityY: new Float32Array(128 * 128),
    velocityX0: new Float32Array(128 * 128),
    velocityY0: new Float32Array(128 * 128),
    density: new Float32Array(128 * 128),
    density0: new Float32Array(128 * 128),
    temperature: new Float32Array(128 * 128)
  });

  const addDensity = useCallback((x: number, y: number, amount: number) => {
    const { size, density, temperature } = gridRef.current;
    const radius = 6;
    const centerX = Math.max(0, Math.min(size - 1, Math.floor(x)));
    const centerY = Math.max(0, Math.min(size - 1, Math.floor(y)));
    
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const px = centerX + dx;
        const py = centerY + dy;
        
        if (px >= 0 && px < size && py >= 0 && py < size) {
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance <= radius) {
            const falloff = 1 - (distance / radius);
            const index = py * size + px;
            density[index] += amount * falloff * falloff;
            temperature[index] += amount * falloff * 0.5;
          }
        }
      }
    }
  }, []);

  const addVelocity = useCallback((x: number, y: number, vx: number, vy: number) => {
    const { size, velocityX, velocityY } = gridRef.current;
    const radius = 4;
    const centerX = Math.max(0, Math.min(size - 1, Math.floor(x)));
    const centerY = Math.max(0, Math.min(size - 1, Math.floor(y)));
    
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const px = centerX + dx;
        const py = centerY + dy;
        
        if (px >= 0 && px < size && py >= 0 && py < size) {
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance <= radius) {
            const falloff = 1 - (distance / radius);
            const index = py * size + px;
            velocityX[index] += vx * falloff;
            velocityY[index] += vy * falloff;
          }
        }
      }
    }
  }, []);

  const setBoundary = useCallback((boundary: number, field: Float32Array) => {
    const { size } = gridRef.current;
    
    for (let i = 1; i < size - 1; i++) {
      field[i] = boundary === 2 ? -field[i + size] : field[i + size];
      field[i + (size - 1) * size] = boundary === 2 ? -field[i + (size - 2) * size] : field[i + (size - 2) * size];
    }
    
    for (let j = 1; j < size - 1; j++) {
      field[j * size] = boundary === 1 ? -field[j * size + 1] : field[j * size + 1];
      field[j * size + (size - 1)] = boundary === 1 ? -field[j * size + (size - 2)] : field[j * size + (size - 2)];
    }
    
    field[0] = 0.33 * (field[1] + field[size] + field[size + 1]);
    field[size - 1] = 0.33 * (field[size - 2] + field[2 * size - 1] + field[2 * size - 2]);
    field[(size - 1) * size] = 0.33 * (field[(size - 2) * size] + field[(size - 1) * size + 1] + field[(size - 2) * size + 1]);
    field[size * size - 1] = 0.33 * (field[size * size - 2] + field[(size - 1) * size - 1] + field[(size - 2) * size - 1]);
  }, []);

  const linearSolve = useCallback((boundary: number, field: Float32Array, field0: Float32Array, a: number, c: number) => {
    const { size } = gridRef.current;
    const cRecip = 1.0 / c;
    
    for (let iter = 0; iter < 8; iter++) {
      for (let j = 1; j < size - 1; j++) {
        for (let i = 1; i < size - 1; i++) {
          const index = j * size + i;
          field[index] = (field0[index] + a * (
            field[index - 1] + field[index + 1] + 
            field[index - size] + field[index + size]
          )) * cRecip;
        }
      }
      setBoundary(boundary, field);
    }
  }, [setBoundary]);

  const diffuse = useCallback((boundary: number, field: Float32Array, field0: Float32Array, diff: number, dt: number) => {
    const { size } = gridRef.current;
    const a = dt * diff * (size - 2) * (size - 2);
    linearSolve(boundary, field, field0, a, 1 + 6 * a);
  }, [linearSolve]);

  const project = useCallback((velocX: Float32Array, velocY: Float32Array, p: Float32Array, div: Float32Array) => {
    const { size } = gridRef.current;
    
    for (let j = 1; j < size - 1; j++) {
      for (let i = 1; i < size - 1; i++) {
        const index = j * size + i;
        div[index] = -0.5 * (
          velocX[index + 1] - velocX[index - 1] +
          velocY[index + size] - velocY[index - size]
        ) / size;
        p[index] = 0;
      }
    }
    
    setBoundary(0, div);
    setBoundary(0, p);
    linearSolve(0, p, div, 1, 6);
    
    for (let j = 1; j < size - 1; j++) {
      for (let i = 1; i < size - 1; i++) {
        const index = j * size + i;
        velocX[index] -= 0.5 * (p[index + 1] - p[index - 1]) * size;
        velocY[index] -= 0.5 * (p[index + size] - p[index - size]) * size;
      }
    }
    
    setBoundary(1, velocX);
    setBoundary(2, velocY);
  }, [setBoundary, linearSolve]);

  const advect = useCallback((boundary: number, field: Float32Array, field0: Float32Array, velocX: Float32Array, velocY: Float32Array, dt: number) => {
    const { size } = gridRef.current;
    const dtx = dt * (size - 2);
    const dty = dt * (size - 2);
    
    for (let j = 1; j < size - 1; j++) {
      for (let i = 1; i < size - 1; i++) {
        const index = j * size + i;
        
        let tmp1 = dtx * velocX[index];
        let tmp2 = dty * velocY[index];
        let x = i - tmp1;
        let y = j - tmp2;
        
        if (x < 0.5) x = 0.5;
        if (x > size + 0.5) x = size + 0.5;
        let i0 = Math.floor(x);
        let i1 = i0 + 1.0;
        
        if (y < 0.5) y = 0.5;
        if (y > size + 0.5) y = size + 0.5;
        let j0 = Math.floor(y);
        let j1 = j0 + 1.0;
        
        let s1 = x - i0;
        let s0 = 1.0 - s1;
        let t1 = y - j0;
        let t0 = 1.0 - t1;
        
        let i0i = Math.floor(i0);
        let i1i = Math.floor(i1);
        let j0i = Math.floor(j0);
        let j1i = Math.floor(j1);
        
        field[index] = 
          s0 * (t0 * field0[j0i * size + i0i] + t1 * field0[j1i * size + i0i]) +
          s1 * (t0 * field0[j0i * size + i1i] + t1 * field0[j1i * size + i1i]);
      }
    }
    
    setBoundary(boundary, field);
  }, [setBoundary]);

  const step = useCallback(() => {
    const { 
      size, velocityX, velocityY, velocityX0, velocityY0, 
      density, density0, temperature 
    } = gridRef.current;
    
    const dt = 0.016;
    
    // Enhanced fluid dynamics
    diffuse(1, velocityX0, velocityX, viscosity, dt);
    diffuse(2, velocityY0, velocityY, viscosity, dt);
    
    project(velocityX0, velocityY0, velocityX, velocityY);
    
    advect(1, velocityX, velocityX0, velocityX0, velocityY0, dt);
    advect(2, velocityY, velocityY0, velocityX0, velocityY0, dt);
    
    project(velocityX, velocityY, velocityX0, velocityY0);
    
    diffuse(0, density0, density, 0.0001, dt);
    advect(0, density, density0, velocityX, velocityY, dt);
    
    // Temperature cooling and buoyancy
    for (let i = 0; i < size * size; i++) {
      temperature[i] *= 0.998;
      density[i] *= 0.995;
      
      if (temperature[i] > 0.1) {
        const y = Math.floor(i / size);
        if (y > 0) {
          velocityY[i] -= temperature[i] * 0.01;
        }
      }
    }
  }, [viscosity, diffuse, project, advect]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { size, density, temperature } = gridRef.current;
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(1, '#1a1a1a');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // High-quality fluid rendering
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        const x = Math.floor((i / width) * size);
        const y = Math.floor((j / height) * size);
        const index = y * size + x;
        
        const d = Math.min(1, density[index] * 0.8);
        const temp = temperature[index];
        
        // Sophisticated color mapping
        const pixelIndex = (j * width + i) * 4;
        
        if (d > 0.01) {
          const hue = 180 + temp * 60; // Blue to cyan gradient
          const saturation = 0.8 + temp * 0.2;
          const lightness = d * 0.6 + temp * 0.3;
          
          // HSL to RGB conversion
          const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
          const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
          const m = lightness - c / 2;
          
          let r = 0, g = 0, b = 0;
          if (hue < 60) { r = c; g = x; b = 0; }
          else if (hue < 120) { r = x; g = c; b = 0; }
          else if (hue < 180) { r = 0; g = c; b = x; }
          else if (hue < 240) { r = 0; g = x; b = c; }
          else if (hue < 300) { r = x; g = 0; b = c; }
          else { r = c; g = 0; b = x; }
          
          data[pixelIndex] = Math.floor((r + m) * 255);
          data[pixelIndex + 1] = Math.floor((g + m) * 255);
          data[pixelIndex + 2] = Math.floor((b + m) * 255);
          data[pixelIndex + 3] = Math.floor(d * opacity * 255);
        } else {
          data[pixelIndex] = 0;
          data[pixelIndex + 1] = 0;
          data[pixelIndex + 2] = 0;
          data[pixelIndex + 3] = 0;
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Add subtle glow overlay
    if (opacity > 0.5) {
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = 0.1;
      
      const glowGradient = ctx.createRadialGradient(
        mouseRef.current.x, mouseRef.current.y, 0,
        mouseRef.current.x, mouseRef.current.y, 150
      );
      glowGradient.addColorStop(0, '#ffffff');
      glowGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, width, height);
      
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }, [width, height, opacity]);

  const animate = useCallback(() => {
    if (isHovered) {
      step();
    }
    render();
    animationRef.current = requestAnimationFrame(animate);
  }, [step, render, isHovered]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const { current: mouse } = mouseRef;
    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    
    if (isHovered && opacity > 0.3) {
      const { size } = gridRef.current;
      const cx = (mouse.x / width) * size;
      const cy = (mouse.y / height) * size;
      const vx = (mouse.x - mouse.prevX) * 0.08;
      const vy = (mouse.y - mouse.prevY) * 0.08;
      
      addDensity(cx, cy, 15);
      addVelocity(cx, cy, vx, vy);
    }
  }, [width, height, addDensity, addVelocity, isHovered, opacity]);

  // Smooth opacity transitions
  useEffect(() => {
    const targetOpacity = isHovered ? 1 : 0;
    const step = 0.05;
    
    const fadeInterval = setInterval(() => {
      setOpacity(prev => {
        const diff = targetOpacity - prev;
        if (Math.abs(diff) < step) {
          clearInterval(fadeInterval);
          return targetOpacity;
        }
        return prev + (diff > 0 ? step : -step);
      });
    }, 16);
    
    return () => clearInterval(fadeInterval);
  }, [isHovered]);

  useEffect(() => {
    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
      width: `${width}px`,
      height: `${height}px`,
      borderRadius: '20px',
      overflow: 'hidden',
      background: 'linear-gradient(145deg, rgba(18,18,22,0.95) 0%, rgba(10,10,14,0.98) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      cursor: 'pointer',
      transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
      transform: isHovered ? 'scale(1.01) translateY(-3px)' : 'scale(1) translateY(0)',
      boxShadow: isHovered 
        ? '0 30px 60px rgba(0,0,0,0.4), 0 12px 30px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.1)'
        : '0 15px 35px rgba(0,0,0,0.2), 0 5px 15px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.05)',
      }}
    >
      {/* Glass effect highlight */}
      <div
      className="absolute inset-0 backdrop-blur-sm pointer-events-none"
      style={{
        background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08), transparent 60%)',
        opacity: isHovered ? 1 : 0.4,
        transition: 'opacity 0.7s ease',
      }}
      />
      
      {/* Edge highlight */}
      <div 
      className="absolute inset-0 pointer-events-none opacity-30"
      style={{
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.2)',
        opacity: isHovered ? 0.5 : 0.2,
        transition: 'opacity 0.5s ease',
      }}
      />
      
      {/* Fluid canvas */}
      <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseMove={handleMouseMove}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        filter: isHovered ? 'contrast(1.15) brightness(1.05)' : 'contrast(1.05)',
        transition: 'filter 0.5s ease',
      }}
      />
    </div>
  );
};
