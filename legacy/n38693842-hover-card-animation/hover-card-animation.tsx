"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Custom Pointer Component
function Pointer({ children, className = "" }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    if (isHovered) {
      document.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isHovered]);

  return (
    <div
      className="absolute inset-0 cursor-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <motion.div
          className="fixed pointer-events-none z-50"
          style={{
            left: position.x,
            top: position.y,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
        >
          {children || (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`${className}`}
            >
              <path
                d="M8.5 2L20.5 8.5L15 10.5L12.5 16L8.5 2Z"
                fill="currentColor"
                className="text-black"
              />
            </svg>
          )}
        </motion.div>
      )}
    </div>
  );
}

// Custom Card Components
function Card({ children, className = "" }) {
  return (
    <div className={`rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ children, className = "" }) {
  return (
    <div className={`p-6 pb-2 ${className}`}>
      {children}
    </div>
  );
}

function CardTitle({ children, className = "" }) {
  return (
    <h3 className={`text-xl font-bold text-gray-900 dark:text-gray-100 ${className}`}>
      {children}
    </h3>
  );
}

function CardDescription({ children, className = "" }) {
  return (
    <p className={`text-sm text-gray-600 dark:text-gray-400 mt-1 ${className}`}>
      {children}
    </p>
  );
}

function CardContent({ children, className = "" }) {
  return (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  );
}

export function Component() {
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-2 md:grid-rows-2 p-4">

      <Card className="col-span-1 row-span-1 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-none relative">
        <CardHeader>
          <CardTitle>Animated Pointer</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Animated pointer
          </CardDescription>
        </CardHeader>
        <CardContent className="relative flex h-40 items-center justify-center">
          <span className="pointer-events-none text-center text-xl font-medium text-slate-800 dark:text-slate-200">
            Move your cursor here
          </span>
        </CardContent>
        <Pointer>
          <motion.div
            animate={{
              scale: [0.8, 1, 0.8],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-pink-600"
            >
              <motion.path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="currentColor"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </svg>
          </motion.div>
        </Pointer>
      </Card>

      <Card className="col-span-1 row-span-1 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 shadow-none relative">
        <CardHeader>
          <CardTitle>Colored Pointer</CardTitle>
          <CardDescription className="text-blue-700 dark:text-blue-300">
            A custom pointer with different color
          </CardDescription>
        </CardHeader>
        <CardContent className="relative flex h-40 items-center justify-center">
          <span className="pointer-events-none text-center text-xl font-medium text-blue-800 dark:text-blue-200">
            Try me out
          </span>
        </CardContent>
        <Pointer className="text-blue-500" />
      </Card>

      <Card className="col-span-1 row-span-1 overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 shadow-none relative">
        <CardHeader>
          <CardTitle>Custom Shape</CardTitle>
          <CardDescription className="text-purple-700 dark:text-purple-300">
            A pointer with a custom SVG shape
          </CardDescription>
        </CardHeader>
        <CardContent className="relative flex h-40 items-center justify-center">
          <span className="pointer-events-none text-center text-xl font-medium text-purple-800 dark:text-purple-200">
            Hover here
          </span>
        </CardContent>
        <Pointer>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" className="fill-purple-500" />
            <circle cx="12" cy="12" r="5" className="fill-white" />
          </svg>
        </Pointer>
      </Card>

      <Card className="col-span-1 row-span-1 overflow-hidden bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 shadow-none relative">
        <CardHeader>
          <CardTitle>Emoji Pointer</CardTitle>
          <CardDescription className="text-green-700 dark:text-green-300">
            Using an emoji as a custom pointer
          </CardDescription>
        </CardHeader>
        <CardContent className="relative flex h-40 items-center justify-center">
          <span className="pointer-events-none text-center text-xl font-medium text-green-800 dark:text-green-200">
            Check this out
          </span>
        </CardContent>
        <Pointer>
          <div className="text-2xl">👆</div>
        </Pointer>
      </Card>
      </div>
  );
}