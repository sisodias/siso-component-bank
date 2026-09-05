"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "../_utils/cn"; // Assuming you have a `cn` utility for class merging.
import { Button } from "./button"; // Using shadcn's Button.

// Define the props for the component
export interface AnimatedPromoCardProps {
  imageSrc: string;
  title: string;
  subtitle: string;
  buttonText: string;
  href: string;
  className?: string;
}

export const AnimatedPromoCard = ({
  imageSrc,
  title,
  subtitle,
  buttonText,
  href,
  className,
}: AnimatedPromoCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  // Mouse position values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the mouse position values using spring animation
  const smoothMouseX = useSpring(mouseX, { stiffness: 300, damping: 50, mass: 0.5 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 300, damping: 50, mass: 0.5 });

  // Transform mouse position into rotation values for the 3D effect
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], ["12.5deg", "-12.5deg"]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], ["-12.5deg", "12.5deg"]);

  // Handle mouse move event to update motion values
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / width;
    const y = (e.clientY - top - height / 2) / height;
    mouseX.set(x);
    mouseY.set(y);
  };

  // Reset motion values on mouse leave
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
      }}
      className={cn(
        "relative w-full max-w-lg h-72 rounded-xl overflow-hidden bg-background shadow-lg",
        className
      )}
    >
      {/* Background Image */}
      <img
        src={imageSrc}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />
      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Content */}
      <div
        style={{ transform: "translateZ(50px)" }}
        className="relative z-10 h-full flex flex-col justify-end p-6 text-card-foreground"
      >
        <h2 className="text-3xl font-bold text-white shadow-md">{title}</h2>
        <p className="text-md text-white/90 shadow-sm mt-1">{subtitle}</p>
        <div className="mt-6">
          <a href={href} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-neutral-200 text-black hover:bg-white transition-colors">
                {buttonText}
            </Button>
          </a>
        </div>
      </div>
    </motion.div>
  );
};