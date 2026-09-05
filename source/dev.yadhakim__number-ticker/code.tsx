"use client";

import { cn } from "@/lib/utils";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useMemo } from "react";

interface NumberTickerProps {
  value: number;
  className?: string;
  delay?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  direction?: "up" | "down";
}

function Digit({
  digit,
  delay,
  duration,
  direction,
}: {
  digit: number;
  delay: number;
  duration: number;
  direction: "up" | "down";
}) {
  const from = direction === "up" ? 10 : -10;

  const spring = useSpring(from, {
    stiffness: 60,
    damping: 20,
    mass: 0.8,
  });

  const y = useTransform(spring, (v) => {
    const current = ((v % 10) + 10) % 10;
    return `${-current * 10}%`;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      spring.set(digit);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [digit, delay, spring]);

  return (
    <span className="relative inline-block overflow-hidden" style={{ height: "1em", width: "0.6em" }}>
      <motion.span
        className="absolute inset-x-0 flex flex-col items-center"
        style={{ y }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n} className="flex h-[10%] items-center justify-center" style={{ height: "1em" }}>
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

function StaticChar({ char }: { char: string }) {
  return <span>{char}</span>;
}

export function Component({
  value,
  className,
  delay = 0,
  prefix,
  suffix,
  decimals = 0,
  duration = 1.5,
  direction = "up",
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const formatted = useMemo(() => {
    const fixed = value.toFixed(decimals);
    const [whole, dec] = fixed.split(".");

    // add commas
    const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return dec ? `${withCommas}.${dec}` : withCommas;
  }, [value, decimals]);

  const chars = formatted.split("");

  // count actual digits for stagger
  let digitIndex = 0;
  const digitCount = chars.filter((c) => /\d/.test(c)).length;

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-baseline tabular-nums font-bold tracking-tight",
        className
      )}
    >
      {prefix && <span>{prefix}</span>}

      {chars.map((char, i) => {
        if (/\d/.test(char)) {
          const stagger = delay + (digitIndex / digitCount) * duration * 0.6;
          digitIndex++;
          return isInView ? (
            <Digit
              key={i}
              digit={parseInt(char)}
              delay={stagger}
              duration={duration}
              direction={direction}
            />
          ) : (
            <span key={i} className="inline-block" style={{ width: "0.6em" }}>
              {direction === "up" ? "0" : char}
            </span>
          );
        }
        return <StaticChar key={i} char={char} />;
      })}

      {suffix && <span>{suffix}</span>}
    </span>
  );
}