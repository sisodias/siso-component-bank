"use client"

import { motion } from "framer-motion"

export function Component() {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="relative">
        {/* Outer rotating ring */}
        <motion.div
          className="w-28 h-28 border-4 border-transparent border-t-purple-400 border-r-purple-400 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {/* Inner counter-rotating ring */}
        <motion.div
          className="absolute top-2 left-2 w-24 h-24 border-4 border-transparent border-b-cyan-400 border-l-cyan-400 rounded-full"
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {/* Center pulsing core */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              top: "50%",
              left: "50%",
            }}
            animate={{
              x: [0, Math.cos((i * Math.PI) / 4) * 60],
              y: [0, Math.sin((i * Math.PI) / 4) * 60],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Orbiting dots */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`orbit-${i}`}
            className="absolute w-3 h-3 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transformOrigin: `${40 + i * 15}px 0px`,
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 4 + i,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </div>


      {/* Background ambient glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-purple-500/20 via-transparent to-transparent"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}
