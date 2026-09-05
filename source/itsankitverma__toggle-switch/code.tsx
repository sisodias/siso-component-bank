import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center w-full">
      <div className={cn("flex flex-col items-center gap-8 p-12 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl transition-all duration-300", isHovered && "scale-105 shadow-purple-500/25")}>
        
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">
            Make Your Choice
          </h2>
          <p className="text-white/70">
            Toggle between Yes and No with style
          </p>
        </div>

        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Glow effect */}
          <div className={cn(
            "absolute inset-0 rounded-full transition-all duration-500",
            isToggled 
              ? "bg-emerald-400/30 blur-xl scale-110" 
              : "bg-rose-400/30 blur-xl scale-110"
          )} />
          
          {/* Main toggle container */}
          <label className={cn(
            "relative cursor-pointer select-none flex items-center justify-between w-48 h-16 rounded-full p-2 transition-all duration-500 transform",
            isToggled 
              ? "bg-gradient-to-r from-emerald-500 to-green-400 shadow-lg shadow-emerald-500/30" 
              : "bg-gradient-to-r from-rose-500 to-pink-400 shadow-lg shadow-rose-500/30",
            isHovered && "scale-110"
          )}>
            
            <input 
              type="checkbox" 
              className="sr-only"
              checked={isToggled}
              onChange={(e) => setIsToggled(e.target.checked)}
            />
            
            {/* Left label - Yes */}
            <span className={cn(
              "flex-1 text-center text-lg font-semibold transition-all duration-300 z-10",
              isToggled 
                ? "text-white transform scale-110" 
                : "text-white/70 transform scale-95"
            )}>
              Yes
            </span>
            
            {/* Sliding indicator */}
            <div className={cn(
              "absolute top-1 w-20 h-14 bg-white rounded-full shadow-lg transition-all duration-500 flex items-center justify-center",
              isToggled 
                ? "translate-x-28 bg-gradient-to-r from-white to-emerald-50" 
                : "translate-x-0 bg-gradient-to-r from-white to-rose-50"
            )}>
              <div className={cn(
                "w-8 h-8 rounded-full transition-all duration-300",
                isToggled 
                  ? "bg-emerald-500 animate-pulse" 
                  : "bg-rose-500 animate-pulse"
              )} />
            </div>
            
            {/* Right label - No */}
            <span className={cn(
              "flex-1 text-center text-lg font-semibold transition-all duration-300 z-10",
              !isToggled 
                ? "text-white transform scale-110" 
                : "text-white/70 transform scale-95"
            )}>
              No
            </span>
          </label>
        </div>

        {/* Status indicator */}
        <div className="text-center space-y-2">
          <div className={cn(
            "text-2xl font-bold transition-all duration-300",
            isToggled ? "text-emerald-400" : "text-rose-400"
          )}>
            {isToggled ? "✅ Yes Selected" : "❌ No Selected"}
          </div>
          
          <div className="flex items-center justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  isToggled ? "bg-emerald-400" : "bg-rose-400"
                )}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animation: "pulse 2s infinite"
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute w-2 h-2 rounded-full opacity-30 animate-bounce",
              isToggled ? "bg-emerald-400" : "bg-rose-400"
            )}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};