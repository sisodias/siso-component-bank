import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AuroraHeroProps {
  title?: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  children?: React.ReactNode;
}

export function AuroraHero({
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
  children,
}: AuroraHeroProps) {
  const titleWords = title?.split(" ") || [];

  return (
    <section
      className={cn(
        "relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-background",
        className
      )}
      role="banner"
      aria-label="Hero section"
    >
      {/* Aurora Gradient Background */}
      <div className="absolute inset-0 overflow-hidden opacity-40" aria-hidden="true">
        <motion.div
          className="absolute inset-[-100%]"
          style={{
            background: `
              repeating-linear-gradient(100deg, 
                #8b5cf6 10%, 
                #3b82f6 15%, 
                #ec4899 20%, 
                #8b5cf6 25%, 
                #3b82f6 30%)
            `,
            backgroundSize: "300% 100%",
            filter: "blur(80px)",
          }}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-[-10px]"
          style={{
            background: `
              repeating-linear-gradient(100deg, 
                rgba(139, 92, 246, 0.1) 0%, 
                rgba(139, 92, 246, 0.1) 7%, 
                transparent 10%, 
                transparent 12%, 
                rgba(139, 92, 246, 0.1) 16%),
              repeating-linear-gradient(100deg, 
                #8b5cf6 10%, 
                #3b82f6 15%, 
                #ec4899 20%, 
                #8b5cf6 25%, 
                #3b82f6 30%)
            `,
            backgroundSize: "200%, 100%",
            backgroundPosition: "50% 50%, 50% 50%",
            mixBlendMode: "difference",
          }}
          animate={{
            backgroundPosition: [
              "50% 50%, 50% 50%",
              "100% 50%, 150% 50%",
              "50% 50%, 50% 50%",
            ],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Vignette Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.8) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Content Layer */}
      {children ? (
        <div className="relative z-10 w-full">{children}</div>
      ) : (
        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="max-w-5xl mx-auto"
          >
            {/* Animated Title */}
            {title && (
              <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold mb-8 tracking-tight">
                {titleWords.map((word, wordIndex) => (
                  <span key={wordIndex} className="inline-block mr-4 last:mr-0 mb-2">
                    {word.split("").map((letter, letterIndex) => (
                      <motion.span
                        key={`${wordIndex}-${letterIndex}`}
                        initial={{
                          y: 100,
                          opacity: 0,
                          filter: "blur(8px)",
                        }}
                        animate={{
                          y: 0,
                          opacity: 1,
                          filter: "blur(0px)",
                        }}
                        transition={{
                          delay: wordIndex * 0.1 + letterIndex * 0.03,
                          type: "spring",
                          stiffness: 100,
                          damping: 15,
                        }}
                        whileHover={{
                          scale: 1.1,
                          transition: { duration: 0.2 },
                        }}
                        className="inline-block text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 cursor-default"
                        style={{
                          textShadow: "0 0 20px hsl(var(--primary) / 0.3)",
                        }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </h1>
            )}

            {/* Description */}
            {description && (
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed"
              >
                {description}
              </motion.p>
            )}

            {/* Action Buttons */}
            {(primaryAction || secondaryAction) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                {primaryAction && (
                  <button
                    onClick={primaryAction.onClick}
                    className="px-8 py-4 text-base sm:text-lg font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                    aria-label={primaryAction.label}
                  >
                    {primaryAction.label}
                  </button>
                )}

                {secondaryAction && (
                  <button
                    onClick={secondaryAction.onClick}
                    className="px-8 py-4 text-base sm:text-lg font-semibold rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-background"
                    aria-label={secondaryAction.label}
                  >
                    {secondaryAction.label}
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </section>
  );
}
