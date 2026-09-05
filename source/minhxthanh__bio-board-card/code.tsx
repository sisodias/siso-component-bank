"use client"

import React, { useEffect, useRef, useState } from 'react';

// Utility function to merge class names
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};


// --- Glowing Card Components ---
export interface GlowingCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  hoverEffect?: boolean;
}

export interface GlowingCardsProps {
  children: React.ReactNode;
  className?: string;
  enableGlow?: boolean;
  glowRadius?: number;
  glowOpacity?: number;
  animationDuration?: number;
  enableHover?: boolean;
  gap?: string;
  maxWidth?: string;
  padding?: string;
  backgroundColor?: string;
  borderRadius?: string;
  responsive?: boolean;
  customTheme?: {
    cardBg?: string;
    cardBorder?: string;
    textColor?: string;
    hoverBg?: string;
  };
}

export const GlowingCard: React.FC<GlowingCardProps> = ({
  children,
  className,
  glowColor = "#3b82f6",
  hoverEffect = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative flex-1 min-w-[14rem] p-6 rounded-2xl text-black dark:text-white",
        "bg-white dark:bg-black border border-gray-200 dark:border-gray-800",
        "transition-all duration-400 ease-out",
        className
      )}
      style={{
        '--glow-color': glowColor,
      } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
};

