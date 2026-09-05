import React, { useState, useEffect, useRef } from "react";
import type { MouseEvent } from "react";

// Type definitions
interface Particle {
  id: number;
  left: number;
  duration: number;
  opacity: number;
}

interface CardTransform {
  rotateX: number;
  rotateY: number;
  translateY: number;
  scale: number;
}

// Custom hook for theme management
const useTheme = () => {
  const [isDark, setIsDark] = useState<boolean>(false);

  const toggleTheme = (): void => {
    setIsDark((prev) => !prev);
  };

  return { isDark, toggleTheme };
};

// Custom hook for 3D card effects
const useCardTransform = () => {
  const [transform, setTransform] = useState<CardTransform>({
    rotateX: 0,
    rotateY: 0,
    translateY: 0,
    scale: 1,
  });

  const handleMouseMove = (
    e: MouseEvent<HTMLDivElement>,
    cardRef: React.RefObject<HTMLDivElement>
  ): void => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = (y / rect.height) * -20;
    const rotateY = (x / rect.width) * 20;

    setTransform({
      rotateX,
      rotateY,
      translateY: -20,
      scale: 1.02,
    });
  };

  const handleMouseLeave = (): void => {
    setTransform({
      rotateX: 0,
      rotateY: 0,
      translateY: 0,
      scale: 1,
    });
  };

  return { transform, handleMouseMove, handleMouseLeave };
};

// Particle system hook
const useParticles = (isActive: boolean) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleId = useRef<number>(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const newParticle: Particle = {
        id: particleId.current++,
        left: Math.random() * 100,
        duration: Math.random() * 3 + 2,
        opacity: Math.random() * 0.5 + 0.2,
      };

      setParticles((prev) => [...prev, newParticle]);

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, newParticle.duration * 1000);
    }, 300);

    return () => clearInterval(interval);
  }, [isActive]);

  return particles;
};

// Ripple effect hook
const useRipple = () => {
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);
  const rippleId = useRef<number>(0);

  const createRipple = (e: MouseEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = 60;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      id: rippleId.current++,
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  return { ripples, createRipple };
};

// Main component
const FloatingCard: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { transform, handleMouseMove, handleMouseLeave } = useCardTransform();
  const { ripples, createRipple } = useRipple();
  const particles = useParticles(true);
  const cardRef = useRef<HTMLDivElement>(null);

  const getTransformStyle = (): string => {
    return `translateY(${transform.translateY}px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`;
  };

  const handleCardClick = (e: MouseEvent<HTMLDivElement>): void => {
    createRipple(e);
  };

  const handleTryNow = (): void => {
    console.log("Try now clicked!");
  };

  const handleSignUp = (): void => {
    console.log("Sign up clicked!");
  };

  return (
    <div
      className={`w-screen min-h-screen transition-all duration-300 ${
        isDark ? "bg-black" : "bg-white"
      }`}
    >
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-5 right-5 px-5 py-3 rounded-full backdrop-blur-md transition-all duration-300 text-sm font-medium hover:scale-105 z-50 ${
          isDark
            ? "bg-white/10 border border-white/20 text-white hover:bg-white/15"
            : "bg-black/10 border border-black/20 text-white hover:bg-black/15"
        }`}
      >
        {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      {/* Centered Card Container */}
      <div className="flex justify-center items-center min-h-screen p-4 sm:p-6 lg:p-8">
        <div
          className="perspective-1000"
          onMouseMove={(e) =>
            handleMouseMove(e, cardRef as React.RefObject<HTMLDivElement>)
          }
          onMouseLeave={handleMouseLeave}
          style={{ perspective: "1000px" }}
        >
          <div
            ref={cardRef}
            onClick={handleCardClick}
            className={`relative w-80 sm:w-96 lg:w-[28rem] h-auto min-h-[500px] p-6 sm:p-8 rounded-3xl backdrop-blur-3xl cursor-pointer transition-all duration-500 transform-gpu preserve-3d ${
              isDark
                ? "bg-white/10 border border-white/20 text-white shadow-lg shadow-white/10"
                : "bg-white border border-black/20 text-black shadow-lg shadow-black/10"
            }`}
            style={{
              transform: getTransformStyle(),
              animation: "float 6s ease-in-out infinite",
            }}
          >
            {/* Particles */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
              {particles.map((particle) => (
                <div
                  key={particle.id}
                  className={`absolute w-0.5 h-0.5 rounded-full ${
                    isDark ? "bg-white/60" : "bg-black/40"
                  }`}
                  style={{
                    left: `${particle.left}%`,
                    opacity: particle.opacity,
                    animation: `particleFloat ${particle.duration}s linear infinite`,
                  }}
                />
              ))}
            </div>

            {/* Ripples */}
            {ripples.map((ripple) => (
              <span
                key={ripple.id}
                className={`absolute w-15 h-15 rounded-full pointer-events-none ${
                  isDark ? "bg-white/30" : "bg-black/30"
                }`}
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  animation: "ripple 0.6s ease-out",
                }}
              />
            ))}

            {/* Card Content */}
            <div className="relative z-10 h-full flex flex-col">
              <h1
                className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight bg-gradient-to-br bg-clip-text text-transparent ${
                  isDark ? "from-white to-gray-300" : "from-black to-gray-700"
                }`}
              >
                Make things float in air
              </h1>

              <p className="text-sm sm:text-base opacity-80 mb-6 sm:mb-8 leading-relaxed">
                Did you like our Floating Card?
              </p>

              <img
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
                alt="Forest scene"
                className="w-full h-32 sm:h-40 lg:h-48 object-cover rounded-xl mb-6 sm:mb-8 transition-all duration-300 shadow-lg shadow-black/30"
                style={{
                  transform:
                    transform.scale > 1
                      ? "translateZ(20px) scale(1.03)"
                      : "none",
                }}
              />

              {/* Buttons inside the card with proper margins */}
              <div className="mt-auto flex justify-between sm:gap-4">
                <button
                  onClick={handleTryNow}
                  className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium transition-all duration-300 hover:translate-x-1 hover:opacity-80 ${
                    isDark
                      ? "bg-[#1a1a1a] border border-white text-white rounded-lg"
                      : "bg-[#1a1a1a] border border-white text-white rounded-lg"
                  }`}
                >
                  Try now
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>

                <button
                  onClick={handleSignUp}
                  className={`px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    isDark
                      ? "bg-[#1a1a1a] border border-white text-white rounded-lg"
                      : "bg-[#1a1a1a] border border-white text-white rounded-lg"
                  }`}
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotateX(0deg);
          }
          50% {
            transform: translateY(-10px) rotateX(2deg);
          }
        }

        @keyframes particleFloat {
          0% {
            transform: translateY(100%) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100%) scale(1);
            opacity: 0;
          }
        }

        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }

        /* Responsive breakpoints */
        @media (max-width: 640px) {
          .perspective-1000 > div {
            width: 20rem;
            min-height: 28rem;
          }
        }

        @media (max-width: 480px) {
          .perspective-1000 > div {
            width: 18rem;
            min-height: 26rem;
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingCard;

