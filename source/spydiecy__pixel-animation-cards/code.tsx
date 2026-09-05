import React, { useEffect, useRef, useState } from "react";

// PixelAnimation class to handle the pixel drawing and animation
class Pixel {
  constructor(canvas, context, x, y, color, speed, delay) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = context;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = this.getRandomValue(0.05, 0.2) * speed;
    this.size = 0;
    this.sizeStep = Math.random() * 0.2;
    this.minSize = 0.1;
    this.maxSizeInteger = 1.5;
    this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger);
    this.delay = delay;
    this.counter = 0;
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
    this.isIdle = false;
    this.isReverse = false;
    this.isShimmer = false;
  }

  getRandomValue(min, max) {
    return Math.random() * (max - min) + min;
  }

  draw() {
    if (this.size <= 0) return;
    
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;

    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      this.x + centerOffset,
      this.y + centerOffset,
      this.size,
      this.size
    );
  }

  appear() {
    this.isIdle = false;

    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }

    if (this.size >= this.maxSize) {
      this.isShimmer = true;
    }

    if (this.isShimmer) {
      this.shimmer();
    } else {
      this.size += this.sizeStep;
    }

    this.draw();
  }

  disappear() {
    this.isShimmer = false;
    this.counter = 0;

    if (this.size <= 0) {
      this.isIdle = true;
      return;
    } else {
      this.size -= 0.1;
    }

    this.draw();
  }

  shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true;
    } else if (this.size <= this.minSize) {
      this.isReverse = false;
    }

    if (this.isReverse) {
      this.size -= this.speed;
    } else {
      this.size += this.speed;
    }
  }
}

// PixelCanvas component that manages all the pixels and animations
const PixelCanvas = ({ 
  colors = ["#f8fafc", "#f1f5f9", "#cbd5e1"], 
  gap = 5, 
  speed = 35, 
  noFocus = false 
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const pixelsRef = useRef([]);
  const animationRef = useRef(null);
  const timePreviousRef = useRef(performance.now());
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Initialize the canvas and pixels
  const initCanvas = () => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext('2d');
    
    const rect = container.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);

    setDimensions({ width, height });
    
    pixelsRef.current = [];
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    createPixels(canvas, ctx, width, height);
  };

  // Calculate distance to center for delay
  const getDistanceToCanvasCenter = (x, y, width, height) => {
    const dx = x - width / 2;
    const dy = y - height / 2;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Create all the pixels
  const createPixels = (canvas, ctx, width, height) => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const normalizedGap = parseInt(gap);
    const normalizedSpeed = parseInt(speed) * 0.001;
    const colorArray = Array.isArray(colors) ? colors : colors.split(',').map(c => c.trim());

    for (let x = 0; x < width; x += normalizedGap) {
      for (let y = 0; y < height; y += normalizedGap) {
        const color = colorArray[Math.floor(Math.random() * colorArray.length)];
        const delay = reducedMotion ? 0 : getDistanceToCanvasCenter(x, y, width, height);

        pixelsRef.current.push(
          new Pixel(canvas, ctx, x, y, color, normalizedSpeed, delay)
        );
      }
    }
  };

  // Animation loop
  const animate = (fnName) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const timeInterval = 1000 / 60;
    
    animationRef.current = requestAnimationFrame(() => animate(fnName));

    const timeNow = performance.now();
    const timePassed = timeNow - timePreviousRef.current;

    if (timePassed < timeInterval) return;

    timePreviousRef.current = timeNow - (timePassed % timeInterval);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let allIdle = true;
    for (let i = 0; i < pixelsRef.current.length; i++) {
      pixelsRef.current[i][fnName]();
      if (!pixelsRef.current[i].isIdle) {
        allIdle = false;
      }
    }

    if (allIdle) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  // Handle animation start/stop
  const handleAnimation = (name) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(() => animate(name));
  };

  // Event handlers
  const onMouseEnter = () => {
    handleAnimation("appear");
  };

  const onMouseLeave = () => {
    handleAnimation("disappear");
  };

  const onFocusIn = (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    handleAnimation("appear");
  };

  const onFocusOut = (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    handleAnimation("disappear");
  };

  // Initialize the canvas when the component mounts or resizes
  useEffect(() => {
    if (!containerRef.current) return;
    
    initCanvas();
    
    const observer = new ResizeObserver(() => {
      initCanvas();
    });
    
    observer.observe(containerRef.current);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      observer.disconnect();
    };
  }, []);

  // Add event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);

    if (!noFocus) {
      container.addEventListener("focusin", onFocusIn);
      container.addEventListener("focusout", onFocusOut);
    }

    return () => {
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mouseleave", onMouseLeave);

      if (!noFocus) {
        container.removeEventListener("focusin", onFocusIn);
        container.removeEventListener("focusout", onFocusOut);
      }
    };
  }, [noFocus]);

  return (
    <div 
      ref={containerRef} 
      className="pixel-canvas-container"
      style={{ 
        display: 'grid',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      <canvas 
        ref={canvasRef} 
        width={dimensions.width} 
        height={dimensions.height}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          display: 'block',
        }}
      />
    </div>
  );
};

