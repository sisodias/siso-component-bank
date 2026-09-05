
import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Types & Interfaces ---
interface PageProps {
  index: number;
  total: number;
  progress: number;
  isTopCover?: boolean;
}

interface BookConfig {
  width: number;
  height: number;
  layers: number;
  maxRotation: number;
  tilt: number;
}

// --- Constants ---
const BOOK_CONFIG: BookConfig = {
  width: 320,
  height: 440,
  layers: 12,
  maxRotation: 170,
  tilt: -2,
};

const COLORS = {
  appBg: '#000000',
  bookBg: 'rgb(30, 58, 138)', // Deep sapphire blue
  border: 'rgba(147, 197, 253, 0.6)', // Bright ethereal blue border
  title: '#f8f9fa',
  subtitle: '#94a3b8',
  grid: 'rgba(147, 197, 253, 0.08)',
};

// --- Sub-components ---
const Page: React.FC<PageProps> = ({ index, total, progress, isTopCover }) => {
  const weight = (total - 1 - index) / (total - 1);
  const rotationY = progress * BOOK_CONFIG.maxRotation * weight;
  const zOffset = (total - 1 - index) * 0.5;
  
  // Calculate curl effect intensity based on rotation
  // The curl is most visible as the page "peels" away (around 45-90 degrees)
  const curlIntensity = Math.sin((rotationY * Math.PI) / 180);
  const curlSkew = curlIntensity * 8; // Max 8 degrees skew
  const curlOpacity = curlIntensity * 0.4;

  return (
    <div
      className="absolute top-0 left-0 transition-transform duration-75 ease-out select-none overflow-hidden"
      style={{
        width: `${BOOK_CONFIG.width}px`,
        height: `${BOOK_CONFIG.height}px`,
        backgroundColor: COLORS.bookBg,
        border: `${isTopCover || index === total - 1 ? '2px' : '1px'} solid ${COLORS.border}`,
        borderRadius: '4px 16px 16px 4px',
        transformOrigin: 'left center',
        transform: `translateZ(${zOffset}px) rotateY(${-rotationY}deg)`,
        zIndex: total - index,
        backfaceVisibility: 'hidden',
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}
    >
      {/* Paper Grain Simulation: Micro-texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 2px),
            repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 2px)
          `,
          backgroundSize: '2px 2px'
        }}
      />

      {/* Dimensional Sheen & Shadow: Simulates surface light behavior */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 45%, rgba(0,0,0,0.2) 100%)'
        }}
      />

      {/* Page Curl Effect Layer: Uses skew to simulate corner lift */}
      <div 
        className="absolute right-0 bottom-0 w-48 h-48 pointer-events-none origin-bottom-right"
        style={{
          background: 'linear-gradient(135deg, transparent 60%, rgba(255,255,255,0.15) 100%)',
          transform: `skewY(${-curlSkew}deg)`,
          opacity: curlOpacity,
          filter: 'blur(4px)',
        }}
      />

      {/* Secondary Curl Shadow: Adds depth to the lift */}
      <div 
        className="absolute right-0 bottom-0 w-full h-24 pointer-events-none origin-bottom-right"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 100%)',
          transform: `skewX(${curlSkew}deg)`,
          opacity: curlOpacity * 0.5,
        }}
      />

      {isTopCover && (
        <div className="relative text-center flex flex-col items-center z-10">
          <h1 
            className="text-5xl font-lexend tracking-tight mb-2"
            style={{ color: COLORS.title }}
          >
            book.
          </h1>
          <p 
            className="text-sm font-mono tracking-widest opacity-90 mb-8"
            style={{ color: COLORS.subtitle }}
          >
            [interactive]
          </p>
          
          <div className="max-w-[240px]">
            <p 
              className="text-[13px] font-mono leading-relaxed opacity-95 tracking-tight text-white/90"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
            >
              Move your pointer across the screen to peel back the layers. 
              Each stacked leaf responds with a staggered 3D transform, 
              simulating physical depth and rotation based on your distance 
              from the spine.
            </p>
          </div>
        </div>
      )}
      
      {/* Spine Shadow Detail: Adds depth at the fold */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-8 opacity-40 z-20"
        style={{ 
          background: 'linear-gradient(to right, rgba(0,0,0,0.5), transparent)',
          borderLeft: `1px solid ${COLORS.border}`
        }}
      />
    </div>
  );
};

// --- Main Component ---
const App: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const spinePosRef = useRef<number>(0);

  const updateSpinePos = useCallback(() => {
    spinePosRef.current = window.innerWidth / 2 - BOOK_CONFIG.width / 2;
  }, []);

  useEffect(() => {
    updateSpinePos();
    window.addEventListener('resize', updateSpinePos);
    return () => window.removeEventListener('resize', updateSpinePos);
  }, [updateSpinePos]);

  useEffect(() => {
    const handleMove = (clientX: number) => {
      const spineX = spinePosRef.current;
      const W = BOOK_CONFIG.width;
      // Define the interaction range centered roughly around the book's right edge
      const startX = spineX + (0.75 * W);
      const endX = spineX - (0.75 * W);
      let currentProgress = (clientX - startX) / (endX - startX);
      currentProgress = Math.max(0, Math.min(1, currentProgress));
      setProgress(currentProgress);
    };

    const onPointerMove = (e: PointerEvent) => handleMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientX);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('touchmove', onTouchMove);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  const layers = Array.from({ length: BOOK_CONFIG.layers });

  return (
    <div 
      className="relative w-full h-screen flex items-center justify-center overflow-hidden touch-none"
      style={{
        backgroundColor: COLORS.appBg,
        backgroundImage: `
          linear-gradient(to right, ${COLORS.grid} 1px, transparent 1px),
          linear-gradient(to bottom, ${COLORS.grid} 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        backgroundPosition: 'center center'
      }}
    >
      <div 
        className="relative"
        style={{
          width: `${BOOK_CONFIG.width}px`,
          height: `${BOOK_CONFIG.height}px`,
          perspective: '2000px',
          transform: `rotate(${-BOOK_CONFIG.tilt}deg)`,
        }}
      >
        <div 
          className="relative w-full h-full"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: 'translateZ(0px)'
          }}
        >
          {layers.map((_, idx) => (
            <Page
              key={idx}
              index={idx}
              total={BOOK_CONFIG.layers}
              progress={progress}
              isTopCover={idx === 0}
            />
          ))}
        </div>
      </div>

      {/* Guide line for the spine */}
      <div 
        className="absolute h-1/2 w-px pointer-events-none"
        style={{ 
            left: `${spinePosRef.current}px`,
            top: '25%',
            backgroundColor: COLORS.border,
            opacity: 0.15,
            boxShadow: '0 0 20px rgba(147, 197, 253, 0.1)'
        }}
      />
    </div>
  );
};

export default App;