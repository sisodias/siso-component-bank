import React, { useState, useEffect } from 'react';

function LoadingScreen() {
  const [phase, setPhase] = useState('rotating'); // rotating, exploding, done
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // After 7 seconds, trigger explosion
    const explosionTimer = setTimeout(() => {
      setPhase('exploding');
      
      // Generate particles
      const newParticles = [];
      for (let i = 0; i < 30; i++) {
        const angle = (Math.PI * 2 * i) / 30;
        const velocity = 2 + Math.random() * 3;
        newParticles.push({
          id: i,
          angle,
          velocity,
          size: 10 + Math.random() * 20,
          color: Math.random() > 0.5 ? 'from-purple-500 to-pink-500' : 'from-cyan-500 to-blue-500'
        });
      }
      setParticles(newParticles);
    }, 7000);

    // After 9 seconds, mark as done
    const doneTimer = setTimeout(() => {
      setPhase('done');
    }, 9000);

    return () => {
      clearTimeout(explosionTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden flex items-center justify-center">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet" />
      {/* Main rotating circles */}
      {phase === 'rotating' && (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="circle-orbit">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 blur-sm shadow-2xl shadow-purple-500/50 animate-orbit-1" />
            </div>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="circle-orbit-2">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 blur-sm shadow-2xl shadow-cyan-500/50 animate-orbit-2" />
            </div>
          </div>
        </>
      )}

      {/* Explosion particles */}
      {phase === 'exploding' && particles.map((p) => (
        <div
          key={p.id}
          className={`absolute top-1/2 left-1/2 rounded-full bg-gradient-to-br ${p.color} blur-sm animate-explode`}
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            '--angle': `${p.angle}rad`,
            '--velocity': p.velocity,
            animation: 'explode 2s ease-out forwards'
          }}
        />
      ))}

      {/* Center text */}
      <div className="relative z-10 text-center">
        <h1 className={`text-6xl transition-all duration-300 ${
          phase === 'rotating' ? 'text-white' : 
          phase === 'exploding' ? 'text-yellow-300 scale-150' : 
          'text-green-400 scale-110'
        }`}>
          {phase === 'rotating' ? 'LOADING...' : 
           phase === 'exploding' ? 'WOAH!' : 
           'DONE!'}
        </h1>
      </div>

      <style jsx>{`
        h1 {
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
        }

        @keyframes orbit1 {
          0% {
            transform: rotate(0deg) translateX(200px) rotate(0deg);
          }
          70% {
            transform: rotate(360deg) translateX(200px) rotate(-360deg);
          }
          100% {
            transform: rotate(360deg) translateX(0px) rotate(-360deg);
          }
        }

        @keyframes orbit2 {
          0% {
            transform: rotate(180deg) translateX(250px) rotate(-180deg);
          }
          70% {
            transform: rotate(-180deg) translateX(250px) rotate(180deg);
          }
          100% {
            transform: rotate(-180deg) translateX(0px) rotate(180deg);
          }
        }

        @keyframes explode {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(
              calc(-50% + cos(var(--angle)) * var(--velocity) * 150px),
              calc(-50% + sin(var(--angle)) * var(--velocity) * 150px)
            ) scale(0);
            opacity: 0;
          }
        }

        .circle-orbit {
          animation: orbit1 7s ease-in-out forwards;
        }

        .circle-orbit-2 {
          animation: orbit2 7s ease-in-out forwards;
        }

        .animate-orbit-1 {
          animation: pulse 1.5s ease-in-out infinite;
        }

        .animate-orbit-2 {
          animation: pulse 1.5s ease-in-out infinite 0.75s;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export { LoadingScreen as Component };
export default LoadingScreen;