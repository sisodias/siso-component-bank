import React from "react";
import { motion } from "framer-motion";
import { cn } from "../_utils/cn";

interface GlassRefractionHeroProps {
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

export function GlassRefractionHero({
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
  children,
}: GlassRefractionHeroProps) {
  const titleWords = title?.split(" ") || [];

  return (
    <section
      className={cn(
        "relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black",
        className
      )}
      role="banner"
      aria-label="Hero section"
    >
      {/* Blue Gradient Blobs Background */}
      <div className="absolute inset-0" aria-hidden="true">
        {/* Blob 1 - Top Left (Bright Blue #0367FE) - U-shaped motion */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "min(600px, 40vw)",
            height: "min(600px, 40vw)",
            left: "calc(-91px + 5vw)",
            top: "calc(438px - 10vh)",
            background: "radial-gradient(circle, #0367FE 0%, #0367FE 50%, #0256CC 100%)",
            filter: "blur(150px)",
          }}
          animate={{
            x: [0, 50, 100, 50, 0],
            y: [0, -80, 0, 80, 0],
            scale: [1, 1.2, 1.4, 1.2, 1],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Blob 2 - Center Left (Deep Blue #0A1DCB) - Inverted U-shaped motion */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "min(600px, 40vw)",
            height: "min(600px, 40vw)",
            left: "calc(430px - 5vw)",
            top: "calc(609px - 20vh)",
            background: "radial-gradient(circle, #0A1DCB 0%, #0A1DCB 50%, #0816A3 100%)",
            filter: "blur(150px)",
          }}
          animate={{
            x: [0, -60, -120, -60, 0],
            y: [0, 90, 0, -90, 0],
            scale: [1, 1.3, 1.5, 1.3, 1],
            rotate: [0, -90, -180, -270, -360],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Blob 3 - Center Right (Deep Blue #0A1DCB) - U-shaped motion */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "min(600px, 40vw)",
            height: "min(600px, 40vw)",
            left: "calc(900px - 15vw)",
            top: "calc(651px - 20vh)",
            background: "radial-gradient(circle, #0A1DCB 0%, #0A1DCB 50%, #0816A3 100%)",
            filter: "blur(150px)",
          }}
          animate={{
            x: [0, 70, 140, 70, 0],
            y: [0, -100, 0, 100, 0],
            scale: [1, 1.25, 1.45, 1.25, 1],
            rotate: [0, 120, 240, 120, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Blob 4 - Top Right (Bright Blue #0367FE) - Inverted U-shaped motion */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "min(600px, 40vw)",
            height: "min(600px, 40vw)",
            right: "calc(-200px + 10vw)",
            top: "calc(329px - 10vh)",
            background: "radial-gradient(circle, #0367FE 0%, #0367FE 50%, #0256CC 100%)",
            filter: "blur(150px)",
          }}
          animate={{
            x: [0, -80, -160, -80, 0],
            y: [0, 110, 0, -110, 0],
            scale: [1, 1.35, 1.5, 1.35, 1],
            rotate: [0, -120, -240, -120, -360],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Center floating blob - Pulsing U motion */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "min(400px, 30vw)",
            height: "min(400px, 30vw)",
            left: "50%",
            top: "50%",
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0.2) 100%)",
            filter: "blur(120px)",
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            x: [0, 40, 80, 40, 0],
            y: [0, -60, 0, 60, 0],
            scale: [1, 1.3, 1.6, 1.3, 1],
            opacity: [0.3, 0.5, 0.7, 0.5, 0.3],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Vertical Glass Strips Overlay */}
      <div 
        className="absolute inset-0 flex flex-row items-center pointer-events-none" 
        aria-hidden="true"
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {Array.from({ length: 18 }).map((_, index) => (
          <motion.div
            key={index}
            className="h-full flex-shrink-0"
            style={{
              width: "calc(100vw / 18)",
              minWidth: "60px",
              maxWidth: "100px",
              background: "linear-gradient(90deg, rgba(217, 217, 217, 0) 0%, rgba(0, 0, 0, 0.7) 76%, rgba(255, 255, 255, 0.3) 100%)",
              mixBlendMode: "overlay",
            }}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 4,
              delay: index * 0.1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

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
                  <motion.span
                    key={wordIndex}
                    className="inline-block mr-4 last:mr-0 mb-2"
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: wordIndex * 0.15,
                      duration: 0.8,
                      type: "spring",
                      stiffness: 100,
                    }}
                  >
                    <span
                      className="text-transparent bg-clip-text"
                      style={{
                        backgroundImage: "linear-gradient(135deg, #0367FE 0%, #3b82f6 50%, #60a5fa 100%)",
                        textShadow: "0 0 40px rgba(3, 103, 254, 0.5)",
                      }}
                    >
                      {word}
                    </span>
                  </motion.span>
                ))}
              </h1>
            )}

            {/* Description */}
            {description && (
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-lg sm:text-xl md:text-2xl text-blue-200 mb-10 max-w-3xl mx-auto leading-relaxed"
                style={{
                  textShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
                }}
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
                    className="px-8 py-4 text-base sm:text-lg font-semibold rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
                    style={{
                      boxShadow: "0 0 30px rgba(3, 103, 254, 0.5), 0 10px 20px rgba(0, 0, 0, 0.5)",
                    }}
                    aria-label={primaryAction.label}
                  >
                    {primaryAction.label}
                  </button>
                )}

                {secondaryAction && (
                  <button
                    onClick={secondaryAction.onClick}
                    className="px-8 py-4 text-base sm:text-lg font-semibold rounded-full bg-transparent text-blue-300 border-2 border-blue-500 hover:bg-blue-500/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
                    style={{
                      boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
                    }}
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
