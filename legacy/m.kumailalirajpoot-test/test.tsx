'use client'
import React from 'react'
import { motion, useSpring, useMotionTemplate } from 'framer-motion'
import { Home, Book, Brain, MessageCircle } from 'lucide-react'

const Links = [
  { name: 'Home', icon: Home },
  { name: 'Learn', icon: Book },
  { name: 'Quiz', icon: Brain },
  { name: 'Ask', icon: MessageCircle },
]

export function HoverClip() {
  const HoverClipLink = ({
    label,
    icon: Icon,
  }: {
    label: string
    icon: React.ElementType
  }) => {
    const clipPath = useSpring(100, { stiffness: 120, damping: 12 })
    const clipStyle = useMotionTemplate`inset(0% ${clipPath}% 0% 0%)`

    return (
      <div
        onMouseEnter={() => clipPath.set(0)}
        onMouseLeave={() => clipPath.set(100)}
        className="relative overflow-hidden cursor-pointer px-4 py-2 text-foreground"
      >
        {/* Hover overlay */}
        <motion.div
          style={{ clipPath: clipStyle }}
          className="absolute top-0 left-0 w-full h-full border-b-2 border-b-blue-500 text-blue-500 flex items-center justify-center font-semibold"
        >
          <span className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            {label}
          </span>
        </motion.div>

        {/* Base text */}
        <div
          style={{ clipPath: clipStyle }}
          className="w-full h-full border-b-2 border-b-transparent text-foreground flex items-center justify-center font-semibold"
        >
          <span className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            {label}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-4 p-10 bg-backgorund min-h-fit items-center justify-center">
      {Links.map((link) => (
        <HoverClipLink key={link.name} label={link.name} icon={link.icon} />
      ))}
    </div>
  )
}