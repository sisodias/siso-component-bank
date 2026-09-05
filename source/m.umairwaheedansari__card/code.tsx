import { cn } from "@/lib/utils"

export default function Card({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center p-4",
        "transition-colors duration-300",
        className
      )}
    >
      <div className="relative flex flex-col items-center select-none group/he">
        <div
          className={cn(
            "absolute z-20 transition-all duration-700 ease-[cubic-bezier(0.4,0.0,0.2,1)]",
            "transform-gpu will-change-transform",
            // initial: centered above card with subtle glow
            "left-1/2 -translate-x-1/2 -top-15",
            "drop-shadow-[0_0_20px_rgba(59,130,246,0.6)] dark:drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]",
            // on hover: move to card's top-left corner with smooth rotation
            "group-hover/he:-top-3 group-hover/he:left-3 group-hover/he:-translate-x-0",
            "group-hover/he:scale-[0.65] group-hover/he:rotate-[15deg]",
            "group-hover/he:drop-shadow-[0_0_15px_rgba(34,197,94,0.8)] dark:group-hover/he:drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]"
          )}
        >
          {/* Orbital ring animation - adaptive colors for light/dark mode */}
          <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-blue-500/40 dark:border-cyan-400/30 animate-[spin_8s_linear_infinite] group-hover/he:border-emerald-500/60 dark:group-hover/he:border-emerald-400/50 group-hover/he:shadow-[0_0_20px_rgba(34,197,94,0.4)]" />
          
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 120 120"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full backdrop-blur-sm"
            role="img"
            aria-hidden="true"
          >
            {/* Space background */}
            <defs>
              <radialGradient id="spaceGradient" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#f1f5f9" className="dark:stop-color-[#1e293b]" />
                <stop offset="70%" stopColor="#e2e8f0" className="dark:stop-color-[#0f172a]" />
                <stop offset="100%" stopColor="#cbd5e1" className="dark:stop-color-[#020617]" />
              </radialGradient>
              <radialGradient id="earthGradient" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#60a5fa" className="dark:stop-color-[#3b82f6]" />
                <stop offset="40%" stopColor="#2563eb" className="dark:stop-color-[#1d4ed8]" />
                <stop offset="70%" stopColor="#1d4ed8" className="dark:stop-color-[#1e40af]" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </radialGradient>
              <radialGradient id="lightSpaceGradient" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="70%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </radialGradient>
              <radialGradient id="darkSpaceGradient" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="70%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </radialGradient>
              <radialGradient id="lightEarthGradient" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="40%" stopColor="#3b82f6" />
                <stop offset="70%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </radialGradient>
              <radialGradient id="darkEarthGradient" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="40%" stopColor="#1d4ed8" />
                <stop offset="70%" stopColor="#1e40af" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Space background - different for light/dark mode */}
            <circle cx="60" cy="60" r="58" className="fill-slate-100 dark:fill-slate-900" />
            <circle cx="60" cy="60" r="58" fill="url(#lightSpaceGradient)" className="dark:hidden" />
            <circle cx="60" cy="60" r="58" fill="url(#darkSpaceGradient)" className="hidden dark:block" />
            
            {/* Stars - more visible in light mode */}
            <circle cx="25" cy="25" r="1" className="fill-slate-600 dark:fill-slate-300" opacity="0.6" />
            <circle cx="95" cy="30" r="0.8" className="fill-slate-500 dark:fill-slate-400" opacity="0.5" />
            <circle cx="85" cy="85" r="1.2" className="fill-slate-700 dark:fill-slate-200" opacity="0.7" />
            <circle cx="30" cy="90" r="0.6" className="fill-slate-600 dark:fill-slate-300" opacity="0.4" />
            
            {/* Earth globe - adaptive colors */}
            <circle cx="60" cy="60" r="32" fill="url(#lightEarthGradient)" filter="url(#glow)" className="dark:hidden" />
            <circle cx="60" cy="60" r="32" fill="url(#darkEarthGradient)" filter="url(#glow)" className="hidden dark:block" />
            
            {/* Continents - enhanced visibility for both modes */}
            <path
              d="M45 45 Q52 42 58 45 Q65 48 70 52 Q68 58 65 62 Q58 65 52 62 Q48 58 45 52 Z"
              className="fill-emerald-600 dark:fill-emerald-400 animate-[pulse_3s_ease-in-out_infinite]"
              opacity="0.9"
            />
            <path
              d="M35 55 Q42 52 48 55 Q45 62 40 65 Q35 62 35 55 Z"
              className="fill-emerald-700 dark:fill-emerald-500"
              opacity="0.8"
            />
            <path
              d="M65 70 Q72 68 78 72 Q75 78 70 80 Q65 78 65 70 Z"
              className="fill-green-700 dark:fill-green-400"
              opacity="0.7"
            />
            
            {/* Atmospheric glow - adaptive colors */}
            <circle 
              cx="60" 
              cy="60" 
              r="34" 
              fill="none" 
              className="stroke-blue-400/60 dark:stroke-blue-300/40 animate-[pulse_2s_ease-in-out_infinite]"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* — INFO CARD — */}
        <div
          className={cn(
            "relative z-10 overflow-hidden rounded-3xl",
            // Futuristic glassmorphism styling
            "bg-gray-50 dark:bg-gray-900",
            "backdrop-blur-xl backdrop-saturate-150",
            "border border-white/20 dark:border-gray-700/30",
            "shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
            // Enhanced transitions with custom easing
            "transition-all duration-700 ease-[cubic-bezier(0.4,0.0,0.2,1)]",
            "transform-gpu will-change-transform",
            // initial size - compact to show heading
            "w-52 h-16 sm:w-64 sm:h-20",
            // expand on hover with subtle transform
            "group-hover/he:w-84 sm:group-hover/he:w-96",
            "group-hover/he:h-36 sm:group-hover/he:h-44",
            "group-hover/he:scale-[1.02]",
            // Enhanced glow effect on hover
            "group-hover/he:shadow-[0_20px_40px_rgba(59,130,246,0.15)]",
            "group-hover/he:border-cyan-400/40"
          )}
        >
          <div className="flex flex-col justify-center h-full p-4 sm:p-6 relative">
            {/* Subtle gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            
            {/* Heading - always visible with enhanced typography */}
            <h2 
              className={cn(
                "text-lg sm:text-xl font-bold",
                "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900",
                "dark:from-white dark:via-gray-100 dark:to-white",
                "bg-clip-text text-transparent",
                "transition-all duration-500 ease-[cubic-bezier(0.4,0.0,0.2,1)]",
                "relative z-10",
                // Adjust position when SVG moves to make room
                "group-hover/he:mt-2 group-hover/he:ml-16",
                "group-hover/he:text-cyan-900 dark:group-hover/he:text-cyan-100"
              )}
            >
              Global Network
            </h2>
            
            {/* Content - appears on hover with staggered animation */}
            <p
              className={cn(
                "text-sm sm:text-base",
                "text-gray-600/80 dark:text-gray-300/80",
                "opacity-0 max-h-0 overflow-hidden",
                "transition-all duration-500 ease-[cubic-bezier(0.4,0.0,0.2,1)] delay-150",
                "group-hover/he:opacity-100 group-hover/he:max-h-24 group-hover/he:mt-3",
                // Adjust position to account for SVG
                "group-hover/he:ml-16",
                "group-hover/he:text-gray-700 dark:group-hover/he:text-gray-200",
                "leading-relaxed"
              )}
            >
              Connected across continents, powered by innovation. Experience the future of global communication.
            </p>

            {/* Animated accent line */}
            <div 
              className={cn(
                "absolute bottom-4 left-4 w-0 h-0.5",
                "bg-gradient-to-r from-cyan-400 to-blue-500",
                "transition-all duration-700 delay-300 ease-[cubic-bezier(0.4,0.0,0.2,1)]",
                "group-hover/he:w-20 group-hover/he:ml-16"
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}