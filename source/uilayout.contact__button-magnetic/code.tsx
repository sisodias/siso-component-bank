
'use client'; 

import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react'; 
export const Component = () => {
  const buttonRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  
  const springConfig = { stiffness: 200, damping: 20 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (buttonRef.current) {
        const button = buttonRef.current.getBoundingClientRect();
        const centerX = button.left + button.width / 2;
        const centerY = button.top + button.height / 2;

        const deltaX = e.pageX - centerX;
        const deltaY = e.pageY - centerY;

        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
        const magneticDistance = 120; 
        const attractionStrength = 0.45; 

        if (distance < magneticDistance) {
          const strength = 1 - distance / magneticDistance; 
          x.set(deltaX * strength * attractionStrength);
          y.set(deltaY * strength * attractionStrength);
          setIsHovering(true);
        } else {
          x.set(0);
          y.set(0);
          setIsHovering(false);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [x, y]); 

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.button
        ref={buttonRef}
        className={`px-6 py-3 rounded-lg text-white font-semibold transition-colors duration-300 ${isHovering ? 'bg-green-500' : 'bg-green-600'}`}
        style={{
          x: springX,
          y: springY,
        }}
      >
        Hover on me!
      </motion.button>
    </div>
  );
};