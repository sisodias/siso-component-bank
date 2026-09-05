'use client';

import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
}

interface Mouse {
  x: number;
  y: number;
}

const PLUS_SIZE = 16;
const PLUS_OFFSET = 12;

// Utility to get the CSS variable for foreground color, fallback to #ffdfc4
const getForegroundColor = () => {
  if (typeof window !== 'undefined') {
    const root = document.documentElement;
    const style = getComputedStyle(root);
    return style.getPropertyValue('--foreground').trim() || '#ffdfc4';
  }
  return '#ffdfc4';
};

interface EngravedStringProps {
  text: string;
}

export const EngravedString: React.FC<EngravedStringProps> = ({ text }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<Mouse>({ x: -9999, y: -9999 });
  const linesFooterRef = useRef<Point[][]>([]);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationFrameRef = useRef<number>(null);

  const cornersRef = useRef<{ x: number; y: number }[]>([
    { x: 0, y: 0 }, // top-left
    { x: 0, y: 0 }, // top-right
    { x: 0, y: 0 }, // bottom-right
    { x: 0, y: 0 }, // bottom-left
  ]);

  let horizontalPadding = 0;
  let verticalPadding = 0;

  // Store the foreground color in a ref to avoid repeated lookups
  const foregroundRef = useRef<string>('#ffdfc4');

  const drawWaveEffect = (
    context: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void => {
    horizontalPadding = window.innerWidth < 1400 ? width * 0.03 : width * 0.197;
    verticalPadding = height * 0.197;

    const linesCount = 60;
    const lineHeight = (height - verticalPadding * 2) / linesCount;
    const cellWidth = 5;
    const cols = Math.floor((width - horizontalPadding * 2) / cellWidth);

    const typeCanvasWidth = 120;
    const typeCanvasHeight = 50;
    const typeCanvas = document.createElement('canvas');
    const typeContext = typeCanvas.getContext('2d');
    
    if (!typeContext) return;

    typeCanvas.width = typeCanvasWidth;
    typeCanvas.height = typeCanvasHeight;

    const fontSize = typeCanvasWidth * 0.22;
    typeContext.fillStyle = 'black';
    typeContext.fillRect(0, 0, typeCanvasWidth, typeCanvasHeight);
    typeContext.fillStyle = 'white';
    typeContext.font = `bold ${fontSize}px Arial, sans-serif`; // Fallback font
    typeContext.textBaseline = 'middle';
    typeContext.textAlign = 'center';
    typeContext.fillText(text, typeCanvasWidth / 2, typeCanvasHeight / 2);

    const typeData = typeContext.getImageData(
      0,
      0,
      typeCanvasWidth,
      typeCanvasHeight
    ).data;

    linesFooterRef.current = [];
    for (let i = 0; i < linesCount; i++) {
      const y = verticalPadding + i * lineHeight;
      const line: Point[] = [];

      for (let j = 0; j < cols; j++) {
        const x = horizontalPadding + j * cellWidth;

        const typeX = Math.floor((j / cols) * typeCanvasWidth);
        const typeY = Math.floor((i / linesCount) * typeCanvasHeight);
        const index = (typeY * typeCanvasWidth + typeX) * 4;
        const brightness = typeData[index] || 0;

        const heightOffset = (brightness / 255) * 20;
        const finalY = y - heightOffset;

        line.push({
          x,
          y: finalY,
          baseX: x,
          baseY: finalY,
        });
      }
      linesFooterRef.current.push(line);
    }

    // Set corners for plus SVGs
    if (linesFooterRef.current.length > 0 && linesFooterRef.current[0].length > 0) {
      const firstLine = linesFooterRef.current[0];
      const lastLine = linesFooterRef.current[linesFooterRef.current.length - 1];
      cornersRef.current = [
        // top-left
        {
          x: firstLine[0].x - PLUS_OFFSET,
          y: firstLine[0].y - PLUS_OFFSET,
        },
        // top-right
        {
          x: firstLine[firstLine.length - 1].x + PLUS_OFFSET,
          y: firstLine[firstLine.length - 1].y - PLUS_OFFSET,
        },
        // bottom-right
        {
          x: lastLine[lastLine.length - 1].x + PLUS_OFFSET,
          y: lastLine[lastLine.length - 1].y + PLUS_OFFSET,
        },
        // bottom-left
        {
          x: lastLine[0].x - PLUS_OFFSET,
          y: lastLine[0].y + PLUS_OFFSET,
        },
      ];
    }
  };

  const updateLines = (
    mouseX: number,
    mouseY: number,
    radius: number = 100,
    maxSpeed: number = 10
  ): void => {
    linesFooterRef.current.forEach((lineFooter) => {
      lineFooter.forEach((point) => {
        const dx = point.x - mouseX;
        const dy = point.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < radius) {
          const angle = Math.atan2(dy, dx);
          const force = (radius - distance) / radius;

          point.x += Math.cos(angle) * force * maxSpeed;
          point.y += Math.sin(angle) * force * maxSpeed;
        }

        const springX = (point.baseX - point.x) * 0.1;
        const springY = (point.baseY - point.y) * 0.1;

        point.x += springX;
        point.y += springY;
      });
    });
  };

  const drawLines = (
    context: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void => {
    context.clearRect(0, 0, width, height);

    const foreground = foregroundRef.current;

    linesFooterRef.current.forEach((lineFooter) => {
      context.beginPath();
      context.moveTo(lineFooter[0].x, lineFooter[0].y);

      for (let i = 1; i < lineFooter.length; i++) {
        const prev = lineFooter[i - 1];
        const current = lineFooter[i];

        const midX = (prev.x + current.x) / 2;
        const midY = (prev.y + current.y) / 2;

        context.quadraticCurveTo(prev.x, prev.y, midX, midY);
      }

      context.strokeStyle = foreground;
      context.lineWidth = 0.5;
      context.stroke();
    });

    // Draw plus signs at the corners
    drawPlusSigns(context);
  };

  // Draws a plus sign at the given (x, y) position
  const drawPlus = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number = PLUS_SIZE,
    color: string = '#ffdfc4',
    lineWidth: number = 2
  ) => {
    const half = size / 2;
    context.save();
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.beginPath();
    // Vertical line
    context.moveTo(x, y - half);
    context.lineTo(x, y + half);
    // Horizontal line
    context.moveTo(x - half, y);
    context.lineTo(x + half, y);
    context.stroke();
    context.restore();
  };

  // Draw plus signs at the four corners
  const drawPlusSigns = (context: CanvasRenderingContext2D) => {
    if (!cornersRef.current) return;
    const foreground = foregroundRef.current;
    for (const corner of cornersRef.current) {
      drawPlus(context, corner.x, corner.y, PLUS_SIZE, foreground, 2.2);
    }
  };

  const resizeCanvas = (): void => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    
    if (!canvas || !context) return;

    const scaleFactor = window.devicePixelRatio || 1;
    // Use the wrapper's width instead of 100vw to prevent overflow
    const wrapper = wrapperRef.current;
    const width = wrapper ? wrapper.offsetWidth : canvas.offsetWidth;
    const height = wrapper ? wrapper.offsetHeight : canvas.offsetHeight;
    canvas.width = width * scaleFactor;
    canvas.height = height * scaleFactor;

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(scaleFactor, scaleFactor);

    drawWaveEffect(context, width, height);
  };

  const animateFooterLines = (): void => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    
    if (!canvas || !context) return;

    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    updateLines(mouseRef.current.x, mouseRef.current.y);
    drawLines(context, width, height);

    animationFrameRef.current = requestAnimationFrame(animateFooterLines);
  };

  const waitForFonts = async (): Promise<void> => {
    if (document.fonts) {
      try {
        await document.fonts.load('1em Arial');
      } catch (e) {
        console.error('Error loading font:', e);
      }
    }
    resizeCanvas();
    animateFooterLines();
  };

  const handleMouseMove = (e: MouseEvent): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  const handleTouchMove = (e: TouchEvent): void => {
    const canvas = canvasRef.current;
    if (!canvas || !e.touches[0]) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = e.touches[0].clientX - rect.left;
    mouseRef.current.y = e.touches[0].clientY - rect.top;
  };

  useEffect(() => {
    // Set the foreground color on mount and on theme change
    const setForeground = () => {
      foregroundRef.current = getForegroundColor();
    };
    setForeground();

    // Listen for theme changes (if using CSS custom properties that may change)
    const observer = new MutationObserver(setForeground);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] });

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    contextRef.current = context;
    resizeCanvas();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('resize', resizeCanvas);

    waitForFonts();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', resizeCanvas);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={wrapperRef}
      className="footer-hover-effect relative"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      <canvas
        ref={canvasRef}
        id="line-effect"
        style={{
          position: 'absolute',
          display: 'block',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0
        }}
        className="h-[40vh] sm:h-[60vh] md:h-screen top-[10vh] sm:top-[8vh] md:top-0"
      />
    </div>
  );
};