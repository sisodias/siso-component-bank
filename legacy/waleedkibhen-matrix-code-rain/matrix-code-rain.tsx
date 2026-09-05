import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Settings } from 'lucide-react';

interface Character {
  char: string;
  opacity: number;
}

interface Strand {
  x: number;
  y: number;
  speed: number;
  length: number;
  characters: Character[];
  showCursor: boolean;
  layer: number;
  scale: number;
}

export const Component = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [speed, setSpeed] = useState(0.4);
  const [density, setDensity] = useState(1);
  const [textColor, setTextColor] = useState('#00FF41');
  
  const animationFrameId = useRef<number | null>(null);
  const strands = useRef<Strand[]>([]);
  const lastTime = useRef<number>(0);
  const cursorBlinkTime = useRef<number>(0);
  
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,./<>?';
  
  const getRandomChar = useCallback(() => {
    return characters.charAt(Math.floor(Math.random() * characters.length));
  }, []);

  const createStrand = useCallback((x: number, canvasHeight: number) => {
    const layer = Math.floor(Math.random() * 3);
    const scale = layer === 0 ? 0.8 : layer === 1 ? 1 : 1.2;
    const length = Math.floor(Math.random() * 15) + 15;
    
    const chars: Character[] = Array(length).fill(null).map(() => ({
      char: getRandomChar(),
      opacity: 1
    }));

    return {
      x,
      y: -length * (fontSize * scale),
      speed: (Math.random() * 0.3 + 0.7) * speed * fontSize * (layer === 2 ? 1.2 : layer === 1 ? 1 : 0.8),
      length,
      characters: chars,
      showCursor: true,
      layer,
      scale
    };
  }, [fontSize, getRandomChar, speed]);

  const updateStrands = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, deltaTime: number) => {
    const spacing = fontSize * 1.5;
    const maxStrands = Math.floor(width / spacing) * density * 1.5;
    
    if (strands.current.length < maxStrands) {
      const availableSlots = Array.from({ length: Math.floor(width / spacing) })
        .map((_, i) => i * spacing)
        .filter(x => !strands.current.some(strand => strand.x === x));
      
      if (availableSlots.length > 0 && Math.random() < 0.1 * density) {
        const x = availableSlots[Math.floor(Math.random() * availableSlots.length)];
        strands.current.push(createStrand(x, height));
      }
    }
    
    cursorBlinkTime.current += deltaTime;
    if (cursorBlinkTime.current >= 500) {
      strands.current.forEach(strand => {
        strand.showCursor = !strand.showCursor;
      });
      cursorBlinkTime.current = 0;
    }
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    
    strands.current.sort((a, b) => a.layer - b.layer);
    
    strands.current = strands.current.filter(strand => {
      strand.y += strand.speed * deltaTime * 0.05;
      
      const baseOpacity = strand.layer === 0 ? 0.3 : strand.layer === 1 ? 0.6 : 0.9;
      const blur = strand.layer === 0 ? 1 : strand.layer === 1 ? 2 : 3;
      
      const scaledFontSize = fontSize * strand.scale;
      ctx.font = `${scaledFontSize}px monospace`;
      ctx.shadowBlur = blur;
      ctx.shadowColor = textColor;

      strand.characters.forEach((char, i) => {
        const y = strand.y + (i * scaledFontSize);
        
        if (y > -scaledFontSize && y < height + scaledFontSize) {
          ctx.fillStyle = textColor;
          ctx.globalAlpha = baseOpacity;
          ctx.fillText(char.char, strand.x, y);
          
          if (i === strand.characters.length - 1 && strand.showCursor) {
            ctx.fillStyle = '#FFFFFF';
            ctx.globalAlpha = baseOpacity;
            ctx.fillRect(strand.x, y + 2, scaledFontSize * 0.8, 2);
          }
        }
      });

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      if (Math.random() < 0.02) {
        const randomIndex = Math.floor(Math.random() * strand.characters.length);
        strand.characters[randomIndex].char = getRandomChar();
      }

      return strand.y - (strand.length * (fontSize * strand.scale)) < height;
    });
  }, [density, fontSize, getRandomChar, textColor, createStrand]);
  
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const container = canvas.parentElement;
    if (!container) return;
    
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  }, []);
  
  const animate = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const deltaTime = time - lastTime.current;
    lastTime.current = time;
    
    if (canvas.width !== canvas.parentElement?.clientWidth || 
        canvas.height !== canvas.parentElement?.clientHeight) {
      resizeCanvas();
    }
    
    updateStrands(ctx, canvas.width, canvas.height, deltaTime);
    
    animationFrameId.current = requestAnimationFrame(animate);
  }, [resizeCanvas, updateStrands]);
  
  useEffect(() => {
    resizeCanvas();
    lastTime.current = performance.now();
    cursorBlinkTime.current = 0;
    animationFrameId.current = requestAnimationFrame(animate);
    
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [animate, resizeCanvas]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="bg-black/70 text-green-400 p-2 rounded-full hover:bg-black/90 transition-colors"
          aria-label="Settings"
        >
          <Settings size={24} />
        </button>
      </div>
      
      {showSettings && (
        <div className="absolute top-16 right-4 bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-green-500/30 text-green-400 w-64 shadow-lg z-10">
          <h2 className="text-xl mb-4 font-semibold">Matrix Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm">Font Size: {fontSize}px</label>
              <input 
                type="range" 
                min={8} 
                max={24} 
                value={fontSize} 
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-green-500"
              />
            </div>
            
            <div>
              <label className="block mb-1 text-sm">Speed: {speed.toFixed(1)}x</label>
              <input 
                type="range" 
                min={0.1} 
                max={3} 
                step={0.1}
                value={speed} 
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full accent-green-500"
              />
            </div>
            
            <div>
              <label className="block mb-1 text-sm">Density: {density.toFixed(1)}x</label>
              <input 
                type="range" 
                min={0.2} 
                max={2} 
                step={0.1}
                value={density} 
                onChange={(e) => setDensity(Number(e.target.value))}
                className="w-full accent-green-500"
              />
            </div>
            
            <div>
              <label className="block mb-1 text-sm">Text Color:</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="color" 
                  value={textColor} 
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-8 h-8 rounded border-none"
                />
                <span>{textColor}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-xs opacity-70">
            Inspired by "The Matrix" (1999)
          </div>
        </div>
      )}

      <style>{`
        html, body, :root {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background-color: #000;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        input[type="color"] {
          -webkit-appearance: none;
          padding: 0;
          border: none;
          border-radius: 4px;
          overflow: hidden;
        }

        input[type="color"]::-webkit-color-swatch-wrapper {
          padding: 0;
        }

        input[type="color"]::-webkit-color-swatch {
          border: none;
        }
      `}</style>
    </div>
  );
};