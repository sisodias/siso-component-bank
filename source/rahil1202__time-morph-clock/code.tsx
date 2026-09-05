"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Attempts to register MorphSVGPlugin.
 * If not installed (Club plugin), we gracefully continue with a no-op morph.
 */
function useMorphSVG() {
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const mod = await import("gsap/MorphSVGPlugin"); // requires Club GreenSock
        if (!mounted) return;
        // @ts-ignore
        gsap.registerPlugin(mod.MorphSVGPlugin);
      } catch {
        // Fallback: do nothing; component still renders (just no morph animation).
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.warn(
            "[TimeClock] MorphSVGPlugin not found. Install `gsap` club plugin to enable morphing."
          );
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
}

type Props = {
  /** Background color behind the whole block */
  bg?: string;
  /** Foreground “fill” color for the morphing bars */
  accent?: string;
  /** Gradient color (top/bottom) inside each digit tile */
  gradient?: string;
  /** Tailwind classes to size/position container */
  className?: string;
  /** 24h or 12h display */
  use24h?: boolean;
  /** Update interval (ms). Default 1000. */
  tickMs?: number;
};

const DIGIT_TARGETS: Array<{ path1: string; path2: string }> = [
  // 0..9, same data as source (two target shapes per digit)
  { path1: "M640 400H150V160h490v240z", path2: "M640 640H150V400h490v240z" },
  { path2: "M320 640H0V160h320v480z", path1: "M800 640H480V0h320v640z" },
  { path1: "M640 320H0V160h640v160z", path2: "M800 640H160V480h640v160z" },
  { path1: "M640 320H0V160h640v160z", path2: "M640 640H0V480h640v160z" },
  { path1: "M640 320H160V0h480v320z", path2: "M640 800H0V480h640v320z" },
  { path1: "M800 320H160V160h640v160z", path2: "M640 640H0V480h640v160z" },
  { path1: "M800 320H160V160h640v160z", path2: "M640 640H160V480h480v160z" },
  { path1: "M640 480H0V160h640v320z", path2: "M640 800H0V480h640v320z" },
  { path1: "M640 320H160V160h480v160z", path2: "M640 640H160V480h480v160z" },
  { path1: "M640 320H160V160h480v160z", path2: "M640 640H0V480h640v160z" },
];

function pad2(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

function useNow(tickMs: number) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), Math.max(16, tickMs));
    return () => clearInterval(id);
  }, [tickMs]);
  return now;
}

function Divider({
  gradient,
}: {
  gradient: string;
}) {
  const colonRef = useRef<SVGPathElement | null>(null);

  useGSAP(() => {
    // blink colon
    if (!colonRef.current) return;
    gsap.to(colonRef.current, {
      opacity: 0,
      repeat: -1,
      yoyo: true,
      duration: 0.6,
      ease: "none",
    });
  });

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 800"
      className="w-[18vw] max-w-[180px] min-w-[100px]"
      aria-hidden
    >
      <defs>
        <linearGradient id="clock-grad-divider" x1="400" y1="0" x2="400" y2="800" gradientUnits="userSpaceOnUse">
          <stop offset={0} stopColor={gradient} />
          <stop offset={0.5} stopColor="#fff" stopOpacity={0} />
          <stop offset={1} stopColor={gradient} />
        </linearGradient>
      </defs>
      <path
        ref={colonRef}
        d="M555.56,800H244.44v-311.11h311.11v311.11ZM555.56,311.11H244.44S244.44,0,244.44,0h311.11v311.11Z"
        fill={gradient}
        opacity={0.6}
      />
    </svg>
  );
}

function Digit({
  digit,
  accent,
  gradient,
  delayIndex = 0,
}: {
  digit: number;
  accent: string;
  gradient: string;
  delayIndex?: number;
}) {
  const path1Ref = useRef<SVGPathElement | null>(null);
  const path2Ref = useRef<SVGPathElement | null>(null);

  // Morph on digit change
  useGSAP(
    () => {
      const t = DIGIT_TARGETS[digit] ?? DIGIT_TARGETS[0];
      const hasMorph = "MorphSVGPlugin" in gsap; // registered?

      if (hasMorph) {
        gsap.to(path1Ref.current, {
          // @ts-ignore
          morphSVG: { shape: t.path1 },
          duration: 0.9,
          delay: delayIndex * 0.08,
          ease: "expo.inOut",
        });
        gsap.to(path2Ref.current, {
          // @ts-ignore
          morphSVG: { shape: t.path2 },
          duration: 0.9,
          delay: delayIndex * 0.08,
          ease: "expo.inOut",
        });
      } else {
        // Fallback: quick fade swap
        gsap.to([path1Ref.current, path2Ref.current], {
          opacity: 0,
          duration: 0.15,
          yoyo: true,
          repeat: 1,
          onRepeat: () => {
            path1Ref.current?.setAttribute("d", t.path1);
            path2Ref.current?.setAttribute("d", t.path2);
          },
        });
      }
    },
    { dependencies: [digit] }
  );

  return (
    <svg
      className="w-[22vw] max-w-[240px] min-w-[140px]"
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="clock-grad" x1="400" y1="0" x2="400" y2="800" gradientUnits="userSpaceOnUse">
          <stop offset={0} stopColor={gradient} />
          <stop offset={0.5} stopColor="#fff" stopOpacity={0} />
          <stop offset={1} stopColor={gradient} />
        </linearGradient>
      </defs>

      {/* background tile + soft vertical gradient */}
      <rect width="800" height="800" fill={gradient} />
      <rect width="800" height="800" fill="url(#clock-grad)" />

      {/* two animated bars */}
      <path ref={path1Ref} d="M800 800H0V0h800v800z" fill={accent} />
      <path ref={path2Ref} d="M800 800H0V0h800v800z" fill={accent} />

      {/* subtle stroke frame */}
      <rect width="800" height="800" fill="transparent" stroke={accent} strokeWidth="42" />
    </svg>
  );
}

function TimeClock({
  bg = "#FC5130",
  accent = "#FC5130",
  gradient = "#FFFAFF",
  className = "",
  use24h = true,
  tickMs = 1000,
}: Props) {
  useMorphSVG();
  const now = useNow(tickMs);

  const [h1, h2, m1, m2] = useMemo(() => {
    let hours = now.getHours();
    if (!use24h) hours = hours % 12 || 12;
    const [H1, H2] = pad2(hours).split("").map(Number);
    const [M1, M2] = pad2(now.getMinutes()).split("").map(Number);
    return [H1, H2, M1, M2];
  }, [now, use24h]);

  return (
    <div
      className={`relative flex min-h-screen w-full items-center justify-center ${className}`}
      style={{ backgroundColor: bg }}
    >
      <div className="flex w-full max-w-6xl items-center justify-center gap-3 px-4">
        <Digit digit={h1} accent={accent} gradient={gradient} delayIndex={0} />
        <Digit digit={h2} accent={accent} gradient={gradient} delayIndex={1} />
        <Divider gradient={gradient} />
        <Digit digit={m1} accent={accent} gradient={gradient} delayIndex={2} />
        <Digit digit={m2} accent={accent} gradient={gradient} delayIndex={3} />
      </div>

      {/* SR-only live region for accessibility */}
      <span className="sr-only" aria-live="polite">
        {now.toLocaleTimeString()}
      </span>
    </div>
  );
}

export {TimeClock}