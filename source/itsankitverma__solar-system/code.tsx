"use client"

import React, { useEffect, useState, memo } from 'react';

// --- Type Definitions ---
type PlanetName = 'mercury' | 'venus' | 'earth' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune';

interface PlanetConfig {
  id: string;
  name: PlanetName;
  orbitRadius: number;
  size: number;
  speed: number;
  color: string;
  shadowColor: string;
  label: string;
  moons?: MoonConfig[];
  hasRings?: boolean;
}

interface MoonConfig {
  id: string;
  size: number;
  orbitRadius: number;
  speed: number;
  color: string;
}

interface OrbitingPlanetProps {
  config: PlanetConfig;
  angle: number;
  time: number;
}

interface OrbitPathProps {
  radius: number;
  opacity?: number;
}

// --- Planet Configurations ---
const planetsConfig: PlanetConfig[] = [
  {
    id: 'mercury',
    name: 'mercury',
    orbitRadius: 60,
    size: 12,
    speed: 2.4,
    color: 'bg-gradient-to-br from-gray-400 to-gray-600',
    shadowColor: 'rgba(156, 163, 175, 0.5)',
    label: 'Mercury'
  },
  {
    id: 'venus',
    name: 'venus',
    orbitRadius: 90,
    size: 18,
    speed: 1.8,
    color: 'bg-gradient-to-br from-yellow-200 to-yellow-500',
    shadowColor: 'rgba(253, 224, 71, 0.5)',
    label: 'Venus'
  },
  {
    id: 'earth',
    name: 'earth',
    orbitRadius: 120,
    size: 20,
    speed: 1.5,
    color: 'bg-gradient-to-br from-blue-400 to-green-500',
    shadowColor: 'rgba(59, 130, 246, 0.5)',
    label: 'Earth',
    moons: [
      {
        id: 'moon',
        size: 6,
        orbitRadius: 15,
        speed: 8,
        color: 'bg-gray-300'
      }
    ]
  },
  {
    id: 'mars',
    name: 'mars',
    orbitRadius: 150,
    size: 16,
    speed: 1.2,
    color: 'bg-gradient-to-br from-red-400 to-red-700',
    shadowColor: 'rgba(248, 113, 113, 0.5)',
    label: 'Mars',
    moons: [
      {
        id: 'phobos',
        size: 4,
        orbitRadius: 12,
        speed: 10,
        color: 'bg-gray-400'
      },
      {
        id: 'deimos',
        size: 3,
        orbitRadius: 16,
        speed: 7,
        color: 'bg-gray-500'
      }
    ]
  },
  {
    id: 'jupiter',
    name: 'jupiter',
    orbitRadius: 200,
    size: 35,
    speed: 0.8,
    color: 'bg-gradient-to-br from-orange-300 via-orange-400 to-red-400',
    shadowColor: 'rgba(251, 146, 60, 0.5)',
    label: 'Jupiter',
    moons: [
      {
        id: 'io',
        size: 5,
        orbitRadius: 25,
        speed: 12,
        color: 'bg-yellow-200'
      },
      {
        id: 'europa',
        size: 4,
        orbitRadius: 30,
        speed: 10,
        color: 'bg-gray-200'
      },
      {
        id: 'ganymede',
        size: 6,
        orbitRadius: 35,
        speed: 8,
        color: 'bg-orange-200'
      },
      {
        id: 'callisto',
        size: 5,
        orbitRadius: 40,
        speed: 6,
        color: 'bg-amber-300'
      }
    ]
  },
  {
    id: 'saturn',
    name: 'saturn',
    orbitRadius: 250,
    size: 30,
    speed: 0.6,
    color: 'bg-gradient-to-br from-yellow-300 to-amber-400',
    shadowColor: 'rgba(252, 211, 77, 0.5)',
    label: 'Saturn',
    hasRings: true,
    moons: [
      {
        id: 'titan',
        size: 6,
        orbitRadius: 30,
        speed: 7,
        color: 'bg-orange-300'
      },
      {
        id: 'enceladus',
        size: 4,
        orbitRadius: 35,
        speed: 9,
        color: 'bg-gray-100'
      }
    ]
  },
  {
    id: 'uranus',
    name: 'uranus',
    orbitRadius: 300,
    size: 24,
    speed: 0.4,
    color: 'bg-gradient-to-br from-cyan-300 to-cyan-500',
    shadowColor: 'rgba(34, 211, 238, 0.5)',
    label: 'Uranus'
  },
  {
    id: 'neptune',
    name: 'neptune',
    orbitRadius: 340,
    size: 22,
    speed: 0.3,
    color: 'bg-gradient-to-br from-blue-500 to-blue-700',
    shadowColor: 'rgba(59, 130, 246, 0.5)',
    label: 'Neptune'
  }
];

// --- Moon Component ---
const Moon = memo(({ moon, planetAngle, time }: { moon: MoonConfig; planetAngle: number; time: number }) => {
  const moonAngle = time * moon.speed;
  const x = Math.cos(moonAngle) * moon.orbitRadius;
  const y = Math.sin(moonAngle) * moon.orbitRadius;

  return (
    <div
      className={`absolute rounded-full ${moon.color}`}
      style={{
        width: `${moon.size}px`,
        height: `${moon.size}px`,
        transform: `translate(${x}px, ${y}px)`,
        left: '50%',
        top: '50%',
        marginLeft: `-${moon.size / 2}px`,
        marginTop: `-${moon.size / 2}px`,
        boxShadow: '0 0 10px rgba(255,255,255,0.3)'
      }}
    />
  );
});
Moon.displayName = 'Moon';

