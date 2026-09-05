"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useState } from "react";

interface HoverDetailCardProps {
  title?: string;
  subtitle?: string;
  images?: string[];
  primaryButton?: {
    text: string;
    color?: string;
    hoverColor?: string;
    textColor?: string;
  };
  secondaryButton?: {
    text: string;
    color?: string;
    hoverColor?: string;
    textColor?: string;
  };
  pills?: {
    left: {
      text: string;
      color?: string;
      textColor?: string;
    };
    sparkle?: {
      show: boolean;
      color?: string;
    };
    right: {
      text: string;
      color?: string;
      textColor?: string;
    };
  };
  enableAnimations?: boolean;
}

const defaultImages = [
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop&flip=h",
  "https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=200&h=200&fit=crop&flip=h",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=200&h=200&fit=crop&sat=-100",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=200&h=200&fit=crop&flip=h",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop&sat=-50",
];

export function HoverDetailCard({
  title = "Studio shots",
  subtitle = "52 tiles",
  images = defaultImages,
  primaryButton = {
    text: "Go to collection",
    color: "bg-white/90",
    hoverColor: "hover:bg-white",
    textColor: "text-gray-900"
  },
  secondaryButton = {
    text: "Edit rules",
    color: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
    textColor: "text-white"
  },
  pills = {
    left: { text: "1×1", color: "bg-blue-100", textColor: "text-blue-800" },
    sparkle: { show: true, color: "bg-purple-100 text-purple-800" },
    right: { text: "Published", color: "bg-green-100", textColor: "text-green-800" }
  },
  enableAnimations = true
}: HoverDetailCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = enableAnimations && !shouldReduceMotion;

  // Animation variants
  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.08,
        delayChildren: 0.1,
      }
    }
  };

  const imageVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 10
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25 
      }
    }
  };

  const contentVariants = {
    hidden: { 
      opacity: 0, 
      x: -25,
      scale: 0.95,
      filter: "blur(4px)",
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 28,
        mass: 0.6,
      }
    }
  };

  const bottomSectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.4,
      },
    },
  };

  const pillVariants = {
    hidden: { 
      opacity: 0, 
      x: -20,
      scale: 0.9,
      filter: "blur(3px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 450,
        damping: 25,
        mass: 0.5,
      },
    },
  };

  const textVariants = {
    hidden: { 
      opacity: 0, 
      y: 15,
      scale: 0.95,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 0.7,
      },
    },
  };

  return (
    <motion.div
      className="w-full max-w-md"
      initial={shouldAnimate ? "hidden" : "visible"}
      animate="visible"
      variants={shouldAnimate ? containerVariants : {}}
    >
      <motion.div 
        className="bg-card border border-border/50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
        variants={shouldAnimate ? contentVariants : {}}
      >
        {/* Top Image Section */}
        <motion.div 
          className="bg-muted p-4 border-b border-border/50 relative"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          variants={shouldAnimate ? contentVariants : {}}
        >
          <div className="grid grid-cols-5 gap-2 relative">
            {images.slice(0, 10).map((src, index) => (
              <motion.div
                key={index}
                className="relative aspect-square overflow-hidden rounded-lg"
                variants={shouldAnimate ? imageVariants : {}}
                custom={index}
                animate={{
                  scale: isHovered ? 0.85 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
              >
                <img
                  src={src}
                  alt={`${title} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>

          {/* Blur Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center"
              >
                {/* Buttons Container */}
                <div className="flex gap-3 mx-auto">
                  <motion.button
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                      delay: 0.1,
                    }}
                    className={`${primaryButton.color} ${primaryButton.hoverColor} ${primaryButton.textColor} cursor-pointer px-3 py-1.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200`}
                  >
                    {primaryButton.text}
                  </motion.button>
                  <motion.button
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                      delay: 0.2,
                    }}
                    className={`${secondaryButton.color} ${secondaryButton.hoverColor} ${secondaryButton.textColor} cursor-pointer px-3 py-1.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200`}
                  >
                    {secondaryButton.text}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Content Section */}
        <motion.div 
          className="p-4"
          variants={shouldAnimate ? bottomSectionVariants : {}}
        >
          {/* Bottom Pills and Content */}
          <motion.div 
            className="flex items-center justify-between mb-3"
            variants={shouldAnimate ? contentVariants : {}}
          >
            <motion.div 
              className="flex items-center gap-2"
              variants={shouldAnimate ? bottomSectionVariants : {}}
            >
              <motion.div 
                className={`${pills.left.color} ${pills.left.textColor} px-3 py-1 rounded-full text-sm font-medium`}
                variants={shouldAnimate ? pillVariants : {}}
              >
                {pills.left.text}
              </motion.div>
              {pills.sparkle?.show && (
                <motion.div 
                  className={`${pills.sparkle.color} p-2 rounded-full`}
                  variants={shouldAnimate ? pillVariants : {}}
                  whileHover={shouldAnimate ? { 
                    rotate: 15,
                    scale: 1.1,
                    transition: { type: "spring", stiffness: 400, damping: 25 }
                  } : {}}
                >
                  <Sparkles className="w-3 h-3" />
                </motion.div>
              )}
            </motion.div>
            <motion.div 
              className={`${pills.right.color} ${pills.right.textColor} px-3 py-1 rounded-full text-sm font-medium`}
              variants={shouldAnimate ? pillVariants : {}}
            >
              {pills.right.text}
            </motion.div>
          </motion.div>

          {/* Title and Subtitle */}
          <motion.div
            variants={shouldAnimate ? bottomSectionVariants : {}}
          >
            <motion.h3 
              className="text-2xl font-bold text-foreground mb-1"
              variants={shouldAnimate ? textVariants : {}}
            >
              {title}
            </motion.h3>
            <motion.p 
              className="text-muted-foreground text-lg"
              variants={shouldAnimate ? textVariants : {}}
            >
              {subtitle}
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
