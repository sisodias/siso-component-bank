"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface FloatingPhoneProps extends React.HTMLAttributes<HTMLDivElement> {
  phoneColor?: string
  screenContent?: React.ReactNode
  headerIcons?: React.ReactNode
  floatDuration?: number
  floatDistance?: {
    z: number
    y: number
  }
  tiltAngle?: {
    x: number
    y: number
  }
}

const FloatingPhone = React.forwardRef<HTMLDivElement, FloatingPhoneProps>(
  (
    {
      className,
      phoneColor = "hsl(var(--primary))",
      screenContent,
      headerIcons,
      floatDuration = 2,
      floatDistance = { z: 24, y: 6 },
      tiltAngle = { x: 15, y: -30 },
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("grid place-content-center", className)}
        {...props}
      >
        <div
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${tiltAngle.y}deg) rotateX(${tiltAngle.x}deg)`,
            backgroundColor: phoneColor,
          }}
          className="rounded-[24px]"
        >
          <motion.div
            initial={{
              transform: `translateZ(8px) translateY(-2px)`,
            }}
            animate={{
              transform: `translateZ(${floatDistance.z + 8}px) translateY(-${floatDistance.y + 2}px)`,
            }}
            transition={{
              repeat: Infinity,
              repeatType: "mirror",
              duration: floatDuration,
              ease: "easeInOut",
            }}
            className="relative h-96 w-56 rounded-[24px] border-2 border-b-4 border-r-4 border-white/20 border-l-white/10 border-t-white/10 bg-neutral-900 p-1 pl-[3px] pt-[3px]"
          >
            {/* Notch */}
            <div className="absolute left-[50%] top-2.5 z-10 h-2 w-16 -translate-x-[50%] rounded-md bg-black"></div>
            
            {/* Header Icons */}
            <div className="absolute right-3 top-2 z-10 flex gap-2 text-white/60">
              {headerIcons}
            </div>

            {/* Screen */}
            <div className="relative z-0 grid h-full w-full place-content-center overflow-hidden rounded-[20px] bg-background">
              {screenContent}
            </div>
          </motion.div>
        </div>
      </div>
    )
  }
)

FloatingPhone.displayName = "FloatingPhone"

export { FloatingPhone }