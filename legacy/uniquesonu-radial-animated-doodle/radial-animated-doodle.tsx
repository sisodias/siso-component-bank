import React from 'react';

const RadialAnimation = ({ 
  count = 100, 
  size = 80, 
  duration = 4, 
  hue = 240,
  className = "" 
}) => {
  // Generate array of items
  const items = Array.from({ length: count }, (_, i) => i);
  
  return (
    <div className={`flex items-center justify-center w-full min-h-screen overflow-hidden bg-slate-900 ${className}`}>
      <div 
        className="relative rounded-full"
        style={{
          '--size': `${size}vmin`,
          '--c': count,
          '--dur': `${duration}s`,
          '--hue': `${hue}deg`,
          height: `${size}vmin`,
          width: `${size}vmin`,
        }}
      >
        {items.map((i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 rounded-full border-2 bg-slate-900"
            style={{
              '--i': i,
              '--width': 'calc(var(--size) / 4)',
              '--height': 'calc(((4 * (pow(var(--move), 2))) - (4 * var(--move)) + 1) * (var(--size) / 4))',
              '--del': 'calc(var(--dur) / var(--c) * 4)',
              '--color': `hsl(calc(4turn / var(--c) * var(--i)), 100%, 50%)`,
              height: 'calc(var(--height))',
              width: 'calc(var(--width))',
              borderColor: 'var(--color)',
              transform: `
                translate(-50%, -50%)
                rotate(calc(1turn / var(--c) * var(--i)))
                translateY(calc(((var(--size) - var(--height)) / 2) * (.5 - var(--move)) * 2))
              `,
              animation: 'move var(--dur) cubic-bezier(0.37, 0, 0.63, 1) infinite alternate',
              animationDelay: 'calc(var(--del) * var(--i) * -1)',
            }}
          />
        ))}
      </div>
      
      <style jsx>{`
        @keyframes move {
          from { --move: 0; }
          to   { --move: 1; }
        }
        @property --move {
          syntax: "<number>";
          inherits: true;
          initial-value: 0;
        }
      `}</style>
    </div>
  );
};



export default RadialAnimation;