"use client";

import * as React from "react";

export const WormLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="128px"
        width="256px"
        viewBox="0 0 256 128"
        className="w-40 h-20"
      >
        <defs>
          <linearGradient y2={0} x2={1} y1={0} x1={0} id="grad1">
            <stop stopColor="#5ebd3e" offset="0%" />
            <stop stopColor="#ffb900" offset="33%" />
            <stop stopColor="#f78200" offset="67%" />
            <stop stopColor="#e23838" offset="100%" />
          </linearGradient>
          <linearGradient y2={0} x2={0} y1={0} x1={1} id="grad2">
            <stop stopColor="#e23838" offset="0%" />
            <stop stopColor="#973999" offset="33%" />
            <stop stopColor="#009cdf" offset="67%" />
            <stop stopColor="#5ebd3e" offset="100%" />
          </linearGradient>
        </defs>
        <g strokeWidth={16} strokeLinecap="round" fill="none">
          {/* Track (light & dark) */}
          <g className="stroke-gray-300 dark:stroke-gray-800 transition-colors">
            <path d="M8,64s0-56,60-56,60,112,120,112,60-56,60-56" />
            <path d="M248,64s0-56-60-56-60,112-120,112S8,64,8,64" />
          </g>

          {/* Worms */}
          <g strokeDasharray="180 656">
            <path
              d="M8,64s0-56,60-56,60,112,120,112,60-56,60-56"
              stroke="url(#grad1)"
              className="animate-worm1"
            />
            <path
              d="M248,64s0-56-60-56-60,112-120,112S8,64,8,64"
              stroke="url(#grad2)"
              className="animate-worm2"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};
