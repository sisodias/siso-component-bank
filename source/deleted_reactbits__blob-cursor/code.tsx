"use client";

import React, { useTrail, animated } from '@react-spring/web';
import { useRef, useEffect, useCallback, FC } from 'react';

const fast = { tension: 1200, friction: 40 };
const slow = { mass: 10, tension: 200, friction: 50 };
const trans = (x: number, y: number) => `translate3d(${x}px,${y}px,0) translate3d(-50%,-50%,0)`;

interface BlobCursorProps {
  blobType?: 'circle' | 'square';
  fillColor?: string;
  trailCount?: number;
  className?: string; 
  style?: React.CSSProperties;
}

export const BlobCursor: FC<BlobCursorProps> = ({
  blobType = 'circle',
  fillColor = '#00f0ff',
  trailCount = 3,
  className = "",
  style = {}
}) => {
  const [trail, api] = useTrail(trailCount, i => ({
    xy: [0, 0],
    config: i === 0 ? fast : slow,
  }));

  const handleMove = useCallback((e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    const x = 'clientX' in e ? e.clientX : (e as React.TouchEvent).touches[0].clientX;
    const y = 'clientY' in e ? e.clientY : (e as React.TouchEvent).touches[0].clientY;
    api.start({ xy: [x, y] });
  }, [api]);


  useEffect(() => {
    window.addEventListener('mousemove', handleMove as EventListener);
    window.addEventListener('touchmove', handleMove as EventListener);
    
    return () => {
      window.removeEventListener('mousemove', handleMove as EventListener);
      window.removeEventListener('touchmove', handleMove as EventListener);
    };
  }, [handleMove]);

  const filterId = "blob-cursor-filter-unique";

  return (
    <div 
      className={`blob-cursor-container fixed inset-0 w-full h-full pointer-events-none 
                  ${className}`}
      style={{ filter: `url(#${filterId})`, zIndex: 10000, ...style }}
    >
      <svg className="absolute w-0 h-0 -z-10 pointer-events-none">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="30" />
            <feColorMatrix
              in="blur"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 35 -10"
            />
          </filter>
        </defs>
      </svg>
        {trail.map((props, index) => (
          <animated.div 
            key={index} 
            className="blob-trail-element absolute w-[50px] h-[50px]"
            style={{
                transform: props.xy.to(trans),
                borderRadius: blobType === 'circle' ? '50%' : '10%',
                backgroundColor: fillColor,
            }} 
          />
        ))}
    </div>
  );
};