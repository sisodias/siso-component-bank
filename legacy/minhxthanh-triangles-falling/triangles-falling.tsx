import React, { useMemo, useEffect } from 'react';

const Triangles = () => {
  const total = 200;
  // Precompute all random values once
  const triangles = useMemo(() => {
    return Array.from({ length: total }).map((_, i) => {
      const size = Math.random() * 50; // between 0 and 50px
      const rotate = Math.random() * 360; // between 0 and 360deg
      const hue = Math.floor(Math.random() * 360); // 0–359
      // animation-delay: -i*(10s/200)
      const delaySec = -(i * (10 / total)).toFixed(3);
      // random target translate coords (±500px)
      const tx = (Math.random() * 1000) - 500;
      const ty = (Math.random() * 1000) - 500;
      return { size, rotate, hue, delaySec, tx, ty };
    });
  }, []);

  // Ensure the wrapper fills the viewport
  useEffect(() => {
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.background = 'black';
    document.body.style.backgroundImage = 'radial-gradient(circle at center, white 0%, #222 10%, black 60%)';
    document.body.style.overflow = 'hidden';
  }, []);

  return (
    <div
      className="relative"
      style={{
        perspective: '800px',
        transformStyle: 'preserve-3d',
        height: '100vh',
        width: '100vw',
      }}
    >
      {triangles.map(({ size, rotate, hue, delaySec, tx, ty }, idx) => (
        <div
          key={idx}
          className="absolute top-1/2 left-1/2 filter grayscale"
          style={{
            height: 0,
            width: 0,
            borderTop: `${size}px solid hsla(${hue},100%,50%,1)`,
            borderRight: `${size}px solid transparent`,
            borderLeft: `${size}px solid transparent`,
            marginLeft: `-${size / 2}px`,
            marginTop: `-${size / 2}px`,
            opacity: 0,
            transform: `rotate(${rotate}deg) translate3d(0,0,-1500px) scale(0)`,
            animation: `anim${idx} 10s infinite linear`,
            animationDelay: `${delaySec}s`,
          }}
        />
      ))}

      {/* Generate 200 @keyframes blocks—one per triangle */}
      <style>
        {triangles
          .map(
            ({ rotate, tx, ty }, idx) => `
          @keyframes anim${idx} {
            0% {
              opacity: 1;
              transform: rotate(${rotate * 1.5}deg) translate3d(${tx}px, ${ty}px, 1000px) scale(1);
            }
          }
        `
          )
          .join('\n')}
      </style>
    </div>
  );
};

export default Triangles;
