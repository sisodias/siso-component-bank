"use client";

import React, { useState, useRef, forwardRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface SubscribeBtnProps {
  title?: string;
  onClick?: () => void;
  className?: string;
}

export const Component = forwardRef<HTMLButtonElement, SubscribeBtnProps>(
  ({ title = "Subscribe", onClick, className = "" }, ref) => {
    const [isHovered, setIsHovered] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    
    React.useImperativeHandle(ref, () => buttonRef.current!);
    
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    const springConfig = { damping: 12, stiffness: 180 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);
    
    const bgX = useTransform(springX, value => value * 0.2);
    const bgY = useTransform(springY, value => value * 0.2);
    
    const handleMouseMove = (e: React.MouseEvent) => {
      if (!buttonRef.current || !isHovered) return;
      
      const rect = buttonRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left - rect.width / 2);
      mouseY.set(e.clientY - rect.top - rect.height / 2);
    };

    const transition = {
      type: "spring", 
      damping: 35, 
      stiffness: 500,
      mass: 0.7,
      duration: 0.25,
      ease: [0.34, 1.56, 0.64, 1]
    };

    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black">
        <motion.button
          ref={buttonRef}
          onClick={onClick}
          onMouseMove={handleMouseMove}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => {
            setIsHovered(false);
            mouseX.set(0);
            mouseY.set(0);
          }}
          className={`relative flex flex-row flex-nowrap items-center justify-center gap-[10px] px-12 py-[24px] rounded-[16px] overflow-hidden cursor-pointer backdrop-blur-sm ${className}`}
          style={{
            width: "min-content",
            height: "min-content",
            willChange: "transform",
            backgroundColor: "rgba(22, 23, 24, 0.85)",
          }}
          initial={false}
          animate={{
            boxShadow: isHovered
              ? "0px 0px 30px -2px rgba(81, 106, 164, 0.8), 0px 2px 4px 0px rgba(1, 2, 4, 0.7), inset 0 0 20px rgba(255, 255, 255, 0.1)"
              : "0px 0px 15px -5px hsla(222, 34%, 48%, 0), 0px 1px 3px 0px rgba(1, 2, 4, 0.15)",
            scale: isHovered ? 1.02 : 1,
            backgroundColor: isHovered ? "rgba(22, 23, 24, 0.9)" : "rgba(22, 23, 24, 0.85)",
          }}
          transition={{
            ...transition,
            delay: isHovered ? 0.1 : 0,
          }}
        >
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{
              content: "",
              borderWidth: "1.5px",
              borderStyle: "solid",
              borderColor: isHovered ? "rgba(153, 154, 163, 0.6)" : "rgba(71, 71, 73, 0.2)",
              width: "100%",
              height: "100%",
              position: "absolute",
              boxSizing: "border-box", 
              left: 0,
              top: 0,
              borderRadius: "inherit",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />

          <motion.div
            className="absolute overflow-visible pointer-events-none"
            style={{
              width: "calc(100% + 800px)",
              height: "calc(100% + 300px)",
              left: "-400px",
              top: "-150px",
              right: "-400px",
              bottom: "-150px",
              background: "radial-gradient(circle, rgba(255, 255, 255, 0.25) 1px, transparent 1px)",
              backgroundSize: "25px 25px",
              x: bgX,
              y: bgY,
            }}
            animate={{
              opacity: isHovered ? 0.8 : 0,
              scale: isHovered ? 1.1 : 1,
              filter: isHovered ? "blur(0px)" : "blur(2px)",
            }}
            initial={{ opacity: 0, scale: 1, filter: "blur(2px)" }}
            transition={{
              ...transition,
              delay: isHovered ? 0.2 : 0,
            }}
          />

          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(circle at center, rgba(255, 255, 255, 0.06) 0%, transparent 70%)",
            }}
            animate={{
              opacity: isHovered ? 0.8 : 0,
              filter: isHovered ? "blur(0px)" : "blur(1px)",
            }}
            transition={{
              ...transition,
              delay: isHovered ? 0.3 : 0,
            }}
          />

          <p
            className="relative m-0 text-xl font-bold whitespace-pre tracking-wide"
            style={{
              fontFamily: '"Satoshi Bold", sans-serif',
              backgroundImage: "linear-gradient(0deg, rgba(255, 255, 255, 0.7) 0%, rgb(255, 255, 255) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              textShadow: isHovered ? "0 0 20px rgba(255, 255, 255, 0.3)" : "none",
              transition: "text-shadow 0.3s ease",
            }}
          >
            {title}
          </p>
        </motion.button>
      </div>
    );
  }
);

Component.displayName = "SubscribeBtn";
