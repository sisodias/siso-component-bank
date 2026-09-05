import React from "react";
import { motion } from "framer-motion";

interface AnimatedBadgeProps {
  text: string;
  color?: string;
  href?: string;
  className?: string;
}

const AnimatedBadge: React.FC<AnimatedBadgeProps> = ({
  text,
  color = "#22d3ee",
  href,
  className = "",
}) => {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-white border border-black/20 dark:border-white/30 backdrop-blur-md ${className}`}
    >
      {/* Animated pulsing dot */}
      <div className="relative flex h-2.5 w-2.5">
        {/* Expanding beam / ripple */}
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: 0, scale: 3 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeOut",
          }}
        />

        {/* Core dot */}
        <motion.span
          className="relative inline-flex rounded-full h-2.5 w-2.5 shadow-lg"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 6px ${color}`,
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <span className="dark:text-white text-black">{text}</span>
    </motion.div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    content
  );
};

export const AnimatedBadgeDemo: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen w-full bg-white dark:bg-black">
      <AnimatedBadge
        text="Introducing Eldora UI"
        color="#22d3ee"
        href="/docs/components/animated-badge"
      />
    </div>
  );
};

