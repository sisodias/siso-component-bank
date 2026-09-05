"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring, animate } from "framer-motion"
import { useTheme } from "next-themes"
import { Send, Sparkles, Zap, Shield, PlayCircle, Mouse } from "lucide-react"
import { cn } from "@/lib/utils" // Assuming a `cn` utility exists for merging class names
import { Button, ButtonProps } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// --- HELPER COMPONENTS ---

// Memoized CSS Grid Background for performance
function CssGridBackground() {
  return (
    <>
      {/* Grid overlay that fades from outside to inside */}
      <div
        className="absolute inset-0 pointer-events-none z-[-1] grid-background"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(36, 101, 237, 0.2) 0.5px, transparent 0.5px),
            linear-gradient(to bottom, rgba(36, 101, 237, 0.2) 0.5px, transparent 0.5px)`,
          backgroundSize: "80px 80px", // Increased from 40px to 80px
          maskImage: "radial-gradient(circle at center, transparent 20%, black 70%)",
          WebkitMaskImage: "radial-gradient(circle at center, transparent 20%, black 70%)",
        }}
        aria-hidden="true"
      />

      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[-2] grid-gradient"
        style={{
          background: "radial-gradient(70% 70% at 50% 50%, transparent 0%, rgba(36, 101, 237, 0.05) 100%)",
        }}
        aria-hidden="true"
      />
    </>
  )
}

// Memoized Framer Motion Spotlight Effect
function FramerSpotlight() {
  const [isMounted, setIsMounted] = useState(false)
  const [isMouseInHero, setIsMouseInHero] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement | null>(null)
  const defaultPositionRef = useRef({ x: 0, y: 0 })
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  // Motion values for the spotlight position with spring physics
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Add spring physics for smoother movement
  const springX = useSpring(mouseX, { damping: 20, stiffness: 300 })
  const springY = useSpring(mouseY, { damping: 20, stiffness: 300 })

  // Define multiple spotlight colors
  const spotlightColors = [
    { color: "rgba(36, 101, 237, 0.2)", darkColor: "rgba(36, 101, 237, 0.25)" }, // Blue (primary)
    { color: "rgba(236, 72, 153, 0.15)", darkColor: "rgba(236, 72, 153, 0.2)" }, // Pink
    { color: "rgba(16, 185, 129, 0.15)", darkColor: "rgba(16, 185, 129, 0.2)" }, // Green
  ]

  // Update default position without causing re-renders
  const updateDefaultPosition = () => {
    if (heroRef.current) {
      const heroRect = heroRef.current.getBoundingClientRect()
      const centerX = heroRect.left + heroRect.width / 2
      const centerY = heroRect.top + heroRect.height / 3

      defaultPositionRef.current = { x: centerX, y: centerY }

      // Set initial position
      mouseX.set(centerX)
      mouseY.set(centerY)
    }
  }

  // Handle mouse enter/leave for hero section
  const handleMouseEnter = () => {
    setIsMouseInHero(true)
  }

  const handleMouseLeave = () => {
    setIsMouseInHero(false)

    // Animate back to default position
    animate(mouseX, defaultPositionRef.current.x, {
      duration: 1.2,
      ease: "easeInOut",
    })

    animate(mouseY, defaultPositionRef.current.y, {
      duration: 1.2,
      ease: "easeInOut",
    })
  }

  // Handle mouse movement only when inside hero
  const handleMouseMove = (e: MouseEvent) => {
    if (isMouseInHero) {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
  }

  // Setup effect - runs once on mount and cleans up on unmount
  useEffect(() => {
    setIsMounted(true)

    // Find the hero section element
    heroRef.current = document.getElementById("hero")

    // Initial setup
    updateDefaultPosition()

    // Event listeners
    window.addEventListener("resize", updateDefaultPosition)
    window.addEventListener("mousemove", handleMouseMove)

    if (heroRef.current) {
      heroRef.current.addEventListener("mouseenter", handleMouseEnter)
      heroRef.current.addEventListener("mouseleave", handleMouseLeave)
    }

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateDefaultPosition)
      window.removeEventListener("mousemove", handleMouseMove)

      if (heroRef.current) {
        heroRef.current.removeEventListener("mouseenter", handleMouseEnter)
        heroRef.current.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [isMouseInHero]) // Only depend on isMouseInHero

  if (!isMounted) {
    return null
  }

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary spotlight that follows mouse/animation */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${
            isDark ? spotlightColors[0].darkColor : spotlightColors[0].color
          } 0%, transparent 70%)`,
          width: "1000px",
          height: "1000px",
          borderRadius: "50%",
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Secondary spotlights with independent animations */}
      <motion.div
        className="absolute pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          x: ["0%", "10%", "5%", "0%"],
          y: ["0%", "5%", "10%", "0%"],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
        style={{
          background: `radial-gradient(circle, ${
            isDark ? spotlightColors[1].darkColor : spotlightColors[1].color
          } 0%, transparent 70%)`,
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          left: "20%",
          top: "30%",
        }}
      />

      <motion.div
        className="absolute pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.2, 0.5, 0.2],
          x: ["0%", "-10%", "-5%", "0%"],
          y: ["0%", "-5%", "-10%", "0%"],
        }}
        transition={{
          duration: 18,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
        style={{
          background: `radial-gradient(circle, ${
            isDark ? spotlightColors[2].darkColor : spotlightColors[2].color
          } 0%, transparent 70%)`,
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          right: "20%",
          bottom: "30%",
        }}
      />

      {/* Additional colored spotlights */}
      <motion.div
        className="absolute pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
        style={{
          background: `radial-gradient(circle, ${
            isDark ? "rgba(168, 85, 247, 0.2)" : "rgba(168, 85, 247, 0.15)"
          } 0%, transparent 70%)`,
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          left: "60%",
          top: "20%",
        }}
      />

      <motion.div
        className="absolute pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.15, 0.3, 0.15],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          delay: 2,
        }}
        style={{
          background: `radial-gradient(circle, ${
            isDark ? "rgba(251, 191, 36, 0.2)" : "rgba(251, 191, 36, 0.15)"
          } 0%, transparent 70%)`,
          width: "550px",
          height: "550px",
          borderRadius: "50%",
          left: "30%",
          bottom: "15%",
        }}
      />
    </div>
  )
}

