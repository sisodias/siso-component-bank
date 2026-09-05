"use client"

import * as React from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { Eye, EyeOff, Wifi } from "lucide-react"
import { cn } from "../_utils/cn"

const PERSPECTIVE = 1000
const CARD_ANIMATION_DURATION = 0.6
const INITIAL_DELAY = 0.2

interface CreditCardProps extends React.HTMLAttributes<HTMLDivElement> {
  cardNumber?: string
  cardHolder?: string
  expiryDate?: string
  cvv?: string
  variant?: "gradient" | "dark" | "glass"
}

export default function CreditCard({
  cardNumber = "4532 1234 5678 9010",
  cardHolder = "ANKIT VERMA",
  expiryDate = "12/28",
  cvv = "123",
  variant = "gradient",
}: CreditCardProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [isFlipped, setIsFlipped] = React.useState(false)
  const [isClicked, setIsClicked] = React.useState(false)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [10, -10])
  const rotateY = useTransform(x, [-100, 100], [-10, 10])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(event.clientX - centerX)
    y.set(event.clientY - centerY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const getMaskedNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, '')
    const lastFour = cleaned.slice(-4)
    return `•••• •••• •••• ${lastFour}`
  }

  const variantStyles = {
    gradient: "bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600",
    dark: "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900",
    glass: "bg-white/15 dark:bg-white/10 backdrop-blur-xl border border-white/20",
  }

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden w-full">
      {/* Background with dark mode support */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-purple-100 to-blue-100 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900" />
      
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-cyan-300/20 dark:bg-cyan-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative">
        <motion.div
          className="relative w-96 h-56"
          style={{ perspective: PERSPECTIVE }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: CARD_ANIMATION_DURATION }}
        >
          <motion.div
            className="relative w-full h-full cursor-pointer"
            style={{ 
              transformStyle: "preserve-3d",
              rotateX,
              rotateY: isFlipped ? 180 : rotateY,
            }}
            animate={{ 
              scale: isClicked ? 0.95 : 1,
            }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 20 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              setIsClicked(true)
              setTimeout(() => setIsClicked(false), 200)
              setTimeout(() => setIsFlipped(!isFlipped), 100)
            }}
          >
            {/* Front of card */}
            <motion.div
              className={cn(
                "absolute inset-0 rounded-2xl p-8 shadow-2xl",
                variantStyles[variant],
                "backface-hidden"
              )}
              style={{ 
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden"
              }}
            >
              {/* Card shimmer effect */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "linear",
                  }}
                />
              </div>

              {/* Card content */}
              <div className="relative h-full flex flex-col justify-between text-white">
                {/* Top section */}
                <div className="flex justify-between items-start">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: INITIAL_DELAY }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-12 h-9 rounded bg-gradient-to-br from-amber-600 to-yellow-700 shadow-inner" />
                    <Wifi className="w-6 h-6 rotate-90" />
                  </motion.div>

                  <motion.button
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      delay: 0.4,
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsVisible(!isVisible)
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </motion.button>
                </div>

                {/* Card number */}
                <motion.div
                  className="text-2xl font-mono tracking-wider"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {isVisible ? cardNumber : getMaskedNumber(cardNumber)}
                </motion.div>

                {/* Bottom section */}
                <div className="flex justify-between items-end">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="text-xs opacity-70 mb-1">CARD HOLDER</div>
                    <div className="font-medium text-sm tracking-wide">{cardHolder}</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="text-xs opacity-70 mb-1">EXPIRES</div>
                    <div className="font-medium text-sm">{isVisible ? expiryDate : "••/••"}</div>
                  </motion.div>

                  <motion.div
                    className="text-3xl font-bold italic"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: 0.6,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    VISA
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Back of card */}
            <motion.div
              className={cn(
                "absolute inset-0 rounded-2xl shadow-2xl",
                variantStyles[variant],
                "backface-hidden"
              )}
              style={{ 
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)"
              }}
            >
              {/* Magnetic strip */}
              <div className="absolute top-8 left-0 right-0 h-12 bg-black/80" />
              
              {/* Signature panel */}
              <div className="absolute top-24 left-6 right-6 bg-white/90 h-10 rounded flex items-center justify-end px-3">
                <motion.div 
                  className="text-black font-mono font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {isVisible ? cvv : "•••"}
                </motion.div>
              </div>

              {/* Card info */}
              <div className="absolute bottom-8 left-8 right-8 text-white text-xs space-y-2 opacity-70">
                <p>This card is property of issuing bank</p>
                <p>Customer Service: 1-800-VISA</p>
                <p className="text-[10px]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                  Authorized signature required for all transactions.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating elements */}
          <motion.div
            className="absolute -top-4 -right-4 w-20 h-20 bg-violet-400/30 dark:bg-violet-500/20 rounded-full blur-2xl"
            animate={{
              scale: isClicked ? [1, 1.5, 1] : [1, 1.2, 1],
              opacity: isClicked ? [0.2, 0.6, 0.2] : [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: isClicked ? 0.3 : 3,
              repeat: isClicked ? 0 : Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-4 -left-4 w-24 h-24 bg-pink-400/30 dark:bg-pink-500/20 rounded-full blur-2xl"
            animate={{
              scale: isClicked ? [1, 1.6, 1] : [1, 1.3, 1],
              opacity: isClicked ? [0.2, 0.6, 0.2] : [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: isClicked ? 0.3 : 4,
              repeat: isClicked ? 0 : Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Click ripple effect */}
          {isClicked && (
            <motion.div
              className="absolute inset-0 rounded-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="h-full w-full rounded-2xl border-2 border-white/50 dark:border-white/30" />
            </motion.div>
          )}
        </motion.div>

        {/* Instructions - moved closer to card */}
        <motion.div
          className="text-center text-gray-600 dark:text-gray-400 text-sm mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <p>Click to flip • 3D mouse effect • Eye reveals details</p>
        </motion.div>
      </div>
    </div>
  )
}