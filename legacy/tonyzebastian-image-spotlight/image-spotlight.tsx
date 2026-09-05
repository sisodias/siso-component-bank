'use client'
import React, { useState, useCallback, useRef } from 'react';

// Types
interface PerspectiveState {
  rotateX: number;
  rotateY: number;
}

interface SpotlightConfig {
  spotlightSize?: number;
  overlayOpacity?: number;
  className?: string;
}

interface ImageSpotlightProps {
  src: string;
  alt: string;
  orientation?: 'landscape' | 'portrait';
  width?: number;
  height?: number;
  config?: SpotlightConfig;
}


export default function ImageSpotlight({
  src,
  alt,
  orientation = 'landscape',
  width,
  height,
  config = {}
}: ImageSpotlightProps) {
  // Default configuration
  const defaultConfig: Required<SpotlightConfig> = {
    spotlightSize: 80,
    overlayOpacity: 0.6,
    className: ''
  };

  const finalConfig = { ...defaultConfig, ...config };

  // Component state
  const [perspective, setPerspective] = useState<PerspectiveState>({ rotateX: 0, rotateY: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse move handler
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    // Update CSS variables for spotlight position
    containerRef.current.style.setProperty('--mouse-x', `${x}%`);
    containerRef.current.style.setProperty('--mouse-y', `${y}%`);

    // Calculate 3D perspective rotation
    // Map cursor position to rotation values (-8 to +8 degrees for subtle effect)
    const rotateY = ((x - 50) / 50) * 8; // Left-right tilt
    const rotateX = ((50 - y) / 50) * 8; // Up-down tilt (inverted for natural feel)

    setPerspective({ rotateX, rotateY });
  }, []);

  // Mouse enter handler
  const handleMouseEnter = () => {
    // Handler for mouse enter event
  };

  // Mouse leave handler
  const handleMouseLeave = () => {
    setPerspective({ rotateX: 0, rotateY: 0 }); // Reset perspective when leaving
  };

  // Container classes and inline styles
  const getContainerDimensions = (): React.CSSProperties => {
    // Use provided width/height or fall back to defaults based on orientation
    if (width && height) {
      return {
        width: `${width}px`,
        height: `${height}px`,
        maxWidth: '100%'
      };
    }

    // Default dimensions if no width/height provided
    if (orientation === 'landscape') {
      return {
        width: '800px',
        height: '450px', // 16:9 ratio
        maxWidth: '100%'
      };
    } else {
      return {
        width: '450px',
        height: '600px', // 3:4 ratio
        maxWidth: '100%'
      };
    }
  };

  const containerClasses = `
    relative overflow-hidden cursor-none rounded-lg shadow-md border
    ${finalConfig.className}
  `.trim();

  return (
    <div className="flex items-center justify-center">
      <div
        ref={containerRef}
        className={containerClasses}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="img"
        aria-label={alt}
        aria-describedby="spotlight-instructions"
        tabIndex={0}
        style={{
          ...getContainerDimensions(),
          '--mouse-x': '50%',
          '--mouse-y': '50%',
          '--spotlight-size': `${finalConfig.spotlightSize}px`,
          '--overlay-opacity': finalConfig.overlayOpacity,
          transform: `perspective(1000px) rotateX(${perspective.rotateX}deg) rotateY(${perspective.rotateY}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.2s ease-out'
        } as React.CSSProperties}
      >
        {/* Hidden instructions for screen readers */}
        <div id="spotlight-instructions" className="sr-only">
          Interactive image with mouse spotlight effect.
          Move your mouse over the image to reveal different areas.
        </div>

        {/* Blurred Base Image - Always visible */}
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
          style={{ filter: 'blur(5px)' }}
        />

        {/* Sharp Image - Only visible through spotlight */}
        <img
          src={src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
          style={{
            maskImage: `radial-gradient(
              circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
              black ${finalConfig.spotlightSize * 0.4}px,
              transparent ${finalConfig.spotlightSize * 1.6}px
            )`,
            WebkitMaskImage: `radial-gradient(
              circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
              black ${finalConfig.spotlightSize * 0.4}px,
              transparent ${finalConfig.spotlightSize * 1.6}px
            )`,
            zIndex: 2
          }}
        />

        {/* Main Dark Overlay with Current Spotlight Position */}
        <div
          className="absolute inset-0 bg-black will-change-[mask-position] transition-all duration-100 ease-out"
          style={{
            opacity: finalConfig.overlayOpacity,
            maskImage: `radial-gradient(
              circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
              transparent ${finalConfig.spotlightSize * 0.4}px,
              black ${finalConfig.spotlightSize * 1.6}px
            )`,
            WebkitMaskImage: `radial-gradient(
              circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
              transparent ${finalConfig.spotlightSize * 0.4}px,
              black ${finalConfig.spotlightSize * 1.6}px
            )`,
            zIndex: 10
          }}
        />

      </div>
    </div>
  );
}