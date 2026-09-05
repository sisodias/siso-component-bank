"use client"

import { motion } from "framer-motion"
import type React from "react"
import { useId } from "react"
import { HyperText } from "@/components/ui/hyper-text"

interface HudButtonProps {
  children: React.ReactNode
  variant?: "primary" | "secondary"
  size?: "small" | "default" | "large"
  onClick?: () => void
  delay?: number
}

export function HudButton({ children, variant = "primary", size = "default", onClick, delay = 0 }: HudButtonProps) {
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

  const uniqueId = useId()
  const gradientId1 = `gradient1-${uniqueId}`
  const gradientId2 = `gradient2-${uniqueId}`

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          width: "140px",
          height: "39px",
          textClass: "text-xs tracking-wide"
        }
      case "large":
        return {
          width: "234px",
          height: "65px",
          textClass: "text-base tracking-wider"
        }
      default:
        return {
          width: "187px",
          height: "52px",
          textClass: "text-sm tracking-wider"
        }
    }
  }

  const sizeStyles = getSizeStyles()

  return (
    <motion.button
      className="relative cursor-pointer"
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      style={{ width: sizeStyles.width, height: sizeStyles.height }}
    >
      <motion.div variants={hoverVariants} className="cursor-pointer">
        <svg
          width={sizeStyles.width}
          height={sizeStyles.height}
          viewBox="0 0 187 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id={gradientId1} x1="94.9995" y1="-62.017" x2="94.9995" y2="80.9853" gradientUnits="userSpaceOnUse">
              <stop stopColor={variant === "primary" ? "#4ade80" : "#1a1a1a"} stopOpacity="0.95" />
              <stop offset="0.005" stopColor={variant === "primary" ? "#4ade80" : "#1a1a1a"} stopOpacity="0.92" />
              <stop offset="0.085" stopColor={variant === "primary" ? "#4ade80" : "#1a1a1a"} stopOpacity="0.85" />
              <stop offset="0.17" stopColor={variant === "primary" ? "#4ade80" : "#1a1a1a"} stopOpacity="0.75" />
              <stop offset="0.258" stopColor={variant === "primary" ? "#4ade80" : "#1a1a1a"} stopOpacity="0.65" />
              <stop offset="0.351" stopColor={variant === "primary" ? "#4ade80" : "#1a1a1a"} stopOpacity="0.55" />
              <stop offset="0.449" stopColor={variant === "primary" ? "#4ade80" : "#1a1a1a"} stopOpacity="0.45" />
              <stop offset="0.554" stopColor={variant === "primary" ? "#4ade80" : "#1a1a1a"} stopOpacity="0.35" />
              <stop offset="0.669" stopColor={variant === "primary" ? "#4ade80" : "#1a1a1a"} stopOpacity="0.25" />
              <stop offset="0.804" stopColor={variant === "primary" ? "#4ade80" : "#1a1a1a"} stopOpacity="0.15" />
              <stop offset="1" stopColor={variant === "primary" ? "#4ade80" : "#1a1a1a"} stopOpacity="0" />
            </linearGradient>
            <linearGradient id={gradientId2} x1="95.4995" y1="-65.5377" x2="95.4995" y2="83.1847" gradientUnits="userSpaceOnUse">
              <stop stopColor={variant === "primary" ? "#4ade80" : "#2a2a2a"} stopOpacity="0.8" />
              <stop offset="0.005" stopColor={variant === "primary" ? "#4ade80" : "#2a2a2a"} stopOpacity="0.75" />
              <stop offset="0.085" stopColor={variant === "primary" ? "#4ade80" : "#2a2a2a"} stopOpacity="0.65" />
              <stop offset="0.17" stopColor={variant === "primary" ? "#4ade80" : "#2a2a2a"} stopOpacity="0.55" />
              <stop offset="0.258" stopColor={variant === "primary" ? "#4ade80" : "#2a2a2a"} stopOpacity="0.45" />
              <stop offset="0.351" stopColor={variant === "primary" ? "#4ade80" : "#2a2a2a"} stopOpacity="0.35" />
              <stop offset="0.449" stopColor={variant === "primary" ? "#4ade80" : "#2a2a2a"} stopOpacity="0.25" />
              <stop offset="0.554" stopColor={variant === "primary" ? "#4ade80" : "#2a2a2a"} stopOpacity="0.18" />
              <stop offset="0.669" stopColor={variant === "primary" ? "#4ade80" : "#2a2a2a"} stopOpacity="0.12" />
              <stop offset="0.804" stopColor={variant === "primary" ? "#4ade80" : "#2a2a2a"} stopOpacity="0.06" />
              <stop offset="1" stopColor={variant === "primary" ? "#4ade80" : "#2a2a2a"} stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Corner dots - top right */}
          <circle cx="174.161" cy="7.161" r="1.161" fill={variant === "primary" ? "#4ade80" : "#EFEFEF"} />
          <circle cx="174.161" cy="11.739" r="1.161" fill={variant === "primary" ? "#4ade80" : "#EFEFEF"} />
          <circle cx="178.63" cy="7.161" r="1.161" fill={variant === "primary" ? "#4ade80" : "#EFEFEF"} />
          <circle cx="178.63" cy="11.739" r="1.161" fill={variant === "primary" ? "#4ade80" : "#EFEFEF"} />
          
          {/* Main button shape */}
          <path d="M4.5 6L10 0.5H181L186.5 6V46L181 51.5H10L4.5 45.7834V6Z" fill={`url(#${gradientId1})`} stroke={variant === "primary" ? "#4ade80" : "white"} strokeWidth="0.5" />
          
          {/* Side dots - left */}
          <circle cx="0.621" cy="23.621" r="0.621" fill={variant === "primary" ? "#4ade80" : "#EFEFEF"} />
          <circle cx="0.621" cy="28.91" r="0.621" fill={variant === "primary" ? "#4ade80" : "#EFEFEF"} />
          
          {/* Border outline */}
          <path d="M181.07 52H9.9311L4 46.1001V5.8994L9.9311 0H181.07L187 5.8994V46.1001L181.07 52ZM10.1235 51.5332H180.876L186.531 45.9069V6.09266L180.876 0.466799L10 0.5L4.5 6L4.46916 45.9069L10.1235 51.5332Z" fill="white" />
          <path d="M181.07 52H9.9311L4 46.1001V5.8994L9.9311 0H181.07L187 5.8994V46.1001L181.07 52ZM10.1235 51.5332H180.876L186.531 45.9069V6.09266L180.876 0.466799L10 0.5L4.5 6L4.46916 45.9069L10.1235 51.5332Z" fill={`url(#${gradientId2})`} />
        </svg>

        {/* Text overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <HyperText
            text={children as string}
            className={`cursor-pointer ${sizeStyles.textClass} ${variant === "primary" ? "text-green-300" : "text-slate-600 dark:text-slate-300"}`}
            duration={800}
            animateOnLoad={true}
          />
        </div>
      </motion.div>
    </motion.button>
  )
}
