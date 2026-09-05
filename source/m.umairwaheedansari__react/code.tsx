import React from 'react';

const AnimatedReactLogo = ({ size = 200 }) => {
  return (
    <div 
      className="relative"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 200 200" className="absolute inset-0">
        {/* Define the orbital paths */}
        <defs>
          {/* Horizontal orbital path */}
          <path id="orbit1" d="M 20,100 A 80,30 0 1,1 180,100 A 80,30 0 1,1 20,100" fill="none"/>
        </defs>
        
        {/* Static orbital shells */}
        
        {/* Horizontal orbital */}
        <ellipse
          cx="100"
          cy="100"
          rx="80"
          ry="30"
          fill="none"
          stroke="#61DAFB"
          strokeWidth="4"
          opacity="0.8"
          className="dark:stroke-cyan-400"
        />
        
        {/* 60 degree rotated orbital */}
        <ellipse
          cx="100"
          cy="100"
          rx="80"
          ry="30"
          fill="none"
          stroke="#61DAFB"
          strokeWidth="4"
          opacity="0.8"
          transform="rotate(60 100 100)"
          className="dark:stroke-cyan-400"
        />
        
        {/* -60 degree rotated orbital */}
        <ellipse
          cx="100"
          cy="100"
          rx="80"
          ry="30"
          fill="none"
          stroke="#61DAFB"
          strokeWidth="4"
          opacity="0.8"
          transform="rotate(-60 100 100)"
          className="dark:stroke-cyan-400"
        />
        
        {/* Electrons moving along orbital paths */}
        
        {/* Electron 1 - Horizontal orbital */}
        <circle r="5" fill="#2D3748" className="dark:fill-gray-300">
          <animateMotion dur="4s" repeatCount="indefinite">
            <mpath xlinkHref="#orbit1"/>
          </animateMotion>
        </circle>
        
        {/* Electron 2 - 60 degree orbital */}
        <g transform="rotate(60 100 100)">
          <circle r="5" fill="#2D3748" className="dark:fill-gray-300">
            <animateMotion dur="3.5s" repeatCount="indefinite">
              <mpath xlinkHref="#orbit1"/>
            </animateMotion>
          </circle>
        </g>
        
        {/* Electron 3 - -60 degree orbital */}
        <g transform="rotate(-60 100 100)">
          <circle r="5" fill="#2D3748" className="dark:fill-gray-300">
            <animateMotion dur="3s" repeatCount="indefinite">
              <mpath xlinkHref="#orbit1"/>
            </animateMotion>
          </circle>
        </g>
        
        {/* Center nucleus rotating */}
        <circle cx="100" cy="100" r="15" fill="#2D3748" className="dark:fill-gray-200">
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 100 100;360 100 100"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
};

export default AnimatedReactLogo;