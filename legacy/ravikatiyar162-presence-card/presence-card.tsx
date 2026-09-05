// components/ui/animated-presence-card.tsx

"use client";

import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { cn } from "../_utils/cn"; // Assuming shadcn/ui's utility function

// Define the props for the component
interface AnimatedPresenceCardProps {
  topText: string;
  imageUrl: string;
  title: React.ReactNode;
  description: string;
  buttonText: string;
  buttonHref?: string;
  footerLeft: React.ReactNode;
  footerRight: React.ReactNode;
  className?: string;
}

export function AnimatedPresenceCard({
  topText,
  imageUrl,
  title,
  description,
  buttonText,
  buttonHref = '#',
  footerLeft,
  footerRight,
  className,
}: AnimatedPresenceCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Motion values to track mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Transform mouse position into rotation values
  const rotateX = useTransform(mouseY, [-150, 150], [10, -10]);
  const rotateY = useTransform(mouseX, [-200, 200], [-10, 10]);

  // Apply spring physics for smoother animations
  const springConfig = { damping: 20, stiffness: 150 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    // Update motion values relative to the center of the card
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    // Reset motion values on mouse leave
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      className={cn(
        'group relative w-full max-w-sm overflow-hidden rounded-xl bg-card shadow-lg',
        'text-card-foreground transition-all duration-300 ease-out hover:shadow-2xl',
        className
      )}
    >
      <div style={{ transform: 'translateZ(20px)' }} className="relative">
        {/* Image Section */}
        <div className="absolute top-4 left-4 z-10 text-xs font-semibold uppercase tracking-widest text-white/90 mix-blend-difference">
          {topText}
        </div>
        <img
          src={imageUrl}
          alt="Digital Presence"
          className="h-90 w-full object-cover"
        />

        {/* Content Section */}
        <div className="p-6">
          <h2 className="text-3xl font-bold leading-tight">
            {title}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {description}
          </p>
          <a
            href={buttonHref}
            className="mt-6 inline-block text-sm font-medium text-foreground transition-colors duration-200 hover:text-primary pb-1 border-b border-transparent hover:border-primary/50"
          >
            {buttonText}
          </a>
        </div>

        {/* Footer Section */}
        <div className="flex items-center justify-between border-t border-border p-6 text-xs text-muted-foreground">
          <span>{footerLeft}</span>
          <span>{footerRight}</span>
        </div>
      </div>
    </motion.div>
  );
}