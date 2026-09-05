"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Ball {
  color: string
  size: number
  duration: number
}

type GradientBallsProps = React.ComponentProps<'div'> & {
  size?: number
  balls?: Ball[]
}

const defaultBalls: Ball[] = [
  { color: "#ff6347", size: 12, duration: 3.4 },
  { color: "#00ced1", size: 18, duration: 6.1 },
  { color: "#adff2f", size: 10, duration: 2.9 },
  { color: "#9370db", size: 16, duration: 7.8 },
  { color: "#ff1493", size: 14, duration: 4.6 },
  { color: "#00bfff", size: 11, duration: 3.3 },
  { color: "#7fff00", size: 17, duration: 5.5 },
  { color: "#dc143c", size: 13, duration: 6.7 },
  { color: "#8a2be2", size: 19, duration: 8.2 },
  { color: "#48d1cc", size: 15, duration: 9.1 },
  { color: "#ff4500", size: 14, duration: 4.2 },
  { color: "#00ff7f", size: 16, duration: 5.8 },
  { color: "#ba55d3", size: 10, duration: 7.3 },
  { color: "#1e90ff", size: 18, duration: 6.4 },
  { color: "#ffa500", size: 20, duration: 10 },
  { color: "#ff69b4", size: 12, duration: 3.7 },
  { color: "#00fa9a", size: 11, duration: 2.6 },
  { color: "#9400d3", size: 17, duration: 6.9 },
  { color: "#ffb6c1", size: 13, duration: 5.3 },
  { color: "#20b2aa", size: 19, duration: 7.7 },
]

export function GradientBalls({ size = 300, className, balls = defaultBalls, ...props }: GradientBallsProps) {
  return (
    <div className={cn("relative scale-50 -translate-x-1/4", className)} style={{ width: size, height: size }} {...props}>
      {balls.map((ball, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full blur-[58px] mix-blend-hard-light"
          style={{
            backgroundColor: ball.color,
            width: size + ball.size,
            height: size + ball.size,
            transformOrigin: `${size}px ${size}px`,
          }}
          animate={{
            rotate: index % 2 === 0 ? 360 : -360,
          }}
          transition={{
            duration: ball.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}
