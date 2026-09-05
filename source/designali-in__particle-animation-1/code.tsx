import React, { useEffect, useState } from 'react';

const ParticleAnimation = ({
  gridSize = 500,
  containerSize = '40vmin',
  particleCount = 500,
  colors = ['#00b8a9', '#f8f3d4', '#f6416c', '#ffde7d'],
  animationDuration = [1, 2],
  perspective = '10vmin',
  particleWidth = '40%',
  particleHeight = '1px'
}) => {
  const [particles, setParticles] = useState([]);

  // Generate random value between min and max
  const random = (min, max) => Math.random() * (max - min) + min;

  // Generate random color from the colors array
  const randomColor = () => colors[Math.floor(Math.random() * colors.length)];

  // Generate random rotation
  const randomRotation = () => random(-180, 180);

  // Create particles data
  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      duration: random(animationDuration[0], animationDuration[1]),
      delay: -random(0.1, 2),
      rotateX: randomRotation(),
      rotateY: randomRotation(),
      rotateZ: randomRotation(),
      gradientStops: Math.floor(random(2, 5)),
      color: randomColor(),
      transparentStop: random(50, 100)
    }));
    setParticles(newParticles);
  }, [particleCount, animationDuration, colors]);

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center"
      style={{
        perspective: perspective
      }}
    >
      <div 
        className="relative grid place-items-center"
        style={{
          width: containerSize,
          height: containerSize,
          gridTemplateColumns: '1fr'
        }}
      >
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute"
            style={{
              width: particleWidth,
              height: particleHeight,
              willChange: 'transform, opacity',
              transformStyle: 'preserve-3d',
              background: `linear-gradient(to left, ${particle.color}, transparent ${particle.transparentStop}%)`,
              animation: `move-${particle.id} ${particle.duration}s linear infinite`,
              animationDelay: `${particle.delay}s`,
              transformOrigin: '0 center',
              '--rotateX': `${particle.rotateX}deg`,
              '--rotateY': `${particle.rotateY}deg`,
              '--rotateZ': `${particle.rotateZ}deg`
            }}
          />
        ))}
      </div>
      
      <style jsx>{`
        ${particles.map(particle => `
          @keyframes move-${particle.id} {
            0% {
              transform: translateX(50%) rotateX(${particle.rotateX}deg) rotateY(${particle.rotateY}deg) rotateZ(${particle.rotateZ}deg) scale(2);
              opacity: 0;
            }
            20% {
              opacity: 1;
            }
            100% {
              transform: translateX(50%) rotateX(${particle.rotateX}deg) rotateY(${particle.rotateY}deg) rotateZ(${particle.rotateZ}deg) scale(0);
              opacity: 1;
            }
          }
        `).join('\n')}
      `}</style>
    </div>
  );
};
 

export { ParticleAnimation }