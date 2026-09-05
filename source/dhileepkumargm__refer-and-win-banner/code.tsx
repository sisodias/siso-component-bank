import React from 'react';

/**
 * Decorative paper airplane SVG with drop shadow.
 * Hidden from assistive technology.
 */
export function PaperAirplane({ className = '' }) {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <svg
        width="80"
        height="80"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="icon-drop-shadow"
      >
        <path d="M5.1,26.9L50,10L25,35L5.1,26.9z" fill="#A78BFA" />
        <path d="M25,35L15,29L20,20L25,35z" fill="#DB2777" />
        <path d="M25,35L10,27L15,15L25,35z" fill="#C084FC" />
        <path
          d="M25,35L5.1,26.9L50,10L25,35z"
          fill="#9370DB"
          opacity="0.5"
        />
      </svg>
      <div
        className="absolute top-3/4 left-0 w-2 h-2 bg-cyan-400 rounded-full opacity-80"
        style={{ transform: 'translate(-30px, 10px)' }}
      />
      <div
        className="absolute top-3/4 left-0 w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-60"
        style={{ transform: 'translate(-50px, 5px)' }}
      />
    </div>
  );
}

/**
 * Decorative green checkmark pair.
 * Hidden from assistive technology.
 */
export function GreenChecks({ className = '' }) {
  return (
    <div className={className} aria-hidden="true">
      <svg width="40" height="40" viewBox="0 0 40 40">
        <path
          d="M5 20 L15 30 L35 10"
          stroke="#32CD32"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          transform="rotate(-15 20 20)"
        />
      </svg>
      <svg
        width="40"
        height="40"
        className="absolute -top-2 -right-2"
        viewBox="0 0 40 40"
      >
        <path
          d="M5 20 L15 30 L35 10"
          stroke="#6EE7B7"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          transform="rotate(15 20 20)"
        />
      </svg>
    </div>
  );
}

/**
 * ReferAndWinBanner
 *
 * A customizable banner with floating paper airplanes and decorative accents.
 *
 * @param {string} title - The main heading text.
 */
export default function ReferAndWinBanner({ title = 'Refer & Win' }) {
  return (
    <section
      aria-label={title}
      className="relative w-full max-w-4xl flex items-center justify-center p-8"
    >
      <PaperAirplane className="absolute left-0 md:left-10 -top-8 animate-float" />

      <GreenChecks className="absolute -top-4 left-[calc(50%-130px)]" />

      <div
        className="absolute right-0 md:right-12"
        style={{ top: 'calc(50% + 10px)' }}
      >
        <div className="w-2.5 h-2.5 bg-pink-500 rounded-full" />
        <div className="w-1.5 h-1.5 bg-pink-400 rounded-full ml-4 mt-1" />
      </div>

      <h1
        className="
          text-7xl
          md:text-8xl
          font-extrabold
          text-center
          text-[hsl(var(--banner-color))]
          text-shadow-lg
        "
      >
        {title}
      </h1>

      <PaperAirplane className="absolute right-0 md:right-10 -top-8 animate-float-reverse" />
    </section>
  );
}
