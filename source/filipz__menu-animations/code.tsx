'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

// --- GSAP SETUP & ANIMATION CONFIG ---
// This block should only run once in the entire application.
let isGsapInitialized = false;
const initializeGsap = () => {
  if (isGsapInitialized) return;
  gsap.registerPlugin(CustomEase);
  CustomEase.create("circleEase", "0.68, -0.55, 0.265, 1.55");
  isGsapInitialized = true;
};

// --- RENDERERS FOR EACH ANIMATION TYPE ---
const animationRenderers: Record<string, React.FC> = {
  "dots-grid": () => (
    <div className="dots-grid relative h-[60px] w-[60px]">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="dot absolute h-2 w-2 rounded-full bg-foreground" />
      ))}
    </div>
  ),
  "text-morph": () => (
    <div className="text-morph relative h-5 w-[75px]">
      <div className="text-container relative h-full w-[60px] overflow-hidden ml-[15px]">
        <span className="menu absolute flex h-full w-full items-center justify-center text-sm font-bold tracking-wider text-foreground">MENU</span>
        <span className="close absolute flex h-full w-full items-center justify-center text-sm font-bold tracking-wider text-foreground">CLOSE</span>
      </div>
      <div className="circle absolute left-0 top-1/2 z-10 h-2 w-2 -translate-y-1/2 rounded-full bg-foreground" />
    </div>
  ),
  "plus-morph": () => (
    <div className="plus-morph relative flex h-[60px] w-[60px] items-center justify-center">
      <div className="horizontal absolute left-1/2 top-1/2 h-1 w-[30px] origin-center -translate-x-1/2 -translate-y-1/2 bg-foreground" />
      <div className="vertical absolute left-1/2 top-1/2 h-[30px] w-1 origin-center -translate-x-1/2 -translate-y-1/2 bg-foreground" />
    </div>
  ),
  "circle-pulse": () => (
    <div className="circle-pulse relative h-[60px] w-[60px] overflow-visible">
      <div className="circle absolute left-1/2 top-1/2 z-[3] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground" />
      <div className="ring absolute left-1/2 top-1/2 z-[2] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground" />
      <div className="wave absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/50" />
      <div className="particles absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="particle absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground bg-transparent" />
        ))}
      </div>
    </div>
  ),
  "cube-spin": () => (
    <div className="cube-spin flex h-[60px] w-[60px] items-center justify-center" style={{ perspective: '200px' }}>
      <div className="cube absolute h-10 w-10" style={{ transformStyle: 'preserve-3d' }}>
        <div className="face front absolute flex h-10 w-10 items-center justify-center border-2 border-foreground/60">
          <div className="plus-symbol relative h-[26px] w-[26px]">
            <div className="horizontal absolute left-1/2 top-1/2 h-1 w-full -translate-x-1/2 -translate-y-1/2 bg-foreground" />
            <div className="vertical absolute left-1/2 top-1/2 h-full w-1 -translate-x-1/2 -translate-y-1/2 bg-foreground" />
          </div>
        </div>
        <div className="face right absolute flex h-10 w-10 items-center justify-center border-2 border-foreground/60">
          <div className="x-symbol relative h-[26px] w-[26px]">
            <div className="absolute left-1/2 top-1/2 h-1 w-[30px] origin-center -translate-x-1/2 -translate-y-1/2 rotate-45 bg-foreground" />
            <div className="absolute left-1/2 top-1/2 h-1 w-[30px] origin-center -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-foreground" />
          </div>
        </div>
        <div className="face back absolute h-10 w-10 border-2 border-foreground/60" />
        <div className="face left absolute h-10 w-10 border-2 border-foreground/60" />
      </div>
    </div>
  ),
  "stacked-circles": () => (
    <div className="stacked-circles relative flex h-[60px] w-[60px] items-center justify-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="circle absolute left-1/2 top-1/2 h-6 w-6 rounded-full bg-foreground" />
      ))}
    </div>
  ),
  "rotating-circles": () => (
    <div className="rotating-circles relative flex h-[60px] w-[60px] items-center justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="circle absolute h-[10px] w-[10px] rounded-full bg-foreground" />
      ))}
    </div>
  ),
  "isometric-cube": () => (
    <div className="isometric-cube flex h-[60px] w-[60px] items-center justify-center" style={{ perspective: '1200px' }}>
      <div className="cube absolute h-[30px] w-[30px]" style={{ transformStyle: 'preserve-3d' }}>
        <div className="face front absolute flex h-full w-full items-center justify-center border border-foreground/50 bg-[#222] [box-shadow:0_0_10px_rgba(0,0,0,0.5)_inset]">
          <div className="plus-symbol relative h-3 w-3">
             <div className="horizontal absolute left-1/2 top-1/2 h-[2px] w-full -translate-x-1/2 -translate-y-1/2 bg-foreground" />
             <div className="vertical absolute left-1/2 top-1/2 h-full w-[2px] -translate-x-1/2 -translate-y-1/2 bg-foreground" />
          </div>
        </div>
        <div className="face back absolute flex h-full w-full items-center justify-center border border-foreground/50 bg-[#222] [box-shadow:0_0_10px_rgba(0,0,0,0.5)_inset]">
           <div className="x-symbol relative h-3 w-3">
             <div className="absolute left-1/2 top-1/2 h-[2px] w-full origin-center -translate-x-1/2 -translate-y-1/2 rotate-45 bg-foreground" />
             <div className="absolute left-1/2 top-1/2 h-[2px] w-full origin-center -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-foreground" />
           </div>
        </div>
        <div className="face right absolute h-full w-full border border-foreground/50 bg-[#222] [box-shadow:0_0_10px_rgba(0,0,0,0.5)_inset]" />
        <div className="face left absolute h-full w-full border border-foreground/50 bg-[#222] [box-shadow:0_0_10px_rgba(0,0,0,0.5)_inset]" />
        <div className="face top absolute h-full w-full border border-foreground/50 bg-[#222] [box-shadow:0_0_10px_rgba(0,0,0,0.5)_inset]" />
        <div className="face bottom absolute h-full w-full border border-foreground/50 bg-[#222] [box-shadow:0_0_10px_rgba(0,0,0,0.5)_inset]" />
      </div>
    </div>
  ),
  "expanding-circles": () => (
    <div className="expanding-circles relative flex h-[60px] w-[60px] items-center justify-center">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={`extra-${i}`} className="circle extra absolute h-2 w-2 rounded-full bg-foreground" />
      ))}
       {Array.from({ length: 12 }).map((_, i) => (
        <div key={`micro-${i}`} className="circle micro absolute h-1 w-1 rounded-full bg-foreground" />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={`main-${i}`} className="circle absolute h-2 w-2 rounded-full bg-foreground" />
      ))}
    </div>
  ),
};

