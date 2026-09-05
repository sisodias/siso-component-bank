"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from 'react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
// Note: SplitText is a GSAP premium plugin
import { SplitText } from "gsap/dist/SplitText";

/**
 * Interface for the AnimatedFall component props
 */
interface BlockText {
  children: React.ReactNode;
  delay?: number;
  color?: string;
  className?: string;
}

/**
 * Reusable Fall Animation Component
 * Converts children text into words that "fall" away as color boxes on scroll.
 */
const AnimatedFall: React.FC<BlockText> = ({ 
  children, 
  delay = 0, 
  color = "#ededed",
  className = "" 
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger, SplitText);

    if (!elementRef.current || !textRef.current) return;

    const element = elementRef.current;
    const textTarget = textRef.current;

    const ctx = gsap.context(() => {
      let colorBoxes: HTMLDivElement[] = [];

      // Split text into words
      const split = new SplitText(textTarget, { type: "words" });
      const words = split.words;

      colorBoxes = words.map((word) => {
        // Apply initial styles via GSAP to ensure layout stability
        gsap.set(word, {
          display: "inline-block",
          position: "relative",
        });

        const wordRect = word.getBoundingClientRect();

        // Create the "Falling" color box overlay
        const colorBox = document.createElement("div");
        
        // Manual styling converted from inline styles to JS-managed styles
        // for exact positioning relative to word bounding box
        Object.assign(colorBox.style, {
          position: "absolute",
          top: "0",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: "10",
          width: `${wordRect.width * 1.1}px`,
          height: `${wordRect.height * 0.9}px`,
          backgroundColor: color,
          borderRadius: "0.5vw",
          pointerEvents: "none",
        });

        word.appendChild(colorBox);
        return colorBox;
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "bottom 30%",
          toggleActions: "play none none reverse",
        },
        delay: delay,
        onComplete: () => {
          colorBoxes.forEach((box) => {
            box.style.display = "none";
          });
        }
      });

      tl.to(colorBoxes, {
        y: () => gsap.utils.random(1200, 1600),
        x: () => gsap.utils.random(-150, 150),
        rotation: () => gsap.utils.random(-360, 360),
        duration: 1,
        ease: "power2.in",
        stagger: 0.02,
      });

    }, elementRef);

    return () => ctx.revert();
  }, [delay, color]);

  return (
    <div ref={elementRef} className={`relative overflow-hidden ${className}`}>
      <div ref={textRef} className="inline-block">
        {children}
      </div>
    </div>
  );
};

/**
 * Main Structure Component
 * Combines the Layout and the Animated Content
 */
export default function AnimatedFallStructure() {
  return (
    <main className="min-h-screen w-full bg-neutral-950 text-neutral-100 selection:bg-white selection:text-black">
      {/* Hero Section */}
      <section className="flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
        <AnimatedFall 
          color="#ffffff" 
          className="max-w-4xl"
        >
          <h1 className="font-tanker text-6xl font-normal leading-[0.9] tracking-tighter sm:text-8xl md:text-9xl uppercase">
            Experience the <br /> Fluid Motion
          </h1>
        </AnimatedFall>
        
        <div className="mt-12 max-w-2xl">
          <AnimatedFall delay={0.5} color="#4ade80">
            <p className="text-lg text-neutral-400 md:text-xl">
              Using GSAP and Tailwind CSS to create immersive web experiences 
              with smooth typography animations.
            </p>
          </AnimatedFall>
        </div>
      </section>

      {/* Content Section */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-32 md:grid-cols-2">
        <div className="flex flex-col justify-center space-y-6">
          <AnimatedFall color="#fbbf24">
            <h2 className="font-tanker text-4xl uppercase md:text-6xl">
              Precision and Performance
            </h2>
          </AnimatedFall>
          <AnimatedFall delay={0.2}>
            <p className="text-neutral-500">
              This component utilizes GSAP's ScrollTrigger for high-performance 
              parallax and scroll-bound animations.
            </p>
          </AnimatedFall>
        </div>

        <div className="h-[400px] w-full rounded-2xl bg-neutral-900 flex items-center justify-center border border-neutral-800">
            <AnimatedFall color="#ef4444">
                <span className="font-tanker text-2xl uppercase">Interactive Canvas</span>
            </AnimatedFall>
        </div>
      </section>

      {/* Footer-like Section */}
      <section className="flex h-screen items-center justify-center bg-neutral-100 text-neutral-900">
        <AnimatedFall color="#000000">
          <h2 className="font-tanker text-7xl uppercase md:text-[12rem]">
            Finish
          </h2>
        </AnimatedFall>
      </section>
    </main>
  );
}
