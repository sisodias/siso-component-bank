"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { HeroData } from "@/lib/utils";

/**
 * ============================================
 * HERO COMPONENT - REUSABLE
 * ============================================
 * Fully customizable hero section with space theme
 * All data and configuration passed as props
 */

interface HeroProps {
  data: HeroData;
  isLoaded: boolean;
  currentWord: number;
  mousePosition: { x: number; y: number };
  isNight: boolean;
  onToggleMode?: () => void;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export default function Hero({
  data,
  isLoaded,
  currentWord,
  mousePosition,
  isNight,
  onToggleMode,
  onPrimaryClick,
  onSecondaryClick,
}: HeroProps) {
  return (
    <div className={cn(
      "relative min-h-screen w-full overflow-hidden transition-all duration-3000",
      isNight 
        ? "bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950" 
        : data.background?.gradient || "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-black dark:via-purple-950 dark:to-black"
    )}>
      {/* Animated Background Grid - Hidden in night mode */}
      {!isNight && data.background?.showGrid !== false && (
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] sm:bg-[size:80px_80px] md:bg-[size:100px_100px]" />
      )}

      {/* Night Sky Components */}
      {isNight && data.space && (
        <>
          {/* Static Stars */}
          {data.space.showStars !== false && (
            <StarField count={100} />
          )}

          {/* Shooting Stars */}
          {data.space.showShootingStars !== false && (
            <ShootingStars count={3} />
          )}

          {/* Constellations */}
          {data.space.showConstellations !== false && (
            <Constellations />
          )}

          {/* Moon */}
          {data.space.showMoon !== false && (
            <Moon />
          )}

          {/* Aurora */}
          {data.space.showAurora !== false && (
            <Aurora />
          )}

          {/* Planets */}
          {data.space.showPlanets !== false && (
            <PlanetSystem planets={data.space.planets} />
          )}

       

          {/* Space Station */}
          {data.space.showISS !== false && (
            <SpaceStation />
          )}
        </>
      )}
      
  

      {/* Particle Effect - Only in day mode */}
      {!isNight && data.particles?.enabled !== false && (
        <ParticleField count={data.particles?.count || 30} />
      )}

      {/* Night/Day Toggle Button */}
      {onToggleMode && (
        <button
          onClick={onToggleMode}
          className="absolute top-4 left-4 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
          aria-label="Toggle night mode"
        >
          {isNight ? (
            <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      )}

      {/* Main Content */}
      <MainContent
        data={data}
        isLoaded={isLoaded}
        currentWord={currentWord}
        isNight={isNight}
        onPrimaryClick={onPrimaryClick}
        onSecondaryClick={onSecondaryClick}
      />

      {/* Scroll Indicator */}
      <ScrollIndicator />

      {/* Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-slate-900 dark:from-black to-transparent" />
    </div>
  );
}

/**
 * ============================================
 * SUB-COMPONENTS
 * ============================================
 */

// Main Content Component
const MainContent: React.FC<{
  data: HeroData;
  isLoaded: boolean;
  currentWord: number;
  isNight: boolean;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}> = ({ data, isLoaded, currentWord, isNight, onPrimaryClick, onSecondaryClick }) => (
  <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-20">
    {/* Content Background Blur */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-full max-w-5xl h-[600px] bg-gradient-radial from-black/30 via-black/20 to-transparent rounded-full blur-3xl" />
    </div>

    {/* Badge */}
    <div className={cn(
      "relative mb-6 sm:mb-8 transform transition-all duration-1000 z-30",
      isLoaded ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
    )}>
      <span className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium backdrop-blur-sm border rounded-full",
        isNight 
          ? "text-blue-200 bg-blue-900/30 border-blue-400/30" 
          : "text-purple-300 bg-purple-900/50 border-purple-500/30"
      )}>
        {data.badge.icon !== false && (
          <span className="relative flex h-2 w-2">
            <span className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              isNight ? "bg-blue-400" : "bg-purple-400"
            )}></span>
            <span className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              isNight ? "bg-blue-500" : "bg-purple-500"
            )}></span>
          </span>
        )}
        {data.badge.text}
      </span>
    </div>

    {/* Title */}
    <h1 className={cn(
      "relative text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center transform transition-all duration-1000 delay-200 z-30 leading-tight",
      isLoaded ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
    )}>
      <span className="block text-white mb-2">{data.title.prefix}</span>
      <span className="relative block">
        <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 blur-2xl sm:blur-3xl opacity-50">
          {data.title.animatedWords[currentWord]}
        </span>
        <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 animate-gradient">
          {data.title.animatedWords[currentWord]}
        </span>
      </span>
    </h1>

    {/* Subtitle */}
    <p className={cn(
      "relative mt-4 sm:mt-6 text-sm xs:text-base sm:text-xl md:text-2xl text-gray-300 text-center max-w-3xl px-2 sm:px-4 transform transition-all duration-1000 delay-400 z-30 leading-relaxed",
      isLoaded ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
    )}>
      {data.subtitle}
    </p>

