"use client";

import { useEffect, useRef } from "react";
import TireWheel from "./scrollwheel-utils/TireWheel";

/**
 * ScrollWheel — la rueda del hero "rueda" con el scroll de la página,
 * además de su giro lento de base. Sensación táctil: la página avanza,
 * la rueda avanza. Respeta prefers-reduced-motion.
 */
export default function ScrollWheel({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.style.transform = `rotate(${window.scrollY * 0.22}deg)`;
        }
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} style={{ willChange: "transform" }}>
      <TireWheel className={className} />
    </div>
  );
}
