import React from 'react';

const TicTacToeLoader = ({ size = 160, color = "#ffaa00", className = "" }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-950 w-full">
      <div 
        className={`relative ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          transformStyle: 'preserve-3d',
          perspective: '1200px'
        }}
      >
        <style jsx>{`
          .node {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 12px;
            height: 12px;
            background: ${color};
            border-radius: 50%;
            transform: translate(-50%, -50%);
            box-shadow:
              0 0 20px ${color},
              0 0 40px ${color}66;
            animation: nodePulse 1.6s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
          }
          
          .thread {
            position: absolute;
            background: linear-gradient(
              90deg,
              transparent,
              ${color}cc,
              transparent
            );
            box-shadow: 0 0 10px ${color}80;
            transform-origin: center;
          }
          
          .t1 {
            width: 100%;
            height: 2px;
            top: 30%;
            left: 0;
            animation: weave1 2s cubic-bezier(0.45, 0, 0.55, 1) infinite;
          }
          
          .t2 {
            width: 2px;
            height: 100%;
            top: 0;
            left: 70%;
            animation: weave2 2.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
          }
          
          .t3 {
            width: 100%;
            height: 2px;
            bottom: 30%;
            left: 0;
            animation: weave3 2.4s cubic-bezier(0.23, 1, 0.32, 1) infinite;
          }
          
          .t4 {
            width: 2px;
            height: 100%;
            top: 0;
            left: 30%;
            animation: weave4 2.6s cubic-bezier(0.36, 0, 0.66, -0.56) infinite;
          }
          
          @keyframes nodePulse {
            0%, 100% {
              transform: translate(-50%, -50%) scale(1);
              box-shadow:
                0 0 20px ${color},
                0 0 40px ${color}66;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.4);
              box-shadow:
                0 0 30px ${color},
                0 0 60px ${color}cc;
            }
          }
          
          @keyframes weave1 {
            0% {
              transform: translateY(0) rotateX(0deg) rotateZ(0deg);
              opacity: 0.8;
            }
            50% {
              transform: translateY(40px) rotateX(60deg) rotateZ(20deg);
              opacity: 1;
            }
            100% {
              transform: translateY(0) rotateX(0deg) rotateZ(0deg);
              opacity: 0.8;
            }
          }
          
          @keyframes weave2 {
            0% {
              transform: translateX(0) rotateY(0deg) rotateZ(0deg);
              opacity: 0.8;
            }
            50% {
              transform: translateX(-40px) rotateY(60deg) rotateZ(-20deg);
              opacity: 1;
            }
            100% {
              transform: translateX(0) rotateY(0deg) rotateZ(0deg);
              opacity: 0.8;
            }
          }
          
          @keyframes weave3 {
            0% {
              transform: translateY(0) rotateX(0deg) rotateZ(0deg);
              opacity: 0.8;
            }
            50% {
              transform: translateY(-40px) rotateX(-60deg) rotateZ(15deg);
              opacity: 1;
            }
            100% {
              transform: translateY(0) rotateX(0deg) rotateZ(0deg);
              opacity: 0.8;
            }
          }
          
          @keyframes weave4 {
            0% {
              transform: translateX(0) rotateY(0deg) rotateZ(0deg);
              opacity: 0.8;
            }
            50% {
              transform: translateX(40px) rotateY(-60deg) rotateZ(-15deg);
              opacity: 1;
            }
            100% {
              transform: translateX(0) rotateY(0deg) rotateZ(0deg);
              opacity: 0.8;
            }
          }
        `}</style>
        
        <div className="thread t1"></div>
        <div className="thread t2"></div>
        <div className="thread t3"></div>
        <div className="thread t4"></div>
        <div className="node"></div>
      </div>
    </div>
  );
};

export default TicTacToeLoader;