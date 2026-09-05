import React, { useEffect, useState, useMemo } from 'react';

export const Component = () => {
  const [isDark, setIsDark] = useState(false);

  // Check for dark mode preference
  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark') ||
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setIsDark(isDarkMode);
    };

    checkTheme();
    
    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkTheme);
    };
  }, []);

  // Generate particle data
  const particles = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }));
  }, []);

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.6;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 1;
          }
          50% {
            transform: translateY(-10px) translateX(-5px);
            opacity: 0.8;
          }
          75% {
            transform: translateY(-30px) translateX(15px);
            opacity: 1;
          }
        }
        
        @keyframes drift {
          0% {
            transform: translateX(0px) translateY(0px);
            opacity: 0.4;
          }
          33% {
            transform: translateX(30px) translateY(-20px);
            opacity: 0.8;
          }
          66% {
            transform: translateX(-20px) translateY(20px);
            opacity: 0.6;
          }
          100% {
            transform: translateX(0px) translateY(0px);
            opacity: 0.4;
          }
        }
        
        .particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: float infinite ease-in-out;
        }
        
        .particle-drift {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: drift infinite linear;
        }
      `}</style>
      
      <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        {/* Main text */}
        <span className="pointer-events-none z-10 whitespace-pre-wrap text-center text-8xl font-semibold leading-none text-black dark:text-white">
          Particles
        </span>
        
        {/* Particles container */}
        <div className="absolute inset-0 z-0">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="particle"
              style={{
                backgroundColor: isDark ? '#ffffff' : '#000000',
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                animationDuration: `${particle.duration}s`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
        </div>
        
        {/* Additional drifting particles */}
        <div className="absolute inset-0 z-0">
          {particles.slice(0, 30).map((particle) => (
            <div
              key={`drift-${particle.id}`}
              className="particle-drift"
              style={{
                backgroundColor: isDark ? '#ffffff' : '#000000',
                width: `${particle.size * 0.7}px`,
                height: `${particle.size * 0.7}px`,
                left: `${(particle.x + 30) % 100}%`,
                top: `${(particle.y + 30) % 100}%`,
                animationDuration: `${particle.duration * 1.8}s`,
                animationDelay: `${particle.delay + 1}s`,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};