    {/* CTA Buttons */}
    <div className={cn(
      "relative mt-6 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-sm sm:max-w-none sm:w-auto transform transition-all duration-1000 delay-600 z-30 px-4 sm:px-0",
      isLoaded ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
    )}>
      <button 
        onClick={onPrimaryClick}
        className="group relative inline-flex items-center justify-center px-4 py-2.5 xs:px-6 xs:py-3 sm:px-8 sm:py-4 text-sm xs:text-base sm:text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 w-full sm:w-auto"
      >
        <span className="relative z-10">{data.buttons.primary.text}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>

      <button 
        onClick={onSecondaryClick}
        className="group relative inline-flex items-center justify-center px-4 py-2.5 xs:px-6 xs:py-3 sm:px-8 sm:py-4 text-sm xs:text-base sm:text-lg font-medium text-white border-2 border-white/20 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:border-white/40 hover:backdrop-blur-xl w-full sm:w-auto"
      >
        <span className="relative z-10">{data.buttons.secondary.text}</span>
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>
    </div>

    {/* Stats Section */}
    <div className={cn(
      "relative mt-12 sm:mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 w-full max-w-4xl transform transition-all duration-1000 delay-800 z-30 px-4 sm:px-0",
      isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
    )}>
      {data.stats.map((stat, index) => (
        <div 
          key={index}
          className={cn(
            "text-center transform transition-all duration-700",
            isLoaded ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95"
          )}
          style={{
            transitionDelay: `${900 + index * 100}ms`
          }}
        >
          <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse-slow">
            {stat.value}
          </div>
          <div className="mt-1 sm:mt-2 text-[10px] xs:text-xs sm:text-sm md:text-base text-gray-400">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
);

// Star Field Component
const StarField: React.FC<{ count: number }> = ({ count }) => (
  <div className="absolute inset-0">
    {[...Array(count)].map((_, i) => (
      <div
        key={`star-${i}`}
        className="absolute rounded-full bg-white animate-pulse-star"
        style={{
          width: `${Math.random() * 3}px`,
          height: `${Math.random() * 3}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          opacity: Math.random() * 0.8 + 0.2,
        }}
      />
    ))}
  </div>
);

// Shooting Stars Component
const ShootingStars: React.FC<{ count: number }> = ({ count }) => (
  <div className="absolute inset-0 overflow-hidden">
    {[...Array(count)].map((_, i) => (
      <div
        key={`shooting-${i}`}
        className="absolute w-1 h-1 bg-white rounded-full animate-shooting-star"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 50}%`,
          animationDelay: `${i * 7}s`,
        }}
      >
        <div className="absolute top-0 left-0 w-20 h-[1px] bg-gradient-to-r from-white via-white to-transparent opacity-50" />
      </div>
    ))}
  </div>
);

// Other sub-components (simplified for brevity)
const Constellations: React.FC = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none">
    <defs>
      <linearGradient id="constellation-gradient">
        <stop offset="0%" stopColor="white" stopOpacity="0" />
        <stop offset="50%" stopColor="white" stopOpacity="0.3" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </linearGradient>
    </defs>
    <g className="animate-constellation-fade">
      <line x1="10%" y1="20%" x2="15%" y2="25%" stroke="url(#constellation-gradient)" strokeWidth="1" />
      <line x1="15%" y1="25%" x2="20%" y2="22%" stroke="url(#constellation-gradient)" strokeWidth="1" />
      <line x1="20%" y1="22%" x2="25%" y2="28%" stroke="url(#constellation-gradient)" strokeWidth="1" />
    </g>
  </svg>
);

const Moon: React.FC = () => (
  <div className="absolute top-2 right-2 xs:top-4 xs:right-4 sm:top-8 sm:right-8 md:top-10 md:right-10 z-10">
    <div className="relative w-12 h-12 xs:w-16 xs:h-16 sm:w-24 sm:h-24 md:w-32 md:h-32">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full shadow-moon animate-float-slow" />
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full blur-xl opacity-50 animate-moon-glow" />
      <div className="absolute top-4 left-4 w-4 h-4 sm:w-6 sm:h-6 bg-yellow-300/30 rounded-full" />
      <div className="absolute bottom-6 right-6 w-3 h-3 sm:w-5 sm:h-5 bg-yellow-300/20 rounded-full" />
    </div>
  </div>
);

const Aurora: React.FC = () => (
  <div className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 via-blue-500/10 to-transparent animate-aurora" />
    <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-pink-500/10 to-transparent animate-aurora-slow" />
  </div>
);

const ParticleField: React.FC<{ count: number }> = ({ count }) => (
  <div className="absolute inset-0 pointer-events-none">
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className="absolute w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white rounded-full animate-twinkle"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${3 + Math.random() * 4}s`,
        }}
      />
    ))}
  </div>
);

const ScrollIndicator: React.FC = () => (
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
    <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/30 rounded-full flex justify-center">
      <div className="w-0.5 sm:w-1 h-2 sm:h-3 bg-white/50 rounded-full mt-1.5 sm:mt-2 animate-scroll" />
    </div>
  </div>
);

const PlanetSystem: React.FC<{ planets?: NonNullable<HeroData['space']>['planets'] }> = ({ planets }) => {
  const defaultPlanets = [
    { type: "earth" as const, position: { top: "10%", left: "8%" }, size: "medium" as const, orbitSpeed: "slow" as const },
    { type: "mars" as const, position: { bottom: "15%", right: "12%" }, size: "small" as const, orbitSpeed: "medium" as const },
    { type: "jupiter" as const, position: { bottom: "12%", left: "10%" }, size: "large" as const, orbitSpeed: "fast" as const },
    { type: "saturn" as const, position: { top: "15%", right: "10%" }, size: "medium" as const, orbitSpeed: "reverse" as const },
  ];

  const planetsToRender = planets || defaultPlanets;

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {planetsToRender.map((planet, index) => (
        <Planet key={index} {...planet} />
      ))}
    </div>
  );
};

const Planet: React.FC<{
  type: "earth" | "mars" | "jupiter" | "saturn";
  position: { top?: string; bottom?: string; left?: string; right?: string };
  size: "small" | "medium" | "large";
  orbitSpeed: "slow" | "medium" | "fast" | "reverse";
}> = ({ type, position, size, orbitSpeed }) => {
  const sizeClasses = {
    small: "w-8 h-8 xs:w-10 xs:h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24",
    medium: "w-10 h-10 xs:w-12 xs:h-12 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-32 lg:h-32",
    large: "w-12 h-12 xs:w-16 xs:h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-36 lg:h-36",
  };

  const orbitClasses = {
    slow: "animate-orbit-slow",
    medium: "animate-orbit-medium",
    fast: "animate-orbit-fast",
    reverse: "animate-orbit-reverse",
  };

  const planetStyles = {
    earth: "bg-gradient-to-br from-blue-400 via-blue-500 to-green-400",
    mars: "bg-gradient-to-br from-red-500 via-orange-500 to-red-600",
    jupiter: "bg-gradient-to-br from-yellow-600 via-orange-400 to-red-400",
    saturn: "bg-gradient-to-br from-yellow-200 via-yellow-300 to-orange-200",
  };

  // Responsive positioning
  const getResponsivePosition = () => {
    const style: React.CSSProperties = {};
    
    // Desktop positions
    if (position.top) {
      style.top = position.top;
    }
    if (position.bottom) {
      style.bottom = position.bottom;
    }
    if (position.left) {
      style.left = position.left;
    }
    if (position.right) {
      style.right = position.right;
    }
    
    return style;
  };

  return (
    <div 
      className={cn(
        "absolute opacity-60 sm:opacity-80 md:opacity-90 lg:opacity-100",
        orbitClasses[orbitSpeed],
        // Scale down on mobile
        "scale-75 sm:scale-90 md:scale-100"
      )}
      style={getResponsivePosition()}
    >
      <div className={cn("relative", sizeClasses[size], "animate-rotate-slow")}>
        <div className={cn("absolute inset-0 rounded-full shadow-planet", planetStyles[type])} />
        {/* Saturn rings - more visible on desktop */}
        {type === "saturn" && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-0 sm:opacity-50 md:opacity-100">
            <div className="absolute inset-0 border-2 sm:border-3 md:border-4 border-yellow-400/30 rounded-full transform rotate-x-60" />
            <div className="absolute inset-2 border sm:border-2 border-yellow-300/20 rounded-full transform rotate-x-60" />
          </div>
        )}
        {/* Jupiter's Great Red Spot */}
        {type === "jupiter" && (
          <div className="absolute top-[40%] right-[25%] w-[20%] h-[15%] bg-red-600/60 rounded-full blur-sm animate-pulse-slow" />
        )}
        {/* Earth continents */}
        {type === "earth" && (
          <>
            <div className="absolute top-[20%] left-[30%] w-[40%] h-[20%] bg-green-600/50 rounded-full blur-sm" />
            <div className="absolute bottom-[30%] right-[20%] w-[30%] h-[15%] bg-green-600/40 rounded-full blur-sm" />
          </>
        )}
      </div>
    </div>
  );
};


const SpaceStation: React.FC = () => (
  <div className="absolute top-[5%] right-[20%] animate-space-station hidden lg:block">
    <div className="relative w-32 h-8">
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-10 h-6 bg-gradient-to-r from-blue-900 to-blue-800 transform skew-y-12" />
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-10 h-6 bg-gradient-to-r from-blue-800 to-blue-900 transform -skew-y-12" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-4 bg-gray-300 rounded-full shadow-lg" />
    </div>
  </div>
);