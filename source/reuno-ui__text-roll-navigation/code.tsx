"use client";

import React from "react";
import { motion } from "framer-motion";


const cn = (...arr: Array<string | false | null | undefined>) =>
  arr.filter(Boolean).join(" ");

const navigationItems = [
  { name: "Home", href: "/", description: "" },
  { name: "Components", href: "/components", description: "" },
  { name: "Pricing", href: "/pricing", description: "" },
  { name: "How to use", href: "/docs/quick-start", description: "" },
  { name: "Account", href: "/user", description: "" },
  { name: "Login", href: "/login", description: "" },
];

const STAGGER = 0.035;

export const TextRoll: React.FC<{
  children: string;
  className?: string;
  center?: boolean;
}> = ({ children, className, center = false }) => (
  <motion.span
    initial="initial"
    whileHover="hovered"
    className={cn("relative block overflow-hidden", className)}
    style={{ lineHeight: 0.75 }}
    aria-label={children}
  >
    <div>
      {children.split("").map((l, i) => {
        const delay = center
          ? STAGGER * Math.abs(i - (children.length - 1) / 2)
          : STAGGER * i;
        return (
          <motion.span
            key={`top-${i}`}
            className="inline-block"
            variants={{ initial: { y: 0 }, hovered: { y: "-100%" } }}
            transition={{ ease: "easeInOut", delay }}
          >
            {l}
          </motion.span>
        );
      })}
    </div>

    <div className="absolute inset-0">
      {children.split("").map((l, i) => {
        const delay = center
          ? STAGGER * Math.abs(i - (children.length - 1) / 2)
          : STAGGER * i;
        return (
          <motion.span
            key={`bot-${i}`}
            className="inline-block"
            variants={{ initial: { y: "100%" }, hovered: { y: 0 } }}
            transition={{ ease: "easeInOut", delay }}
          >
            {l}
          </motion.span>
        );
      })}
    </div>
  </motion.span>
);

export const Skiper58: React.FC<{ className?: string }> = ({ className }) => (
  <ul
    className={cn(
      "flex min-h-full w-full flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl px-7 py-3 backdrop-blur-sm",
      className
    )}
  >
    {navigationItems.map((item, index) => (
      <li className="relative flex flex-col items-center" key={index}>
        <a
          href={item.href}
          className="group relative block cursor-pointer select-none"
          aria-label={item.name}
        >
          <TextRoll
            center
            className="text-4xl font-extrabold uppercase leading-[0.8] tracking-[-0.03em] transition-colors lg:text-5xl"
          >
            {item.name}
          </TextRoll>
          <div className="mt-1 flex items-center justify-center">
            <span className="text-xs text-neutral-400 group-hover:text-neutral-300 transition-colors">
              {item.description}
            </span>
          </div>
          <span className="absolute -bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-current transition-all duration-300 group-hover:w-full" />
        </a>
      </li>
    ))}
  </ul>
);
