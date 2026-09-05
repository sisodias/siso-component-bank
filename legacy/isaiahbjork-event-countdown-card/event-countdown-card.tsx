"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { buttonVariants } from "./button"
import { Calendar, Clock, Users } from "lucide-react"
import { cn } from "../_utils/cn"

interface EventCountdownCardProps {
  title?: string
  date?: Date
  image?: string
  attendees?: number
  onJoin?: () => void
  enableAnimations?: boolean
  className?: string
}

export function EventCountdownCard({
  title = "React & AI Workshop",
  date,
  image = "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop", // Tech meetup/workshop
  attendees = 42,
  onJoin,
  enableAnimations = true,
  className,
}: EventCountdownCardProps) {
  // Stable event date - only calculate once when no date prop is provided
  const [eventDate] = useState(() => 
    date || new Date(Date.now() + 2 * 24 * 3600 * 1000 + 5 * 3600 * 1000 + 30 * 60 * 1000)
  )
  
  // Initialize timeLeft with the correct calculation
  const [timeLeft, setTimeLeft] = useState(() => {
    const targetDate = date || eventDate
    return Math.max(0, Math.floor((+targetDate - Date.now()) / 1000))
  })
  const shouldReduceMotion = useReducedMotion()
  const shouldAnimate = enableAnimations && !shouldReduceMotion

  useEffect(() => {
    const targetDate = date || eventDate
    
    const update = () => {
      const remaining = Math.max(0, Math.floor((+targetDate - Date.now()) / 1000))
      setTimeLeft(remaining)
    }
    
    // Update immediately
    update()
    
    // Then update every second
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [date, eventDate])

  const getTimeUnits = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return { days, hours, minutes, seconds: secs }
  }

  const { days, hours, minutes, seconds } = getTimeUnits(timeLeft)

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.95,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
        staggerChildren: 0.08,
        delayChildren: 0.1,
      }
    },
    rest: { 
      scale: 1,
      y: 0,
      filter: "blur(0px)",
    },
    hover: shouldAnimate ? { 
      scale: 1.03, 
      y: -6,
      filter: "blur(0px)",
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        mass: 0.8,
      }
    } : {},
  }

  const numberVariants = {
    initial: { scale: 1, opacity: 1 },
    pulse: shouldAnimate ? {
      scale: [1, 1.15, 1],
      opacity: [1, 0.7, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    } : {},
  }

  const urgentVariants = {
    initial: { scale: 1 },
    urgent: shouldAnimate ? {
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    } : {},
  }

  const childVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 28,
        mass: 0.6,
      },
    },
  }

  const buttonVariants_motion = {
    hidden: {
      opacity: 0,
      y: 15,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.7,
      },
    },
    rest: { scale: 1, y: 0 },
    hover: shouldAnimate ? { 
      scale: 1.05, 
      y: -2,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25 
      }
    } : {},
    tap: shouldAnimate ? { scale: 0.95 } : {},
  }

  return (
    <motion.div
      data-slot="event-countdown-card"
      initial={shouldAnimate ? "hidden" : "visible"}
      animate="visible"
      whileHover="hover"
      variants={containerVariants}
      className={cn(
        "relative w-80 rounded-2xl border border-border/50 bg-card text-card-foreground overflow-hidden",
        "shadow-lg shadow-black/5 cursor-pointer group",
        className
      )}
    >
      {/* Image Container */}
      <motion.div 
        className="relative overflow-hidden"
        variants={shouldAnimate ? childVariants : {}}
      >
        <motion.img 
          src={image} 
          alt={title} 
          className="h-48 w-full object-cover"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        
        {/* Urgency Badge */}
        {timeLeft > 0 && timeLeft < 86400 && ( // Less than 24 hours
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold"
          >
            Starts Soon!
          </motion.div>
        )}
      </motion.div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title & Meta */}
        <motion.div 
          className="space-y-2"
          variants={shouldAnimate ? childVariants : {}}
        >
          <motion.h3 
            className="text-xl font-bold leading-tight tracking-tight"
            initial={{ opacity: 0.9 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {title}
          </motion.h3>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{(date || eventDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{attendees} attending</span>
            </div>
          </div>
        </motion.div>

        {/* Countdown Display */}
        {timeLeft > 0 ? (
          <motion.div 
            className="space-y-3"
            variants={shouldAnimate ? childVariants : {}}
          >
            <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Event starts in:</span>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {[
                { value: days, label: "Days" },
                { value: hours, label: "Hours" },
                { value: minutes, label: "Min" },
                { value: seconds, label: "Sec" },
              ].map((unit, index) => (
                <motion.div
                  key={unit.label}
                  variants={index === 3 ? numberVariants : {}} // Only seconds pulse
                  initial="initial"
                  animate={index === 3 ? "pulse" : "initial"}
                  className="bg-muted/50 rounded-xl p-3 text-center border border-border/30"
                >
                  <div className="text-lg font-bold tabular-nums">
                    {unit.value.toString().padStart(2, "0")}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    {unit.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={shouldAnimate ? childVariants : {}}
            className="text-center py-4"
          >
            <div className="text-lg font-bold text-green-600">Event Started!</div>
            <div className="text-sm text-muted-foreground">Join now to participate</div>
          </motion.div>
        )}

        {/* Action Button */}
        <motion.button
          onClick={onJoin}
          variants={buttonVariants_motion}
          initial={shouldAnimate ? "hidden" : "visible"}
          animate="visible"
          whileHover="hover"
          whileTap="tap"
          className={cn(
            buttonVariants({ variant: "default" }), 
            "w-full h-11 font-medium",
            "bg-gradient-to-r from-primary to-primary/90",
            "hover:from-primary/90 hover:to-primary",
            "shadow-lg shadow-primary/25"
          )}
        >
          {timeLeft > 0 ? "Reserve Your Spot" : "Join Event"}
        </motion.button>
      </div>
    </motion.div>
  )
}
