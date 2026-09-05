"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utility Function ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Card Components ---
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AnimatedGeometricCard({ className, ...props }: CardProps) {
  return (
    <div
      role="region"
      aria-labelledby="card-title"
      aria-describedby="card-description"
      className={cn(
        "group/geometric-card relative w-[356px] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-900 dark:bg-black",
        className
      )}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: CardProps) {
  return (
    <div
      role="group"
      className={cn(
        "flex flex-col space-y-1.5 border-t border-zinc-200 p-4 dark:border-zinc-900",
        className
      )}
      {...props}
    />
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold leading-none tracking-tight text-black dark:text-white",
        className
      )}
      {...props}
    />
  );
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p
      className={cn(
        "text-sm text-neutral-500 dark:text-neutral-400",
        className
      )}
      {...props}
    />
  );
}

export function CardVisual({ className, ...props }: CardProps) {
  return (
    <div
      className={cn("h-[180px] w-[356px] overflow-hidden", className)}
      {...props}
    />
  );
}

// --- GeometricVisual Component ---
interface GeometricVisualProps {
  primaryColor?: string;
  accentColor?: string;
  particleColor?: string;
}

export function GeometricVisual({
  primaryColor = "#06b6d4",
  accentColor = "#f59e0b",
  particleColor = "#8b5cf6",
}: GeometricVisualProps) {
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div
        className="absolute inset-0 z-20"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      <div 
        className="relative h-[180px] w-[356px] overflow-hidden rounded-t-lg"
        style={
          {
            "--primary-color": primaryColor,
            "--accent-color": accentColor,
            "--particle-color": particleColor,
          } as React.CSSProperties
        }
      >
        <ParticleLayer hovered={hovered} mounted={mounted} primaryColor={primaryColor} accentColor={accentColor} particleColor={particleColor} />
        <GeometricShapes hovered={hovered} primaryColor={primaryColor} accentColor={accentColor} particleColor={particleColor} />
        <FloatingElements hovered={hovered} primaryColor={primaryColor} />
        <StatusIndicators primaryColor={primaryColor} accentColor={accentColor} />
        <BackgroundGradient primaryColor={primaryColor} accentColor={accentColor} particleColor={particleColor} />
        <ColorOverlay primaryColor={primaryColor} accentColor={accentColor} particleColor={particleColor} />
        <GridOverlay />
      </div>
    </>
  );
}

// --- Layer Components ---
const GridOverlay: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] h-full w-full bg-transparent bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] bg-center opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_40%,transparent_100%)]" />
  );
};

interface AnimatedLayerProps {
  hovered: boolean;
  mounted?: boolean;
  primaryColor?: string;
  accentColor?: string;
  particleColor?: string;
}

