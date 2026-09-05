'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * CubeSpinner — Accessible 3D cube loading spinner.
 *
 * @author Remco Stoeten
 * @remarks
 * Renders a 3D rotating cube with configurable size, color, and animation speed.
 * Supports fullscreen and centered display modes and includes an accessible label for screen readers.
 *
 * @param {object} props - Component props.
 * @param {number} [props.size=70.4] - Size of the cube in pixels.
 * @param {string} [props.color='rgb(247, 197, 159)'] - Cube border color.
 * @param {string} [props.colorAlpha='rgba(247, 197, 159, 0.1)'] - Cube face fill color.
 * @param {number} [props.borderWidth=3.5] - Cube border thickness.
 * @param {number} [props.duration=1.6] - Duration (in seconds) for one full rotation.
 * @param {string} [props.ease='ease'] - CSS easing function for rotation animation.
 * @param {boolean} [props.fullscreen=false] - Whether the spinner covers the entire viewport.
 * @param {boolean} [props.centered=false] - Whether the spinner is centered within its parent container.
 * @param {string} [props.className] - Additional CSS class for custom styling.
 * @param {React.CSSProperties} [props.style] - Inline style overrides.
 * @param {string} [props.label='Loading...'] - Accessible text label for assistive technologies.
 *
 * @returns {JSX.Element} A visually rendered 3D cube spinner with accessibility support.
 *
 * @example
 * ```tsx
 * <CubeSpinner fullscreen color="rgb(255, 200, 150)" duration={2} />
 * ```
 */
export function CubeSpinner({
  size = 70.4,
  color = 'rgb(155, 60, 70)',
  colorAlpha = 'rgba(191, 60, 70, 0.1)',
  borderWidth = 3.5,
  duration = 1.6,
  ease = 'ease',
  fullscreen = false,
  centered = false,
  className = '',
  style = {},
  label = 'Loading...',
}: {
  size?: number;
  color?: string;
  colorAlpha?: string;
  borderWidth?: number;
  duration?: number;
  ease?: string;
  fullscreen?: boolean;
  centered?: boolean;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
}) {
  const half = size / 2;

  const containerStyle: React.CSSProperties = {
    ...(fullscreen && {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.2)',
      zIndex: 9999,
      isolation: 'isolate',
    }),
    ...(centered && !fullscreen && {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
    }),
  };

  const spinnerStyle: React.CSSProperties = {
    width: size,
    height: size,
    animation: `cubeSpinnerRotate ${duration}s infinite ${ease}`,
    transformStyle: 'preserve-3d',
    ...style,
  };

  const faceStyle: React.CSSProperties = {
    backgroundColor: colorAlpha,
    height: '100%',
    position: 'absolute',
    width: '100%',
    border: `${borderWidth}px solid ${color}`,
  };

  const faces = [
    { transform: `translateZ(-${half}px) rotateY(180deg)` },
    { transform: `rotateY(-270deg) translateX(50%)`, transformOrigin: 'top right' },
    { transform: `rotateY(270deg) translateX(-50%)`, transformOrigin: 'center left' },
    { transform: `rotateX(90deg) translateY(-50%)`, transformOrigin: 'top center' },
    { transform: `rotateX(-90deg) translateY(50%)`, transformOrigin: 'bottom center' },
    { transform: `translateZ(${half}px)` },
  ];

  return (
    <>
      <style>{`
        @keyframes cubeSpinnerRotate {
          0% {
            transform: rotate(45deg) rotateX(-25deg) rotateY(25deg);
          }
          50% {
            transform: rotate(45deg) rotateX(-385deg) rotateY(25deg);
          }
          100% {
            transform: rotate(45deg) rotateX(-385deg) rotateY(385deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0s !important;
            transition: none !important;
          }
        }
      `}</style>

      <div
        style={containerStyle}
        className={cn(fullscreen && 'focus-visible:outline-none')}
        role="status"
        aria-busy="true"
        aria-live="polite"
      >
        <div
          className={className}
          style={spinnerStyle}
          tabIndex={fullscreen ? 0 : -1}
          aria-hidden="true"
        >
          {faces.map((face, index) => (
            <div
              key={index}
              style={{
                ...faceStyle,
                transform: face.transform,
                transformOrigin: face.transformOrigin,
              }}
            />
          ))}
        </div>

        <span
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            margin: -1,
            padding: 0,
            border: 0,
            clip: 'rect(0 0 0 0)',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
      </div>
    </>
  );
}

export const CUBE_SPINNER_COLORS_DARK = {
  color: 'rgb(191, 255, 128)',
  colorAlpha: 'rgba(191, 255, 128, 0.1)',
};

export const CUBE_SPINNER_COLORS_LIGHT = {
  color: 'rgb(34, 197, 94)',
  colorAlpha: 'rgba(34, 197, 94, 0.1)',
};