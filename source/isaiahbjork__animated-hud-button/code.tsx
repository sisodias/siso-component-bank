"use client"

import { motion } from "framer-motion"
import type React from "react"
import { HyperText } from "@/components/ui/hyper-text"

interface HudButtonProps {
  children: React.ReactNode
  variant?: "primary" | "secondary"
  onClick?: () => void
  delay?: number
}

export function HudButton({ children, variant = "primary", onClick, delay = 0 }: HudButtonProps) {
  const buttonVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay,
      },
    },
  }

  const hoverVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  }

  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`

  return (
    <motion.button
      className="relative cursor-pointer"
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      style={{ width: "182px", height: "44px" }}
    >
      <motion.div variants={hoverVariants}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="182.288"
          height="43.721"
          viewBox="0 0 182.288 43.721"
          className="w-full h-full"
        >
          <defs>
            <linearGradient
              id={gradientId}
              x1="93.198"
              y1="-53.343"
              x2="93.198"
              y2="68.841"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor={variant === "primary" ? "#4ade80" : "#64748b"} />
              <stop offset="0.005" stopColor={variant === "primary" ? "#4ade80" : "#64748b"} stopOpacity="0.986" />
              <stop offset="0.085" stopColor={variant === "primary" ? "#4ade80" : "#64748b"} stopOpacity="0.781" />
              <stop offset="0.17" stopColor={variant === "primary" ? "#4ade80" : "#64748b"} stopOpacity="0.596" />
              <stop offset="0.258" stopColor={variant === "primary" ? "#4ade80" : "#64748b"} stopOpacity="0.436" />
              <stop offset="0.351" stopColor={variant === "primary" ? "#4ade80" : "#64748b"} stopOpacity="0.301" />
              <stop offset="0.449" stopColor={variant === "primary" ? "#4ade80" : "#64748b"} stopOpacity="0.191" />
              <stop offset="0.554" stopColor={variant === "primary" ? "#4ade80" : "#64748b"} stopOpacity="0.106" />
              <stop offset="0.669" stopColor={variant === "primary" ? "#4ade80" : "#64748b"} stopOpacity="0.046" />
              <stop offset="0.804" stopColor={variant === "primary" ? "#4ade80" : "#64748b"} stopOpacity="0.011" />
              <stop offset="1" stopColor={variant === "primary" ? "#4ade80" : "#64748b"} stopOpacity="0" />
            </linearGradient>
          </defs>
          <g>
            <g>
              <path d="M181.788.5H13.7L4.609,9.593V43.221H170.048l11.74-11.74Z" fill={`url(#${gradientId})`} />
              <path
                d="M170.256,43.721H4.108V9.386L13.494,0H182.288V31.688Zm-165.148-1H169.842l11.446-11.447V1H13.908l-8.8,8.8Z"
                fill={variant === "primary" ? "#4ade80" : "#64748b"}
              />
              <g>
                <circle cx="169.908" cy="7.326" r="1.161" fill={variant === "primary" ? "#4ade80" : "#64748b"} />
                <circle cx="169.908" cy="11.908" r="1.161" fill={variant === "primary" ? "#4ade80" : "#64748b"} />
                <circle cx="174.373" cy="7.326" r="1.161" fill={variant === "primary" ? "#4ade80" : "#64748b"} />
                <circle cx="174.373" cy="11.908" r="1.161" fill={variant === "primary" ? "#4ade80" : "#64748b"} />
              </g>
            </g>
            <g>
              <circle cx="0.621" cy="19.214" r="0.621" fill={variant === "primary" ? "#4ade80" : "#64748b"} />
              <circle cx="0.621" cy="24.506" r="0.621" fill={variant === "primary" ? "#4ade80" : "#64748b"} />
            </g>
          </g>
        </svg>

        {/* Text overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <HyperText
            text={children as string}
            className={`text-sm tracking-wider ${variant === "primary" ? "text-green-300" : "text-slate-600 dark:text-slate-300"}`}
            duration={800}
            animateOnLoad={true}
          />
        </div>
      </motion.div>
    </motion.button>
  )
}
