"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

const testimonials = [
  {
    id: 1,
    quote: "A rare talent who bridges the gap between aesthetics and functionality with remarkable precision.",
    name: "Sarah Chen",
    role: "Design Director",
    company: "Figma",
    image: "https://plus.unsplash.com/premium_photo-1689551671541-31a345ce6ae0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXZhdGFyc3xlbnwwfHwwfHx8MA%3D%3D$0",
  },
  {
    id: 2,
    quote: "Every pixel tells a story. Working together elevated our entire brand experience.",
    name: "Marcus Webb",
    role: "Creative Lead",
    company: "Stripe",
    image: "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D$0",
  },
  {
    id: 3,
    quote: "Transforms complex problems into elegant, intuitive solutions that users love.",
    name: "Elena Voss",
    role: "Head of Product",
    company: "Linear",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXZhdGFyc3xlbnwwfHwwfHx8MA%3D%3D$0",
  },
]

export function TestimonialsSplit() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const active = testimonials[activeIndex]

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-6">
      <div
        className="relative grid grid-cols-[1fr_auto] gap-12 items-center cursor-pointer group"
        onClick={nextTestimonial}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Left: Quote Content */}
        <div className="space-y-8">
          {/* Company Tag */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active.company}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground"
            >
              <span className="w-8 h-px bg-muted-foreground/50" />
              {active.company}
            </motion.div>
          </AnimatePresence>

          {/* Quote */}
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={active.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl md:text-4xl font-light leading-[1.3] tracking-tight text-foreground"
              >
                {active.quote}
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Author Info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <div className="w-10 h-px bg-foreground/20" />
              <div>
                <p className="text-sm font-medium text-foreground">{active.name}</p>
                <p className="text-xs text-muted-foreground">{active.role}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Visual Element */}
        <div className="relative w-48 h-64">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, filter: "blur(20px)", scale: 1.05 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0, filter: "blur(20px)", scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <div className="w-full h-full rounded-2xl overflow-hidden border border-border/50">
                <img
                  src={active.image || "/placeholder.svg"}
                  alt={active.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Click indicator */}
          <motion.div
            animate={{
              opacity: isHovering ? 1 : 0,
              scale: isHovering ? 1 : 0.8,
            }}
            transition={{ duration: 0.2 }}
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-muted-foreground"
          >
            <span>Next</span>
            <ArrowUpRight className="w-3 h-3" />
          </motion.div>
        </div>

        {/* Progress Dots */}
        <div className="absolute -bottom-16 left-0 flex items-center gap-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation()
                setActiveIndex(index)
              }}
              className="relative p-1 group/dot"
            >
              <span
                className={`
                  block w-2 h-2 rounded-full transition-all duration-300
                  ${
                    index === activeIndex
                      ? "bg-foreground scale-100"
                      : "bg-muted-foreground/30 scale-75 hover:bg-muted-foreground/50 hover:scale-100"
                  }
                `}
              />
              {index === activeIndex && (
                <motion.span
                  layoutId="activeDot"
                  className="absolute inset-0 border border-foreground/30 rounded-full"
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
