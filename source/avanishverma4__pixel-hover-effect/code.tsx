import React, { useEffect, useRef } from 'react';

const PixelButton = ({ children, color = '#ff5722' }) => {
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    const pixelContainer = containerRef.current;
    
    if (!button || !pixelContainer) return;

    const pixelSize = 10;
    const btnWidth = button.offsetWidth;
    const btnHeight = button.offsetHeight;
    const cols = Math.floor(btnWidth / pixelSize);
    const rows = Math.floor(btnHeight / pixelSize);

    // Clear any existing pixels
    pixelContainer.innerHTML = '';

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const pixel = document.createElement('div');
        pixel.className = 'pixel';
        pixel.style.left = `${col * pixelSize}px`;
        pixel.style.top = `${row * pixelSize}px`;
        pixel.style.transitionDelay = `${Math.random() * 1}s`;
        pixelContainer.appendChild(pixel);
      }
    }
  }, []);

  return (
    <button ref={buttonRef} className="pixel-btn">
      <span className="relative z-10">{children}</span>
      <div 
        ref={containerRef} 
        className="pixel-container" 
        style={{ '--clr': color }}
      />
    </button>
  );
};

export default function App() {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center gap-10 relative overflow-hidden">
      <div className="grid-background"></div>
      
      <div className="text-center mb-8 z-10">
        <h1 className="text-5xl font-bold text-black mb-4">
          Pixel Hover Effects
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl px-4">
          Experience the mesmerizing pixel animation effect. Hover over the buttons below 
          to watch as individual pixels fade in with random delays, creating a dynamic 
          and engaging visual experience.
        </p>
      </div>

      <style>{`
        .grid-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          z-index: 0;
        }

        .pixel-btn {
          position: relative;
          width: 180px;
          height: 60px;
          border: none;
          outline: none;
          color: #fff;
          background: #000;
          cursor: pointer;
          font-size: 1.25em;
          letter-spacing: 0.1em;
          font-weight: 400;
          text-transform: uppercase;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: box-shadow 0.3s ease;
        }

        .pixel-btn:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .pixel-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
          border-radius: 10px;
          overflow: hidden;
        }

        .pixel {
          position: absolute;
          width: 10px;
          height: 10px;
          pointer-events: none;
          background: var(--clr);
          border: 1px solid rgba(0, 0, 0, 0.25);
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .pixel-btn:hover .pixel {
          opacity: 1;
        }
      `}</style>

      <PixelButton color="#ff5722">Pixel</PixelButton>
      <PixelButton color="#03a9f4">Button</PixelButton>
      <PixelButton color="#4caf50">Hover Me</PixelButton>
    </div>
  );
}
