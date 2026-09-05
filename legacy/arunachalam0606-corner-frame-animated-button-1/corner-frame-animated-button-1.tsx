'use client'

import type { ButtonHTMLAttributes, FC } from 'react'
import { motion } from 'framer-motion'
import { cn } from "../_utils/cn"

type CornerFrameAnimatedButtonProps = {
  buttonText?: string
  className?: string
  color?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

const CornerFrameAnimatedButton: FC<CornerFrameAnimatedButtonProps> = ({
  buttonText = 'Hover Button',
  className,
  color = 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600',
  onClick,
  ...props
}) => {
  return (
    <motion.button
      type="button"
      className={cn(
        'relative px-8 py-4 bg-transparent border-0 font-semibold text-lg tracking-wide',
        'text-black dark:text-white focus-visible:outline-none cursor-pointer',
        className
      )}
      onClick={onClick}
      whileHover="hover"
      whileTap="tap"
      variants={{
        tap: { scale: 0.98 }
      }}
      {...props}
    >
      <motion.div
        className={cn(
          'absolute inset-0 pointer-events-none',
          '[background-image:linear-gradient(to_right,var(--foreground)_1.5px,transparent_1.5px),linear-gradient(to_right,var(--foreground)_1.5px,transparent_1.5px),linear-gradient(to_left,var(--foreground)_1.5px,transparent_1.5px),linear-gradient(to_left,var(--foreground)_1.5px,transparent_1.5px),linear-gradient(to_bottom,var(--foreground)_1.5px,transparent_1.5px),linear-gradient(to_bottom,var(--foreground)_1.5px,transparent_1.5px),linear-gradient(to_top,var(--foreground)_1.5px,transparent_1.5px),linear-gradient(to_top,var(--foreground)_1.5px,transparent_1.5px)]',
          '[background-position:0_0,0_100%,100%_0,100%_100%,0_0,100%_0,0_100%,100%_100%]',
          '[background-size:15px_15px]',
          '[background-repeat:no-repeat]'
        )}
        variants={{
          hover: {
            opacity: 0,
            transition: { duration: 0.2 }
          }
        }}
      />

      {/* Gradient background on hover */}
      <motion.div
        className={cn('absolute inset-0', color)}
        initial={{ opacity: 0 }}
        variants={{
          hover: {
            opacity: 1,
            transition: { duration: 0.3, ease: 'easeOut' }
          }
        }}
      />

      {/* Button text */}
      <motion.span
        className="relative z-10"
        style={{ color: 'inherit' }}
        variants={{
          hover: {
            color: 'white',
            transition: { duration: 0.3 }
          }
        }}>
        {buttonText}
      </motion.span>
    </motion.button>
  )
}

export default CornerFrameAnimatedButton
