"use client";

import * as React from "react";

interface PreloaderProps {
  text?: string;
  theme?: "dark" | "light";
  onComplete?: () => void;
}

export function Preloader({
  text = "W",
  theme = "dark",
  onComplete,
}: PreloaderProps) {
  const [progress, setProgress] = React.useState(0);
  const [isComplete, setIsComplete] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsComplete(true);
            onComplete?.();
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-[hsl(var(--background))]" : "bg-[hsl(var(--background))]";
  const textColor = "text-[hsl(var(--foreground))]";
  const accentColor = isDark
    ? "from-cyan-500 to-blue-500"
    : "from-blue-600 to-purple-600";
  const secondaryColor = isDark
    ? "bg-[hsl(var(--muted))]"
    : "bg-[hsl(var(--muted))]";
  const glowColor = isDark ? "shadow-cyan-500/50" : "shadow-blue-500/50";

  if (isComplete) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${bgColor} transition-opacity duration-500 ${
        progress === 100 ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 ${
              isDark ? "bg-cyan-500/20" : "bg-blue-500/20"
            } rounded-full animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Rings */}
      <div className="absolute">
        <div
          className={`w-64 h-64 border-2 ${
            isDark ? "border-cyan-500/30" : "border-blue-500/30"
          } rounded-full animate-spin`}
          style={{ animationDuration: "3s" }}
        ></div>
        <div
          className={`absolute inset-8 border-2 ${
            isDark ? "border-blue-500/30" : "border-purple-500/30"
          } rounded-full animate-spin`}
          style={{ animationDuration: "2s", animationDirection: "reverse" }}
        ></div>
        <div
          className={`absolute inset-16 border-2 ${
            isDark ? "border-purple-500/30" : "border-cyan-500/30"
          } rounded-full animate-spin`}
          style={{ animationDuration: "4s" }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Animated Logo/Text */}
        <div className="mb-12 relative">
          <div
            className={`absolute inset-0 blur-3xl opacity-60 bg-gradient-to-r ${accentColor} animate-pulse`}
          />
          <h1
            className={`relative text-8xl md:text-6xl font-bold ${textColor} tracking-wider`}
            style={{
              textShadow: isDark
                ? "0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)"
                : "0 0 20px rgba(37, 99, 235, 0.4), 0 0 40px rgba(147, 51, 234, 0.2)",
              animation: "float 3s ease-in-out infinite",
            }}
          >
            {text}
          </h1>

          {/* Orbiting dots */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[0, 120, 240].map((rotation) => (
              <div
                key={rotation}
                className={`absolute w-3 h-3 bg-gradient-to-r ${accentColor} rounded-full ${glowColor} shadow-lg`}
                style={{
                  animation: "orbit 2s linear infinite",
                  animationDelay: `${rotation / 360}s`,
                  transformOrigin: "0 0",
                }}
              />
            ))}
          </div>
        </div>

        {/* Progress section */}
        <div className="space-y-4">
          {/* Circular Progress */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className={isDark ? "text-gray-800" : "text-gray-200"}
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                className="transition-all duration-300 ease-out"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={isDark ? "#06b6d4" : "#2563eb"} />
                  <stop offset="100%" stopColor={isDark ? "#3b82f6" : "#9333ea"} />
                </linearGradient>
              </defs>
            </svg>
            <div
              className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${textColor}`}
            >
              {progress}%
            </div>
          </div>

          {/* Linear Progress */}
          <div className="relative">
            <div
              className={`w-80 h-2 ${secondaryColor} rounded-full overflow-hidden mx-auto`}
            >
              <div
                className={`h-full bg-gradient-to-r ${accentColor} transition-all duration-300 ease-out relative`}
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>

          {/* Loading text */}
          <div
            className={`text-sm font-medium ${
              isDark ? "text-gray-400" : "text-gray-600"
            } flex items-center justify-center gap-2 mt-4`}
          >
            <span>Loading</span>
            <span className="flex gap-1">
              {[0, 0.2, 0.4].map((delay) => (
                <span
                  key={delay}
                  className="animate-bounce"
                  style={{ animationDelay: `${delay}s` }}
                >
                  .
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(60px); }
          to { transform: rotate(360deg) translateX(60px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
