import React, { useRef, useEffect } from 'react';

const CelestialFieldLines = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let tracers = [];
    let hue = 160;
    let animationFrameId;
    let mouse = { x: null, y: null, radius: 150 };

    class Tracer {
      constructor() {
        this.life = 0;
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + 50;
        this.targetX = Math.random() * width;
        this.targetY = -50;
        const arcHeight = Math.random() * height * 0.8 + height * 0.2;
        this.controlX = (this.x + this.targetX) / 2 + (Math.random() - 0.5) * 300;
        this.controlY = height - arcHeight;
        this.life = 0;
        this.maxLife = Math.floor(Math.random() * 200 + 150);
        this.hue = hue + Math.random() * 30 - 15;
        this.lightness = Math.random() * 30 + 40;
        this.history = [];
      }

      update() {
        this.life++;
        if (this.life >= this.maxLife) this.reset();

        const t = this.life / this.maxLife;
        const invT = 1 - t;
        let currentX = invT * invT * this.x + 2 * invT * t * this.controlX + t * t * this.targetX;
        let currentY = invT * invT * this.y + 2 * invT * t * this.controlY + t * t * this.targetY;

        if (mouse.x !== null) {
          const dx = currentX - mouse.x;
          const dy = currentY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            currentX += Math.cos(angle) * force * 30;
            currentY += Math.sin(angle) * force * 30;
          }
        }

        this.history.push({ x: currentX, y: currentY });
        if (this.history.length > 20) this.history.shift();
      }

      draw() {
        if (this.history.length < 2) return;
        const t = this.life / this.maxLife;
        const opacity = Math.sin(t * Math.PI);
        const lineWidth = t * 3;

        ctx.beginPath();
        ctx.moveTo(this.history[0].x, this.history[0].y);
        for (let i = 1; i < this.history.length; i++) {
          ctx.lineTo(this.history[i].x, this.history[i].y);
        }
        ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.lightness}%, ${opacity * 0.8})`;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }
    }

    const setup = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      tracers = [];
      const tracerCount = Math.floor(width / 8);
      for (let i = 0; i < tracerCount; i++) {
        setTimeout(() => tracers.push(new Tracer()), i * 20);
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 5, 20, 0.15)';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      tracers.forEach((tracer) => {
        tracer.update();
        tracer.draw();
      });
      ctx.globalCompositeOperation = 'source-over';
      hue += 0.1;
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    setup();
    animate();
    window.addEventListener('resize', setup);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', setup);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} id="aurora-canvas-field-lines"></canvas>
    </div>
  );
};

export default CelestialFieldLines;
