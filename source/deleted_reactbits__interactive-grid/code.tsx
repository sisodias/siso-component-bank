'use client';

import React, {
  FC,
  useRef,
  useEffect,
  useCallback,
  CSSProperties,
  ComponentPropsWithoutRef,
} from 'react';
import { gsap } from 'gsap';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

gsap.registerPlugin(InertiaPlugin);

interface ComponentProps extends ComponentPropsWithoutRef<'div'> {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  speedTrigger?: number;
  maxSpeed?: number;
  shockRadius?: number;
  shockStrength?: number;
  resistance?: number;
  returnDuration?: number;
}

const Component: FC<ComponentProps> = ({
  dotSize = 10,
  gap = 15,
  baseColor = '#334155',
  activeColor = '#64748B',
  proximity = 120,
  speedTrigger = 100,
  maxSpeed = 5000,
  shockRadius = 250,
  shockStrength = 5,
  resistance = 750,
  returnDuration = 1.5,
  className,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement[]>([]);
  const centresRef = useRef<{ el: HTMLDivElement; x: number; y: number }[]>([]);

  const buildGrid = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';
    dotsRef.current = [];
    centresRef.current = [];

    const { width: w, height: h } = container.getBoundingClientRect();
    const cols = Math.floor((w + gap) / (dotSize + gap));
    const rows = Math.floor((h + gap) / (dotSize + gap));
    const total = cols * rows;

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      (dot as any)._inertiaApplied = false;
      dot.style.width = `${dotSize}px`;
      dot.style.height = `${dotSize}px`;
      dot.style.borderRadius = '50%';
      dot.style.willChange = 'transform, background-color';

      gsap.set(dot, { x: 0, y: 0, backgroundColor: baseColor });
      fragment.appendChild(dot);
      dotsRef.current.push(dot);
    }
    container.appendChild(fragment);

    requestAnimationFrame(() => {
      const containerRect = container.getBoundingClientRect();
      centresRef.current = dotsRef.current.map(el => {
        const r = el.getBoundingClientRect();
        return {
          el,
          x: r.left - containerRect.left + r.width / 2,
          y: r.top - containerRect.top + r.height / 2,
        };
      });
    });
  }, [dotSize, gap, baseColor]);

  useEffect(() => {
    buildGrid();
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(buildGrid);
    ro.observe(container);
    return () => ro.disconnect();
  }, [buildGrid]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastTime = 0;
    let lastX = 0;
    let lastY = 0;

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      const dt = now - (lastTime || now);
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const dx = mouseX - lastX;
      const dy = mouseY - lastY;
      let vx = dt > 0 ? (dx / dt) * 1000 : 0;
      let vy = dt > 0 ? (dy / dt) * 1000 : 0;
      let speed = Math.hypot(vx, vy);

      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        vx *= scale;
        vy *= scale;
      }

      lastTime = now;
      lastX = mouseX;
      lastY = mouseY;

      requestAnimationFrame(() => {
        centresRef.current.forEach(({ el, x, y }) => {
          const dist = Math.hypot(x - mouseX, y - mouseY);
          const interp = Math.max(0, 1 - dist / proximity);
          gsap.to(el, {
            backgroundColor: gsap.utils.interpolate(
              baseColor,
              activeColor,
              interp
            ),
            duration: 0.1,
          });

          if (
            speed > speedTrigger &&
            dist < proximity &&
            !(el as any)._inertiaApplied
          ) {
            (el as any)._inertiaApplied = true;
            const pushX = x - mouseX + vx * 0.005;
            const pushY = y - mouseY + vy * 0.005;

            gsap.to(el, {
              inertia: { x: pushX, y: pushY, resistance },
              onComplete: () => {
                gsap.to(el, {
                  x: 0,
                  y: 0,
                  duration: returnDuration,
                  ease: 'elastic.out(1,0.75)',
                  onComplete: () => {
                    (el as any)._inertiaApplied = false;
                  },
                });
              },
            });
          }
        });
      });
    };

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      centresRef.current.forEach(({ el, x, y }) => {
        const dist = Math.hypot(x - mouseX, y - mouseY);
        if (dist < shockRadius && !(el as any)._inertiaApplied) {
          (el as any)._inertiaApplied = true;
          const falloff = Math.max(0, 1 - dist / shockRadius);
          const pushX = (x - mouseX) * shockStrength * falloff;
          const pushY = (y - mouseY) * shockStrength * falloff;

          gsap.to(el, {
            inertia: { x: pushX, y: pushY, resistance },
            onComplete: () => {
              gsap.to(el, {
                x: 0,
                y: 0,
                duration: returnDuration,
                ease: 'elastic.out(1,0.75)',
                onComplete: () => {
                  (el as any)._inertiaApplied = false;
                },
              });
            },
          });
        }
      });
    };

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('click', onClick);
    return () => {
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('click', onClick);
    };
  }, [
    baseColor,
    activeColor,
    proximity,
    speedTrigger,
    maxSpeed,
    shockRadius,
    shockStrength,
    resistance,
    returnDuration,
  ]);

  const gridContainerStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, ${dotSize}px)`,
    gridAutoRows: `${dotSize}px`,
    gap: `${gap}px`,
    placeContent: 'center',
    placeItems: 'center',
    width: '100%',
    height: '100%',
    position: 'relative',
  };

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} {...props}>
      <div ref={containerRef} style={gridContainerStyle} />
    </div>
  );
};

export default Component;