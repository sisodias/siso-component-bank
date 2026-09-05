"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

// === Badge (enhanced with vibrant gradients) ===
const Badge = ({ children }: { children: React.ReactNode }) => (
  <span
    className="inline-flex items-center px-4 py-2 rounded-full border border-purple-300/70 bg-gradient-to-r from-purple-200 to-pink-200 text-sm font-bold text-purple-900 shadow-lg backdrop-blur-sm dark:border-purple-400/60 dark:from-purple-800/80 dark:to-pink-800/80 dark:text-purple-100 dark:shadow-purple-500/30 transition-all duration-300"
  >
    {children}
  </span>
);

// === FlipLink (animated text with vibrant colors) ===
const DURATION = 0.25;
const STAGGER = 0.025;

interface FlipLinkProps {
  children: string;
  href: string;
}

const FlipLink: React.FC<FlipLinkProps> = ({ children, href }) => {
  return (
    <motion.a
      initial="initial"
      whileHover="hovered"
      target="_blank"
      href={href}
      className="relative block overflow-hidden whitespace-nowrap text-4xl font-bold uppercase bg-gradient-to-br from-indigo-900 to-[#c7d2fe] bg-clip-text text-transparent dark:from-indigo-300 dark:via-purple-300 dark:to-pink-300 sm:text-7xl md:text-8xl transition-all duration-300 hover:scale-105"
      style={{ lineHeight: 0.795 }}
    >
      <div>
        {children.split("").map((l, i) => (
          <motion.span
            key={i}
            variants={{ initial: { y: 0 }, hovered: { y: "-100%" } }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
          >
            {l}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0">
        {children.split("").map((l, i) => (
          <motion.span
            key={i}
            variants={{ initial: { y: "100%" }, hovered: { y: 0 } }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent dark:from-cyan-300 dark:via-blue-300 dark:to-indigo-300"
          >
            {l}
          </motion.span>
        ))}
      </div>
    </motion.a>
  );
};

// === Icons (enhanced with vibrant gradients and effects) ===
const Icons = {
  linkedin: () => (
    <svg
      width="86"
      height="86"
      viewBox="0 0 86 86"
      className="transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3"
    >
      <defs>
        <linearGradient id="linkedin-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a5b4fc" />
          <stop offset="100%" stopColor="#c7d2fe" />
        </linearGradient>
        <linearGradient
          id="linkedin-bg-dark"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="linkedin-hover" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <rect
        width="86"
        height="86"
        rx="18"
        className="shadow-lg transition-all duration-500"
        style={{ fill: "url(#linkedin-bg)" }}
      />
      <rect
        width="86"
        height="86"
        rx="18"
        className="shadow-lg transition-all duration-500 opacity-0 dark:opacity-100"
        style={{ fill: "url(#linkedin-bg-dark)" }}
      />
      <rect
        width="86"
        height="86"
        rx="18"
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        fill="url(#linkedin-hover)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.7128 69.5277V33.4109H15.7096V69.5277H27.7128ZM21.7112 28.1545C25.5648 28.1545 28.0008 25.5858 28.0008 22.5772C27.916 19.4843 25.5648 17 21.7968 17C18.0289 17 15.5 19.4843 15.5 22.5772C15.5 25.5858 17.9359 28.1545 21.6264 28.1545H21.7112ZM34.5376 69.5277C34.5376 69.5277 34.7079 34.9887 34.5376 33.4109H46.5408V38.9569H46.456C48.0153 36.4592 51.1069 32.6946 57.7039 32.6946C65.7438 32.6946 70.5 37.9369 70.5 48.004V69.5277H58.4968V49.7506C58.4968 45.3979 56.9643 42.1812 52.5418 42.1812C49.1744 42.1812 47.2189 44.4491 46.3719 46.6603C46.0332 47.5476 46.0332 48.7998 46.0332 50.1355V69.5277H34.5376Z"
        className="fill-indigo-900 dark:fill-indigo-100 group-hover:fill-white drop-shadow-sm transition-colors duration-300"
      />
    </svg>
  ),
};

// === Main Component ===
export default function MouseTrailDemo() {
  return (
    <section className="relative z-10 grid place-content-center gap-12 px-8 py-24 text-neutral-800 dark:text-neutral-100">
      {/* 1st link → icon left */}
      <div className="group flex items-center justify-center gap-6 transition-all duration-300 hover:gap-8">
        <div className="transition-transform duration-500 group-hover:translate-x-2">
          <Icons.linkedin />
        </div>
        <FlipLink href="https://linkedin.com">LinkedIn</FlipLink>
      </div>
    </section>
  );
}
