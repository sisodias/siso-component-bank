"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Check, Users, UserCheck } from "lucide-react"
import { useState } from "react"
import { cn } from "../_utils/cn"

interface ProfileCardProps {
  name?: string
  description?: string
  image?: string
  isVerified?: boolean
  followers?: number
  following?: number
  enableAnimations?: boolean
  className?: string
  onFollow?: () => void
  isFollowing?: boolean
}

export function ProfileCard({
  name = "Sophie Bennett",
  description = "Product Designer who focuses on simplicity & usability.",
  image = "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=800&h=800&fit=crop&auto=format&q=80",
  isVerified = true,
  followers = 312,
  following = 48,
  enableAnimations = true,
  className,
  onFollow = () => {},
  isFollowing = false,
}: ProfileHoverCardProps) {
  const [hovered, setHovered] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const shouldAnimate = enableAnimations && !shouldReduceMotion

  const containerVariants = {
    rest: { 
      scale: 1,
      y: 0,
      filter: "blur(0px)",
    },
    hover: shouldAnimate ? { 
      scale: 1.02, 
      y: -4,
      filter: "blur(0px)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 28,
        mass: 0.6,
      }
    } : {},
  }

  const imageVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
  }

  const contentVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      filter: "blur(4px)",
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 28,
        mass: 0.6,
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 15,
      scale: 0.95,
      filter: "blur(2px)",
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.5,
      },
    },
  }

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        damping: 8,
        stiffness: 200,
        mass: 0.8,
      },
    },
  }

  return (
    <motion.div
      data-slot="profile-hover-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial="rest"
      whileHover="hover"
      variants={containerVariants}
      className={cn(
        "relative w-80 h-96 rounded-3xl border border-border/20 text-card-foreground overflow-hidden shadow-xl shadow-black/5 cursor-pointer group backdrop-blur-sm",
        "dark:shadow-black/20",
        className
      )}
    >
      {/* Full Cover Image */}
      <motion.img
        src={image}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover"
        variants={imageVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      {/* Smooth Blur Overlay - Multiple layers for seamless fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 via-background/20 via-background/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background/90 via-background/60 via-background/30 via-background/15 via-background/8 to-transparent backdrop-blur-[1px]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/85 via-background/40 to-transparent backdrop-blur-sm" />

      {/* Content */}
      <motion.div 
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-0 left-0 right-0 p-6 space-y-4"
      >
        {/* Name and Verification */}
        <motion.div variants={itemVariants} className="flex items-center gap-2">
          <motion.h2 
            className="text-2xl font-bold text-foreground"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.02,
                }
              }
            }}
          >
            {name.split("").map((letter, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="inline-block"
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </motion.h2>
          {isVerified && (
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-center w-4 h-4 rounded-full bg-green-500 text-white"
              whileHover={{ 
                scale: 1.1, 
                rotate: 5,
                transition: { type: "spring", stiffness: 400, damping: 20 }
              }}
            >
              <Check className="w-2.5 h-2.5" />
            </motion.div>
          )}
        </motion.div>

        {/* Description */}
        <motion.p 
          variants={itemVariants}
          className="text-muted-foreground text-sm leading-relaxed"
        >
          {description}
        </motion.p>

        {/* Stats */}
        <motion.div 
          variants={itemVariants}
          className="flex items-center gap-6 pt-2"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="font-semibold text-foreground">{followers}</span>
            <span className="text-sm">followers</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <UserCheck className="w-4 h-4" />
            <span className="font-semibold text-foreground">{following}</span>
            <span className="text-sm">following</span>
          </div>
        </motion.div>

        {/* Follow Button */}
        <motion.button
          variants={itemVariants}
          onClick={onFollow}
          whileHover={{ 
            scale: 1.02,
            transition: { type: "spring", stiffness: 400, damping: 25 }
          }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "w-full cursor-pointer py-3 px-4 rounded-2xl font-semibold text-sm transition-all duration-200",
            "border border-border/20 shadow-sm",
            isFollowing 
              ? "bg-muted text-muted-foreground hover:bg-muted/80" 
              : "bg-foreground text-background hover:bg-foreground/90",
            "transform-gpu"
          )}
        >
          {isFollowing ? "Following" : "Follow +"}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
