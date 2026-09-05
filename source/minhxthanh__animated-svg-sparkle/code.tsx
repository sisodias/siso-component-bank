import React from 'react';
import { Wand2 } from 'lucide-react';

// This component includes a CSS animation for the SVG paths.
// The animation simulates the icon being drawn.
const SparkleIcon = () => (
  <>
    <style>
      {`
        @keyframes draw {
          from {
            stroke-dashoffset: 150;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .sparkle-path {
          stroke-dasharray: 150;
          stroke-dashoffset: 150;
          animation: draw 1.5s ease-in-out forwards;
        }

        /* Animation for text and buttons */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          opacity: 0; /* Start hidden */
          animation: fadeInUp 0.7s ease-out forwards;
        }
      `}
    </style>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 132 117"
      fill="none"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 text-amber-500"
      aria-hidden="true"
    >
      {/* Each path has the animation class and a delay to create a staggered effect. */}
      <path className="sparkle-path" style={{animationDelay: '0s'}} d="M71 12L73 4" stroke="currentColor" strokeWidth="4" strokeLinecap="round"></path>
      <path className="sparkle-path" style={{animationDelay: '0.1s'}} d="M91.75 23L99 14.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round"></path>
      <path className="sparkle-path" style={{animationDelay: '0.2s'}} d="M110.545 35.6253L127.458 31.1232" stroke="currentColor" strokeWidth="4" strokeLinecap="round"></path>
      <path className="sparkle-path" style={{animationDelay: '0.3s'}} d="M105 62C108.158 63.3664 111.006 65.0694 114 66.75" stroke="currentColor" strokeWidth="4" strokeLinecap="round"></path>
      <path className="sparkle-path" style={{animationDelay: '0.4s'}} d="M93 94.75L101.25 105" stroke="currentColor" strokeWidth="4" strokeLinecap="round"></path>
      <path className="sparkle-path" style={{animationDelay: '0.5s'}} d="M62 99C62.6012 103.667 63.3333 108.333 64 113" stroke="currentColor" strokeWidth="4" strokeLinecap="round"></path>
      <path className="sparkle-path" style={{animationDelay: '0.6s'}} d="M35 90C32.7477 94.9825 29.7733 99.5866 29 105" stroke="currentColor" strokeWidth="4" strokeLinecap="round"></path>
      <path className="sparkle-path" style={{animationDelay: '0.7s'}} d="M19 68C14.6134 65.3005 9.34297 62 4 62" stroke="currentColor" strokeWidth="4" strokeLinecap="round"></path>
      <path className="sparkle-path" style={{animationDelay: '0.8s'}} d="M32 42C26.5986 39.5448 19.3693 35.054 16 30" stroke="currentColor" strokeWidth="4" strokeLinecap="round"></path>
      <path className="sparkle-path" style={{animationDelay: '0.9s'}} d="M47 22C44.7667 18.65 43.574 14.6728 42 11" stroke="currentColor" strokeWidth="4" strokeLinecap="round"></path>
    </svg>
  </>
);

// Renamed component to reflect the new theme
export const AiDesignStudio = () => {
  return (
    // Use a single-column grid for a clean, centered layout.
    // `gap-y-8` provides vertical spacing between elements.
    // `justify-items-center` centers grid items horizontally.
    <div className="grid grid-cols-1 justify-items-center gap-y-8 max-w-2xl mx-auto text-center">
      {/* Heading with animation */}
      <h2 
        className="flex flex-col sm:flex-row justify-center items-center text-center gap-2 sm:gap-4 text-4xl sm:text-5xl md:text-6xl font-serif text-black dark:text-white animate-fadeInUp"
        style={{ animationDelay: '0.2s' }}
      >
        <div className="relative flex justify-center items-center w-20 h-20 md:w-24 md:h-24">
          <SparkleIcon />
          <span className="relative z-10">
            AI
          </span>
        </div>
        <span>
          Design Studio
        </span>
      </h2>

      {/* Description Text with animation */}
      <p 
        className="text-lg md:text-xl leading-relaxed max-w-prose animate-fadeInUp text-black dark:text-white"
        style={{ animationDelay: '0.5s' }}
      >
        Describe your vision and let our AI instantly generate truly stunning, high-quality designs in seconds.
      </p>

      {/* Button Group with animation */}
      <div 
        className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp"
        style={{ animationDelay: '0.8s' }}
      >
        <a
          href="#"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800/50 text-gray-800 dark:text-white font-semibold border-2 border-gray-800 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/90 transition-colors duration-300"
          aria-label="Start Designing"
        >
          <Wand2 className="w-5 h-5" />
          <span>Start Designing</span>
        </a>
        <a
          href="#"
          className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold border-2 border-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          aria-label="Explore Styles"
        >
          <span>Explore Styles</span>
        </a>
      </div>
    </div>
  );
};
