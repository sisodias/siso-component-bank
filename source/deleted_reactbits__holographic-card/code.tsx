'use client';

import React, {
  FC,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  CSSProperties,
  ReactNode,
} from 'react';

const ANIMATION_CONFIG = {
  SMOOTH_DURATION: 600,
  INITIAL_DURATION: 1500,
};

const clamp = (val: number, min = 0, max = 100) => Math.min(Math.max(val, min), max);
const round = (val: number, p = 3) => parseFloat(val.toFixed(p));
const adjust = (val: number, fromMin: number, fromMax: number, toMin: number, toMax: number) =>
  round(toMin + ((toMax - toMin) * (val - fromMin)) / (fromMax - fromMin));
const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

interface HolographicCardProps {
  children: ReactNode;
  enableTilt?: boolean;
  className?: string;
}

const HolographicCard: FC<HolographicCardProps> = ({
  children,
  enableTilt = true,
  className = '',
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const animationHandlers = useMemo(() => {
    if (!enableTilt) return null;

    let rafId: number | null = null;

    const updateTransform = (offsetX: number, offsetY: number, card: HTMLElement, wrap: HTMLElement) => {
      const { clientWidth: width, clientHeight: height } = card;
      const percentX = clamp((100 / width) * offsetX);
      const percentY = clamp((100 / height) * offsetY);
      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const props: Record<string, string> = {
        '--pointer-x': `${percentX}%`,
        '--pointer-y': `${percentY}%`,
        '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
        '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
        '--pointer-from-center': `${clamp(Math.hypot(centerY, centerX) / 50, 0, 1)}`,
        '--rotate-x': `${round(-(centerY / 5))}deg`,
        '--rotate-y': `${round(centerX / 4)}deg`,
      };
      Object.entries(props).forEach(([p, v]) => wrap.style.setProperty(p, v));
    };

    const smoothAnimation = (duration: number, startX: number, startY: number, card: HTMLElement, wrap: HTMLElement) => {
      const startTime = performance.now();
      const targetX = wrap.clientWidth / 2;
      const targetY = wrap.clientHeight / 2;

      const loop = (currentTime: number) => {
        const progress = clamp((currentTime - startTime) / duration);
        const eased = easeInOutCubic(progress);
        const currentX = adjust(eased, 0, 1, startX, targetX);
        const currentY = adjust(eased, 0, 1, startY, targetY);
        updateTransform(currentX, currentY, card, wrap);
        if (progress < 1) rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
    };

    return {
      updateTransform,
      smoothAnimation,
      cancel: () => rafId && cancelAnimationFrame(rafId),
    };
  }, [enableTilt]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!cardRef.current || !wrapRef.current || !animationHandlers) return;
    const rect = cardRef.current.getBoundingClientRect();
    animationHandlers.updateTransform(e.clientX - rect.left, e.clientY - rect.top, cardRef.current, wrapRef.current);
  }, [animationHandlers]);

  const handlePointerEnter = useCallback(() => {
    if (!wrapRef.current || !cardRef.current || !animationHandlers) return;
    animationHandlers.cancel();
    wrapRef.current.classList.add('active');
    cardRef.current.classList.add('active');
  }, [animationHandlers]);

  const handlePointerLeave = useCallback((e: React.PointerEvent) => {
    if (!wrapRef.current || !cardRef.current || !animationHandlers) return;
    wrapRef.current.classList.remove('active');
    cardRef.current.classList.remove('active');
    animationHandlers.smoothAnimation(ANIMATION_CONFIG.SMOOTH_DURATION, e.nativeEvent.offsetX, e.nativeEvent.offsetY, cardRef.current, wrapRef.current);
  }, [animationHandlers]);
  
  useEffect(() => {
    if (!enableTilt || !animationHandlers || !wrapRef.current || !cardRef.current) return;

    const wrap = wrapRef.current;
    const card = cardRef.current;
    const { INITIAL_DURATION } = ANIMATION_CONFIG;
    
    const initialX = wrap.clientWidth / 2;
    const initialY = wrap.clientHeight / 2;

    animationHandlers.updateTransform(initialX, initialY, card, wrap);
    animationHandlers.smoothAnimation(INITIAL_DURATION, initialX, initialY, card, wrap);

  }, [enableTilt, animationHandlers]);

  return (
    <div
      ref={wrapRef}
      className={`hc-wrapper ${className}`}
    >
      <div
        ref={cardRef}
        className="hc-card"
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div className="hc-inside">
          <div className="hc-shine" />
          <div className="hc-glare" />
          <div className="hc-content-wrapper">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolographicCard;