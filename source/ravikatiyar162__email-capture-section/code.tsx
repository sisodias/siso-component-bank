"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface AccountsPayableHeroProps {
  heading?: string
  subheading?: string
  inputPlaceholder?: string
  buttonText?: string
  poweredByText?: string
  stickyNoteText?: string
  onSubmit?: (email: string) => void
  onDemoClick?: () => void
  className?: string
}

export const AccountsPayableHero = ({
  heading = "Get started with Acctual's accounts payable today",
  subheading,
  inputPlaceholder = "Enter your work email",
  buttonText = "See a demo",
  poweredByText = "Powered by Acctual",
  stickyNoteText = "Everything's looking great! Thanks!",
  onSubmit,
  onDemoClick,
  className,
}: AccountsPayableHeroProps) => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)
    try {
      onSubmit?.(email)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={cn(
        "relative min-h-screen w-full bg-gradient-to-b from-background via-background to-muted/20 overflow-hidden flex flex-col items-center justify-center px-4 py-12 md:py-20",
        className,
      )}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main content container */}
      <div className="relative z-10 max-w-2xl w-full space-y-8 md:space-y-12">
        {/* Sticky note with advanced animation */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="relative w-48 h-40 md:w-56 md:h-48 perspective">
            {/* Sticky note shadow */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 rounded-sm transform translate-x-3 translate-y-3 blur-lg opacity-40" />

            {/* Sticky note */}
            <div
              className="absolute inset-0 bg-yellow-300 rounded-sm shadow-2xl transform origin-center animate-in fade-in zoom-in duration-700"
              style={{
                transform: "perspective(1000px) rotateX(-8deg) rotateY(12deg) rotateZ(-5deg)",
                animation: "float 3s ease-in-out infinite, fadeInSticky 0.8s ease-out",
              }}
            >
              {/* Sticky note texture */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/30 to-transparent rounded-sm" />

              {/* Sticky note text */}
              <div className="relative h-full flex items-center justify-center p-4">
                <p className="text-center text-sm md:text-base font-handwriting text-gray-700 leading-relaxed">
                  {stickyNoteText}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Heading with staggered animation */}
        <div className="space-y-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
            {heading}
          </h1>
          {subheading && <p className="text-lg md:text-xl text-muted-foreground">{subheading}</p>}
        </div>

        {/* Email input and button container */}
        <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xl mx-auto">
            {/* Email input */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={inputPlaceholder}
              className={cn(
                "flex-1 px-6 py-3 md:py-4 rounded-full bg-background border-2 border-input",
                "text-foreground placeholder:text-muted-foreground",
                "transition-all duration-300 ease-out",
                "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
                "hover:border-primary/50",
                "text-sm md:text-base",
              )}
              required
            />

            {/* Demo button */}
            <button
              type="button"
              onClick={onDemoClick}
              className={cn(
                "px-8 py-3 md:py-4 rounded-full font-semibold",
                "bg-primary text-primary-foreground",
                "transition-all duration-300 ease-out",
                "hover:shadow-lg hover:scale-105 active:scale-95",
                "focus:outline-none focus:ring-2 focus:ring-primary/50",
                "text-sm md:text-base whitespace-nowrap",
                "relative overflow-hidden group",
              )}
            >
              {/* Button shine effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              <span className="relative">{buttonText}</span>
            </button>
          </div>
        </form>

        {/* Footer text with fade animation */}
        <div className="text-center animate-in fade-in duration-700 delay-500">
          <p className="text-sm md:text-base text-muted-foreground">{poweredByText}</p>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: perspective(1000px) rotateX(-8deg) rotateY(12deg) rotateZ(-5deg) translateY(0px);
          }
          50% {
            transform: perspective(1000px) rotateX(-8deg) rotateY(12deg) rotateZ(-5deg) translateY(-20px);
          }
        }

        @keyframes fadeInSticky {
          0% {
            opacity: 0;
            transform: perspective(1000px) rotateX(20deg) rotateY(-20deg) rotateZ(10deg) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: perspective(1000px) rotateX(-8deg) rotateY(12deg) rotateZ(-5deg) scale(1);
          }
        }

        .font-handwriting {
          font-family: 'Segoe Print', 'Comic Sans MS', cursive, sans-serif;
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .perspective {
          perspective: 1000px;
        }
      `}</style>
    </div>
  )
}
