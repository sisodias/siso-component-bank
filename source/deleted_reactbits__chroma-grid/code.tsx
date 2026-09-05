'use client';

import {
  FC,
  useRef,
  useEffect,
  useCallback,
  CSSProperties,
  ReactNode,
} from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';

export interface ChromaGridItemType {
  image: string;
  title: string;
  subtitle: string;
  handle?: string;
  location?: string;
  borderColor?: string;
  gradient?: string;
  url: string;
}

interface InteractiveChromaGridProps {
  items: ChromaGridItemType[];
  className?: string;
  radius?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
}

const InteractiveChromaGrid: FC<InteractiveChromaGridProps> = ({
  items,
  className = '',
  radius = 300,
  damping = 0.45,
  fadeOut = 0.6,
  ease = 'power3.out',
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const setX = useRef<(value: number) => void>();
  const setY = useRef<(value: number) => void>();

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    setX.current = gsap.quickSetter(el, '--x', 'px');
    setY.current = gsap.quickSetter(el, '--y', 'px');

    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = useCallback((x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  }, [damping, ease]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!rootRef.current) return;
    const rect = rootRef.current.getBoundingClientRect();
    moveTo(e.clientX - rect.left, e.clientY - rect.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  }, [moveTo]);

  const handlePointerLeave = useCallback(() => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  }, [fadeOut]);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  if (!items || items.length === 0) {
    return null;
  }

  const rootStyle: CSSProperties = {
    '--r': `${radius}px`,
    '--x': '50%',
    '--y': '50%',
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative grid h-full w-full grid-cols-[repeat(auto-fill,minmax(280px,1fr))] content-start items-start gap-4 p-4 ${className}`}
      style={rootStyle}
    >
      {items.map((item, i) => (
        <a
          key={i}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          onMouseMove={handleCardMouseMove}
          className="group relative flex aspect-[3/4] flex-col overflow-hidden rounded-xl border-2 border-transparent transition-colors duration-300"
          style={{
              '--card-border': item.borderColor || 'transparent',
              background: item.gradient || '#111',
              '--spotlight-color': 'rgba(255,255,255,0.3)',
            } as CSSProperties
          }
        >
          <div
            className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                'radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%)',
            }}
          />
          <div className="relative z-10 flex-1 p-2.5">
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="!relative h-full w-full rounded-lg object-cover"
            />
          </div>
          <footer className="relative z-10 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 p-3 pt-0 font-sans text-white">
            <h3 className="m-0 text-base font-semibold">{item.title}</h3>
            {item.handle && <span className="text-sm opacity-80 text-right">{item.handle}</span>}
            <p className="m-0 text-xs opacity-85">{item.subtitle}</p>
          </footer>
        </a>
      ))}
      <div
        className="pointer-events-none absolute inset-0 z-30"
        style={{
          backdropFilter: 'grayscale(1) brightness(0.78)',
          WebkitBackdropFilter: 'grayscale(1) brightness(0.78)',
          background: 'rgba(0,0,0,0.001)',
          maskImage: 'radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 15%,#0000001a 30%,#00000038 45%,#00000059 60%,#00000080 75%,#000000ad 88%,#fff 100%)',
          WebkitMaskImage: 'radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 15%,#0000001a 30%,#00000038 45%,#00000059 60%,#00000080 75%,#000000ad 88%,#fff 100%)',
        }}
      />
      <div
        ref={fadeRef}
        className="pointer-events-none absolute inset-0 z-40 transition-opacity duration-500"
        style={{
          backdropFilter: 'grayscale(1) brightness(0.78)',
          WebkitBackdropFilter: 'grayscale(1) brightness(0.78)',
          background: 'rgba(0,0,0,0.001)',
          maskImage: 'radial-gradient(circle var(--r) at var(--x) var(--y),#fff 0%,#fff 15%,#ffffffE6 30%,#ffffffC7 45%,#ffffffA6 60%,#ffffff80 75%,#ffffff52 88%,#0000 100%)',
          WebkitMaskImage: 'radial-gradient(circle var(--r) at var(--x) var(--y),#fff 0%,#fff 15%,#ffffffE6 30%,#ffffffC7 45%,#ffffffA6 60%,#ffffff80 75%,#ffffff52 88%,#0000 100%)',
          opacity: 1,
        }}
      />
    </div>
  );
};

export default InteractiveChromaGrid;