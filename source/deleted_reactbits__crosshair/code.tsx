"use client"; 

import React, { useEffect, useRef, RefObject, FC, useImperativeHandle, forwardRef } from "react";
import { gsap } from "gsap";

const lerp = (a: number, b: number, n: number): number => (1 - n) * a + n * b;

const getMousePos = (
  e: Event,
  container?: HTMLElement | null
): { x: number; y: number } => {
  const mouseEvent = e as MouseEvent;
  if (container) {
    const bounds = container.getBoundingClientRect();
    return {
      x: mouseEvent.clientX - bounds.left,
      y: mouseEvent.clientY - bounds.top,
    };
  }
  return { x: mouseEvent.clientX, y: mouseEvent.clientY };
};

interface CrosshairProps {
  color?: string; 
  containerRef?: RefObject<HTMLElement | null>; 
  lineThickness?: string; 
}

export interface CrosshairHandle {
  triggerFuzzyEffect: () => void;
}

export const Crosshair = forwardRef<CrosshairHandle, CrosshairProps>(({ 
  color = "white", 
  containerRef,    
  lineThickness = "1px", 
}, ref) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const lineHorizontalRef = useRef<HTMLDivElement>(null);
  const lineVerticalRef = useRef<HTMLDivElement>(null);
  const filterXRef = useRef<SVGFETurbulenceElement>(null);
  const filterYRef = useRef<SVGFETurbulenceElement>(null);

  const mouse = useRef({ x: 0, y: 0 }).current; 
  const renderedStyles = useRef({
    tx: { previous: 0, current: 0, amt: 0.15 },
    ty: { previous: 0, current: 0, amt: 0.15 },
  }).current;
  const animationFrameId = useRef<number | null>(null);
  const fuzzyTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useImperativeHandle(ref, () => ({
    triggerFuzzyEffect: () => {
      if (fuzzyTimelineRef.current) {
        fuzzyTimelineRef.current.restart();
      }
    }
  }));

  useEffect(() => {
    const targetElement: HTMLElement | Window = containerRef?.current || window;
    let initialMoveDone = false;

    const handleVisibility = (ev: MouseEvent) => {
        const isFixedCrosshair = !containerRef?.current;
        if (isFixedCrosshair) { 
             gsap.to(
                [lineHorizontalRef.current, lineVerticalRef.current].filter(Boolean),
                { opacity: 1, duration: 0.3 }
            );
            return;
        }
        if (containerRef?.current) {
            const bounds = containerRef.current.getBoundingClientRect();
            const isInside = 
                ev.clientX >= bounds.left &&
                ev.clientX <= bounds.right &&
                ev.clientY >= bounds.top &&
                ev.clientY <= bounds.bottom;
            gsap.to(
                [lineHorizontalRef.current, lineVerticalRef.current].filter(Boolean),
                { opacity: isInside ? 1 : 0, duration: 0.3 }
            );
        }
    };
    
    const updateMousePosition = (ev: Event) => {
        mouse.x = getMousePos(ev, containerRef?.current).x;
        mouse.y = getMousePos(ev, containerRef?.current).y;
        handleVisibility(ev as MouseEvent); 
    };

    const onInitialMouseMove = (ev: Event) => {
      updateMousePosition(ev); 
      if (!initialMoveDone) { 
        renderedStyles.tx.previous = renderedStyles.tx.current = mouse.x;
        renderedStyles.ty.previous = renderedStyles.ty.current = mouse.y;
        startRendering();
        initialMoveDone = true;
      }
      targetElement.addEventListener("mousemove", updateMousePosition); 
      targetElement.removeEventListener("mousemove", onInitialMouseMove); 
    };
    
    targetElement.addEventListener("mousemove", onInitialMouseMove);
    
    if (containerRef?.current) { 
        containerRef.current.addEventListener("mouseleave", () => {
             gsap.to(
                [lineHorizontalRef.current, lineVerticalRef.current].filter(Boolean),
                { opacity: 0, duration: 0.3 }
            );
        });
    }

    const primitiveValues = { turbulence: 0 };
    const tl = gsap.timeline({
        paused: true,
        onStart: () => {
            if (lineHorizontalRef.current) lineHorizontalRef.current.style.filter = `url(#filter-noise-x-crosshair)`;
            if (lineVerticalRef.current) lineVerticalRef.current.style.filter = `url(#filter-noise-y-crosshair)`;
        },
        onUpdate: () => {
            if (filterXRef.current) filterXRef.current.setAttribute("baseFrequency", primitiveValues.turbulence.toString());
            if (filterYRef.current) filterYRef.current.setAttribute("baseFrequency", primitiveValues.turbulence.toString());
        },
        onComplete: () => {
            if (lineHorizontalRef.current) lineHorizontalRef.current.style.filter = "none";
            if (lineVerticalRef.current) lineVerticalRef.current.style.filter = "none";
        },
      }).to(primitiveValues, { duration: 0.4, ease: "power1.inOut", startAt: { turbulence: 0.8 }, turbulence: 0 }); 
    
    fuzzyTimelineRef.current = tl; 

    const linksNodeList: NodeListOf<HTMLAnchorElement> = (containerRef?.current || document).querySelectorAll("a");
    const links = Array.from(linksNodeList); 
    const enterLink = () => { if(fuzzyTimelineRef.current) fuzzyTimelineRef.current.restart(); };
    const leaveLink = () => { if(fuzzyTimelineRef.current) fuzzyTimelineRef.current.progress(1).pause(); }; 
    links.forEach((link) => { link.addEventListener("mouseenter", enterLink); link.addEventListener("mouseleave", leaveLink); });


    const render = () => {
      renderedStyles.tx.current = mouse.x;
      renderedStyles.ty.current = mouse.y;
      for (const key in renderedStyles) {
        const style = renderedStyles[key as keyof typeof renderedStyles]; 
        style.previous = lerp(style.previous, style.current, style.amt);
      }
      if (lineHorizontalRef.current && lineVerticalRef.current) {
        gsap.set(lineVerticalRef.current, { x: renderedStyles.tx.previous });
        gsap.set(lineHorizontalRef.current, { y: renderedStyles.ty.previous });
      }
      animationFrameId.current = requestAnimationFrame(render);
    };

    function startRendering() { if (animationFrameId.current === null) { animationFrameId.current = requestAnimationFrame(render); } }
    function stopRendering() { if (animationFrameId.current !== null) { cancelAnimationFrame(animationFrameId.current); animationFrameId.current = null; } }
    gsap.set( [lineHorizontalRef.current, lineVerticalRef.current].filter(Boolean), { opacity: 0 } );

    return () => {
      targetElement.removeEventListener("mousemove", updateMousePosition);
      targetElement.removeEventListener("mousemove", onInitialMouseMove);
      if (containerRef?.current) {
         containerRef.current.removeEventListener("mouseleave", () => {
             gsap.to([lineHorizontalRef.current, lineVerticalRef.current].filter(Boolean), { opacity: 0 });
         });
      }
      links.forEach((link) => { link.removeEventListener("mouseenter", enterLink); link.removeEventListener("mouseleave", leaveLink); });
      stopRendering();
      if (fuzzyTimelineRef.current) fuzzyTimelineRef.current.kill(); 
    };
  }, [containerRef, mouse, renderedStyles]); 

  return (
    <div ref={cursorRef} className={`${ containerRef?.current ? "absolute" : "fixed" } top-0 left-0 w-full h-full pointer-events-none z-[10000] overflow-hidden`} >
      <svg className="absolute w-0 h-0 -z-10 pointer-events-none"> 
        <defs>
          <filter id="filter-noise-x-crosshair"> 
            <feTurbulence type="fractalNoise" baseFrequency="0.000001" numOctaves="1" seed="1" ref={filterXRef} />
            <feDisplacementMap in="SourceGraphic" scale="30" /> 
          </filter>
          <filter id="filter-noise-y-crosshair"> 
            <feTurbulence type="fractalNoise" baseFrequency="0.000001" numOctaves="1" seed="2" ref={filterYRef} />
            <feDisplacementMap in="SourceGraphic" scale="30" /> 
          </filter>
        </defs>
      </svg>
      <div ref={lineHorizontalRef} className={`absolute w-full pointer-events-none opacity-0`} style={{ background: color, height: lineThickness, left: 0, transform: 'translateY(-50%)' }} ></div>
      <div ref={lineVerticalRef} className={`absolute h-full pointer-events-none opacity-0`} style={{ background: color, width: lineThickness, top: 0, transform: 'translateX(-50%)' }} ></div>
    </div>
  );
});

Crosshair.displayName = "Crosshair";