// Memoized Typing Prompt Input
const EnhancedTypingPrompt = React.memo(({ prompts }: { prompts: string[] }) => {
  const [placeholder, setPlaceholder] = useState("")
  const [value, setValue] = useState("")
  const [promptIndex, setPromptIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    const typingSpeed = 40
    const deletingSpeed = 15
    const pauseDuration = 2500
    let timeout: NodeJS.Timeout

    const currentPrompt = prompts[promptIndex]

    if (isTyping) {
      if (placeholder.length < currentPrompt.length) {
        timeout = setTimeout(() => {
          setPlaceholder(currentPrompt.slice(0, placeholder.length + 1))
        }, typingSpeed)
      } else {
        timeout = setTimeout(() => setIsTyping(false), pauseDuration)
      }
    } else {
      if (placeholder.length > 0) {
        timeout = setTimeout(() => {
          setPlaceholder(placeholder.slice(0, -1))
        }, deletingSpeed)
      } else {
        setIsTyping(true)
        setPromptIndex((prev) => (prev + 1) % prompts.length)
      }
    }

    return () => clearTimeout(timeout)
  }, [placeholder, isTyping, promptIndex, prompts])

  return (
    <div className="relative w-full max-w-3xl">
      <motion.div
        className="relative group"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary/30 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition-all duration-300" />
        <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-primary/60" />
        <form
          className="relative bg-background/80 backdrop-blur-xl border border-primary/20 rounded-2xl shadow-lg"
          onSubmit={(e) => {
            e.preventDefault()
            console.log("Submitted:", value)
            setValue("")
          }}
        >
          <Input
            className="w-full pr-24 pl-6 py-8 text-md sm:text-lg rounded-2xl border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          {value === "" && (
            <div className="absolute right-24 top-1/2 -translate-y-1/2 w-px h-6 bg-primary animate-pulse" />
          )}
          <Button
            type="submit"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-primary cursor-pointer hover:bg-primary/90 rounded-xl"
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </motion.div>
    </div>
  )
})
EnhancedTypingPrompt.displayName = "EnhancedTypingPrompt"

// --- PROP INTERFACES ---

interface CtaButtonProps extends ButtonProps {
  icon: React.ElementType
  primaryText: string
  secondaryText: string
  hasShine?: boolean
}

const CtaButton = React.forwardRef<HTMLButtonElement, CtaButtonProps>(
  ({ icon: Icon, primaryText, secondaryText, className, hasShine, ...props }, ref) => (
    <Button
      size="lg"
      className={cn(
        "group h-auto rounded-xl px-6 py-4 text-base font-semibold transition-all duration-300 hover:scale-105",
        hasShine && "relative overflow-hidden",
        className
      )}
      ref={ref}
      {...props}
    >
      {hasShine && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      )}
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5" />
        <div className="flex flex-col items-start text-left">
          <span>{primaryText}</span>
          <span className="text-xs font-normal text-muted-foreground">{secondaryText}</span>
        </div>
      </div>
    </Button>
  )
)
CtaButton.displayName = "CtaButton"

interface HeroSectionProps {
  badge: { icon: React.ElementType; label: string; version?: string }
  title: React.ReactNode
  subtitle: string
  typingPrompts: string[]
  primaryCta: CtaButtonProps
  secondaryCta: CtaButtonProps
  trustIndicators: Array<{ icon: React.ElementType; label: string; colorClass: string }>
}

// --- MAIN HERO COMPONENT ---

export function HeroSection({
  badge,
  title,
  subtitle,
  typingPrompts,
  primaryCta,
  secondaryCta,
  trustIndicators,
}: HeroSectionProps) {
  const BadgeIcon = badge.icon
  return (
    <section id="hero" className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-16 md:py-20">
      <CssGridBackground />
      <FramerSpotlight />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm"
          >
            <BadgeIcon className="h-4 w-4" />
            {badge.label}
            {badge.version && (
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                {badge.version}
              </span>
            )}
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl lg:text-7xl"
          >
            {title}
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mb-8 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            {subtitle}
          </motion.p>

          {/* Interactive Prompt Input */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="mb-12 w-full"
          >
            <EnhancedTypingPrompt prompts={typingPrompts} />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <CtaButton
              {...primaryCta}
              className="bg-primary cursor-pointer text-primary-foreground shadow-lg hover:bg-primary/90"
            />
            <CtaButton
              {...secondaryCta}
              variant="outline"
              className="cursor-pointer border-2 bg-transparent hover:bg-muted/50"
            />
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="mt-16 flex flex-col items-center gap-6"
          >
            <p className="text-sm text-muted-foreground">Trusted by leading organizations worldwide</p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-80">
              {trustIndicators.map((indicator, index) => {
                const Icon = indicator.icon
                return (
                  <div key={index} className="flex items-center gap-2 text-sm font-medium">
                    <Icon className={cn("h-4 w-4", indicator.colorClass)} />
                    {indicator.label}
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs">Scroll to explore</span>
          <Mouse className="h-5 w-5" />
        </motion.div>
      </motion.div>
    </section>
  )
}
