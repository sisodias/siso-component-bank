'use client'

import * as React from 'react'
import { motion } from 'framer-motion'

interface MarqueeButtonProps {
  label: string
  href?: string
  speed?: number
  className?: string
  onClick?: () => void
}

export function MarqueeButton({
  label,
  href,
  speed = 5,
  className = '',
  onClick,
}: MarqueeButtonProps) {
  const track = (
    <span
      className="absolute inset-0 flex items-center overflow-hidden pointer-events-none [mask-image:linear-gradient(to_right,transparent_0%,black_15%,black_85%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_15%,black_85%,transparent_100%)]"
      aria-hidden="true"
    >
      <motion.span
        className="flex items-center whitespace-nowrap"
        animate={{ x: ['0%', '-25%'] }}
        transition={{
          duration: speed,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 pr-3 whitespace-nowrap"
          >
            {label}
            <span className="opacity-30 text-xs">✦</span>
          </span>
        ))}
      </motion.span>
    </span>
  )

  const cls = [
    'relative inline-flex items-center justify-center',
    'overflow-hidden rounded-full h-14 px-10',
    'font-semibold text-base cursor-pointer',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <motion.div
      className="inline-block"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
    >
      {href ? (
        <a href={href} className={cls}>
          <span
            className="invisible select-none pointer-events-none whitespace-nowrap"
            aria-hidden="true"
          >
            {label}
          </span>
          {track}
        </a>
      ) : (
        <button type="button" onClick={onClick} className={cls}>
          <span
            className="invisible select-none pointer-events-none whitespace-nowrap"
            aria-hidden="true"
          >
            {label}
          </span>
          {track}
        </button>
      )}
    </motion.div>
  )
}
