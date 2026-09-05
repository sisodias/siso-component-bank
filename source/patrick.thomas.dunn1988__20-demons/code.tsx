import React, { useRef, useEffect } from 'react';

export interface DemonCardProps {
  image: string;
  title: string;
  status: string;
  className?: string;
}

export function Component({ image, title, status, className = '' }: DemonCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    let rafId: number;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -20;
      const rotateY = ((x - centerX) / centerX) * 20;
      
      rafId = requestAnimationFrame(() => {
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
      });
    };
    
    const handleMouseLeave = () => {
      cancelAnimationFrame(rafId);
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      cancelAnimationFrame(rafId);
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={cardRef}
        className="w-[280px] h-[420px] rounded-3xl bg-cover bg-center relative cursor-pointer transition-all duration-500"
        style={{
          backgroundImage: `url(${image})`,
          transformStyle: 'preserve-3d',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.85), 0 0 6px rgba(255, 150, 0, 0.5)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 150, 0, 0.85), 0 0 15px rgba(255, 190, 50, 0.8)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.85), 0 0 6px rgba(255, 150, 0, 0.5)';
        }}
      >
        <div 
          className="absolute inset-0 rounded-3xl pointer-events-none transition-transform duration-500"
          style={{ 
            boxShadow: 'inset 0 0 12px rgba(255, 190, 50, 0.7)',
            transform: 'translateZ(0)',
            zIndex: 1
          }}
        />
        <div 
          className="absolute inset-0 rounded-3xl pointer-events-none transition-transform duration-500"
          style={{ 
            boxShadow: 'inset 0 0 25px rgba(255, 160, 10, 0.9)',
            transform: 'translateZ(40px) scale(0.95)',
            zIndex: 2
          }}
        />
        <div 
          className="absolute inset-0 rounded-3xl pointer-events-none transition-transform duration-500"
          style={{ 
            boxShadow: 'inset 0 0 40px rgba(255, 130, 0, 1)',
            transform: 'translateZ(80px) scale(0.9)',
            zIndex: 3
          }}
        />
        <div 
          className="absolute bottom-5 left-5 right-5 text-[#ffb700] z-10"
          style={{ 
            textShadow: '0 0 8px rgba(0, 0, 0, 0.8)',
            fontFamily: '"Playfair Display", serif',
            lineHeight: 1.3
          }}
        >
          <h2 className="m-0 font-black text-[1.4rem] uppercase tracking-wider">
            {title}
          </h2>
          <p className="m-0 font-semibold italic opacity-85 text-base">
            {status}
          </p>
        </div>
      </div>
    </div>
  );
}