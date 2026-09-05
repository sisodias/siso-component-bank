"use client";

import React from "react";
import { motion } from "framer-motion";

interface ScaleLetterTextProps {
  text: string;
  className?: string;
}

const ScaleLetterText: React.FC<ScaleLetterTextProps> = ({
  text,
  className = "",
}) => {
  const letters = text.split("");

  return (
    <div
      className={`inline-flex flex-wrap justify-center items-center perspective-1000 ${className}`}
    >
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          className="inline-block"
          whileHover={{
            scale: 1.25,
            rotateX: 8,
            rotateY: -6,
          }}
          transition={{
            type: "spring",
            stiffness: 250,
            damping: 20,
            mass: 0.4,
          }}
          style={{
            display: "inline-block",
            transformOrigin: "center",
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </div>
  );
};

export function Component() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-black transition-colors">
      <ScaleLetterText
        className="font-display text-center text-6xl font-bold -tracking-widest text-black md:text-7xl md:leading-[5rem] dark:text-white"
        text="Hover Me"
      />
    </div>
  );
}