// Card component with PixelCanvas
const Card = ({ 
  icon, 
  label, 
  colors = ["#f8fafc", "#f1f5f9", "#cbd5e1"], 
  gap = 3, 
  speed = 20, 
  noFocus = false,
  activeColor
}) => {
  return (
    <div 
      className="card"
      style={{ 
        "--active-color": activeColor || "var(--fg)"
      }}
    >
      <PixelCanvas 
        colors={colors} 
        gap={gap} 
        speed={speed} 
        noFocus={noFocus} 
      />
      {icon}
      <button>{label}</button>
    </div>
  );
};

export const Component = () => {
  return (
    <div className="pixel-cards-demo">
      <main>
        <Card 
          label="Layout"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
              <path d="M216,42H40A14,14,0,0,0,26,56V200a14,14,0,0,0,14,14H216a14,14,0,0,0,14-14V56A14,14,0,0,0,216,42ZM40,54H216a2,2,0,0,1,2,2V98H38V56A2,2,0,0,1,40,54ZM38,200V110H98v92H40A2,2,0,0,1,38,200Zm178,2H110V110H218v90A2,2,0,0,1,216,202Z"></path>
            </svg>
          }
          colors={["#ffffff", "#f1f5f9", "#e3e3e3"]}
          gap={3}
          speed={15}
        />
        
        <Card 
          label="Code"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
              <path d="M67.84,92.61L25.37,128l42.47,35.39a6,6,0,1,1-7.68,9.22l-48-40a6,6,0,0,1,0-9.22l48-40a6,6,0,0,1,7.68,9.22Zm176,30.78-48-40a6,6,0,1,0-7.68,9.22L230.63,128l-42.47,35.39a6,6,0,1,0,7.68,9.22l48-40a6,6,0,0,0,0-9.22Zm-81.79-89A6,6,0,0,0,154.36,38l-64,176A6,6,0,0,0,94,221.64a6.15,6.15,0,0,0,2,.36,6,6,0,0,0,5.64-3.95l64-176A6,6,0,0,0,162.05,34.36Z"></path>
            </svg>
          }
          colors={["#e0f2fe", "#7dd3fc", "#0ea5e9"]}
          gap={3}
          speed={15}
          activeColor="#e0f2fe"
        />
        
        <Card 
          label="Command"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
              <path d="M180,146H158V110h22a34,34,0,1,0-34-34V98H110V76a34,34,0,1,0-34,34H98v36H76a34,34,0,1,0,34,34V158h36v22a34,34,0,1,0,34-34ZM158,76a22,22,0,1,1,22,22H158ZM54,76a22,22,0,0,1,44,0V98H76A22,22,0,0,1,54,76ZM98,180a22,22,0,1,1-22-22H98Zm12-70h36v36H110Zm70,92a22,22,0,0,1-22-22V158h22a22,22,0,0,1,0,44Z"></path>
            </svg>
          }
          colors={["#fef08a", "#fde047", "#eab308"]}
          gap={3}
          speed={15}
          activeColor="#fef08a"
        />
        
        <Card 
          label="Dropper"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
              <path d="M222,67.34a33.81,33.81,0,0,0-10.64-24.25C198.12,30.56,176.68,31,163.54,44.18L142.82,65l-.63-.63a22,22,0,0,0-31.11,0l-9,9a14,14,0,0,0,0,19.81l3.47,3.47L53.14,149.1a37.81,37.81,0,0,0-9.84,36.73l-8.31,19a11.68,11.68,0,0,0,2.46,13A13.91,13.91,0,0,0,47.32,222,14.15,14.15,0,0,0,53,220.82L71,212.92a37.92,37.92,0,0,0,35.84-10.07l52.44-52.46,3.47,3.48a14,14,0,0,0,19.8,0l9-9a22.06,22.06,0,0,0,0-31.13l-.66-.65L212,91.85A33.76,33.76,0,0,0,222,67.34Zm-123.61,127a26,26,0,0,1-26,6.47,6,6,0,0,0-4.17.24l-20,8.75a2,2,0,0,1-2.09-.31l9.12-20.9a5.94,5.94,0,0,0,.19-4.31A25.91,25.91,0,0,1,56,166h70.78ZM138.78,154H65.24l48.83-48.84,36.76,36.78Zm64.77-70.59L178.17,108.9a6,6,0,0,0,0,8.47l4.88,4.89a10,10,0,0,1,0,14.15l-9,9a2,2,0,0,1-2.82,0l-60.69-60.7a2,2,0,0,1,0-2.83l9-9a10,10,0,0,1,14.14,0l4.89,4.89a6,6,0,0,0,4.24,1.75h0a6,6,0,0,0,4.25-1.77L172,52.66c8.57-8.58,22.51-9,31.07-.85a22,22,0,0,1,.44,31.57Z"></path>
            </svg>
          }
          colors={["#fecdd3", "#fda4af", "#e11d48"]}
          gap={3}
          speed={15}
          noFocus
          activeColor="#fecdd3"
        />
      </main>

      <style jsx global>{`
        :root {
          --space: 1rem;
          --bg: #09090b;
          --fg: #e3e3e3;
          --surface-1: #101012;
          --surface-2: #27272a;
          --surface-3: #52525b;
          --ease-out: cubic-bezier(0.5, 1, 0.89, 1);
          --ease-in-out: cubic-bezier(0.45, 0, 0.55, 1);
        }
        
        * {
          box-sizing: border-box;
        }
        
        .pixel-cards-demo {
          color: var(--fg);
          background: var(--bg);
          padding: var(--space);
          min-height: 100vh;
          display: grid;
          width: 100%;
        }
        
        main {
          display: grid;
          grid-template-columns: repeat(var(--count, 1), 1fr);
          gap: var(--space);
          margin: auto;
          inline-size: min(var(--max, 15rem), 100%);
        }
        
        @media (min-width: 25rem) {
          main {
            --count: 2;
            --max: 30rem;
          }
        }
        
        @media (min-width: 45rem) {
          main {
            --count: 4;
            --max: 60rem;
          }
        }
        
        .card {
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-areas: "card";
          place-items: center;
          aspect-ratio: 4/5;
          border: 1px solid var(--surface-2);
          isolation: isolate;
          transition: border-color 200ms var(--ease-out);
          user-select: none;
          background-color: var(--surface-1);
        }
        
        .card::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0.1;
          z-index: 0;
        }
        
        .card > * {
          grid-area: card;
        }
        
        .card canvas {
          z-index: 1;
        }
        
        .card svg {
          position: relative;
          z-index: 2;
          width: 30%;
          height: auto;
          color: var(--surface-3);
          transition: 300ms var(--ease-out);
          transition-property: color, transform;
        }
        
        .card button {
          opacity: 0;
          background: none;
          border: none;
          color: var(--fg);
          font-size: 1rem;
          cursor: pointer;
          padding: 0;
        }
        
        .card:focus-within {
          outline: 5px auto Highlight;
          outline: 5px auto -webkit-focus-ring-color;
        }
        
        .card:hover, .card:focus-within {
          border-color: var(--active-color, var(--fg));
          transition: border-color 800ms var(--ease-in-out);
        }
        
        .card:hover svg, .card:focus-within svg {
          color: var(--active-color, var(--fg));
          transform: scale(1.05);
          transition: 300ms var(--ease-in-out);
        }
        
        .pixel-canvas-container {
          position: absolute;
          inset: 0;
          z-index: 1;
          opacity: 0;
          transition: opacity 300ms var(--ease-out);
        }
        
        .card:hover .pixel-canvas-container, 
        .card:focus-within .pixel-canvas-container {
          opacity: 1;
          transition: opacity 500ms var(--ease-in-out);
        }
      `}</style>
    </div>
  );
};