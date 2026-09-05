"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

interface AnimatedHeroProps {
  heading: string;
  subheading: string;
  loadingText?: string;
  children?: React.ReactNode;
}

const AnimatedHero: React.FC<AnimatedHeroProps> = ({
  heading,
  subheading,
  loadingText = "",
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showHero, setShowHero] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [startExit, setStartExit] = useState(false);
  const { theme } = useTheme();

  const letters = loadingText.split("");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isLoading) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";

    const exitTimer = setTimeout(() => setStartExit(true), 1500);
    const hideTimer = setTimeout(() => setIsLoading(false), 3500);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
      document.body.style.overflow = "unset";
    };
  }, [isLoading]);

  useEffect(() => {
    if (startExit) {
      const heroTimer = setTimeout(() => setShowHero(true), 1000);
      return () => clearTimeout(heroTimer);
    }
  }, [startExit]);

  const letterVariants = {
    initial: { opacity: 0, y: 60, scale: 0.8, rotate: 0 },
    enter: { opacity: 1, y: 0, scale: 1, rotate: 0, transition: { duration: 0.8, ease: "easeOut" } },
    exit: (index: number) => {
      const angles = [
        { x: -1200, y: -800, rotate: -720 },
        { x: -800, y: -1200, rotate: 360 },
        { x: 0, y: -1500, rotate: -540 },
        { x: 800, y: -1200, rotate: 720 },
        { x: 1200, y: -800, rotate: -360 },
        { x: -1500, y: 500, rotate: 540 },
        { x: -800, y: 1200, rotate: -900 },
        { x: 800, y: 1200, rotate: 900 },
        { x: 1500, y: 800, rotate: -1080 },
      ];
      const direction = angles[index % angles.length];
      return {
        x: direction.x,
        y: direction.y,
        rotate: direction.rotate,
        scale: 0.2,
        opacity: 0,
        transition: { duration: 2, delay: index * 0.1, ease: "easeOut" },
      };
    },
  };

  const loadingContainerVariants = {
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
        delay: 1.5,
        when: "afterChildren",
      },
    },
  };

  if (!mounted) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-black z-[100] flex items-center justify-center">
        <div className="text-xl text-black dark:text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white dark:bg-black transition-colors duration-500">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-white dark:bg-black z-[100]"
            variants={loadingContainerVariants}
            initial="show"
            animate="show"
            exit="exit"
          >
            <motion.div
              className="flex space-x-1 md:space-x-2"
              variants={loadingContainerVariants}
              initial="show"
              animate={startExit ? "exit" : "show"}
            >
              {letters.map((letter, index) => (
                <motion.span
                  key={index}
                  className="text-6xl md:text-8xl font-bold text-black dark:text-white tracking-wider select-none"
                  variants={letterVariants}
                  initial="initial"
                  animate={startExit ? "exit" : "enter"}
                  custom={index}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHero && (
          <div className="relative z-20 flex items-center justify-center min-h-screen px-4">
            <div className="text-center max-w-5xl mx-auto">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-black dark:text-white mb-6 leading-tight select-none">
                {heading}
              </h1>

              <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 mb-12 font-light leading-relaxed max-w-3xl mx-auto">
                {subheading}
              </p>

              {children && <div className="mt-6">{children}</div>}

              {/* Floating Particles */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: Math.random() * 4 + 2,
                      height: Math.random() * 4 + 2,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      backgroundColor: theme === "dark" ? "white" : "black",
                    }}
                    animate={{
                      x: [0, (Math.random() - 0.5) * 150],
                      y: [0, (Math.random() - 0.5) * 150],
                      opacity: [0.2, 0.5, 0.2],
                      scale: [1, Math.random() * 1.5 + 0.8, 1],
                    }}
                    transition={{
                      duration: Math.random() * 5 + 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: Math.random() * 2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 2, delay: 1 }}
              >
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20"
                  style={{
                    backgroundColor:
                      theme === "dark"
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(0,0,0,0.2)",
                  }}
                />
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedHero;