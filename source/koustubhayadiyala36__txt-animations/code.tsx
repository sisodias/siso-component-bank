"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useSpring, animate, useMotionValue } from "framer-motion";
import { Plus } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { useInView } from "react-intersection-observer";

/* ------------------------------------------------------
   1️⃣ Countdown Timer
------------------------------------------------------ */
export function CountdownTimer({ start = 60 }: { start?: number }) {
  const [isPaused, setIsPaused] = useState(false);
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (isPaused) return;

    const id = setInterval(() => {
      setCount((c) => (c === 0 ? start : c - 1));
    }, 1000);

    return () => clearInterval(id);
  }, [isPaused, start]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-ternary text-primary">
      <span className="text-xs  uppercase opacity-40 mb-6">Countdown</span>

      <div className="font-bebas-neue text-[18vw] text-primary font-extrabold tracking-tight">
        <NumberFlow value={count} prefix="0:" />
      </div>

      <div className="flex items-center gap-3 mt-4">
        {/* Pause */}
        <motion.button
          onClick={() => setIsPaused((p) => !p)}
          whileTap={{ scale: 0.9 }}
          className="h-10 w-10 bg-primary text-secondary rounded-full flex items-center justify-center"
        >
          <AnimatePresence mode="wait">
            {isPaused ? (
              <motion.span
                key="play"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.3 }}
              >
                ▶
              </motion.span>
            ) : (
              <motion.span
                key="pause"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.3 }}
              >
                ||
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Reset */}
        <button
          onClick={() => setCount(start)}
          className="h-10 w-10 bg-primary/40 rounded-full flex items-center justify-center text-ternary"
        >
          <Plus className="rotate-45" />
        </button>
      </div>
    </div>
  );
}


/* ------------------------------------------------------
   3️⃣ Animated Money Range (randomized bouncing effect)
------------------------------------------------------ */
export function AnimatedMoneyRange() {
  const [num, setNum] = useState(1000000);
  const hasAnimated = useRef(false);
  const [isAnimating, setAnimating] = useState(false);

  const runAnimation = () => {
    if (hasAnimated.current || isAnimating) return;

    hasAnimated.current = true;
    setAnimating(true);

    const steps = 12;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      if (step <= steps) {
        const min = 1000000 + step * (1000000 / steps);
        const max = 2200000;
        setNum(Math.floor(min + Math.random() * (max - min)));
      } else {
        setNum(2146000);
        setAnimating(false);
        clearInterval(interval);
      }
    }, 80);
  };

  const format = (v: number) => new Intl.NumberFormat("en-US").format(v);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-ternary text-primary">
      <span className="text-xs uppercase opacity-40 mb-6">Random Money Range</span>

      <motion.div
        onViewportEnter={runAnimation}
        onViewportLeave={() => {
          hasAnimated.current = false;
          setNum(1000000);
        }}
        className="font-bebas-neue font-bold text-[18vw]"
      >
        ${format(num)}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------
   4️⃣ NumberFlow On View (3 → 100)
------------------------------------------------------ */
export function NumberInView({ start = 3, end = 100 }: { start?: number; end?: number }) {
  const [display, setDisplay] = useState(start);
  const motionValue = useMotionValue(start);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      animate(motionValue, end, {
        duration: 1,
        ease: "easeInOut",
        onUpdate: (latest) => setDisplay(Math.round(latest)),
      });
    } else {
      setDisplay(start);
    }
  }, [inView]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-ternary text-primary">
      <span className="text-xs uppercase opacity-40 mb-6">NumberFlow In View</span>

      <div ref={ref} className="font-babas-nueu font-extrabold text-[18vw]">
        <NumberFlow value={display} prefix="$" suffix="K USD" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------
   5️⃣ Wrapper Component: Skiper37
   (This is what you publish to 21st.dev)
------------------------------------------------------ */
export function Skiper37() {
  return (
    <section className="h-[calc(100vh-1rem)] w-full snap-y snap-mandatory overflow-y-scroll bg-primary]">
      <div className="snap-start">
        <CountdownTimer />
      </div>
      <div className="snap-start">
        <AnimatedMoneyRange />
      </div>
      <div className="snap-start">
        <NumberInView />
      </div>
    </section>
  );
}

/* ------------------------------------------------------
   END — ALL REUSABLE EXPORTS IN ONE FILE
------------------------------------------------------ */
