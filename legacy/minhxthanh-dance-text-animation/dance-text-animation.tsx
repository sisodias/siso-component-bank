import React from 'react';

/**
 * A mesmerizing dance animation component that displays a dynamic text effect
 * with layered CSS animations and a dark theme.
 */
const DanceTextAnimation = () => {
  return (
    <>
      <style>
        {`
          @keyframes dance {
            0%, 100% { 
              opacity: 1; 
              transform: translate(-50%, -50%) scale(1) rotate(0deg);
              text-shadow: 0 0 10px rgba(255, 69, 0, 0.8), 0 0 20px rgba(255, 140, 0, 0.6); 
            }
            25% { 
              opacity: 0.7; 
              transform: translate(-50%, -50%) scale(1.05) rotate(2deg);
              text-shadow: 0 0 15px rgba(255, 69, 0, 0.9), 0 0 25px rgba(255, 140, 0, 0.7); 
            }
            50% { 
              opacity: 0.9; 
              transform: translate(-50%, -50%) scale(0.95) rotate(-2deg);
              text-shadow: 0 0 8px rgba(255, 69, 0, 0.7), 0 0 15px rgba(255, 140, 0, 0.5); 
            }
            75% { 
              opacity: 0.8; 
              transform: translate(-50%, -50%) scale(1.05) rotate(1deg);
              text-shadow: 0 0 12px rgba(255, 69, 0, 0.8), 0 0 22px rgba(255, 140, 0, 0.6); 
            }
          }

          .dance-animation {
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            pointer-events: none;
          }

          .dance-layer {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 6rem;
            font-weight: 900;
            mix-blend-mode: screen;
            animation: dance 2s infinite;
            white-space: nowrap;
            will-change: transform, opacity;
          }

          .dance-layer-1 {
            color: #ff4500;
            animation-delay: 0s;
            z-index: 1;
          }

          .dance-layer-2 {
            color: #ff8c00;
            animation-delay: 0.3s;
            animation-duration: 2.2s;
            z-index: 2;
          }

          .dance-layer-3 {
            color: #ffac1c;
            animation-delay: 0.6s;
            animation-duration: 2.4s;
            z-index: 3;
          }
        `}
      </style>

      <div className="min-h-screen bg-black relative">
        {/* Dance Animation */}
        <div className="dance-animation">
          <div className="dance-layer dance-layer-1">DANCE TEXT</div>
          <div className="dance-layer dance-layer-2">DANCE TEXT</div>
          <div className="dance-layer dance-layer-3">DANCE TEXT</div>
        </div>
      </div>
    </>
  );
};

export default DanceTextAnimation;