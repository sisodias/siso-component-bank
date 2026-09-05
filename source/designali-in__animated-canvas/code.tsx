import React, { useEffect, useRef } from 'react';

// Easing functions
const ease = {
  quint: {
    in: (t, b, c, d) => {
      t /= d;
      return c * t * t * t * t * t + b;
    },
    out: (t, b, c, d) => {
      t = t / d - 1;
      return c * (t * t * t * t * t + 1) + b;
    }
  }
};

// Linear interpolation
const lerp = (a, b, t) => a + (b - a) * t;

const AnimatedCanvas = ({
  count = 40,
  lineColor = 'hsl(180, 70%, 50%)',
  heightMultiplier = 0.4,
  speed = 0.0001,
  lineWidth = 1,
  className = "",
  direction = 'left-to-right' // 'left-to-right' or 'right-to-left'
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Line drawing function
    const line = (x1, y1, x2, y2, close = false) => {
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      if (close) ctx.closePath();
    };

    // Animation loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      
      const c = 1 / count;
      const time_ = Date.now() * speed;
      
      for (let i = 0; i < count; i++) {
        const t_ = i * c;
        const time = (time_ + t_) % 1;
        const t = ease.quint.in(time, 0, 1, 1);
        const ty = ease.quint.out(t, 0, 1, 1);
        // Adjust x based on direction
        const x = direction === 'left-to-right' 
          ? lerp(canvas.width, 0, t)
          : lerp(0, canvas.width, t);
        const y = ty * canvas.height * heightMultiplier;
        line(x, y, x, canvas.height - y, false);
      }
      
      ctx.stroke();
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [count, lineColor, heightMultiplier, speed, lineWidth, direction]);

  return <canvas ref={canvasRef} className={className} style={{ display: 'block' }} />;
};

export {AnimatedCanvas};