"use client"

import { useState, useRef, useEffect } from "react"
import { X, Sparkles, Home, Grid3x3, User } from "lucide-react"

interface AdaptiveNavigationProps {
  title?: string
  subtitle?: string
  placeholder?: string
  onSearch?: (query: string) => void
  onHomeClick?: () => void
  onAppsClick?: () => void
  onProfileClick?: () => void
  showLeftIcon?: boolean
  showRightIcons?: boolean
  variant?: "search" | "navigation"
  accentColor?: string
}

export const AdaptiveNavigation = ({
  title = "AI-Powered Adaptive Navigation",
  subtitle = "",
  placeholder = "Type to Search or Generate",
  onSearch,
  onHomeClick,
  onAppsClick,
  onProfileClick,
  showLeftIcon = true,
  showRightIcons = true,
  variant = "navigation",
  accentColor = "from-purple-400 via-pink-400 to-yellow-300",
}: AdaptiveNavigationProps) => {
  const [searchValue, setSearchValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Track mouse position for gradient animation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleClear = () => {
    setSearchValue("")
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${accentColor} opacity-20 dark:opacity-10 blur-3xl`}
          style={{
            transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-30 dark:opacity-10"
          style={{
            backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(148, 0, 211, 0.05) 25%, rgba(148, 0, 211, 0.05) 26%, transparent 27%, transparent 74%, rgba(148, 0, 211, 0.05) 75%, rgba(148, 0, 211, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(148, 0, 211, 0.05) 25%, rgba(148, 0, 211, 0.05) 26%, transparent 27%, transparent 74%, rgba(148, 0, 211, 0.05) 75%, rgba(148, 0, 211, 0.05) 76%, transparent 77%, transparent)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Title Section */}
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 bg-clip-text text-transparent mb-2">
            {title}
          </h1>
          {subtitle && <p className="text-lg text-muted-foreground animate-fade-in-delay">{subtitle}</p>}
        </div>

        {/* Navigation Bar */}
        <div
          className="w-full max-w-2xl animate-slide-up"
          style={{
            animation: "slideUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

            {/* Main container */}
            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-full shadow-2xl border border-white/20 dark:border-slate-700/20 p-3 md:p-4">
              <div className="flex items-center justify-between gap-3 md:gap-4">
                {/* Left Icon */}
                {showLeftIcon && variant === "navigation" && (
                  <button
                    onClick={onHomeClick}
                    className="flex-shrink-0 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-110 active:scale-95"
                    aria-label="Home"
                  >
                    <Home className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  </button>
                )}

                {/* Search Input */}
                <div className="flex-1 flex items-center gap-2 px-2 md:px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-800 border border-purple-200/50 dark:border-slate-700/50 transition-all duration-300 focus-within:border-purple-400 dark:focus-within:border-purple-500">
                  <Sparkles className="w-4 h-5 text-purple-500 flex-shrink-0 animate-pulse" />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value)
                      onSearch?.(e.target.value)
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-sm md:text-base"
                  />
                  {searchValue && (
                    <button
                      onClick={handleClear}
                      className="flex-shrink-0 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-110 active:scale-95"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </button>
                  )}
                </div>

                {/* Right Icons */}
                {showRightIcons && variant === "navigation" && (
                  <>
                    <button
                      onClick={onAppsClick}
                      className="flex-shrink-0 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-110 active:scale-95"
                      aria-label="Apps"
                    >
                      <Grid3x3 className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </button>
                    <button
                      onClick={onProfileClick}
                      className="flex-shrink-0 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-110 active:scale-95"
                      aria-label="Profile"
                    >
                      <User className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Animated loading bar */}
        {isFocused && (
          <div className="mt-8 w-full max-w-2xl">
            <div className="h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 rounded-full"
                style={{
                  animation: "shimmer 2s infinite",
                  backgroundSize: "200% 100%",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInDelay {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fadeInDelay 1.2s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  )
}
