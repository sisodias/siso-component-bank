import React from 'react';

export const GlassButton = ({ children = "Join Now", onClick, className = "" }) => {
  return (
    <div className="perspective-1000">
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .glass-button {
          width: 200px;
          height: 60px;
          border-radius: 30px;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.15),
            rgba(255, 255, 255, 0.05)
          );
          box-shadow:
            inset 0 1px 2px rgba(255, 255, 255, 0.4),
            inset 0 -1px 2px rgba(0, 0, 0, 0.2),
            0 4px 8px rgba(0, 0, 0, 0.2),
            0 0 20px rgba(255, 255, 255, 0.1);
          transform: rotateX(15deg) translateZ(0);
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
          position: relative;
          cursor: pointer;
          animation: pulse 2s infinite ease-in-out;
          overflow: hidden;
        }
        
        .glass-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: -50px;
          width: 50px;
          height: 100%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0.2),
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transform: skewX(-25deg);
          animation: shine 3s infinite linear;
          pointer-events: none;
          z-index: 1;
        }
        
        .glass-button::after {
          content: "";
          position: absolute;
          bottom: -10px;
          left: 10%;
          width: 80%;
          height: 10px;
          background: radial-gradient(
            ellipse at center,
            rgba(0, 0, 0, 0.3) 0%,
            transparent 70%
          );
          z-index: -1;
        }
        
        .glass-button:hover {
          transform: rotateX(0deg) translateZ(15px) scale(1.05);
          box-shadow:
            inset 0 1px 2px rgba(255, 255, 255, 0.4),
            inset 0 -1px 2px rgba(0, 0, 0, 0.2),
            0 8px 16px rgba(0, 0, 0, 0.3),
            0 0 40px rgba(255, 255, 255, 0.25);
        }
        
        .glass-button:active {
          transform: rotateX(0deg) translateZ(-5px) scale(0.95);
          box-shadow:
            inset 0 1px 2px rgba(255, 255, 255, 0.4),
            inset 0 -1px 2px rgba(0, 0, 0, 0.2),
            0 2px 4px rgba(0, 0, 0, 0.2),
            0 0 10px rgba(255, 255, 255, 0.1);
        }
        
        @keyframes pulse {
          0%, 100% {
            box-shadow:
              inset 0 1px 2px rgba(255, 255, 255, 0.4),
              inset 0 -1px 2px rgba(0, 0, 0, 0.2),
              0 4px 8px rgba(0, 0, 0, 0.2),
              0 0 20px rgba(255, 255, 255, 0.1);
          }
          50% {
            box-shadow:
              inset 0 1px 2px rgba(255, 255, 255, 0.4),
              inset 0 -1px 2px rgba(0, 0, 0, 0.2),
              0 4px 8px rgba(0, 0, 0, 0.2),
              0 0 30px rgba(255, 255, 255, 0.2);
          }
        }
        
        @keyframes shine {
          0% {
            left: -50px;
          }
          100% {
            left: 250px;
          }
        }
      `}</style>
      
      <button
        className={`glass-button ${className}`}
        onClick={onClick}
      >
        <span className="relative z-10 text-white text-lg font-sans block leading-[60px] font-bold text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
          {children}
        </span>
      </button>
    </div>
  );
};
