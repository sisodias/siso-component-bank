'use client';

import type { ButtonHTMLAttributes, FC } from 'react';
import { motion } from 'framer-motion';

type CornerFrameAnimatedButtonProps = {
  buttonText?: string;
  className?: string;
  color?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const CornerFrameAnimatedButton: FC<CornerFrameAnimatedButtonProps> = ({
  buttonText = 'Hover Button',
  className = '',
  color = 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600',
  onClick,
  ...props
}) => {
  return (
    <motion.button
      type="button"
      className={`
        relative px-8 py-4 bg-transparent border-0 font-semibold text-lg tracking-wide
        text-black dark:text-white focus-visible:outline-none cursor-pointer ${className}
      `}
      onClick={onClick}
      whileHover="hover"
      whileTap="tap"
      variants={{
        tap: { scale: 0.98 },
      }}
      {...props}
    >
      {/* Corner borders */}
      <motion.div
        className="absolute inset-0 pointer-events-none corner-frame-border"
        variants={{
          hover: {
            opacity: 0,
            transition: { duration: 0.2 },
          },
        }}
      />

      {/* Background fill animation */}
      <motion.div
        className={`absolute inset-0 ${color}`}
        initial={{ opacity: 0 }}
        variants={{
          hover: {
            opacity: 1,
            transition: { duration: 0.3, ease: 'easeOut' },
          },
        }}
      />

      {/* Text */}
      <motion.span
        className="relative z-10"
        style={{ color: 'inherit' }}
        variants={{
          hover: {
            color: 'white',
            transition: { duration: 0.3 },
          },
        }}
      >
        {buttonText}
      </motion.span>
    </motion.button>
  );
};

export default CornerFrameAnimatedButton;
