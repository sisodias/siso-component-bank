// Original animated background with ripple effect
// Creates interactive ripples that respond to user interaction

import { cn } from "../_utils/cn";
import { useState, useEffect, useRef } from "react";

interface Ripple {
  x: number;
  y: number;
  id: number;
  timestamp: number;
}

export const RippleBackground = ({ children }: { children?: React.ReactNode }) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const rippleIdRef = useRef(0);

  const createRipple = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple: Ripple = {
      x,
      y,
      id: rippleIdRef.current++,
      timestamp: Date.now()
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 2000);
  };

  // Auto-generate ambient ripples
  useEffect(() => {
    const interval = setInterval(() => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;

      const newRipple: Ripple = {
        x,
        y,
        id: rippleIdRef.current++,
        timestamp: Date.now()
      };

      setRipples(prev => [...prev, newRipple]);

      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 2000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden cursor-pointer"
      onClick={createRipple}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="absolute inset-0 rounded-full border-2 border-purple-400/30 animate-ripple" />
          <div
            className="absolute inset-0 rounded-full border-2 border-blue-400/20 animate-ripple"
            style={{ animationDelay: '0.2s' }}
          />
          <div
            className="absolute inset-0 rounded-full border-2 border-pink-400/10 animate-ripple"
            style={{ animationDelay: '0.4s' }}
          />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10">
        {children || (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Interactive Ripple Background
              </h2>
              <p className="text-gray-600">
                Click anywhere to create ripples
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes ripple {
          0% {
            width: 0;
            height: 0;
            opacity: 1;
          }
          100% {
            width: 400px;
            height: 400px;
            opacity: 0;
          }
        }
        
        .animate-ripple {
          animation: ripple 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
