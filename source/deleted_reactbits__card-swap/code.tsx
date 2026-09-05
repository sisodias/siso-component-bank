'use client';

import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  ReactNode,
  HTMLAttributes,
} from 'react';
import gsap from 'gsap';

// --- Type Definitions ---

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface CardSwapProps {
  children: ReactNode;
  width?: number;
  height?: number;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (index: number) => void;
  skewAmount?: number;
  easing?: 'elastic' | 'power';
}

interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

// --- Helper Functions ---

const makeSlot = (
  i: number,
  distX: number,
  distY: number,
  total: number,
): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el: HTMLDivElement, slot: Slot, skew: number): void => {
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true,
  });
};

// --- Child Component: Card ---

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`absolute top-1/2 left-1/2 rounded-xl border p-6 
      bg-neutral-900 text-white border-neutral-700
      dark:bg-black dark:border-neutral-800
      [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden]
      transition-colors duration-300 ${className ?? ''}`.trim()}
    />
  ),
);
Card.displayName = 'Card';

// --- Main Component: CardSwap ---

const CardSwap = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = 'elastic',
  children,
}: CardSwapProps) => {
  const config = useMemo(
    () =>
      easing === 'elastic'
        ? {
            ease: 'elastic.out(0.6,0.9)',
            durDrop: 2,
            durMove: 2,
            durReturn: 2,
            promoteOverlap: 0.9,
            returnDelay: 0.05,
          }
        : {
            ease: 'power1.inOut',
            durDrop: 0.8,
            durMove: 0.8,
            durReturn: 0.8,
            promoteOverlap: 0.45,
            returnDelay: 0.2,
          },
    [easing],
  );

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef<HTMLDivElement>()),
    [childArr.length],
  );
  const order = useRef<number[]>(
    Array.from({ length: childArr.length }, (_, i) => i),
  );
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => {
      if (r.current) {
        placeNow(
          r.current,
          makeSlot(i, cardDistance, verticalDistance, total),
          skewAmount,
        );
      }
    });

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      if (!elFront) return;

      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        y: '+=500',
        duration: config.durDrop,
        ease: config.ease,
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        if (!el) return;
        const slot = makeSlot(i, cardDistance, verticalDistance, total);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease,
          },
          `promote+=${i * 0.15}`,
        );
      });

      const backSlot = makeSlot(total - 1, cardDistance, verticalDistance, total);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(() => gsap.set(elFront, { zIndex: backSlot.zIndex }), [], 'return');
      tl.set(elFront, { x: backSlot.x, z: backSlot.z }, 'return');
      tl.to(
        elFront,
        { y: backSlot.y, duration: config.durReturn, ease: config.ease },
        'return',
      );
      tl.call(() => (order.current = [...rest, front]));
    };

    // Initial animation call
    const timeoutId = setTimeout(swap, 100);
    intervalRef.current = window.setInterval(swap, delay);

    const node = containerRef.current;
    if (pauseOnHover && node) {
      const pause = () => {
        tlRef.current?.pause();
        clearInterval(intervalRef.current);
      };
      const resume = () => {
        tlRef.current?.play();
        intervalRef.current = window.setInterval(swap, delay);
      };
      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);
      return () => {
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
        clearTimeout(timeoutId);
        clearInterval(intervalRef.current);
      };
    }

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalRef.current);
    };
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, config, refs]);

  const renderedChildren = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child as React.ReactElement<any>, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: (e: React.MouseEvent) => {
            child.props.onClick?.(e);
            onCardClick?.(i);
          },
        })
      : child,
  );

  return (
    <div
      ref={containerRef}
      className="absolute bottom-0 right-0 origin-bottom-right perspective-[900px] overflow-visible 
      transform translate-x-[5%] translate-y-[20%] 
      max-[768px]:scale-[0.75] max-[768px]:translate-x-[25%] max-[768px]:translate-y-[25%] 
      max-[480px]:scale-[0.55] max-[480px]:translate-x-[25%] max-[480px]:translate-y-[25%]"
      style={{ width, height }}
    >
      {renderedChildren}
    </div>
  );
};

export default CardSwap;