const BackgroundGradient: React.FC<{primaryColor: string; accentColor: string; particleColor: string}> = ({ primaryColor, accentColor, particleColor }) => {
  return (
    <div className="absolute inset-0 z-[2] flex h-full w-full items-center justify-center">
      <svg
        width="356"
        height="180"
        viewBox="0 0 356 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="356" height="180" fill="url(#geometric_gradient)" />
        <rect width="356" height="180" fill="url(#secondary_gradient)" opacity="0.6" />
        <defs>
          <radialGradient
            id="geometric_gradient"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(178 90) rotate(45) scale(120 180)"
          >
            <stop stopColor={primaryColor} stopOpacity="0.2" />
            <stop offset="0.3" stopColor={accentColor} stopOpacity="0.15" />
            <stop offset="0.7" stopColor={particleColor} stopOpacity="0.1" />
            <stop offset="1" stopOpacity="0" />
          </radialGradient>
          <linearGradient
            id="secondary_gradient"
            x1="0"
            y1="0"
            x2="356"
            y2="180"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={primaryColor} stopOpacity="0.05" />
            <stop offset="0.5" stopColor={particleColor} stopOpacity="0.08" />
            <stop offset="1" stopColor={accentColor} stopOpacity="0.03" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

const StatusIndicators: React.FC<{primaryColor: string; accentColor: string}> = ({ primaryColor, accentColor }) => {
  return (
    <div className="absolute top-4 right-4 z-[9] flex items-center gap-2">
      <div className="flex shrink-0 items-center rounded-full border border-zinc-200 bg-white/30 px-2 py-1 backdrop-blur-sm transition-all duration-500 ease-out group-hover/geometric-card:scale-110 group-hover/geometric-card:bg-white/40 dark:border-zinc-800 dark:bg-black/30 dark:group-hover/geometric-card:bg-black/40">
        <div className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
        <span className="ml-1.5 text-[10px] font-medium text-black dark:text-white">
          Active
        </span>
      </div>
      <div className="flex shrink-0 items-center rounded-full border border-zinc-200 bg-white/30 px-2 py-1 backdrop-blur-sm transition-all duration-500 ease-out group-hover/geometric-card:scale-110 group-hover/geometric-card:bg-white/40 dark:border-zinc-800 dark:bg-black/30 dark:group-hover/geometric-card:bg-black/40">
        <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
        <span className="ml-1.5 text-[10px] font-medium text-black dark:text-white">
          2.4k
        </span>
      </div>
    </div>
  );
};

const FloatingElements: React.FC<AnimatedLayerProps> = ({ hovered, primaryColor }) => {
  return (
    <div className="ease-[cubic-bezier(0.4, 0, 0.2, 1)] absolute inset-0 z-[7] flex translate-y-full items-center justify-center opacity-0 transition-all duration-700 group-hover/geometric-card:translate-y-0 group-hover/geometric-card:opacity-100">
      <div className="rounded-lg border border-zinc-200 bg-white/25 p-3 backdrop-blur-md dark:border-zinc-800 dark:bg-black/25">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: `${primaryColor}33` }}>
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: primaryColor }} />
          </div>
          <div>
            <p className="text-xs font-medium text-black dark:text-white">
              Geometric Analysis
            </p>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
              Processing spatial data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const GeometricShapes: React.FC<AnimatedLayerProps> = ({ hovered, primaryColor, accentColor, particleColor }) => {
  const shapes = [
    { type: 'circle', x: 60, y: 60, size: 20, delay: 0, colorVariant: 'primary' },
    { type: 'square', x: 120, y: 40, size: 16, delay: 100, colorVariant: 'accent' },
    { type: 'triangle', x: 180, y: 70, size: 18, delay: 200, colorVariant: 'particle' },
    { type: 'circle', x: 240, y: 50, size: 22, delay: 300, colorVariant: 'mixed1' },
    { type: 'square', x: 300, y: 65, size: 14, delay: 400, colorVariant: 'mixed2' },
    { type: 'circle', x: 80, y: 120, size: 16, delay: 150, colorVariant: 'accent' },
    { type: 'triangle', x: 160, y: 130, size: 20, delay: 250, colorVariant: 'primary' },
    { type: 'square', x: 220, y: 110, size: 18, delay: 350, colorVariant: 'particle' },
    { type: 'circle', x: 280, y: 125, size: 15, delay: 450, colorVariant: 'mixed1' },
  ];

  const getShapeColor = (colorVariant: string, index: number) => {
    switch (colorVariant) {
      case 'primary': return primaryColor;
      case 'accent': return accentColor;
      case 'particle': return particleColor;
      case 'mixed1': return `url(#gradient_${index}_1)`;
      case 'mixed2': return `url(#gradient_${index}_2)`;
      default: return primaryColor;
    }
  };

  return (
    <div className="ease-[cubic-bezier(0.4, 0, 0.2, 1)] absolute inset-0 z-[6] transition-transform duration-1000 group-hover/geometric-card:scale-110">
      <svg width="356" height="180" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {shapes.map((shape, index) => (
            <React.Fragment key={`gradients-${index}`}>
              <linearGradient id={`gradient_${index}_1`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={primaryColor} stopOpacity="0.8" />
                <stop offset="50%" stopColor={accentColor} stopOpacity="0.6" />
                <stop offset="100%" stopColor={particleColor} stopOpacity="0.4" />
              </linearGradient>
              <radialGradient id={`gradient_${index}_2`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={accentColor} stopOpacity="0.7" />
                <stop offset="70%" stopColor={primaryColor} stopOpacity="0.5" />
                <stop offset="100%" stopColor={particleColor} stopOpacity="0.3" />
              </radialGradient>
            </React.Fragment>
          ))}
        </defs>
        
        {shapes.map((shape, index) => {
          const animationDelay = `${shape.delay}ms`;
          const baseOpacity = hovered ? 0.8 : 0.4;
          const shapeColor = getShapeColor(shape.colorVariant, index);
          
          if (shape.type === 'circle') {
            return (
              <circle
                key={index}
                cx={shape.x}
                cy={shape.y}
                r={hovered ? shape.size * 0.7 : shape.size * 0.5}
                fill={shapeColor}
                opacity={baseOpacity}
                className="ease-[cubic-bezier(0.4, 0, 0.2, 1)] transition-all duration-700"
                style={{ 
                  transitionDelay: animationDelay,
                  filter: hovered ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' : 'none'
                }}
              />
            );
          }
          
          if (shape.type === 'square') {
            return (
              <rect
                key={index}
                x={shape.x - (hovered ? shape.size * 0.7 : shape.size * 0.5)}
                y={shape.y - (hovered ? shape.size * 0.7 : shape.size * 0.5)}
                width={hovered ? shape.size * 1.4 : shape.size}
                height={hovered ? shape.size * 1.4 : shape.size}
                fill={shapeColor}
                opacity={baseOpacity * 0.9}
                rx="3"
                className="ease-[cubic-bezier(0.4, 0, 0.2, 1)] transition-all duration-700"
                style={{ 
                  transitionDelay: animationDelay,
                  filter: hovered ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' : 'none'
                }}
              />
            );
          }
          
          if (shape.type === 'triangle') {
            const size = hovered ? shape.size * 1.2 : shape.size * 0.8;
            const points = `${shape.x},${shape.y - size/2} ${shape.x - size/2},${shape.y + size/2} ${shape.x + size/2},${shape.y + size/2}`;
            
            return (
              <polygon
                key={index}
                points={points}
                fill={shapeColor}
                opacity={baseOpacity * 0.85}
                className="ease-[cubic-bezier(0.4, 0, 0.2, 1)] transition-all duration-700"
                style={{ 
                  transitionDelay: animationDelay,
                  filter: hovered ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' : 'none'
                }}
              />
            );
          }
          
          return null;
        })}
      </svg>
    </div>
  );
};

const ParticleLayer: React.FC<AnimatedLayerProps> = ({ hovered, mounted, primaryColor, accentColor, particleColor }) => {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: 30 + (i * 25) + Math.random() * 20,
    y: 30 + Math.random() * 120,
    size: 2 + Math.random() * 3,
    delay: i * 80,
    colorType: i % 3,
  }));

  const getParticleColor = (colorType: number) => {
    switch (colorType) {
      case 0: return particleColor;
      case 1: return primaryColor;
      case 2: return accentColor;
      default: return particleColor;
    }
  };

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-[5]">
      {particles.map((particle) => {
        const color = getParticleColor(particle.colorType);
        return (
          <div
            key={particle.id}
            className="ease-[cubic-bezier(0.4, 0, 0.2, 1)] absolute rounded-full transition-all duration-1000"
            style={{
              left: `${particle.x}px`,
              top: hovered ? `${particle.y - 20}px` : `${particle.y}px`,
              width: `${hovered ? particle.size * 1.5 : particle.size}px`,
              height: `${hovered ? particle.size * 1.5 : particle.size}px`,
              background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
              opacity: hovered ? 0.7 : 0.3,
              transitionDelay: `${particle.delay}ms`,
              boxShadow: hovered ? `0 0 ${particle.size * 2}px ${color}40` : 'none',
            }}
          />
        );
      })}
    </div>
  );
};

const ColorOverlay: React.FC<{primaryColor: string; accentColor: string; particleColor: string}> = ({ primaryColor, accentColor, particleColor }) => {
  return (
    <div className="absolute inset-0 z-[3] opacity-30">
      <svg width="356" height="180" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="color_overlay_1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.1" />
            <stop offset="33%" stopColor={accentColor} stopOpacity="0.05" />
            <stop offset="66%" stopColor={particleColor} stopOpacity="0.08" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id="color_overlay_2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.06" />
            <stop offset="50%" stopColor={particleColor} stopOpacity="0.04" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0.07" />
          </linearGradient>
        </defs>
        <rect width="356" height="180" fill="url(#color_overlay_1)" />
        <rect width="356" height="180" fill="url(#color_overlay_2)" />
      </svg>
    </div>
  );
};
