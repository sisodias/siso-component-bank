"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "../_utils/cn";

interface FlipDigitProps {
  value: number;
}

export const Component = () => {
  const [megaCounter, setMegaCounter] = useState(0);
  const [timeCounter, setTimeCounter] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  // Display states
  const [displayMega, setDisplayMega] = useState(0);
  const [displayHours, setDisplayHours] = useState(0);
  const [displayMinutes, setDisplayMinutes] = useState(0);
  const [displaySeconds, setDisplaySeconds] = useState(0);

  const timeoutMega = useRef<NodeJS.Timeout | undefined>(undefined);
  const timeoutHours = useRef<NodeJS.Timeout | undefined>(undefined);
  const timeoutMinutes = useRef<NodeJS.Timeout | undefined>(undefined);
  const timeoutSeconds = useRef<NodeJS.Timeout | undefined>(undefined);

  // Single flip digit component
  const FlipDigit: React.FC<FlipDigitProps> = ({ value }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const [nextValue, setNextValue] = useState(value);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
      if (value !== displayValue) {
        setNextValue(value);
        setIsAnimating(true);

        setTimeout(() => {
          setDisplayValue(value);
          setTimeout(() => setIsAnimating(false), 150);
        }, 150);
      }
    }, [value, displayValue]);

    return (
      <div
        className="relative inline-block overflow-hidden bg-black border-2 border-gray-600 rounded-lg shadow-2xl shadow-green-500/20"
        style={{ width: "4rem", height: "5rem" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-black to-gray-900 opacity-90" />

        <div
          className={`absolute inset-0 flex items-center justify-center text-green-400 font-mono font-black text-3xl transition-transform duration-200 ease-out drop-shadow-lg ${
            isAnimating ? "transform -translate-y-full opacity-0" : ""
          }`}
          style={{
            textShadow:
              "0 0 10px rgba(34, 197, 94, 0.8), 0 0 20px rgba(34, 197, 94, 0.4)",
            transitionDuration: "150ms",
          }}
        >
          {displayValue}
        </div>

        <div
          className={`absolute inset-0 flex items-center justify-center text-green-400 font-mono font-black text-3xl transition-transform duration-200 ease-out drop-shadow-lg transform translate-y-full opacity-0 ${
            isAnimating ? "transform translate-y-0 opacity-100" : ""
          }`}
          style={{
            textShadow:
              "0 0 10px rgba(34, 197, 94, 0.8), 0 0 20px rgba(34, 197, 94, 0.4)",
            transitionDuration: "150ms",
            transitionDelay: "75ms",
          }}
        >
          {nextValue}
        </div>

        {isAnimating && (
          <div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-300 to-transparent"
            style={{
              top: "50%",
              boxShadow: "0 0 4px rgba(34, 197, 94, 0.8)",
            }}
          />
        )}

        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-2 left-1 right-1 h-px bg-gradient-to-r from-transparent via-green-600 to-transparent" />
          <div className="absolute bottom-2 left-1 right-1 h-px bg-gradient-to-r from-transparent via-green-600 to-transparent" />
          <div className="absolute top-1/2 left-1 right-1 h-px bg-green-700 transform -translate-y-1/2" />
        </div>

        <div className="absolute top-1 left-1 w-1 h-1 bg-green-500 rounded-full opacity-60" />
        <div className="absolute top-1 right-1 w-1 h-1 bg-green-500 rounded-full opacity-60" />
        <div className="absolute bottom-1 left-1 w-1 h-1 bg-green-500 rounded-full opacity-60" />
        <div className="absolute bottom-1 right-1 w-1 h-1 bg-green-500 rounded-full opacity-60" />
      </div>
    );
  };

  // Animation function
  const animateFlip = (
    currentValue: number,
    targetValue: number,
    setDisplayValue: React.Dispatch<React.SetStateAction<number>>,
    timeoutRef: React.MutableRefObject<NodeJS.Timeout | undefined>,
    digits: number = 6,
    duration: number = 150
  ) => {
    if (currentValue === targetValue) return;

    const animateToValue = () => {
      const current = currentValue.toString().padStart(digits, "0");
      const target = targetValue.toString().padStart(digits, "0");

      const digitPositions: number[] = [];
      for (let i = 0; i < digits; i++) {
        if (current[i] !== target[i]) {
          digitPositions.push(i);
        }
      }

      if (digitPositions.length === 0) return;

      let delay = 0;
      for (let i = digitPositions.length - 1; i >= 0; i--) {
        const digitPos = digitPositions[i];

        setTimeout(() => {
          const currentStr = currentValue.toString().padStart(digits, "0");
          const currentDigitValue = parseInt(currentStr[digitPos]);
          const targetDigitValue = parseInt(target[digitPos]);

          let nextValue = currentDigitValue;
          if (currentDigitValue < targetDigitValue) {
            nextValue = currentDigitValue + 1;
          } else if (currentDigitValue > targetDigitValue) {
            nextValue = currentDigitValue - 1;
          }

          const newValueStr =
            currentStr.substring(0, digitPos) +
            nextValue.toString() +
            currentStr.substring(digitPos + 1);
          setDisplayValue(parseInt(newValueStr));
        }, delay);

        delay += duration;
      }

      if (currentValue !== targetValue) {
        timeoutRef.current = setTimeout(animateToValue, delay + 300);
      }
    };

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    animateToValue();
  };

  // Render digit display
  const renderDigits = (value: number, digits: number) => {
    const formatDisplay = (num: number): string =>
      num.toString().padStart(digits, "0");
    const digitArray = formatDisplay(value)
      .split("")
      .map((d: string) => parseInt(d));

    return digitArray.map((digit: number, index: number) => (
      <FlipDigit key={index} value={digit} />
    ));
  };

  // Counter intervals
  useEffect(() => {
    if (!isRunning) return;

    const megaInterval = setInterval(() => {
      setMegaCounter((prev) => prev + 1);
    }, 100);

    const timeInterval = setInterval(() => {
      setTimeCounter((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(megaInterval);
      clearInterval(timeInterval);
    };
  }, [isRunning]);

  // Flip animations
  useEffect(() => {
    animateFlip(displayMega, megaCounter, setDisplayMega, timeoutMega, 8, 150);
  }, [megaCounter, displayMega]);

  useEffect(() => {
    const hours = Math.floor(timeCounter / 3600);
    const minutes = Math.floor((timeCounter % 3600) / 60);
    const seconds = timeCounter % 60;

    animateFlip(displayHours, hours, setDisplayHours, timeoutHours, 2, 300);
    animateFlip(
      displayMinutes,
      minutes,
      setDisplayMinutes,
      timeoutMinutes,
      2,
      300
    );
    animateFlip(
      displaySeconds,
      seconds,
      setDisplaySeconds,
      timeoutSeconds,
      2,
      300
    );
  }, [timeCounter, displayHours, displayMinutes, displaySeconds]);

  const resetCounters = () => {
    setIsRunning(false);
    setMegaCounter(0);
    setTimeCounter(0);
    setDisplayMega(0);
    setDisplayHours(0);
    setDisplayMinutes(0);
    setDisplaySeconds(0);

    setTimeout(() => setIsRunning(true), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-green-400 font-mono mb-4 drop-shadow-lg">
            ⚡ FLIP COUNTERS ⚡
          </h1>
          <p className="text-green-300/80 font-mono text-lg">
            Mega Display & Digital Clock
          </p>
        </div>

        {/* Control Button */}
        <div className="flex justify-center mb-12">
          <button
            onClick={resetCounters}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-mono font-bold rounded-lg border-2 border-red-500 transition-all duration-200 shadow-lg hover:shadow-red-500/50 transform hover:scale-105"
          >
            🔄 RESET
          </button>
        </div>

        {/* Mega Display */}
        <div className="bg-gray-800/50 rounded-2xl p-12 border-2 border-green-500/50 backdrop-blur-sm mb-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-mono text-green-400 mb-4 font-bold">
              🎰 MEGA DISPLAY
            </h3>
            <p className="text-green-300/60 font-mono text-lg">
              Random incrementing counter
            </p>
          </div>
          <div className="flex items-center justify-center gap-1 p-4 scale-125 mb-4">
            {renderDigits(displayMega, 8)}
          </div>
          <p className="text-center text-green-300/60 text-xl mt-6 font-mono">
            Total: {megaCounter.toLocaleString()}
          </p>
        </div>

        {/* Digital Clock */}
        <div className="bg-gray-800/50 rounded-2xl p-8 border-2 border-green-500/30 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-mono text-green-400 mb-4 font-bold">
              ⏰ DIGITAL CLOCK
            </h3>
            <p className="text-green-300/60 font-mono">HH:MM:SS format</p>
          </div>
          <div className="flex justify-center items-center space-x-4">
            <div className="flex items-center justify-center gap-1 p-4">
              {renderDigits(displayHours, 2)}
            </div>
            <div className="text-green-400 text-6xl font-mono font-bold animate-pulse">
              :
            </div>
            <div className="flex items-center justify-center gap-1 p-4">
              {renderDigits(displayMinutes, 2)}
            </div>
            <div className="text-green-400 text-6xl font-mono font-bold animate-pulse">
              :
            </div>
            <div className="flex items-center justify-center gap-1 p-4">
              {renderDigits(displaySeconds, 2)}
            </div>
          </div>
          <p className="text-center text-green-300/60 text-lg mt-4 font-mono">
            Elapsed time since page load
          </p>
        </div>
      </div>
    </div>
  );
};
