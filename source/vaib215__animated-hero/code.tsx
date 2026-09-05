import React, { useEffect, useRef, useCallback } from 'react';

// Easing functions (simplified version of easing-utils)
const easingUtils = {
  linear: (t: number) => t,
  easeInExpo: (t: number) => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
};

interface Disc {
  x: number;
  y: number;
  w: number;
  h: number;
  p: number;
}

interface Particle {
  x: number;
  sx: number;
  dx: number;
  y: number;
  vy: number;
  p: number;
  r: number;
  c: string;
}

interface Point {
  x: number;
  y: number;
}

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  
  // Animation state refs
  const discsRef = useRef<Disc[]>([]);
  const linesRef = useRef<Point[][]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const renderRef = useRef({ width: 0, height: 0, dpi: 1 });
  const startDiscRef = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const endDiscRef = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const clipRef = useRef<{ disc: Disc; i: number; path: Path2D } | null>(null);
  const linesCanvasRef = useRef<OffscreenCanvas | null>(null);
  const particleAreaRef = useRef({ sx: 0, ex: 0, sw: 0, ew: 0, h: 0 });

  const setSize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    
    renderRef.current = {
      width: rect.width,
      height: rect.height,
      dpi: window.devicePixelRatio
    };

    canvas.width = renderRef.current.width * renderRef.current.dpi;
    canvas.height = renderRef.current.height * renderRef.current.dpi;
    canvas.style.width = `${renderRef.current.width}px`;
    canvas.style.height = `${renderRef.current.height}px`;

    return rect;
  }, []);

  const tweenValue = useCallback((start: number, end: number, p: number, ease?: string) => {
    const delta = end - start;
    const easeFn = ease === 'inExpo' ? easingUtils.easeInExpo : easingUtils.linear;
    return start + delta * easeFn(p);
  }, []);

  const tweenDisc = useCallback((disc: Disc) => {
    disc.x = tweenValue(startDiscRef.current.x, endDiscRef.current.x, disc.p);
    disc.y = tweenValue(startDiscRef.current.y, endDiscRef.current.y, disc.p, 'inExpo');
    disc.w = tweenValue(startDiscRef.current.w, endDiscRef.current.w, disc.p);
    disc.h = tweenValue(startDiscRef.current.h, endDiscRef.current.h, disc.p);
    return disc;
  }, [tweenValue]);

  const setDiscs = useCallback((rect: DOMRect) => {
    const { width, height } = rect;

    discsRef.current = [];

    startDiscRef.current = {
      x: width * 0.5,
      y: height * 0.45,
      w: width * 0.75,
      h: height * 0.7
    };

    endDiscRef.current = {
      x: width * 0.5,
      y: height * 0.95,
      w: 0,
      h: 0
    };

    const totalDiscs = 100;
    let prevBottom = height;
    let clip: { disc: Disc; i: number; path?: Path2D } = { disc: { x: 0, y: 0, w: 0, h: 0, p: 0 }, i: 0 };

    for (let i = 0; i < totalDiscs; i++) {
      const p = i / totalDiscs;
      const disc = tweenDisc({ x: 0, y: 0, w: 0, h: 0, p });
      const bottom = disc.y + disc.h;

      if (bottom <= prevBottom) {
        clip = { disc: { ...disc }, i };
      }

      prevBottom = bottom;
      discsRef.current.push(disc);
    }

    const clipPath = new Path2D();
    clipPath.ellipse(
      clip.disc.x,
      clip.disc.y,
      clip.disc.w,
      clip.disc.h,
      0,
      0,
      Math.PI * 2
    );
    clipPath.rect(
      clip.disc.x - clip.disc.w,
      0,
      clip.disc.w * 2,
      clip.disc.y
    );

    clipRef.current = { ...clip, path: clipPath };
  }, [tweenDisc]);

  const setLines = useCallback((rect: DOMRect) => {
    const { width, height } = rect;
    linesRef.current = [];

    const totalLines = 100;
    const linesAngle = (Math.PI * 2) / totalLines;

    for (let i = 0; i < totalLines; i++) {
      linesRef.current.push([]);
    }

    discsRef.current.forEach((disc) => {
      for (let i = 0; i < totalLines; i++) {
        const angle = i * linesAngle;
        const p = {
          x: disc.x + Math.cos(angle) * disc.w,
          y: disc.y + Math.sin(angle) * disc.h
        };
        linesRef.current[i].push(p);
      }
    });

    linesCanvasRef.current = new OffscreenCanvas(width, height);
    const ctx = linesCanvasRef.current.getContext('2d');
    if (!ctx || !clipRef.current) return;

    linesRef.current.forEach((line) => {
      ctx.save();
      let lineIsIn = false;

      line.forEach((p1, j) => {
        if (j === 0) return;
        const p0 = line[j - 1];

        if (!lineIsIn && clipRef.current?.path && 
            (ctx.isPointInPath(clipRef.current.path, p1.x, p1.y) ||
             ctx.isPointInStroke(clipRef.current.path, p1.x, p1.y))) {
          lineIsIn = true;
        } else if (lineIsIn && clipRef.current?.path) {
          ctx.clip(clipRef.current.path);
        }

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
      });

      ctx.restore();
    });
  }, []);

  const initParticle = useCallback((start = false): Particle => {
    const area = particleAreaRef.current;
    const sx = area.sx + area.sw * Math.random();
    const ex = area.ex + area.ew * Math.random();
    const dx = ex - sx;
    const y = start ? area.h * Math.random() : area.h;
    const r = 0.5 + Math.random() * 4;
    const vy = 0.5 + Math.random();

    return {
      x: sx,
      sx,
      dx,
      y,
      vy,
      p: 0,
      r,
      c: `rgba(255, 255, 255, ${Math.random()})`
    };
  }, []);

  const setParticles = useCallback((rect: DOMRect) => {
    const { width, height } = rect;
    particlesRef.current = [];

    if (!clipRef.current) return;

    particleAreaRef.current = {
      sw: clipRef.current.disc.w * 0.5,
      ew: clipRef.current.disc.w * 2,
      h: height * 0.85,
      sx: 0,
      ex: 0
    };

    particleAreaRef.current.sx = (width - particleAreaRef.current.sw) / 2;
    particleAreaRef.current.ex = (width - particleAreaRef.current.ew) / 2;

    const totalParticles = 100;
    for (let i = 0; i < totalParticles; i++) {
      const particle = initParticle(true);
      particlesRef.current.push(particle);
    }
  }, [initParticle]);

  const drawDiscs = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;

    // Outer disc
    const outerDisc = startDiscRef.current;
    ctx.beginPath();
    ctx.ellipse(outerDisc.x, outerDisc.y, outerDisc.w, outerDisc.h, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();

    // Inner discs
    discsRef.current.forEach((disc, i) => {
      if (i % 5 !== 0) return;

      if (disc.w < (clipRef.current?.disc.w || 0) - 5) {
        ctx.save();
        if (clipRef.current?.path) {
          ctx.clip(clipRef.current.path);
        }
      }

      ctx.beginPath();
      ctx.ellipse(disc.x, disc.y, disc.w, disc.h, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();

      if (disc.w < (clipRef.current?.disc.w || 0) - 5) {
        ctx.restore();
      }
    });
  }, []);

  const drawLines = useCallback((ctx: CanvasRenderingContext2D) => {
    if (linesCanvasRef.current) {
      ctx.drawImage(linesCanvasRef.current, 0, 0);
    }
  }, []);

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.save();
    if (clipRef.current?.path) {
      ctx.clip(clipRef.current.path);
    }

    particlesRef.current.forEach((particle) => {
      ctx.fillStyle = particle.c;
      ctx.beginPath();
      ctx.rect(particle.x, particle.y, particle.r, particle.r);
      ctx.fill();
      ctx.closePath();
    });

    ctx.restore();
  }, []);

  const moveDiscs = useCallback(() => {
    discsRef.current.forEach((disc) => {
      disc.p = (disc.p + 0.001) % 1;
      tweenDisc(disc);
    });
  }, [tweenDisc]);

  const moveParticles = useCallback(() => {
    const area = particleAreaRef.current;
    particlesRef.current.forEach((particle) => {
      particle.p = 1 - particle.y / area.h;
      particle.x = particle.sx + particle.dx * particle.p;
      particle.y -= particle.vy;

      if (particle.y < 0) {
        const newParticle = initParticle();
        particle.y = newParticle.y;
      }
    });
  }, [initParticle]);

  const tick = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(renderRef.current.dpi, renderRef.current.dpi);

    moveDiscs();
    moveParticles();
    drawDiscs(ctx);
    drawLines(ctx);
    drawParticles(ctx);

    ctx.restore();
    animationRef.current = requestAnimationFrame(tick);
  }, [moveDiscs, moveParticles, drawDiscs, drawLines, drawParticles]);

  const handleResize = useCallback(() => {
    const rect = setSize();
    if (rect) {
      setDiscs(rect);
      setLines(rect);
      setParticles(rect);
    }
  }, [setSize, setDiscs, setLines, setParticles]);

  useEffect(() => {
    const rect = setSize();
    if (rect) {
      setDiscs(rect);
      setLines(rect);
      setParticles(rect);
    }

    window.addEventListener('resize', handleResize);
    animationRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleResize, tick]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden" ref={containerRef}>
      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {/* Radial gradient overlay - before pseudo element equivalent */}
      <div 
        className="absolute top-1/2 left-1/2 w-[150%] h-[140%] pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse at 50% 55%, transparent 10%, black 50%)',
          transform: 'translate3d(-50%, -50%, 0)'
        }}
      />
      
      {/* Aura animation */}
      <div 
        className="absolute left-1/2 w-[30%] h-[140%] rounded-b-full blur-[50px] opacity-75 pointer-events-none z-20 aura-glow"
        style={{
          top: '-71.5%',
          background: `linear-gradient(
            20deg,
            #00f8f1,
            #ffbd1e20 16.5%,
            #fe848f 33%,
            #fe848f20 49.5%,
            #00f8f1 66%,
            #00f8f160 85.5%,
            #ffbd1e 100%
          )`,
          backgroundSize: '100% 200%',
          backgroundPosition: '0 100%',
          mixBlendMode: 'plus-lighter',
          transform: 'translate3d(-50%, 0, 0)'
        }}
      />
      
      {/* Purple glow overlay - after pseudo element equivalent */}
      <div 
        className="absolute top-1/2 left-1/2 w-full h-full pointer-events-none z-30"
        style={{
          background: 'radial-gradient(ellipse at 50% 75%, #a900ff 20%, transparent 75%)',
          mixBlendMode: 'overlay',
          transform: 'translate3d(-50%, -50%, 0)'
        }}
      />
      
      {/* Scanline overlay */}
      <div 
        className="absolute inset-0 w-full h-full opacity-50 pointer-events-none z-40"
        style={{
          background: 'repeating-linear-gradient(transparent, transparent 1px, white 1px, white 2px)',
          mixBlendMode: 'overlay'
        }}
      />

      {/* Keyframes for aura animation */}
      <style jsx>{`
        .aura-glow {
          animation: aura-glow 5s infinite linear;
        }
        
        @keyframes aura-glow {
          0% {
            background-position: 0 100%;
          }
          100% {
            background-position: 0 300%;
          }
        }
        
        @keyframes glow-pulse {
          0% {
            filter: brightness(1) drop-shadow(0 0 20px rgba(168, 85, 247, 0.3));
            transform: scale(1);
          }
          100% {
            filter: brightness(1.1) drop-shadow(0 0 40px rgba(168, 85, 247, 0.6));
            transform: scale(1.02);
          }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;