import React, { useEffect, useRef, useState } from "react";
import { useAnimate } from "framer-motion";

// Change this date to your target countdown date
const COUNTDOWN_FROM = "2026-10-01T00:00:00";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export default function ShiftingCountdown() {
  return (
    <section className="dark:bg-black bg-white dark:text-white text-black min-h-screen flex items-center justify-center p-4 transition-colors duration-500">
      <div className="flex w-full max-w-5xl items-center bg-transparent">
        <CountdownItem unit="Day" label="Days" />
        <CountdownItem unit="Hour" label="Hours" />
        <CountdownItem unit="Minute" label="Minutes" />
        <CountdownItem unit="Second" label="Seconds" />
      </div>
    </section>
  );
}

function CountdownItem({ unit, label }) {
  const { ref, time } = useTimer(unit);
  // For seconds, ensure two digits (00–59)
  const display = unit === "Second" ? String(time).padStart(2, '0') : time;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-1 px-4 py-6 md:gap-2 md:py-8">
      <div className="relative w-full overflow-hidden text-center">
        <span
          ref={ref}
          className="block text-3xl font-mono font-semibold dark:text-white text-black md:text-5xl lg:text-7xl transition-colors duration-500"
        >
          {display}
        </span>
      </div>
      <span className="text-sm font-light dark:text-gray-400 text-gray-500 md:text-base lg:text-lg transition-colors duration-500">
        {label}
      </span>
      <div className="h-px w-full dark:bg-gray-700 bg-gray-300 mt-4 transition-colors duration-500"></div>
    </div>
  );
}

function useTimer(unit) {
  const [ref, animate] = useAnimate();
  const intervalRef = useRef(null);
  const timeRef = useRef(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    handleCountdown();
    intervalRef.current = setInterval(handleCountdown, 1000);
    return () => clearInterval(intervalRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCountdown = async () => {
    const end = new Date(COUNTDOWN_FROM);
    const now = new Date();
    const distance = end - now;

    let newTime = 0;
    switch (unit) {
      case "Day":
        newTime = Math.max(0, Math.floor(distance / DAY));
        break;
      case "Hour":
        newTime = Math.max(0, Math.floor((distance % DAY) / HOUR));
        break;
      case "Minute":
        newTime = Math.max(0, Math.floor((distance % HOUR) / MINUTE));
        break;
      default:
        newTime = Math.max(0, Math.floor((distance % MINUTE) / SECOND));
    }

    if (newTime !== timeRef.current) {
      await animate(
        ref.current,
        { y: ["0%", "-50%"], opacity: [1, 0] },
        { duration: 0.35 }
      );

      timeRef.current = newTime;
      setTime(newTime);

      await animate(
        ref.current,
        { y: ["50%", "0%"], opacity: [0, 1] },
        { duration: 0.35 }
      );
    }
  };

  return { ref, time };
}
