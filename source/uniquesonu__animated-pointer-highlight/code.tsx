"use client";
import { cn } from "@/lib/utils";
import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";

export function PointerHighlight({
  children,
  rectangleClassName,
  pointerClassName,
  containerClassName,
  variant = "default",
  glowEffect = false,
  animationDelay = 0,
}: {
  children: React.ReactNode;
  rectangleClassName?: string;
  pointerClassName?: string;
  containerClassName?: string;
  variant?: "default" | "gradient" | "neon" | "minimal" | "premium";
  glowEffect?: boolean;
  animationDelay?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const getVariantStyles = () => {
    switch (variant) {
      case "gradient":
        return {
          border: "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-[2px]",
          pointer: "text-purple-500",
          glow: "shadow-lg shadow-purple-500/20"
        };
      case "neon":
        return {
          border: "border-2 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]",
          pointer: "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]",
          glow: "shadow-2xl shadow-cyan-400/30"
        };
      case "minimal":
        return {
          border: "border border-gray-300 dark:border-gray-600",
          pointer: "text-gray-500 dark:text-gray-400",
          glow: ""
        };
      case "premium":
        return {
          border: "border-2 border-amber-400 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20",
          pointer: "text-amber-500",
          glow: "shadow-xl shadow-amber-500/20"
        };
      default:
        return {
          border: "border-2 border-blue-500 dark:border-blue-400",
          pointer: "text-blue-500 dark:text-blue-400",
          glow: "shadow-lg shadow-blue-500/20"
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <div
      className={cn("relative w-fit group", containerClassName)}
      ref={containerRef}
    >
      {children}
      
      {dimensions.width > 0 && dimensions.height > 0 && isInView && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: animationDelay }}
        >
          {/* Animated border */}
          <motion.div
            className={cn(
              "absolute rounded-lg",
              variant === "gradient" ? variantStyles.border : variantStyles.border,
              glowEffect && variantStyles.glow,
              rectangleClassName,
            )}
            initial={{
              width: 0,
              height: 0,
              x: dimensions.width / 2,
              y: dimensions.height / 2,
            }}
            animate={{
              width: dimensions.width,
              height: dimensions.height,
              x: 0,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: animationDelay + 0.2,
            }}
          >
            {variant === "gradient" && (
              <div className="absolute inset-[2px] bg-white dark:bg-gray-900 rounded-lg" />
            )}
          </motion.div>

          {/* Corner accent dots */}
          {variant !== "minimal" && (
            <>
              {[0, 1, 2, 3].map((corner) => (
                <motion.div
                  key={corner}
                  className={cn(
                    "absolute w-2 h-2 rounded-full",
                    variant === "neon" ? "bg-cyan-400" : 
                    variant === "premium" ? "bg-amber-400" :
                    variant === "gradient" ? "bg-purple-500" : "bg-blue-500"
                  )}
                  style={{
                    top: corner < 2 ? -4 : dimensions.height - 4,
                    left: corner % 2 === 0 ? -4 : dimensions.width - 4,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: animationDelay + 0.8 + corner * 0.1,
                    ease: "backOut",
                  }}
                />
              ))}
            </>
          )}

          {/* Enhanced pointer with trail effect */}
          <motion.div
            className="pointer-events-none absolute"
            initial={{ 
              opacity: 0,
              scale: 0.5,
              x: dimensions.width / 2,
              y: dimensions.height / 2,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: dimensions.width + 8,
              y: dimensions.height + 8,
            }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: animationDelay + 0.6,
            }}
          >
            {/* Pointer glow effect */}
            {glowEffect && (
              <motion.div
                className={cn(
                  "absolute inset-0 rounded-full blur-sm",
                  variant === "neon" ? "bg-cyan-400/40" :
                  variant === "premium" ? "bg-amber-400/40" :
                  variant === "gradient" ? "bg-purple-500/40" : "bg-blue-500/40"
                )}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
            
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Pointer
                className={cn(
                  "h-6 w-6 relative z-10",
                  variantStyles.pointer,
                  pointerClassName
                )}
              />
            </motion.div>
          </motion.div>

          {/* Animated scan line effect for premium variant */}
          {variant === "premium" && (
            <motion.div
              className="absolute inset-0 overflow-hidden rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: animationDelay + 1.2 }}
            >
              <motion.div
                className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                animate={{
                  y: [0, dimensions.height - 2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: animationDelay + 1.5,
                }}
              />
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}

const Pointer = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"></path>
    </svg>
  );
};

// Demo component to showcase the variants
export default function PointerHighlightDemo() {
  const variants = [
    { name: "Default", variant: "default" as const },
    { name: "Gradient", variant: "gradient" as const },
    { name: "Neon", variant: "neon" as const },
    { name: "Minimal", variant: "minimal" as const },
    { name: "Premium", variant: "premium" as const },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Enhanced PointerHighlight Component
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Multiple variants with improved animations and visual effects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {variants.map(({ name, variant }, index) => (
            <div key={name} className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 text-center">
                {name}
              </h3>
              
              {/* Card example */}
              <PointerHighlight
                variant={variant}
                glowEffect={variant !== "minimal"}
                animationDelay={index * 0.2}
                containerClassName="mx-auto"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 min-w-[200px]">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      variant === "neon" ? "bg-cyan-400" :
                      variant === "premium" ? "bg-amber-400" :
                      variant === "gradient" ? "bg-purple-500" : "bg-blue-500"
                    )} />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {name} Card
                    </h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    This is a sample card showcasing the {name.toLowerCase()} variant
                    of the PointerHighlight component.
                  </p>
                  <div className="mt-4 flex space-x-2">
                    <div className="w-8 h-2 bg-gray-200 dark:bg-gray-600 rounded-full" />
                    <div className="w-6 h-2 bg-gray-200 dark:bg-gray-600 rounded-full" />
                    <div className="w-4 h-2 bg-gray-200 dark:bg-gray-600 rounded-full" />
                  </div>
                </div>
              </PointerHighlight>

              {/* Button example */}
              <div className="flex justify-center">
                <PointerHighlight
                  variant={variant}
                  glowEffect={variant === "neon" || variant === "premium"}
                  animationDelay={index * 0.2 + 1}
                >
                  <button className={cn(
                    "px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105",
                    variant === "neon" ? "bg-cyan-500 hover:bg-cyan-600 text-white" :
                    variant === "premium" ? "bg-amber-500 hover:bg-amber-600 text-white" :
                    variant === "gradient" ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white" :
                    variant === "minimal" ? "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white" :
                    "bg-blue-500 hover:bg-blue-600 text-white"
                  )}>
                    {name} Button
                  </button>
                </PointerHighlight>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Key Improvements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Multiple Variants
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                5 distinct visual styles including gradient, neon, minimal, and premium options
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Enhanced Animations
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Smooth easing, staggered timing, and micro-interactions for better UX
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Visual Effects
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Corner accents, glow effects, scan lines, and pointer animations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}