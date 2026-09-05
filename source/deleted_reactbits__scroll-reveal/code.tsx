import React, { useEffect, useRef, useMemo, ReactNode, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = "",
  textClassName = "",
  rotationEnd = "bottom bottom",
  wordAnimationEnd = "bottom bottom",
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  const splitText = useMemo(() => {
    const text = typeof children === "string" ? children : "";
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) {
        return <span key={index}>{word}</span>;
      }
      return (
        <span className="inline-block scroll-reveal-word" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    triggersRef.current.forEach(trigger => trigger.kill());
    triggersRef.current = [];

    const scroller =
      scrollContainerRef && scrollContainerRef.current
        ? scrollContainerRef.current
        : window;

    const wordElements = el.querySelectorAll<HTMLElement>(".scroll-reveal-word");

    const rotationTrigger = ScrollTrigger.create({
        trigger: el,
        scroller,
        start: "top bottom",
        end: rotationEnd,
        scrub: true,
        animation: gsap.fromTo(el, { transformOrigin: "0% 50%", rotate: baseRotation }, { ease: "none", rotate: 0 })
    });
    triggersRef.current.push(rotationTrigger);

    const opacityTrigger = ScrollTrigger.create({
        trigger: el,
        scroller,
        start: "top bottom-=20%",
        end: wordAnimationEnd,
        scrub: true,
        animation: gsap.fromTo(wordElements, { opacity: baseOpacity, willChange: "opacity" }, { ease: "none", opacity: 1, stagger: 0.05 })
    });
    triggersRef.current.push(opacityTrigger);

    if (enableBlur) {
      const blurTrigger = ScrollTrigger.create({
            trigger: el,
            scroller,
            start: "top bottom-=20%",
            end: wordAnimationEnd,
            scrub: true,
            animation: gsap.fromTo(wordElements, { filter: `blur(${blurStrength}px)` }, { ease: "none", filter: "blur(0px)", stagger: 0.05 })
        });
        triggersRef.current.push(blurTrigger);
    }

    return () => {
      triggersRef.current.forEach((trigger) => trigger.kill());
      triggersRef.current = [];
    };
  }, [
    children,
    scrollContainerRef,
    enableBlur,
    baseRotation,
    baseOpacity,
    rotationEnd,
    wordAnimationEnd,
    blurStrength,
  ]);

  return (
    <h2 ref={containerRef} className={`my-5 ${containerClassName}`}>
      <p
        className={`text-[clamp(1.6rem,4vw,3rem)] leading-[1.5] font-semibold ${textClassName}`}
      >
        {splitText}
      </p>
    </h2>
  );
};