const animationConfigs = {
    // All GSAP animation configs from original JS are here...
    // I'll define one for brevity, the full code will have all of them.
    "dots-grid": {
        init: (el: HTMLElement) => gsap.set(el.querySelectorAll(".dot"), { scale: 1, opacity: 1, x: 0, y: 0 }),
        activate: (el: HTMLElement) => {
            const dots = el.querySelectorAll(".dot");
            gsap.to(dots[0], { x: 30, y: 30, scale: 1.2, ease: "circleEase", duration: 0.6 });
            gsap.to(dots[1], { opacity: 0, scale: 5, ease: "circleEase", duration: 0.6 });
            gsap.to(dots[2], { x: -30, y: 30, scale: 1.2, ease: "circleEase", duration: 0.6 });
            gsap.to(dots[3], { opacity: 0, scale: 5, ease: "circleEase", duration: 0.6 });
            gsap.to(dots[4], { scale: 1.2, ease: "circleEase", duration: 0.6 });
            gsap.to(dots[5], { opacity: 0, scale: 5, ease: "circleEase", duration: 0.3 });
            gsap.to(dots[6], { x: 30, y: -30, scale: 1.2, ease: "circleEase", duration: 0.6 });
            gsap.to(dots[7], { opacity: 0, scale: 5, ease: "circleEase", duration: 0.6 });
            gsap.to(dots[8], { x: -30, y: -30, scale: 1.2, ease: "circleEase", duration: 0.6 });
        },
        deactivate: (el: HTMLElement) => gsap.to(el.querySelectorAll(".dot"), { x: 0, y: 0, scale: 1, opacity: 1, ease: "circleEase", duration: 0.6 }),
    },
    "text-morph": {
        init: (el: HTMLElement) => {
            gsap.set(el.querySelector(".menu"), { y: 0 });
            gsap.set(el.querySelector(".close"), { y: 20 });
            gsap.set(el.querySelector(".circle"), { x: 0, scaleX: 1, borderRadius: "50%" });
        },
        activate: (el: HTMLElement) => {
            gsap.to(el.querySelector(".menu"), { y: -20, ease: "power2.inOut", duration: 0.5 });
            gsap.to(el.querySelector(".close"), { y: 0, ease: "power2.inOut", duration: 0.5 });
            const tl = gsap.timeline();
            tl.to(el.querySelector(".circle"), { x: -20, scaleX: 2.5, borderRadius: "4px", ease: "power1.out", duration: 0.2 })
              .to(el.querySelector(".circle"), { x: 0, scaleX: 1, borderRadius: "50%", ease: "power1.in", duration: 0.2 }, ">=0");
        },
        deactivate: (el: HTMLElement) => {
            gsap.to(el.querySelector(".menu"), { y: 0, ease: "power2.inOut", duration: 0.5 });
            gsap.to(el.querySelector(".close"), { y: 20, ease: "power2.inOut", duration: 0.5 });
            const tl = gsap.timeline();
            tl.to(el.querySelector(".circle"), { x: -20, scaleX: 2.5, borderRadius: "4px", ease: "power1.out", duration: 0.2 })
              .to(el.querySelector(".circle"), { x: 0, scaleX: 1, borderRadius: "50%", ease: "power1.in", duration: 0.2 }, ">=0");
        },
    },
    "plus-morph": {
        init: (el: HTMLElement) => {
            gsap.set(el, { rotation: 0 });
        },
        activate: (el: HTMLElement) => {
            gsap.to(el, { rotation: 405, ease: "power1.inOut", duration: 0.7 });
        },
        deactivate: (el: HTMLElement) => {
            gsap.to(el, { rotation: 0, ease: "power1.inOut", duration: 0.7 });
        },
    },
    "circle-pulse": {
        init: (el: HTMLElement) => {
            gsap.set(el.querySelector(".circle"), { scale: 1 });
            gsap.set(el.querySelector(".ring"), { scale: 0.5, opacity: 0 });
            gsap.set(el.querySelector(".wave"), { scale: 0.5, opacity: 0 });
            gsap.set(el.querySelectorAll(".particle"), { x: 0, y: 0, scale: 1, opacity: 1 });
        },
        activate: (el: HTMLElement) => {
            gsap.to(el.querySelector(".circle"), { scale: 0.7, ease: "power2.out", duration: 0.4 });
            gsap.to(el.querySelector(".ring"), { scale: 1.5, opacity: 0.8, ease: "power2.out", duration: 0.5 });
            gsap.to(el.querySelector(".wave"), { scale: 2.5, opacity: 0.4, ease: "power1.out", duration: 0.8 });
            const particles = el.querySelectorAll(".particle");
            particles.forEach((particle, i) => {
                const angle = (i / particles.length) * Math.PI * 2;
                gsap.to(particle, { x: Math.cos(angle) * 24, y: Math.sin(angle) * 24, ease: "power2.out", duration: 0.5, delay: i * 0.05 });
            });
        },
        deactivate: (el: HTMLElement) => {
            gsap.to(el.querySelector(".circle"), { scale: 1, ease: "power2.out", duration: 0.4 });
            gsap.to(el.querySelector(".ring"), { scale: 0.5, opacity: 0, ease: "power2.in", duration: 0.4 });
            gsap.to(el.querySelector(".wave"), { scale: 0.5, opacity: 0, ease: "power2.in", duration: 0.4 });
            gsap.to(el.querySelectorAll(".particle"), { x: 0, y: 0, ease: "power2.in", duration: 0.4 });
        },
    },
    "cube-spin": {
        init: (el: HTMLElement) => gsap.set(el.querySelector(".cube"), { rotationY: 0 }),
        activate: (el: HTMLElement) => gsap.to(el.querySelector(".cube"), { rotationY: -450, ease: "circleEase", duration: 1.2 }),
        deactivate: (el: HTMLElement) => gsap.to(el.querySelector(".cube"), { rotationY: 0, ease: "circleEase", duration: 1.2 }),
    },
    "stacked-circles": {
        init: (el: HTMLElement) => {
             const circles = el.querySelectorAll(".circle");
             const positions = [0, 5, 10, 15, 20];
             circles.forEach((circle, i) => gsap.set(circle, { x: `calc(-50% + ${positions[i]}px)`, y: '-50%' }));
        },
        activate: (el: HTMLElement) => {
            const circles = el.querySelectorAll(".circle");
            const positions = [-40, -20, 0, 20, 40];
            circles.forEach((circle, i) => gsap.to(circle, { x: `calc(-50% + ${positions[i]}px)`, ease: "circleEase", duration: 0.6 }));
        },
        deactivate: (el: HTMLElement) => {
            const circles = el.querySelectorAll(".circle");
            const positions = [0, 5, 10, 15, 20];
            circles.forEach((circle, i) => gsap.to(circle, { x: `calc(-50% + ${positions[i]}px)`, ease: "circleEase", duration: 0.6 }));
        },
    },
    "rotating-circles": {
        init: (el: HTMLElement) => {
            const circles = el.querySelectorAll(".circle");
            circles.forEach((circle, index) => {
                gsap.set(circle, { x: (index - 2.5) * 8, y: 0, scale:1, opacity: 1 - index * 0.1, zIndex: 6 - index, transform: 'translate(-50%, -50%)' });
            });
        },
        activate: (el: HTMLElement) => {
            const circles = el.querySelectorAll(".circle");
            gsap.to(circles, {
                duration: 0.6,
                rotation: (i) => i * (360/6),
                transformOrigin: "0px 15px",
                ease: "circleEase",
                stagger: 0.05
            });
        },
        deactivate: (el: HTMLElement) => {
             const circles = el.querySelectorAll(".circle");
             gsap.to(circles, {
                duration: 0.6,
                rotation: 0,
                ease: "circleEase",
                stagger: {
                    amount: 0.3,
                    from: "end"
                }
            });
        },
    },
    "isometric-cube": {
        init: (el: HTMLElement) => gsap.set(el.querySelector(".cube"), { rotateX: 35.264, rotateY: 45, rotateZ: 0 }),
        activate: (el: HTMLElement) => gsap.to(el.querySelector(".cube"), { rotateY: 45 + 180, duration: 0.8, ease: "power2.inOut" }),
        deactivate: (el: HTMLElement) => gsap.to(el.querySelector(".cube"), { rotateY: 45, duration: 0.8, ease: "power2.inOut" }),
    },
    "expanding-circles": {
        init: (el: HTMLElement) => {
            const mainCircles = el.querySelectorAll('.circle:not(.extra):not(.micro)');
            gsap.set(el, { rotation: 0 });
            gsap.set(el.querySelectorAll('.circle'), { scale: 0, opacity: 0, xPercent: -50, yPercent: -50 });
            mainCircles.forEach((circle, i) => {
              const angle = (i * 60) * (Math.PI / 180);
              gsap.set(circle, {
                x: Math.cos(angle) * 15,
                y: Math.sin(angle) * 15,
                scale: 1,
                opacity: 1,
              });
            });
        },
        activate: (el: HTMLElement) => {
            const allCircles = el.querySelectorAll('.circle');
            gsap.timeline()
                .to(el, { rotation: 360, duration: 1.2, ease: "power1.inOut" })
                .to(allCircles, {
                    scale: 1,
                    opacity: 1,
                    stagger: 0.02,
                    duration: 0.3,
                    ease: 'power2.out',
                    transformOrigin: 'center center'
                }, 0.1);
        },
        deactivate: (el: HTMLElement) => {
             const mainCircles = el.querySelectorAll('.circle:not(.extra):not(.micro)');
             const otherCircles = el.querySelectorAll('.circle.extra, .circle.micro');
             gsap.timeline()
                .to(el, { rotation: 0, duration: 1.2, ease: "power1.inOut" })
                .to(otherCircles, { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.in' }, 0)
                .to(mainCircles, { scale: 1, opacity: 1, duration: 0.3 }, 0.1);
        },
    }
};

// --- CORNER DECORATION COMPONENT ---
const Corner = ({ position, rotation }: { position: string; rotation: string }) => (
  <div className={`absolute h-4 w-4 text-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${position}`} style={{ transform: rotation }}>
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path fill="currentColor" d="M12 4V12H4V14H14V4H12Z"></path>
    </svg>
  </div>
);

// --- MAIN COMPONENT ---
interface MenuAnimationProps {
  title: string;
  animationId: keyof typeof animationConfigs;
}

export const MenuAnimation: React.FC<MenuAnimationProps> = ({ title, animationId }) => {
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<HTMLDivElement>(null);
  const config = useMemo(() => animationConfigs[animationId], [animationId]);
  const AnimationComponent = useMemo(() => animationRenderers[animationId], [animationId]);

  useEffect(() => {
    initializeGsap();
  }, []);

  useEffect(() => {
    if (animationRef.current && config?.init) {
      config.init(animationRef.current);
    }
  }, [config]);

  const handleClick = () => {
    if (!animationRef.current || !config) return;
    if (isActive) {
      config.deactivate?.(animationRef.current);
    } else {
      config.activate?.(animationRef.current);
    }
    setIsActive(!isActive);
  };

  if (!AnimationComponent) {
    return <div>Error: Animation "{animationId}" not found.</div>;
  }

  return (
    <div ref={containerRef} className="group relative flex h-[220px] w-[220px] flex-col items-center overflow-visible border border-foreground/10 bg-black/50 p-2.5 transition-colors duration-300 hover:border-foreground/30">
      <Corner position="top-[-8px] left-[-8px]" rotation="rotate(0deg)" />
      <Corner position="top-[-8px] right-[-8px]" rotation="rotate(90deg)" />
      <Corner position="bottom-[-8px] left-[-8px]" rotation="rotate(-90deg)" />
      <Corner position="bottom-[-8px] right-[-8px]" rotation="rotate(180deg)" />
      
      <div className="mb-[30px] text-center text-xs uppercase tracking-[0.5px]">{title}</div>
      <div className="m-auto flex cursor-pointer items-center justify-center" onClick={handleClick} ref={animationRef}>
        <AnimationComponent />
      </div>
    </div>
  );
};