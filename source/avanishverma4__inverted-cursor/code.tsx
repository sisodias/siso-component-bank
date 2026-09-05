import React, { useState, useEffect, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface CursorProps {
  size?: number;
}

const Cursor: React.FC<CursorProps> = ({ size = 60 }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const previousPos = useRef({ x: -size, y: -size });
  
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: -size, y: -size });

  const animate = () => {
    if (!cursorRef.current) return;

    const currentX = previousPos.current.x;
    const currentY = previousPos.current.y;
    const targetX = position.x - size / 2;
    const targetY = position.y - size / 2;

    const deltaX = (targetX - currentX) * 0.2;
    const deltaY = (targetY - currentY) * 0.2;

    const newX = currentX + deltaX;
    const newY = currentY + deltaY;

    previousPos.current = { x: newX, y: newY };
    cursorRef.current.style.transform = `translate(${newX}px, ${newY}px)`;

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => {
      setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    document.body.style.cursor = "none";

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      document.body.style.cursor = "auto";
    };
  }, [position]);

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none rounded-full bg-white mix-blend-difference z-50 transition-opacity duration-300"
      style={{
        width: size,
        height: size,
        opacity: visible ? 1 : 0,
      }}
      aria-hidden="true"
    />
  );
};

export default function CursorDemoPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white">
      {/* Orthogonal Grid Background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      <Cursor size={80} />

      <div className="flex flex-col items-center justify-center h-full px-8">
        <div className="max-w-4xl text-center space-y-8">
          <h1 className="text-8xl font-black tracking-tighter leading-none">
            INVERTED
          </h1>
          
          <div className="w-24 h-1 bg-white mx-auto"></div>
          
          <p className="text-2xl font-light tracking-wide uppercase opacity-80">
            Modern Cursor Experience
          </p>
          
          <p className="text-base font-normal tracking-wide leading-relaxed max-w-2xl mx-auto opacity-70">
            Move your cursor to experience the inverted blend effect. 
            Watch how the white circle interacts with elements on the page.
          </p>
        </div>
        
        <div className="absolute bottom-12 left-0 right-0 text-center">
          <p className="text-sm font-mono uppercase tracking-widest opacity-50">
            Scroll to explore
          </p>
        </div>
      </div>
      
      <div className="absolute top-8 left-8">
        <div className="space-y-1">
          <div className="w-12 h-0.5 bg-white"></div>
          <div className="w-8 h-0.5 bg-white"></div>
          <div className="w-10 h-0.5 bg-white"></div>
        </div>
      </div>
      
      <div className="absolute top-8 right-8">
        <p className="text-sm font-mono uppercase tracking-widest">
          2025
        </p>
      </div>
    </div>
  );
}