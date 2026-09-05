'use client';

import React from 'react';

export type ScrollingHeroMarqueeProps = {
  /** The sentence to scroll. */
  text?: string;
  /** Animation duration in seconds (lower = faster). Default: 10 */
  durationSec?: number;
  /** Height of each scroller row in px. Default: 150 */
  rowHeight?: number;
  /** Font size (any CSS size; clamp recommended). Default: 'clamp(2rem, 6vw, 4rem)' */
  fontSize?: string;
  /** Perspective in px. Default: 500 */
  perspectivePx?: number;
  /** Bottom scroller tilt/skew (deg). Defaults: rotateX=-30, skewX=20 */
  bottomRotateXDeg?: number;
  bottomSkewXDeg?: number;

  /** Light-mode gradient colors for top/bottom masks. */
  lightTopFade?: string;    // e.g. '#ffffff'
  lightBottomFade?: string; // e.g. '#ffffff'
  /** Dark-mode gradient colors for top/bottom masks. */
  darkTopFade?: string;     // e.g. '#000000'
  darkBottomFade?: string;  // e.g. '#000000'

  /** Extra class on the root container. */
  className?: string;
};

export default function ScrollingHeroMarquee({
  text = 'I believe that a good user interface is carefully targeted towards its audience, with the right mixture of simplicity, elegance and innovation.',
  durationSec = 10,
  rowHeight = 150,
  fontSize = 'clamp(2rem, 6vw, 4rem)',
  perspectivePx = 500,
  bottomRotateXDeg = -30,
  bottomSkewXDeg = 20,
  lightTopFade = '#ffffff',
  lightBottomFade = '#ffffff',
  darkTopFade = '#000000',
  darkBottomFade = '#000000',
  className = '',
}: ScrollingHeroMarqueeProps) {
  return (
    <section
      className={`flex min-h-screen flex-col justify-center p-8 ${className}`}
      style={{ perspective: `${perspectivePx}px` }}
      aria-label="Hero marquee"
    >
      {/* Screen-reader only single copy */}
      <p className="sr-only">{text}</p>

      {/* TOP SCROLLER */}
      <div
        className="relative mx-auto overflow-hidden"
        style={{ height: `${rowHeight}px` }}
      >
        <h2
          className="relative m-0 font-semibold leading-tight will-change-transform"
          aria-hidden="true"
          style={{
            fontSize,
            top: '100%',
            animation: `scrollerTop ${durationSec}s linear infinite`,
          }}
        >
          {text}
        </h2>
        {/* Top fade mask (light/dark aware) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
          style={{
            backgroundImage: `linear-gradient(180deg, ${lightTopFade}, transparent)`,
          }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2 dark:block hidden"
          style={{
            backgroundImage: `linear-gradient(180deg, ${darkTopFade} )`,
          }}
        />
      </div>

      {/* BOTTOM SCROLLER */}
      <div
        className="relative mx-auto overflow-hidden origin-top"
        style={{
          height: `${rowHeight}px`,
          transform: `rotateX(${bottomRotateXDeg}deg) translateZ(0) skewX(${bottomSkewXDeg}deg)`,
        }}
      >
        <h2
          className="relative m-0 font-semibold leading-tight will-change-transform"
          aria-hidden="true"
          style={{
            fontSize,
            top: 0,
            animation: `scrollerBottom ${durationSec}s linear infinite`,
          }}
        >
          {text}
        </h2>
        {/* Bottom fade mask (light/dark aware) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
          style={{
            backgroundImage: `linear-gradient(0deg, ${lightBottomFade}, transparent)`,
          }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 dark:block hidden"
          style={{
            backgroundImage: `linear-gradient(0deg, ${darkBottomFade})`,
          }}
        />
      </div>

      {/* Keyframes + reduced-motion handling */}
      <style jsx>{`
        @keyframes scrollerTop {
          0% {
            top: 200%;
            transform: translateY(0%);
          }
          100% {
            top: 0%;
            transform: translateY(-100%);
          }
        }
        @keyframes scrollerBottom {
          0% {
            top: 100%;
            transform: translateY(0%);
          }
          100% {
            top: -100%;
            transform: translateY(-100%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          h2 {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}

export { ScrollingHeroMarquee };