// --- Saturn's Rings Component ---
const SaturnRings = memo(({ size }: { size: number }) => {
  return (
    <div
      className="absolute rounded-full"
      style={{
        width: `${size * 2.5}px`,
        height: `${size * 2.5}px`,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%) rotateX(70deg)',
        border: '8px solid',
        borderColor: 'rgba(252, 211, 77, 0.3)',
        boxShadow: '0 0 20px rgba(252, 211, 77, 0.2), inset 0 0 20px rgba(252, 211, 77, 0.1)'
      }}
    />
  );
});
SaturnRings.displayName = 'SaturnRings';

// --- Orbiting Planet Component ---
const OrbitingPlanet = memo(({ config, angle, time }: OrbitingPlanetProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { orbitRadius, size, color, shadowColor, label, moons, hasRings } = config;

  const x = Math.cos(angle) * orbitRadius;
  const y = Math.sin(angle) * orbitRadius * 0.6; // Elliptical orbit

  return (
    <div
      className="absolute"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(${x}px, ${y}px)`,
        left: '50%',
        top: '50%',
        marginLeft: `-${size / 2}px`,
        marginTop: `-${size / 2}px`,
        zIndex: y > 0 ? 100 : 1,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Planet */}
      <div
        className={`relative w-full h-full rounded-full ${color} transition-all duration-300 cursor-pointer`}
        style={{
          boxShadow: `0 0 ${isHovered ? '40px' : '20px'} ${shadowColor}, inset -${size/4}px -${size/4}px ${size/2}px rgba(0,0,0,0.3)`,
          transform: isHovered ? 'scale(1.2)' : 'scale(1)',
        }}
      >
        {/* Saturn's rings */}
        {hasRings && <SaturnRings size={size} />}
        
        {/* Moons */}
        {moons?.map(moon => (
          <Moon key={moon.id} moon={moon} planetAngle={angle} time={time} />
        ))}
      </div>

      {/* Label on hover */}
      {isHovered && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900/95 backdrop-blur-sm rounded text-xs text-white whitespace-nowrap pointer-events-none z-50">
          {label}
        </div>
      )}
    </div>
  );
});
OrbitingPlanet.displayName = 'OrbitingPlanet';

// --- Orbit Path Component ---
const OrbitPath = memo(({ radius, opacity = 0.1 }: OrbitPathProps) => {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: `${radius * 2}px`,
        height: `${radius * 2 * 0.6}px`,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        border: `1px solid rgba(255, 255, 255, ${opacity})`,
      }}
    />
  );
});
OrbitPath.displayName = 'OrbitPath';

// --- Star Field Background ---
const StarField = memo(() => {
  const [stars] = useState(() => 
    Array.from({ length: 200 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      twinkle: Math.random() * 3 + 1
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `twinkle ${star.twinkle}s ease-in-out infinite`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: inherit; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
});
StarField.displayName = 'StarField';

// --- Main Solar System Component ---
export default function SolarSystem() {
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  useEffect(() => {
    if (isPaused) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setTime(prevTime => prevTime + deltaTime * speedMultiplier);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, speedMultiplier]);

  return (
    <main className="w-full h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center overflow-hidden relative">
      {/* Star field background */}
      <StarField />

      {/* Controls */}
      <div className="absolute top-4 left-4 z-50 flex gap-2">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="px-4 py-2 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-lg backdrop-blur-sm transition-colors"
        >
          {isPaused ? 'Play' : 'Pause'}
        </button>
        <button
          onClick={() => setSpeedMultiplier(prev => prev === 0.5 ? 1 : prev === 1 ? 2 : 0.5)}
          className="px-4 py-2 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-lg backdrop-blur-sm transition-colors"
        >
          Speed: {speedMultiplier}x
        </button>
      </div>

      {/* Solar System Container */}
      <div className="relative w-[800px] h-[800px] flex items-center justify-center">
        
        {/* Sun */}
        <div className="absolute w-40 h-40 bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-500 rounded-full z-10"
          style={{
            boxShadow: '0 0 80px rgba(255, 204, 0, 0.8), 0 0 120px rgba(255, 204, 0, 0.5), 0 0 200px rgba(255, 204, 0, 0.3)',
            animation: 'pulse 4s ease-in-out infinite'
          }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-orange-600/30 animate-spin" style={{ animationDuration: '20s' }} />
        </div>

        {/* Render orbit paths */}
        {planetsConfig.map((planet) => (
          <OrbitPath
            key={`path-${planet.id}`}
            radius={planet.orbitRadius}
            opacity={0.15}
          />
        ))}

        {/* Render planets */}
        {planetsConfig.map((planet) => {
          const angle = time * planet.speed * 0.2;
          return (
            <OrbitingPlanet
              key={planet.id}
              config={planet}
              angle={angle}
              time={time}
            />
          );
        })}
      </div>

      {/* Title */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-wider">Solar System</h1>
        <p className="text-gray-400 text-sm">Interactive planetary visualization</p>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </main>
  );
}