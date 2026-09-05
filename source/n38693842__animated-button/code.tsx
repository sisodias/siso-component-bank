import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Sparkle Icon Component
const SparkleIcon = ({ className = "", style = {} }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
  </svg>
);

// Particle Component
const Particle = ({ delay, duration, startX, startY, color, size }) => {
  const endX = 110;
  const endY = 45;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${startX}px`,
        top: `${startY}px`,
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0.9, 0.7, 0],
        x: [0, endX - startX],
        y: [0, endY - startY],
        rotate: [0, 720],
        scale: [0.3, 1.2, 1, 0.3],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: [0.4, 0.0, 0.2, 1],
      }}
    >
      <svg width={size} height={size} viewBox="0 0 8 8">
        <path
          d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2L4 0Z"
          fill={color}
        />
      </svg>
    </motion.div>
  );
};

// Particle System Component
const ParticleSystem = ({ isActive, isDark }) => {
  const colors = isDark
    ? ["#a78bfa", "#93c5fd", "#38bdf8", "#7c3aed", "#c084fc"]
    : ["#3b82f6", "#7dd3fc", "#a78bfa", "#facc15", "#60a5fa"];

  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    startX: Math.random() * 220 + 5,
    startY: Math.random() * 90 + 5,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 0.8,
    duration: 1.5 + Math.random() * 1.5,
    size: 4 + Math.random() * 8,
  }));

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="absolute -bottom-4 -left-4 -right-4 -top-4 pointer-events-none overflow-hidden rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {particles.map((particle) => (
            <Particle key={particle.id} {...particle} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main Button Component
export function Component() {
  const [isHovering, setIsHovering] = useState(false);
  const [isDark, setIsDark] = useState(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  return (
    <div
      className={`flex items-center justify-center min-h-screen w-full transition-colors duration-500 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <motion.button
        className={`
          group relative my-8 rounded-full p-1
          bg-gradient-to-r
          from-blue-300/30 via-blue-500/30 to-purple-500/30
          dark:from-blue-700/30 dark:via-purple-700/30 dark:to-indigo-700/30
          text-white
        `}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <div
          className={`
            relative flex items-center justify-center gap-2 rounded-full
            px-4 py-2 overflow-hidden
            bg-gradient-to-r
            from-blue-400 via-blue-500 to-purple-500
            dark:from-blue-700 dark:via-purple-700 dark:to-indigo-700
            text-white
          `}
        >
          {/* Main Sparkle */}
          <motion.div
            animate={{
              opacity: [0.75, 1, 0.75],
              scale: [0.9, 1, 0.9],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <SparkleIcon className="w-6 h-6 -translate-y-0.5 fill-white" />
          </motion.div>

          {/* Tiny sparkles */}
          <motion.div
            className="absolute bottom-2.5 left-3.5 z-20"
            animate={{ opacity: [0.75, 1, 0.75], scale: [0.9, 1, 0.9] }}
            transition={{
              duration: 2,
              delay: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <SparkleIcon className="w-2 h-2 rotate-12 fill-white" />
          </motion.div>

          <motion.div
            className="absolute left-5 top-2.5"
            animate={{ opacity: [0.75, 1, 0.75], scale: [0.9, 1, 0.9] }}
            transition={{
              duration: 2.5,
              delay: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <SparkleIcon className="w-1.5 h-1.5 -rotate-12 fill-white" />
          </motion.div>

          <motion.div
            className="absolute left-3 top-3"
            animate={{ opacity: [0.75, 1, 0.75], scale: [0.9, 1, 0.9] }}
            transition={{
              duration: 2.5,
              delay: 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <SparkleIcon className="w-2.5 h-2.5 fill-white" />
          </motion.div>

          <span className="font-semibold">Generate thumbnails</span>
        </div>

        {/* Particle System */}
        <ParticleSystem isActive={isHovering} isDark={isDark} />
      </motion.button>
    </div>
  );
}
