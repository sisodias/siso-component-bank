import React from 'react';

const PathAnimation = () => {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <svg width="1000" height="360" viewBox="0 0 800 160" className="max-w-full">
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f093fb" />
            <stop offset="100%" stopColor="#f5576c" />
          </linearGradient>
        </defs>
        
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="none"
          stroke="url(#pathGradient)"
          strokeWidth="2"
          fontSize="88"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
          strokeDasharray="1000"
          strokeDashoffset="1000"
        >
          PATH DRAWING
          <animate
            attributeName="stroke-dashoffset"
            values="1000;0"
            dur="8s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.25 0.1 0.25 1"
          />
        </text>
      </svg>
    </div>
  );
};

export default PathAnimation;
