import React, { useEffect, useRef } from 'react';
import { CreditCard } from 'lucide-react';

export const Component = () => {
  const ballsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const createBall = (index: number) => {
      const ball = document.createElement('div');
      ball.className = 'floating-ball';
      const size = 300;
      ball.style.width = `${size}px`;
      ball.style.height = `${size}px`;
      
      if (index === 0) {
        ball.style.left = '25%';
        ball.style.top = '25%';
        ball.style.transform = 'translate(-50%, -50%)';
      } else {
        ball.style.right = '25%';
        ball.style.bottom = '25%';
        ball.style.transform = 'translate(50%, 50%)';
      }
      
      ball.style.animation = `float${index + 1} 15s infinite ease-in-out`;
      
      document.body.appendChild(ball);
      ballsRef.current.push(ball);
    };

    for (let i = 0; i < 2; i++) {
      createBall(i);
    }

    return () => {
      ballsRef.current.forEach(ball => ball.remove());
      ballsRef.current = [];
    };
  }, []);

  return (
    <>
      <style>
        {`
          html, body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            font-family: 'Inter', system-ui, sans-serif;
            background: #000000;
            min-height: 100vh;
          }

          .glassmorphism {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease-in-out;
            transform-style: preserve-3d;
            perspective: 1000px;
          }

          .glassmorphism:hover {
            transform: translateY(-5px) rotateX(2deg) rotateY(2deg);
            box-shadow: 
              0 15px 35px rgba(0, 0, 0, 0.2),
              0 5px 15px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.12);
          }

          .glassmorphism::before {
            content: '';
            position: absolute;
            inset: 0;
            background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            opacity: 0.04;
            pointer-events: none;
          }

          .floating-ball {
            position: fixed;
            border-radius: 50%;
            background: #3b82f6;
            border: 1px solid rgba(59, 130, 246, 0.3);
            box-shadow:
              0 0 120px rgba(96, 165, 250, 0.9),
              0 0 240px rgba(96, 165, 250, 0.6),
              inset 0 0 120px rgba(96, 165, 250, 0.5);
            z-index: 1;
            pointer-events: none;
          }

          @keyframes float1 {
            0%, 100% { transform: translate(-50%, -50%); }
            25% { transform: translate(-35%, -30%); }
            50% { transform: translate(-55%, -35%); }
            75% { transform: translate(-30%, -55%); }
          }

          @keyframes float2 {
            0%, 100% { transform: translate(50%, 50%); }
            25% { transform: translate(35%, 30%); }
            50% { transform: translate(55%, 35%); }
            75% { transform: translate(30%, 55%); }
          }
        `}
      </style>
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8 overflow-hidden">
        <div className="relative z-10">
          <div className="glassmorphism w-[430px] h-[270px] mx-auto p-8 group">
            <div className="relative h-full flex flex-col justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-12 h-12 text-white/90 transition-colors duration-300 group-hover:text-white" 
                  strokeWidth={1.5} />
                <div className="text-white/80 text-lg font-light tracking-widest mt-1">PLATINUM</div>
              </div>
              
              <div className="space-y-8">
                <div className="text-[22px] font-light tracking-[0.3em] text-white/90 transition-colors duration-300 group-hover:text-white font-mono">
                  5256 6775 4456 2245
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <p className="text-white/60 text-xs uppercase tracking-wider font-light">Card Holder</p>
                    <p className="text-white/90 text-base tracking-wider font-light">JOHN DOE</p>
                  </div>
                  
                  <div className="text-right space-y-2">
                    <div>
                      <p className="text-white/60 text-xs uppercase tracking-wider font-light">Expires</p>
                      <p className="text-white/90 text-base tracking-wider font-light">12/25</p>
                    </div>
                    <p className="text-white/60 text-xs tracking-widest font-light mt-2">WORLD ELITE</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};