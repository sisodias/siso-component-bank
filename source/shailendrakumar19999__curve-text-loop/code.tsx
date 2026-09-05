import { useRef, useEffect, useState, useMemo, useId, FC, PointerEvent, useCallback } from 'react';

interface CurvedLoopProps {
  marqueeText?: string;
  speed?: number;
  className?: string;
  curveAmount?: number;
  direction?: 'left' | 'right';
  interactive?: boolean;
}

export const CurvedLoop: FC<CurvedLoopProps> = ({
  marqueeText = '',
  speed = 2,
  className,
  curveAmount = 400,
  direction = 'left',
  interactive = true
}) => {
  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    return (hasTrailing ? marqueeText.replace(/\s+$/, '') : marqueeText) + '\u00A0';
  }, [marqueeText]);
  
  const measureRef = useRef<SVGTextElement | null>(null);
  const textPathRef = useRef<SVGTextPathElement | null>(null);
  const [spacing, setSpacing] = useState(0);
  const [offset, setOffset] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const uid = useId();
  const pathId = `curve-${uid}`;
  const pathD = useMemo(() => `M-100,40 Q500,${40 + curveAmount} 1540,40`, [curveAmount]);
  
  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef<'left' | 'right'>(direction);
  const velRef = useRef(0);
  
  const totalText = useMemo(() => {
    return spacing ? Array(Math.ceil(1800 / spacing) + 2).fill(text).join('') : text;
  }, [spacing, text]);
  
  const ready = spacing > 0;
  
  useEffect(() => {
    if (measureRef.current) setSpacing(measureRef.current.getComputedTextLength());
  }, [text]);
  
  useEffect(() => {
    if (!spacing || !textPathRef.current) return;
    const initial = -spacing;
    textPathRef.current.setAttribute('startOffset', initial + 'px');
    setOffset(initial);
  }, [spacing]);
  
  useEffect(() => {
    if (!spacing || !ready || !textPathRef.current) return;
    let frame = 0;
    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = dirRef.current === 'right' ? speed : -speed;
        const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');
        let newOffset = currentOffset + delta;
        if (newOffset <= -spacing) newOffset += spacing;
        if (newOffset > 0) newOffset -= spacing;
        textPathRef.current.setAttribute('startOffset', newOffset + 'px');
        setOffset(newOffset);
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [spacing, speed, ready]);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    });
  }, []);
  
  const onPointerDown = useCallback((e: PointerEvent) => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = e.clientX;
    velRef.current = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [interactive]);
  
  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!interactive || !dragRef.current || !textPathRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx;
    const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');
    let newOffset = currentOffset + dx;
    if (newOffset <= -spacing) newOffset += spacing;
    if (newOffset > 0) newOffset -= spacing;
    textPathRef.current.setAttribute('startOffset', newOffset + 'px');
    setOffset(newOffset);
  }, [interactive, spacing]);
  
  const endDrag = useCallback(() => {
    if (!interactive) return;
    dragRef.current = false;
    dirRef.current = velRef.current > 0 ? 'right' : 'left';
  }, [interactive]);
  
  const cursorStyle = interactive ? (dragRef.current ? 'grabbing' : 'grab') : 'auto';
  
  const orbs = useMemo(() => [...Array(8)].map((_, i) => ({
    size: Math.random() * 300 + 150,
    left: Math.random() * 100,
    top: Math.random() * 100,
    color: Math.random() > 0.5 ? '99, 102, 241' : '168, 85, 247',
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5
  })), []);
  
  const particles = useMemo(() => [...Array(40)].map((_, i) => ({
    size: Math.random() * 3 + 1,
    left: Math.random() * 100,
    top: Math.random() * 100,
    opacity: Math.random() * 0.3 + 0.1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
    glow: Math.random() * 10 + 5
  })), []);
  
  return (
    <div
      className="relative min-h-screen flex items-center justify-center w-full overflow-hidden"
      style={{ cursor: cursorStyle }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onMouseMove={handleMouseMove}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
        <div 
          className="absolute inset-0 opacity-40 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(99, 102, 241, 0.4), transparent 40%), radial-gradient(circle at ${(1 - mousePos.x) * 100}% ${(1 - mousePos.y) * 100}%, rgba(168, 85, 247, 0.3), transparent 40%), radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.2), transparent 60%)`
          }}
        />
      </div>

      {/* Grid */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          transform: 'perspective(500px) rotateX(60deg) scale(2)',
          transformOrigin: 'center center'
        }}
      />
      
      {/* Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {orbs.map((orb, i) => (
          <div
            key={i}
            className="absolute rounded-full backdrop-blur-xl will-change-transform"
            style={{
              width: orb.size + 'px',
              height: orb.size + 'px',
              left: orb.left + '%',
              top: orb.top + '%',
              background: `radial-gradient(circle, rgba(${orb.color}, 0.15), transparent 70%)`,
              animation: `float-orb ${orb.duration}s ease-in-out infinite`,
              animationDelay: orb.delay + 's',
              filter: 'blur(40px)'
            }}
          />
        ))}
      </div>

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full will-change-transform"
            style={{
              width: p.size + 'px',
              height: p.size + 'px',
              left: p.left + '%',
              top: p.top + '%',
              background: `rgba(255, 255, 255, ${p.opacity})`,
              animation: `particle-drift ${p.duration}s linear infinite`,
              animationDelay: p.delay + 's',
              boxShadow: `0 0 ${p.glow}px rgba(255, 255, 255, 0.3)`
            }}
          />
        ))}
      </div>
      
      {/* Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ filter: 'blur(120px)', opacity: 0.5 }}>
        <div className="w-4/5 h-64 rounded-full" style={{ background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.6) 0%, rgba(139, 92, 246, 0.6) 50%, rgba(236, 72, 153, 0.6) 100%)', animation: 'glow-pulse 8s ease-in-out infinite' }} />
      </div>
      
      {/* SVG */}
      <div className="relative z-10 w-full px-4" style={{ visibility: ready ? 'visible' : 'hidden' }}>
        <svg className="select-none w-full overflow-visible block aspect-[100/12] font-black uppercase leading-none" viewBox="0 0 1440 120" style={{ filter: 'drop-shadow(0 4px 20px rgba(99, 102, 241, 0.8)) drop-shadow(0 0 80px rgba(168, 85, 247, 0.6)) drop-shadow(0 0 120px rgba(236, 72, 153, 0.4))', fontSize: '6rem' }}>
          <text ref={measureRef} xmlSpace="preserve" style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none' }}>{text}</text>
          <defs>
            <path id={pathId} d={pathD} fill="none" stroke="transparent" />
            <linearGradient id={`grad-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }}><animate attributeName="stop-color" values="#3b82f6; #8b5cf6; #ec4899; #f59e0b; #3b82f6" dur="12s" repeatCount="indefinite" /></stop>
              <stop offset="25%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }}><animate attributeName="stop-color" values="#8b5cf6; #ec4899; #f59e0b; #3b82f6; #8b5cf6" dur="12s" repeatCount="indefinite" /></stop>
              <stop offset="50%" style={{ stopColor: '#ec4899', stopOpacity: 1 }}><animate attributeName="stop-color" values="#ec4899; #f59e0b; #3b82f6; #8b5cf6; #ec4899" dur="12s" repeatCount="indefinite" /></stop>
              <stop offset="75%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }}><animate attributeName="stop-color" values="#f59e0b; #3b82f6; #8b5cf6; #ec4899; #f59e0b" dur="12s" repeatCount="indefinite" /></stop>
              <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }}><animate attributeName="stop-color" values="#3b82f6; #8b5cf6; #ec4899; #f59e0b; #3b82f6" dur="12s" repeatCount="indefinite" /></stop>
            </linearGradient>
            <linearGradient id={`shimmer-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: 'rgba(255, 255, 255, 0)', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: 'rgba(255, 255, 255, 0.8)', stopOpacity: 1 }}><animate attributeName="offset" values="0; 1; 0" dur="3s" repeatCount="indefinite" /></stop>
              <stop offset="100%" style={{ stopColor: 'rgba(255, 255, 255, 0)', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          {ready && (
            <>
              <text xmlSpace="preserve" className={className} fill={`url(#grad-${uid})`} style={{ fontWeight: 900 }}>
                <textPath ref={textPathRef} href={`#${pathId}`} startOffset={offset + 'px'} xmlSpace="preserve">{totalText}</textPath>
              </text>
              <text xmlSpace="preserve" className={className} fill={`url(#shimmer-${uid})`} style={{ fontWeight: 900, mixBlendMode: 'overlay' }}>
                <textPath href={`#${pathId}`} startOffset={offset + 'px'} xmlSpace="preserve">{totalText}</textPath>
              </text>
            </>
          )}
        </svg>
      </div>
      
      {/* Controls */}
      {interactive && (
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="text-white/50 text-xs font-medium animate-pulse">Drag to control • Move to explore</div>
        </div>
      )}

      {/* Corners */}
      <div className="absolute top-8 left-8 w-24 h-24 border-t-2 border-l-2 border-white/10 rounded-tl-3xl" />
      <div className="absolute top-8 right-8 w-24 h-24 border-t-2 border-r-2 border-white/10 rounded-tr-3xl" />
      <div className="absolute bottom-8 left-8 w-24 h-24 border-b-2 border-l-2 border-white/10 rounded-bl-3xl" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-b-2 border-r-2 border-white/10 rounded-br-3xl" />
      
      <style>{`
        @keyframes float-orb {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          25% { transform: translate(30px, -40px) scale(1.1); opacity: 0.8; }
          50% { transform: translate(-20px, -80px) scale(0.9); opacity: 0.5; }
          75% { transform: translate(-40px, -40px) scale(1.05); opacity: 0.7; }
        }
        @keyframes particle-drift {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
        }
        @keyframes glow-pulse {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.5; }
          50% { transform: scale(1.1) rotate(5deg); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};