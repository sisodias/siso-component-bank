// /components/ui/hover-glare-card.tsx
'use client';

import {
  useRef,
  useCallback,
  useMemo,
  FC,
  ReactNode,
  CSSProperties,
} from 'react';


interface HoverGlareCardProps {

  children: ReactNode;

  glareColor?: string;

  glareOpacity?: number;

  glareAngle?: number;

  glareSize?: number;

  transitionDuration?: number;

  playOnce?: boolean;

  className?: string;

  style?: CSSProperties;
}


const hexToRgba = (hex: string, alpha: number): string => {
  if (!/^#[\dA-Fa-f]{3,6}$/.test(hex)) {
    // Fallback to white if hex is invalid
    return `rgba(255, 255, 255, ${alpha})`;
  }

  let color = hex.substring(1); // remove #

  if (color.length === 3) {
    color = color.split('').map(char => char + char).join('');
  }

  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};


const HoverGlareCard: FC<HoverGlareCardProps> = ({
  children,
  glareColor = '#ffffff',
  glareOpacity = 0.3,
  glareAngle = -45,
  glareSize = 250,
  transitionDuration = 650,
  playOnce = false,
  className = '',
  style = {},
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  const animateIn = useCallback(() => {
    const el = overlayRef.current;
    if (!el || (playOnce && hasAnimatedRef.current)) return;

    el.style.transition = 'none';
    el.style.backgroundPosition = '-100% -100%, 0 0';
    // Force reflow to apply the initial position without transition
    el.offsetHeight;
    el.style.transition = `${transitionDuration}ms ease`;
    el.style.backgroundPosition = '100% 100%, 0 0';

    if (playOnce) {
      hasAnimatedRef.current = true;
    }
  }, [playOnce, transitionDuration]);

  const animateOut = useCallback(() => {
    const el = overlayRef.current;
    if (!el || (playOnce && hasAnimatedRef.current)) return;

    el.style.transition = `${transitionDuration}ms ease`;
    el.style.backgroundPosition = '-100% -100%, 0 0';
  }, [playOnce, transitionDuration]);

  const overlayStyle = useMemo<CSSProperties>(() => {
    const rgbaColor = hexToRgba(glareColor, glareOpacity);
    return {
      position: 'absolute',
      inset: 0,
      background: `linear-gradient(${glareAngle}deg, hsla(0,0%,0%,0) 60%, ${rgbaColor} 70%, hsla(0,0%,0%,0) 100%)`,
      backgroundSize: `${glareSize}% ${glareSize}%, 100% 100%`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '-100% -100%, 0 0',
      pointerEvents: 'none',
      zIndex: 1, 
    };
  }, [glareColor, glareOpacity, glareAngle, glareSize]);

  return (
    <div
      className={`relative grid place-items-center overflow-hidden cursor-pointer ${className}`}
      style={style}
      onMouseEnter={animateIn}
      onMouseLeave={animateOut}
    >
      <div ref={overlayRef} style={overlayStyle} />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default HoverGlareCard;