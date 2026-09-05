import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

// --- Self-contained SVG Icon for the component ---
const BulbIcon = ({ isDrawn }) => {
  const [length, setLength] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      setLength(ref.current.getTotalLength());
    }
  }, []);

  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      className="stroke-neutral-200"
    >
      <motion.path
        ref={ref}
        d="M9 18h6M12 22V18M12 14.5A4.5 4.5 0 1 0 12 5.5a4.5 4.5 0 0 0 0 9z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ strokeDasharray: length, strokeDashoffset: length }}
        animate={{ strokeDashoffset: isDrawn ? 0 : length }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.5 }}
      />
    </svg>
  );
};

export default function SketchbookRevealCard() {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.5 });

  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef(null);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  return (
    <div ref={cardRef} className="relative w-full max-w-sm">
      {/* Invisible filter definition for the wobble effect */}
      <svg className="absolute h-0 w-0">
        <defs>
          <filter id="wobble">
            <feTurbulence
              baseFrequency="0.02"
              numOctaves="1"
              seed={Math.random()}
              result="turbulence"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="2"
            />
          </filter>
        </defs>
      </svg>

      {/* Hand-drawn border path */}
      <svg
        viewBox="0 0 320 400"
        className="absolute inset-0 h-full w-full"
      >
        <motion.path
          ref={pathRef}
          d="M20,20 h280 a10,10 0 0 1 10,10 v340 a10,10 0 0 1 -10,10 h-280 a10,10 0 0 1 -10,-10 v-340 a10,10 0 0 1 10,-10 z"
          fill="none"
          className="stroke-neutral-400"
          strokeWidth="2"
          style={{ filter: "url(#wobble)" }}
          initial={{ strokeDasharray: pathLength, strokeDashoffset: pathLength }}
          animate={{ strokeDashoffset: isInView ? 0 : pathLength }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>

      {/* Content */}
      <div className="relative z-10 flex h-[400px] flex-col items-center justify-center p-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ delay: 0.3 }}
        >
          <BulbIcon isDrawn={isInView} />
        </motion.div>

        <motion.h2
          className="mt-4 text-2xl font-bold text-neutral-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ delay: 0.8 }}
        >
          Generative Idea
        </motion.h2>

        {/* Drawn text lines */}
        <div className="mt-4 w-full space-y-2">
          {[120, 160, 140].map((w, i) => (
            <div
              key={i}
              className="mx-auto h-2 rounded-full bg-neutral-700"
              style={{ width: `${w}px` }}
            >
              <motion.div
                className="h-full rounded-full bg-neutral-400"
                initial={{ width: "0%" }}
                animate={{ width: isInView ? "100%" : "0%" }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  delay: 1 + i * 0.2,
                }}
              />
            </div>
          ))}
        </div>

        <motion.button
          className="mt-8 rounded-full border border-neutral-500 px-6 py-2 text-sm font-medium text-neutral-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 10 }}
          transition={{ delay: 1.6 }}
          whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
        >
          Explore
        </motion.button>
      </div>
    </div>
  );
}
