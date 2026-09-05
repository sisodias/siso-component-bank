import React, { useRef, useEffect, useCallback } from 'react';

export const Component = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(null);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d')!;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    const barCount = 64;
    
    // Each bar has its own state
    const bars = Array.from({ length: barCount }, () => ({
      current: Math.random() * 0.3,
      target: Math.random() * 0.5,
      speed: 0.02 + Math.random() * 0.03,
      nextChange: Math.random() * 60
    }));
    
    let frame = 0;
    
    resizeCanvas();
    
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      ctx.fillStyle = '#fafafa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      frame++;
      
      const centerY = canvas.height / 2;
      const totalWidth = canvas.width * 0.65;
      const barWidth = 1.5;
      const gap = (totalWidth - barCount * barWidth) / (barCount - 1);
      const startX = (canvas.width - totalWidth) / 2;
      
      for (let i = 0; i < barCount; i++) {
        const bar = bars[i];
        
        // Randomly assign new target
        bar.nextChange--;
        if (bar.nextChange <= 0) {
          bar.target = Math.random() * 0.6;
          bar.nextChange = 30 + Math.random() * 90;
          bar.speed = 0.015 + Math.random() * 0.025;
        }
        
        // Smooth interpolation toward target
        bar.current += (bar.target - bar.current) * bar.speed;
        
        const maxHeight = 80;
        const barHeight = bar.current * maxHeight;
        const x = startX + i * (barWidth + gap);
        
        // Very subtle opacity
        const opacity = 0.04 + bar.current * 0.05;
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        
        // Rounded caps
        const radius = barWidth / 2;
        
        // Top cap
        ctx.beginPath();
        ctx.arc(x + radius, centerY - barHeight, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Bottom cap
        ctx.beginPath();
        ctx.arc(x + radius, centerY + barHeight, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Bar body
        ctx.fillRect(x, centerY - barHeight, barWidth, barHeight * 2);
      }
      
      // Gentle edge fade
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.55
      );
      gradient.addColorStop(0, 'rgba(250, 250, 250, 0)');
      gradient.addColorStop(1, 'rgba(250, 250, 250, 0.85)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    
    animate();
    
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const cleanup = initCanvas();
    return cleanup;
  }, [initCanvas]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#fafafa]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <p className="text-neutral-400 text-xs md:text-sm tracking-[0.25em] uppercase mb-6">
          A Personal Approach to Your Perfect Event
        </p>
        
        <h1 className="text-center px-4">
          <span className="block text-neutral-800 text-3xl md:text-5xl lg:text-6xl font-light tracking-wide">
            Custom Entertainment
          </span>
          <span className="block text-neutral-900 text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight mt-2">
            For Your Event
          </span>
        </h1>
        
        <p className="text-neutral-500 text-sm md:text-base max-w-md text-center px-6 mt-8">
          Creating unforgettable moments through music, tailored to your vision
        </p>
        
        <a 
          href="#contact"
          className="
            mt-10 px-8 py-3 
            border border-neutral-800 
            text-neutral-800 text-xs md:text-sm tracking-[0.15em] uppercase
            transition-all duration-300
            hover:bg-neutral-800 hover:text-white
          "
        >
          Get in Touch
        </a>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 text-neutral-400 text-xs tracking-widest">
        <span>Weddings</span>
        <span className="w-1 h-1 rounded-full bg-neutral-300" />
        <span>Corporate</span>
        <span className="w-1 h-1 rounded-full bg-neutral-300" />
        <span>Private Events</span>
      </div>
    </div>
  );
};

export default Component;
