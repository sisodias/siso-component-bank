import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

type AnimatedTextPathProps = {
  text?: string;
  duration?: number;
  reversed?: boolean;
  fontSize?: string;
  letterSpacing?: string;
  svgPath?: string;
  viewBox?: string;
  rotation?: number;
  className?: string;
};

const AnimatedTextPath: React.FC<AnimatedTextPathProps> = ({
  text = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do",
  duration = 21,
  reversed = false,
  fontSize = "17px",
  letterSpacing = "-0.47px",
  svgPath = "M227 120C227 142.091 178.871 160 119.5 160C60.1294 160 12 142.091 12 120C12 97.9086 60.1294 80 119.5 80C178.871 80 227 97.9086 227 120Z", 
  viewBox = "0 0 240 240",
  rotation = -40,
  className = ""
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const animationRef = useRef<any>(null);

  useEffect(() => {
    const loadGSAP = async () => {
      if (typeof window !== 'undefined' && !window.gsap) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
        script.onload = () => initAnimation();
        document.head.appendChild(script);
      } else if (window.gsap) {
        initAnimation();
      }
    };

    const initAnimation = () => {
      const { gsap } = window as any;
      const svg = svgRef.current;
      if (!svg || !gsap) return;

      if (animationRef.current) {
        animationRef.current.kill();
      }

      const pathId = `path-${Math.floor(Math.random() * 900000) + 100000}`;
      const path = svg.querySelector('path');

      if (path) {
        gsap.set(path, {
          attr: {
            fill: "none",
            id: pathId,
            stroke: "none"
          }
        });
      }

      const existingTexts = svg.querySelectorAll('text');
      existingTexts.forEach(el => el.remove());

      const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textElement.innerHTML = `
        <textPath href="#${pathId}" startOffset="0%">${text}</textPath>
        <textPath href="#${pathId}" startOffset="0%">${text}</textPath>
      `;
      svg.appendChild(textElement);

      const textPaths = svg.querySelectorAll('textPath');
      gsap.set(textPaths, {
        fontSize: /iPhone/.test(navigator.userAgent) ? "19px" : fontSize,
        letterSpacing: letterSpacing,
        fill: "currentColor"
      });

      const props = {
        duration,
        ease: "none",
        repeat: -1
      };

      const tl = gsap.timeline();
      animationRef.current = tl;

      tl.fromTo(
        textPaths[0],
        { attr: { startOffset: "0%" } },
        { attr: { startOffset: reversed ? "-100%" : "100%" }, ...props },
        0
      );

      tl.fromTo(
        textPaths[1],
        { attr: { startOffset: reversed ? "100%" : "-100%" } },
        { attr: { startOffset: "0%" }, ...props },
        0
      );
    };

    loadGSAP();

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [text, duration, reversed, fontSize, letterSpacing, svgPath]);

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen overflow-hidden text-foreground font-sans ${className}`}>
      <div className="w-[min(95vw,95vh)]">
        <svg
          ref={svgRef}
          viewBox={viewBox}
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            backgroundColor: 'transparent'
          }}
        >
          <path d={svgPath} fill="none" />
        </svg>
      </div>
    </div>
  );
};

export { AnimatedTextPath };