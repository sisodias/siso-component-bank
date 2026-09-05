import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export function Component() {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div className="relative max-w-md bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Header with Lens Effect */}
      <div className="relative">
        <div
          ref={containerRef}
          className="relative overflow-hidden cursor-none"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label="Zoom Area"
        >
          <img
            src="https://images.unsplash.com/photo-1736606355698-5efdb410fe93?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="image placeholder"
            className="w-full h-auto"
            width={500}
            height={500}
          />
          
          {/* Lens Effect */}
          {isHovering && (
            <motion.div
              className="absolute pointer-events-none border-2 border-white rounded-full shadow-lg overflow-hidden"
              style={{
                width: '150px',
                height: '150px',
                left: mousePosition.x - 75,
                top: mousePosition.y - 75,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(https://images.unsplash.com/photo-1736606355698-5efdb410fe93?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
                  backgroundSize: '200%',
                  backgroundPosition: `${-mousePosition.x * 2 + 150}px ${-mousePosition.y * 2 + 150}px`,
                }}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your next camp</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          See our latest and best camp destinations all across the five
          continents of the globe.
        </p>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 flex gap-4">
        <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors duration-200 hover:cursor-pointer">
          Let's go
        </button>
        <button className="px-4 py-2 bg-gray-100 text-gray-900 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors duration-200 hover:cursor-pointer">
          Another time
        </button>
      </div>
    </div>
  );
}