"use client";
import { cn } from "@/lib/utils";
import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 1. CONFIGURATION (The "Feel")
const SCRAMBLE_SPEED = 50; // ms
const CYCLES_PER_LETTER = 2; // How many "flips" before settling
const SHUFFLE_CHARS = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz"; // Clean alpha characters

// "Apple-style" smooth spring physics
const SMOOTH_SPRING = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 1,
};

// 2. SUB-COMPONENT: The Interactive Word
interface WordProps {
  children: string;
  emoji?: string;
  isDimmed: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

const Word = ({
  children,
  emoji,
  isDimmed,
  onHoverStart,
  onHoverEnd,
}: WordProps) => {
  const [displayText, setDisplayText] = useState(children);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- Scramble Logic ---
  const scramble = useCallback(() => {
    let pos = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const scrambled = children
        .split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) return char;
          return SHUFFLE_CHARS[
            Math.floor(Math.random() * SHUFFLE_CHARS.length)
          ];
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

  // --- Render: Plain Text (Non-interactive) ---
  if (!emoji) {
    return (
      <motion.span
        className="inline-block transition-all duration-500 ease-out"
        animate={{
          opacity: isDimmed ? 0.3 : 1,
          filter: isDimmed ? "blur(2px)" : "blur(0px)",
        }}
      >
        {children}
      </motion.span>
    );
  }

  // --- Render: Interactive Word ---
  return (
    <motion.span
      className="relative inline-block cursor-pointer whitespace-nowrap font-semibold text-gray-900"
      onMouseEnter={() => {
        setIsHovered(true);
        onHoverStart();
        scramble();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onHoverEnd();
        stopScramble();
      }}
      animate={{
        scale: isHovered ? 1.05 : 1,
        color: isHovered ? "#000000" : "#0050EF", // Dark Gray -> Black
        filter: isDimmed && !isHovered ? "blur(4px)" : "none",
        opacity: isDimmed && !isHovered ? 0.4 : 1,
        zIndex: isHovered ? 50 : 1,
      }}
      transition={SMOOTH_SPRING}
    >
      {/* Floating Emoji */}
      <AnimatePresence>
        {isHovered && (
          <motion.span
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none select-none"
            initial={{ opacity: 0, y: 10, scale: 0.5 }}
            animate={{ opacity: 1, y: -25, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.5 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 20,
            }}
          >
            <span className="text-3xl drop-shadow-sm">{emoji}</span>
          </motion.span>
        )}
      </AnimatePresence>

      {/* Subtle Highlight Pill */}
      <AnimatePresence>
        {isHovered && (
          <motion.span
            className="absolute -inset-x-2 -inset-y-0.5 bg-gray-100 rounded-lg -z-10"
            layoutId="minimal-highlight"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={SMOOTH_SPRING}
          />
        )}
      </AnimatePresence>

      <span className="relative z-10">{displayText}</span>
    </motion.span>
  );
};

// 3. MAIN COMPONENT
interface HyperTextProps {
  text: string;
  className?: string;
  emojiMap?: Record<string, string>;
}

const EmojiHyperText = ({
  text,
  className = "",
  emojiMap = {},
}: HyperTextProps) => {
  const [isParagraphHovered, setIsParagraphHovered] = useState(false);
  const words = text.split(" ");
  const clean = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");

  return (
    <div className={`leading-relaxed tracking-tight ${className}`}>
      {words.map((word, i) => {
        const cleanedWord = clean(word);
        const matchKey = Object.keys(emojiMap).find(
          (key) => clean(key) === cleanedWord
        );
        const emoji = matchKey ? emojiMap[matchKey] : undefined;

        return (
          <React.Fragment key={i}>
            <Word
              emoji={emoji}
              isDimmed={isParagraphHovered}
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
};

// 4. USAGE PAGE
export default function Page() {
  const bio =
    "I am a creative developer who loves building fast websites and AI apps. I work with Next.js to ship production code.";

  const reactions = {
    creative: "🎨",
    developer: "👨‍💻",
    loves: "❤️",
    fast: "⚡",
    AI: "🤖",
    "Next.js": "▲",
    ship: "🚀",
    code: "💻",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfdfd] p-8 md:p-20">
      <div className="max-w-3xl">
        <EmojiHyperText
          text={bio}
          emojiMap={reactions}
          className="text-3xl md:text-5xl font-medium text-gray-800 text-center"
        />

        {/* Minimal Caption */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 flex justify-center"
        >
          <div className="px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
              Hover for context
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
