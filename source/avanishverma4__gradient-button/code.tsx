import React, { useState, useEffect, useLayoutEffect } from 'react';

/**
 * Ripple data structure
 */
interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

/**
 * GradientButtonProps defines the configuration for our custom button.
 */
interface GradientButtonProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'ocean' | 'sunset' | 'emerald' | 'crimson' | 'neon' | 'mint' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
}

/**
 * GradientButton - A highly polished button with:
 * 1. Multi-color gradients
 * 2. Glassmorphism backdrop
 * 3. Animated shimmer effect on hover (enabled only)
 * 4. Subtle scale-up and gentle breathing animation on hover (enabled only)
 * 5. Tactile press animation (downward scale, translation, and opacity)
 * 6. Visual ripple effect on click
 * 7. Robust disabled state (prevents all interactions and animations)
 * 8. Interactive icon animation on hover
 */
const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  icon,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
}) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  // Cleanup ripples after animation finishes
  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple: Ripple = {
      id: Date.now(),
      x,
      y,
      size,
    };

    setRipples((prev) => [...prev, newRipple]);
    if (onClick) onClick();
  };

  // Variant mapping to Tailwind gradient classes
  const variants = {
    primary: 'from-indigo-600 via-purple-600 to-pink-600',
    ocean: 'from-blue-600 via-cyan-500 to-teal-400',
    sunset: 'from-orange-500 via-red-500 to-pink-500',
    emerald: 'from-emerald-500 via-green-600 to-teal-600',
    crimson: 'from-rose-600 via-red-600 to-orange-600',
    neon: 'from-fuchsia-500 via-pink-500 to-indigo-500',
    mint: 'from-green-400 via-emerald-500 to-teal-400',
    gold: 'from-yellow-500 via-orange-500 to-red-500',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base font-semibold',
    lg: 'px-8 py-4 text-lg font-bold',
    xl: 'px-10 py-5 text-xl font-extrabold tracking-wide',
  };

  return (
    <button
      onPointerDown={handlePointerDown}
      disabled={disabled}
      className={`
        group relative overflow-hidden rounded-xl transition-all duration-300 select-none
        ${!disabled ? 'hover:scale-105 active:scale-95 active:translate-y-0.5 active:opacity-90 shadow-lg hover:shadow-2xl cursor-pointer' : 'opacity-40 grayscale cursor-not-allowed'}
        ${sizes[size]}
        ${className}
      `}
      style={{
        animation: !disabled ? 'gentle-pulse 3s ease-in-out infinite' : 'none'
      }}
    >
      {/* Background Gradient Layer */}
      <div className={`absolute inset-0 bg-gradient-to-r ${variants[variant]} transition-all duration-500`} />

      {/* Ripple Container */}
      <span className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute bg-white/30 rounded-full"
            style={{
              top: ripple.y,
              left: ripple.x,
              width: ripple.size,
              height: ripple.size,
              animation: 'ripple 600ms ease-out forwards'
            }}
          />
        ))}
      </span>

      {/* Shimmer Effect Overlay - Only active when not disabled */}
      {!disabled && (
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full skew-x-[-20deg]"
            style={{
              animation: 'shimmer 2s ease-in-out infinite'
            }}
          />
        </div>
      )}

      {/* Glossy Top Highlight */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

      {/* Inner Content Wrapper */}
      <span className={`relative flex items-center justify-center gap-2 drop-shadow-md text-white ${!disabled ? 'group-active:scale-95 transition-transform' : ''}`}>
        {icon && (
          <span className={`
            flex-shrink-0 transition-transform duration-300 ease-out
            ${!disabled ? 'group-hover:scale-110 group-hover:-rotate-6' : ''}
          `}>
            {icon}
          </span>
        )}
        <span className="font-semibold">{children}</span>
      </span>
    </button>
  );
};

export default function App() {
  const [darkMode, setDarkMode] = useState(true);

  // Sync the body class with the darkMode state
  useLayoutEffect(() => {
    if (darkMode) {
      document.body.className = 'bg-gray-950 text-white selection:bg-purple-500/30';
    } else {
      document.body.className = 'bg-slate-50 text-slate-900 selection:bg-indigo-200';
    }

    // Add custom animations to the document
    const style = document.createElement('style');
    style.textContent = `
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

      @keyframes shimmer {
        0% {
          transform: translateX(-100%) skewX(-20deg);
        }
        100% {
          transform: translateX(200%) skewX(-20deg);
        }
      }

      @keyframes gentle-pulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.01);
        }
      }

      @keyframes pulse-slow {
        0%, 100% {
          opacity: 0.3;
        }
        50% {
          opacity: 0.5;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center overflow-hidden relative gap-8 p-4`}>
      {/* Top right toggle button */}
      <div className="absolute top-8 right-8 z-20">
        <button 
          onClick={toggleTheme}
          className={`
            p-3 rounded-full border active:scale-90
            ${darkMode 
              ? 'bg-gray-900 border-white/10 text-yellow-400 hover:bg-gray-800 shadow-[0_0_15px_rgba(250,204,21,0.1)]' 
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
            }
          `}
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          )}
        </button>
      </div>

      {/* Background Orthogonal Grid Layer */}
      <div className={`absolute inset-0 -z-20 ${darkMode ? 'opacity-30' : 'opacity-50'}`}>
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(${darkMode ? '#ffffff33' : '#00000022'} 1.5px, transparent 1.5px),
              linear-gradient(90deg, ${darkMode ? '#ffffff33' : '#00000022'} 1.5px, transparent 1.5px)
            `,
            backgroundSize: '60px 60px',
            backgroundPosition: 'center center'
          }} 
        />
        {/* Grid fade edges */}
        <div 
          className="absolute inset-0" 
          style={{
            background: `radial-gradient(ellipse at center, transparent 0%, transparent 50%, ${darkMode ? '#030712' : '#f8fafc'} 90%)`
          }}
        />
      </div>

      {/* Abstract Background Elements for Atmosphere */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] blur-[120px] rounded-full ${darkMode ? 'bg-purple-600/10' : 'bg-indigo-400/10'}`}
          style={{
            animation: 'pulse-slow 6s ease-in-out infinite'
          }}
        />
      </div>

      <div className="text-center mb-4 relative z-10">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">Component Gallery</h1>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
          Experience the organic ripple effect on every click.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 max-w-4xl relative z-10">
        {/* Neon Variant with Icon */}
        <GradientButton 
          size="lg" 
          variant="neon"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>}
        >
          Neon Vibes
        </GradientButton>

        {/* Mint Variant with Icon */}
        <GradientButton 
          size="lg" 
          variant="mint"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m4.93 4.93 14.14 14.14"/><path d="M2 12h20"/><path d="m19.07 4.93-14.14 14.14"/></svg>}
        >
          Mint Fresh
        </GradientButton>

        {/* Disabled Example */}
        <GradientButton 
          size="lg" 
          variant="crimson"
          disabled={true}
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
        >
          Locked
        </GradientButton>

        {/* Gold Variant with Icon */}
        <GradientButton 
          size="lg" 
          variant="gold"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>}
        >
          Gold Status
        </GradientButton>

        {/* Original Variant */}
        <GradientButton 
          size="lg" 
          variant="primary"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>}
        >
          Get Started
        </GradientButton>
      </div>
    </div>
  );
}