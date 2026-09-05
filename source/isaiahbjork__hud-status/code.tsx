"use client";

import { motion } from "framer-motion";
import { HyperText } from "@/components/ui/hyper-text";

interface HUDStatusProps {
  className?: string;
}

export function HUDStatus({ className }: HUDStatusProps) {
  const containerVariants = {
    hidden: { 
      opacity: 0,
      x: -100
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className={`relative ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="relative">
        <svg width="180" height="36" viewBox="0 0 180 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="activeSystemsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#15803d" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <path 
            d="M0 0H180V24H8L0 16V0Z" 
            fill="url(#activeSystemsGradient)"
            stroke="#4ade80"
            strokeWidth="1.5"
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-start pl-4 pb-3">
          <HyperText
            text="ACTIVE"
            className="text-green-400 text-sm font-mono tracking-wider font-semibold"
            duration={1000}
            animateOnLoad={true}
            trigger={true}
          />
        </div>
      </div>
    </motion.div>
  );
} 