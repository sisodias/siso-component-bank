"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ArrowRight, Sparkles, Clock } from "lucide-react"

const TARGET_DATE = new Date()
TARGET_DATE.setDate(TARGET_DATE.getDate() + 3)
TARGET_DATE.setHours(0, 0, 0, 0)

function getTimeLeft() {
  const diff = TARGET_DATE.getTime() - Date.now()
  
  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0 }
  }

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return { hours, minutes, seconds }
}

function AnimatedDigit({ value }: { value: number }) {
  return (
    <div className="relative h-[1em] w-[1.2em] overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {String(value).padStart(2, "0")}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center bg-secondary/50 backdrop-blur-sm border border-border/50 rounded-xl px-4 py-3 md:px-6 md:py-5 min-w-[80px] md:min-w-[100px] shadow-sm overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="font-mono text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-foreground">
          <AnimatedDigit value={value} />
        </span>
      </div>
      <span className="text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

export function CountdownBanner() {
  const [time, setTime] = useState<{ hours: number; minutes: number; seconds: number } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTime(getTimeLeft())
    const interval = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  return (
    <section className="relative w-full px-4 py-12 md:py-24 overflow-hidden flex items-center justify-center min-h-screen bg-background">
      {/* Background decorative elements */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl -top-1/2 -left-1/4" />
        <div className="absolute w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl bottom-0 right-0" />
      </div>

      <div className="relative w-full max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl p-8 md:p-16 flex flex-col items-center gap-8 md:gap-12 text-center shadow-2xl overflow-hidden"
        >
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          
          <div className="flex flex-col items-center gap-4 relative z-10">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-border/50 text-xs font-medium text-secondary-foreground"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Early Access Opening Soon</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-3xl lg:text-6xl font-semibold tracking-tight text-balance text-foreground">
Launching Soon
            </h2>
            
            <p className="text-muted-foreground text-base md:text-lg max-w-xl leading-relaxed">
              Be among the first to experience our revolutionary new platform. Reserve your spot before the timer runs out.
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-4 relative z-10">
            <TimeUnit value={time?.hours ?? 0} label="Hours" />
            <div className="flex flex-col items-center justify-center pb-6">
              <span className="text-2xl md:text-4xl font-light text-muted-foreground/50 animate-pulse">:</span>
            </div>
            <TimeUnit value={time?.minutes ?? 0} label="Minutes" />
            <div className="flex flex-col items-center justify-center pb-6">
              <span className="text-2xl md:text-4xl font-light text-muted-foreground/50 animate-pulse">:</span>
            </div>
            <TimeUnit value={time?.seconds ?? 0} label="Seconds" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto relative z-10"
          >
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
              <span>Get Notified</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-all">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>Add to Calendar</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
