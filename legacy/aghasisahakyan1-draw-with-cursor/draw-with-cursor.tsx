"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

type DrawingType = 'drawOnHold' | 'drawAlways';

interface DrawingCursorEffectProps {
  children?: React.ReactNode;
  bgImageSrc?: string | null;
  strokeColor?: string;
  strokeWidth?: number;
  type: DrawingType;
  followEffect?: boolean;
}

function supportsTouch(): boolean {
  if (typeof window === 'undefined') return false;
  return (('ontouchstart' in window) ||
          (navigator.maxTouchPoints > 0));
}

const DrawingCursorEffect: React.FC<DrawingCursorEffectProps> = ({
  children,
  bgImageSrc = null,
  strokeColor = '#FF9900',
  strokeWidth = 15,
  type,
  followEffect = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRootRef = useRef<SVGSVGElement | null>(null);

  const isDrawingRef = useRef(false);

  const lastPointRef = useRef<{ x: number | null, y: number | null }>({ x: null, y: null });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    if (supportsTouch()) {
      console.log("Drawing cursor effect disabled on touch device.");
      return;
    }

    const svgns = "http://www.w3.org/2000/svg";

    let svgRoot = svgRootRef.current;
    if (!svgRoot) {
      svgRoot = document.createElementNS(svgns, "svg");
      svgRoot.classList.add(
        "absolute", "z-10", "top-0", "left-0", "h-full", "w-full",
        "pointer-events-none",
        "mix-blend-difference"
      );
      element.appendChild(svgRoot);
      svgRootRef.current = svgRoot;
    }

    const createLine = (x1: number, y1: number, x2: number, y2: number): SVGLineElement => {
      const line = document.createElementNS(svgns, "line");
      line.setAttribute("x1", x1.toString());
      line.setAttribute("y1", y1.toString());
      line.setAttribute("x2", x2.toString());
      line.setAttribute("y2", y2.toString());
      line.setAttribute("stroke", strokeColor);
      line.setAttribute("stroke-width", String(strokeWidth));
      line.setAttribute("stroke-linecap", "round");
      line.setAttribute("stroke-linejoin", "round");
      svgRoot!.appendChild(line);
      return line;
    };

    const handleMouseEnter = (event: MouseEvent) => {
        lastPointRef.current = { x: event.offsetX, y: event.offsetY };
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (type === 'drawOnHold' && event.button === 0) {
        isDrawingRef.current = true;
        lastPointRef.current = { x: event.offsetX, y: event.offsetY };
        event.preventDefault();
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!(type === 'drawAlways' || (type === 'drawOnHold' && isDrawingRef.current))) {
         lastPointRef.current = { x: event.offsetX, y: event.offsetY };
         return;
      }

      const currentX = event.offsetX;
      const currentY = event.offsetY;

      if (lastPointRef.current.x === null || lastPointRef.current.y === null) {
           lastPointRef.current = { x: currentX, y: currentY };
           return;
      }

      const prevX = lastPointRef.current.x;
      const prevY = lastPointRef.current.y;

      const dx = currentX - prevX;
      const dy = currentY - prevY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const stepSize = strokeWidth * 0.5;

      if (distance > stepSize) {
        const numSteps = Math.ceil(distance / stepSize);

        const stepX = dx / numSteps;
        const stepY = dy / numSteps;

        for (let i = 1; i <= numSteps; i++) {
          const interX = prevX + i * stepX;
          const interY = prevY + i * stepY;

          const line = createLine(lastPointRef.current.x, lastPointRef.current.y, interX, interY);

          if (followEffect) {
             gsap.to(line, {
                opacity: 0,
                duration: 0.4,
                ease: "power1.out",
                onComplete: () => line.remove(),
             });
          }

          lastPointRef.current = { x: interX, y: interY };
        }
      } else if (distance > 0) {
         const line = createLine(prevX, prevY, currentX, currentY);

         if (followEffect) {
             gsap.to(line, {
                opacity: 0,
                duration: 0.4,
                ease: "power1.out",
                onComplete: () => line.remove(),
             });
         }
         lastPointRef.current = { x: currentX, y: currentY };
      } else {
           lastPointRef.current = { x: currentX, y: currentY };
      }

      lastPointRef.current = { x: currentX, y: currentY };
    };


    const handleMouseUp = (event: MouseEvent) => {
      if (type === 'drawOnHold' && event.button === 0) {
         isDrawingRef.current = false;
      }
    };

    const handleMouseLeave = () => {
      lastPointRef.current = { x: null, y: null };
      if (type === 'drawOnHold') {
           isDrawingRef.current = false;
      }

      const svg = svgRootRef.current;
      if (!svg) return;

      const lines = svg.querySelectorAll("line");

      if (lines.length > 0) {
          gsap.killTweensOf(lines);
      }

      if (!followEffect && lines.length > 0) {
          gsap.to(lines, {
            strokeOpacity: 0,
            duration: 0.3,
            stagger: 0.01,
            ease: "none",
            onComplete: () => {
              if (svgRootRef.current) {
                 lines.forEach(line => {
                    if (line.parentNode === svgRootRef.current) {
                       line.remove();
                    }
                 });
              }
            },
          });
      }
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    if (type === 'drawOnHold') {
        element.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);

      if (type === 'drawOnHold') {
          element.removeEventListener("mousedown", handleMouseDown);
          window.removeEventListener("mouseup", handleMouseUp);
      }

      const svg = svgRootRef.current;
      if (svg) {
          gsap.killTweensOf(svg.querySelectorAll("line"));
          if (svg.parentNode === element) {
             svg.remove();
          }
          svgRootRef.current = null;
      }

      lastPointRef.current = { x: null, y: null };
      isDrawingRef.current = false;
    };

  }, [type, followEffect, strokeColor, strokeWidth]);

  return (
    <div className="w-full min-h-[100vh] mb-[50vh] relative overflow-hidden">

      <div ref={containerRef} className="relative z-0 w-full h-full">

        {bgImageSrc && (
          <img
            src={bgImageSrc}
            loading="lazy"
            alt="Background"
            className="absolute inset-0 object-cover w-full h-full select-none"
          />
        )}

      </div>

      <div className="z-20 pointer-events-none flex flex-col justify-between items-stretch p-8 absolute inset-0">
        {children}
      </div>
    </div>
  );
};

export default DrawingCursorEffect;