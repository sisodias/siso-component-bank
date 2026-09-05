import React, { useState, useEffect } from "react";

export function Component() {
  const [isProcessing, setIsProcessing] = useState(false);
  // Create a 100-item array representing a 10x10 grid
  const [pixels, setPixels] = useState(Array(100).fill(true));

  useEffect(() => {
    if (!isProcessing) return;

    // Speed of disintegration: 500ms per pixel
    const interval = setInterval(() => {
      setPixels((prev) => {
        const next = [...prev];
        // Find all pixels that are still "visible"
        const visibleIndices = next
          .map((isVisible, index) => (isVisible ? index : -1))
          .filter((index) => index !== -1);

        if (visibleIndices.length === 0) {
          clearInterval(interval);
          return next;
        }

        // Randomly pick one visible pixel to "delete"
        const randomIndex = visibleIndices[Math.floor(Math.random() * visibleIndices.length)];
        next[randomIndex] = false;
        return next;
      });
    }, 15);

    return () => clearInterval(interval);
  }, [isProcessing]);

  return (
    <button
      onClick={() => setIsProcessing(true)}
      disabled={isProcessing}
      className="relative w-44 h-14 bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden transition-transform active:scale-95 disabled:cursor-default"
    >
      {/* LAYER 1: The "Loading" state (Hidden behind pixels initially) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 animate-pulse">
          Processing...
        </span>
      </div>

      {/* LAYER 2: The Pixel Surface (This is what vanishes) */}
      <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 pointer-events-none">
        {pixels.map((isVisible, i) => (
          <div
            key={i}
            className={`bg-neutral-950 transition-opacity duration-100 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* LAYER 3: The Button Label (Disappears immediately on click) */}
      <div 
        className={`absolute inset-0 flex items-center justify-center bg-neutral-950 transition-opacity duration-300 ${
          isProcessing ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <span className="text-white text-sm font-semibold tracking-wide">
          Deploy Agent
        </span>
      </div>
    </button>
  );
}