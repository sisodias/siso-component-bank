import React from 'react';

const SqueezeLoader = ({ 
  size = 60, // Size in pixels
  color1 = '#3498db', 
  color2 = '#e74c3c',
  spinDuration = 10, // Duration in seconds
  squeezeDuration = 3, // Duration in seconds
  className = "",
  containerClassName = ""
}) => {
  return (
    <div className={`flex items-center justify-center min-h-screen w-screen bg-background ${containerClassName}`}>
      <div className={`flex justify-center ${className}`}>
        <div 
          className="relative"
          style={{
            '--color1': color1,
            '--color2': color2,
            '--spin-duration': `${spinDuration}s`,
            '--squeeze-duration': `${squeezeDuration}s`,
            width: `${size}px`,
            height: `${size}px`,
            animation: 'spin var(--spin-duration) infinite linear',
          }}
        >
          {/* First element (blue by default) */}
          <div
            className="absolute"
            style={{
              background: 'var(--color1)',
              animation: 'squeeze var(--squeeze-duration) infinite',
            }}
          />
          
          {/* Second element (red by default) with rounded corners */}
          <div
            className="absolute rounded-full"
            style={{
              background: 'var(--color2)',
              animation: 'squeeze var(--squeeze-duration) infinite',
              animationDelay: '-1.25s',
            }}
          />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes squeeze {
          0% { inset: 0 2em 2em 0; }
          12.5% { inset: 0 2em 0 0; }
          25% { inset: 2em 2em 0 0; }
          37.5% { inset: 2em 0 0 0; }
          50% { inset: 2em 0 0 2em; }
          62.5% { inset: 0 0 0 2em; }
          75% { inset: 0 0 2em 2em; }
          87.5% { inset: 0 0 2em 0; }
          100% { inset: 0 2em 2em 0; }
        }
        @keyframes spin {
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  );
};


export default SqueezeLoader;