export const GlowingCards: React.FC<GlowingCardsProps> = ({
  children,
  className,
  enableGlow = true,
  glowRadius = 25,
  glowOpacity = 1,
  animationDuration = 400,
  enableHover = true,
  gap = "1rem",
  maxWidth = "75rem",
  padding = "0",
  backgroundColor,
  borderRadius = "1rem",
  responsive = true,
  customTheme,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const overlay = overlayRef.current;

    if (!container || !overlay || !enableGlow) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePosition({ x, y });
      setShowOverlay(true);

      overlay.style.setProperty('--x', x + 'px');
      overlay.style.setProperty('--y', y + 'px');
      overlay.style.setProperty('--opacity', glowOpacity.toString());
    };

    const handleMouseLeave = () => {
      setShowOverlay(false);
      overlay.style.setProperty('--opacity', '0');
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enableGlow, glowOpacity]);

  const containerStyle = {
    '--gap': gap,
    '--max-width': maxWidth,
    '--padding': padding,
    '--border-radius': borderRadius,
    '--animation-duration': animationDuration + 'ms',
    '--glow-radius': glowRadius + 'rem',
    '--glow-opacity': glowOpacity,
    backgroundColor: backgroundColor || undefined,
    ...customTheme,
  } as React.CSSProperties;

  return (
    <div
      className={cn("relative w-full", className)}
      style={containerStyle}
    >
      <div
        ref={containerRef}
        className={cn(
          "relative max-w-[var(--max-width)] mx-auto ",
          "px-6 py-2"
        )}
        style={{ padding: "var(--padding)" }}
      >
        <div
          className={cn(
            "flex items-stretch justify-center flex-wrap gap-[var(--gap)]",
            responsive && "flex-col sm:flex-row "
          )}
        >
          {children}
        </div>

        {enableGlow && (
          <div
            ref={overlayRef}
            className={cn(
              "absolute inset-0 pointer-events-none select-none",
              "opacity-0 transition-all duration-[var(--animation-duration)] ease-out"
            )}
            style={{
              WebkitMask:
                "radial-gradient(var(--glow-radius) var(--glow-radius) at var(--x, 0) var(--y, 0), #000 1%, transparent 50%)",
              mask:
                "radial-gradient(var(--glow-radius) var(--glow-radius) at var(--x, 0) var(--y, 0), #000 1%, transparent 50%)",
              opacity: showOverlay ? 'var(--opacity)' : '0',
            }}
          >
            <div
              className={cn(
                "flex items-stretch justify-center flex-wrap gap-[var(--gap)] max-w-[var(--max-width)] center mx-auto",
                responsive && "flex-col sm:flex-row"
              )}
              style={{ padding: "var(--padding)" }}
            >
              {React.Children.map(children, (child, index) => {
                if (React.isValidElement(child) && child.type === GlowingCard) {
                  const cardGlowColor = child.props.glowColor || "#3b82f6";
                  return React.cloneElement(child as React.ReactElement<any>, {
                    className: cn(
                      child.props.className,
                      "bg-opacity-15 dark:bg-opacity-15",
                      "border-opacity-100 dark:border-opacity-100"
                    ),
                    style: {
                      ...child.props.style,
                      backgroundColor: cardGlowColor + "15",
                      borderColor: cardGlowColor,
                      boxShadow: "0 0 0 1px inset " + cardGlowColor,
                    },
                  });
                }
                return child;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export function BioBoardCard() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* SVG Filter Definition */}
      <svg className="absolute">
        <defs>
          <filter id="turbulent-displace" colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="1" />
            <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
              <animate attributeName="dy" values="700; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="1" />
            <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
              <animate attributeName="dy" values="0; -700" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="2" />
            <feOffset in="noise1" dx="0" dy="0" result="offsetNoise3">
              <animate attributeName="dx" values="490; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="2" />
            <feOffset in="noise2" dx="0" dy="0" result="offsetNoise4">
              <animate attributeName="dx" values="0; -490" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
            <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
            <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />

            <feDisplacementMap
              in="SourceGraphic"
              in2="combinedNoise"
              scale="30"
              xChannelSelector="R"
              yChannelSelector="B"
            />
          </filter>
        </defs>
      </svg>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
        {/* Bio Card with Electric Border */}
        <div className="card-container group">
          <div className="relative">
            {/* Border Outer */}
            <div className="border-outer">
              <div className="main-card"></div>
            </div>

            {/* Glow Layers */}
            <div className="glow-layer-1"></div>
            <div className="glow-layer-2"></div>
          </div>

          {/* Overlay Effects */}
          <div className="overlay-1"></div>
          <div className="overlay-2"></div>
          <div className="background-glow"></div>

          {/* Content Container */}
          <div className="absolute inset-0 w-full h-full flex flex-col p-4 md:p-6">
            <h2 className="text-white text-lg font-medium mb-4">AI Code</h2>

            {/* Profile Section */}
            <div className="flex gap-4 mb-4">
              <img
                src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=64&h=64&fit=crop&crop=face"
                alt="AI Code Assistant"
                className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="certified-trainer-badge mb-2">AI Developer</div>
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                  AI Code is an intelligent web development platform that generates, optimizes, and maintains code
                  automatically using advanced AI algorithms.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1 grid grid-cols-1 gap-4 md:gap-6">
            <GlowingCards className="col-span-1" glowRadius={10}>
                <GlowingCard className="h-[250px] overflow-y-auto" glowColor="#fbbf24">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-900 dark:text-gray-100 text-base md:text-lg font-medium">Motivations</h3>
                    <div className="w-6 h-6 md:w-5 md:h-5 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-300 text-xs md:text-sm">?</span>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-400 text-sm">Accelerate development with AI-powered code generation.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-400 text-sm">Reduce bugs through intelligent code analysis.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-400 text-sm">Enable developers to focus on creative solutions.</span>
                    </li>
                  </ul>
                </GlowingCard>
            </GlowingCards>
        </div>


       <div className="md:col-span-1 grid grid-cols-1 gap-4 md:gap-6">
            <GlowingCards className="col-span-1" glowRadius={10}>
                <GlowingCard className="h-[250px] overflow-y-auto" glowColor="#22c55e">
                   <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-900 dark:text-gray-100 text-base md:text-lg font-medium">Goals</h3>
                    <div className="w-6 h-6 md:w-5 md:h-5 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-300 text-sm md:text-lg">+</span>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-400 text-sm">Generate production-ready code instantly.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-400 text-sm">Optimize code performance automatically.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-400 text-sm">Provide intelligent debugging assistance.</span>
                    </li>
                  </ul>
                </GlowingCard>
            </GlowingCards>
        </div>

        <div className="md:col-span-1 grid grid-cols-1 gap-4 md:gap-6">
            <GlowingCards className="col-span-1" glowRadius={10}>
                <GlowingCard className="h-[250px] overflow-y-auto" glowColor="#ef4444">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-900 dark:text-gray-100 text-base md:text-lg font-medium">Pain Points</h3>
                    <div className="w-6 h-6 md:w-5 md:h-5 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-300 text-xs md:text-sm">i</span>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-400 text-sm">Manual coding is time-consuming and error-prone.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-400 text-sm">Complex debugging slows development cycles.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-400 text-sm">Repetitive tasks reduce creative problem-solving time.</span>
                    </li>
                  </ul>
                </GlowingCard>
            </GlowingCards>
        </div>
      </div>

      <style>{`
        :root {
          --electric-border-color: #3b82f6;
          --electric-light-color: oklch(from var(--electric-border-color) l c h);
          --gradient-color: oklch(from var(--electric-border-color) 0.3 calc(c / 2) h / 0.4);
          --color-neutral-900: oklch(0.185 0 0);
        }

        .card-container {
          padding: 2px;
          border-radius: 24px;
          position: relative;
          background: linear-gradient(
              -30deg,
              var(--gradient-color),
              transparent,
              var(--gradient-color)
            ),
            linear-gradient(
              to bottom,
              var(--color-neutral-900),
              var(--color-neutral-900)
            );
        }

        .border-outer {
          border: 2px solid rgba(59, 130, 246, 0.5);
          border-radius: 24px;
          padding-right: 4px;
          padding-bottom: 4px;
        }

        .main-card {
          width: 100%;
          height: 250px;
          border-radius: 24px;
          border: 2px solid var(--electric-border-color);
          margin-top: -4px;
          margin-left: -4px;
          filter: url(#turbulent-displace);
          background: #1a1a1a;
        }

        .glow-layer-1 {
          border: 2px solid rgba(59, 130, 246, 0.6);
          border-radius: 24px;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          filter: blur(1px);
        }

        .glow-layer-2 {
          border: 2px solid var(--electric-light-color);
          border-radius: 24px;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          filter: blur(4px);
        }

        .overlay-1 {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 24px;
          opacity: 1;
          mix-blend-mode: overlay;
          transform: scale(1.1);
          filter: blur(16px);
          background: linear-gradient(
            -30deg,
            white,
            transparent 30%,
            transparent 70%,
            white
          );
        }

        .overlay-2 {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 24px;
          opacity: 0.5;
          mix-blend-mode: overlay;
          transform: scale(1.1);
          filter: blur(16px);
          background: linear-gradient(
            -30deg,
            white,
            transparent 30%,
            transparent 70%,
            white
          );
          transition: all 0.3s ease-in-out;
        }

        .card-container:hover .overlay-2 {
          opacity: 0.8;
          transform: scale(1.3);
          filter: blur(20px);
          animation: pulse-glow 1.5s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.4);
          }
        }

        .background-glow {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 24px;
          filter: blur(32px);
          transform: scale(1.1);
          opacity: 0.3;
          z-index: -1;
          background: linear-gradient(
            -30deg,
            var(--electric-light-color),
            transparent,
            var(--electric-border-color)
          );
        }

        .certified-trainer-badge {
          background: #fbbf24;
          color: #1a1a1a;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          width: fit-content;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  )
}
