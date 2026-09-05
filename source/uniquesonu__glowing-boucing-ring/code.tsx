import React, { useRef, useEffect } from 'react';

const GlowingBouncingRing = ({ 
  ringColor = 'rgba(0, 150, 255, 1)',
  shadowColor = 'rgba(0, 150, 255, 0.8)',
  backgroundColor = 'black',
  ringWidth = 80,
  ringHeight = 25,
  bounceHeight = 150,
  speed = 0.05,
  trailLength = 20,
  className = ''
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const trailsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawRing = (x, y, scale, alpha = 1) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.ellipse(x, y, ringWidth * scale, ringHeight * scale, 0, 0, Math.PI * 2);
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = 20;
      ctx.strokeStyle = ringColor;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const baseY = canvas.height / 2 + 100;
      const bounceY = baseY - Math.abs(Math.sin(timeRef.current) * bounceHeight);
      const scale = 1 + Math.sin(timeRef.current) * 0.1;

      // Add new trail point
      trailsRef.current.push({ 
        x: centerX, 
        y: bounceY, 
        scale: scale, 
        alpha: 1 
      });

      // Draw trails
      for (let i = trailsRef.current.length - 1; i >= 0; i--) {
        const trail = trailsRef.current[i];
        drawRing(trail.x, trail.y, trail.scale, trail.alpha);
        trail.alpha -= 0.05;
        
        if (trail.alpha <= 0) {
          trailsRef.current.splice(i, 1);
        }
      }

      // Draw main ring
      drawRing(centerX, bounceY, scale);

      // Limit trail length
      if (trailsRef.current.length > trailLength) {
        trailsRef.current.shift();
      }

      timeRef.current += speed;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [ringColor, shadowColor, ringWidth, ringHeight, bounceHeight, speed, trailLength]);

  return (
    <div 
      className={`w-full h-full flex items-center justify-center overflow-hidden ${className}`}
      style={{ backgroundColor }}
    >
      <canvas 
        ref={canvasRef}
        className="block w-full h-full"
      />
    </div>
  );
};

export default GlowingBouncingRing