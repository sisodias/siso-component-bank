"use client";
import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Configuration ---
const SCRAMBLE_SPEED = 10; // Faster for a snappier feel
const CYCLES_PER_LETTER = 3; // More cycles for a "computational" look
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+"; // Uppercase + Symbols looks cleaner

interface HyperTextProps {
  text: string;
  className?: string;
  highlightWords?: string[];
}

interface WordProps {
  children: string;
  isDimmed: boolean; // True when another word is hovered
  isHighlightable: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

const Word = ({
  children,
  isDimmed,
  isHighlightable,
  onHoverStart,
  onHoverEnd,
}: WordProps) => {
  const [displayText, setDisplayText] = useState(children);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const scramble = useCallback(() => {
    let pos = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const scrambled = children
        .split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) return char;
          const randomChar = CHARS[Math.floor(Math.random() * CHARS.length)];
          return randomChar;
        })
        .join("");

      setDisplayText(scrambled);
      pos++;

      if (pos >= children.length * CYCLES_PER_LETTER) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(children);
      }
    }, SCRAMBLE_SPEED);
  }, [children]);

  const stopScramble = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayText(children);
  }, [children]);

  const handleMouseEnter = () => {
    if (isHighlightable) {
      setIsHovered(true);
      onHoverStart();
      scramble();
    }
  };

  const handleMouseLeave = () => {
    if (isHighlightable) {
      setIsHovered(false);
      onHoverEnd();
      stopScramble();
    }
  };

  return (
    <motion.span
      className={`
        relative inline-block font-mono font-medium whitespace-nowrap
        ${isHighlightable ? "cursor-pointer" : "cursor-default"}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        // Visual Logic:
        // 1. Hovered: Scale up, move up slightly
        // 2. Dimmed: Blur out, lower opacity
        // 3. Default: Normal
        scale: isHovered ? 1.1 : 1,
        y: isHovered ? -4 : 0,
        opacity: isDimmed && !isHovered ? 0.3 : 1,
        filter: isDimmed && !isHovered ? "blur(2px)" : "blur(0px)",
        color: isHovered ? "#FFFFFF" : isHighlightable ? "#2563eb" : "#1f2937", // White on hover, Blue if interactive, Gray default
        zIndex: isHovered ? 20 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Background Pill (Only Visible on Hover) */}
      <AnimatePresence>
        {isHovered && (
          <motion.span
            className="absolute -inset-2 rounded-lg bg-black z-[-1]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            layoutId="hover-bg"
            // High-quality shadow for depth
            style={{
              boxShadow:
                "0px 10px 25px -5px rgba(37, 99, 235, 0.4), 0px 8px 10px -6px rgba(0, 0, 0, 0.1)",
            }}
          />
        )}
      </AnimatePresence>

      {/* The Text Content */}
      <span className="relative z-10 px-1">{displayText}</span>

      {/* Decorative 'Tech' Corners (Only on Hover) */}
      <AnimatePresence>
        {isHovered && (
          <>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full z-20"
            />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-500 rounded-full z-20"
            />
          </>
        )}
      </AnimatePresence>
    </motion.span>
  );
};

export default function HyperTextParagraph({
  text,
  className = "",
  highlightWords = [],
}: HyperTextProps) {
  const [isParagraphHovered, setIsParagraphHovered] = useState(false);

  const words = text.split(" ");

  // Clean helper for word matching
  const clean = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");

  return (
    <div className={`leading-relaxed tracking-wide ${className}`}>
      {words.map((word, i) => {
        const isHighlightable = highlightWords.some(
          (hw) => clean(hw) === clean(word)
        );

        return (
          <React.Fragment key={i}>
            <Word
              isDimmed={isParagraphHovered}
              isHighlightable={isHighlightable}
              onHoverStart={() => setIsParagraphHovered(true)}
              onHoverEnd={() => setIsParagraphHovered(false)}
            >
              {word}
            </Word>
            <span className="inline-block whitespace-pre"> </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}
