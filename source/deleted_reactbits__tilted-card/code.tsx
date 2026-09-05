"use client";

import type { SpringOptions } from "framer-motion";
import React, { useRef, useState, FC, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface TiltedCardProps {
  imageSrc: React.ComponentProps<"img">["src"];
  altText?: string;
  captionText?: string;
  containerHeight?: React.CSSProperties['height'];
  containerWidth?: React.CSSProperties['width'];
  imageHeight?: React.CSSProperties['height'];
  imageWidth?: React.CSSProperties['width'];
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  overlayContent?: ReactNode;
  displayOverlayContent?: boolean;
  className?: string;
  tooltipClassName?: string; // Added for tooltip theming
}

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

export const TiltedCard: FC<TiltedCardProps> = ({
  imageSrc,
  altText = "Tilted card image",
  captionText = "",
  containerHeight = "300px",
  containerWidth = "100%",
  imageHeight = "300px",
  imageWidth = "300px",
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = true,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false,
  className = "",
  tooltipClassName = "bg-white text-[#2d2d2d] dark:bg-neutral-800 dark:text-neutral-200", // Default theme-aware tooltip
}) => {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1,
  });

  const [lastY, setLastY] = useState(0);

  function handleMouse(e: React.MouseEvent<HTMLElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetXPosition = e.clientX - rect.left - rect.width / 2;
    const offsetYPosition = e.clientY - rect.top - rect.height / 2;
    const rotationXValue = (offsetYPosition / (rect.height / 2)) * -rotateAmplitude;
    const rotationYValue = (offsetXPosition / (rect.width / 2)) * rotateAmplitude;
    rotateX.set(rotationXValue);
    rotateY.set(rotationYValue);
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
    const velocityY = offsetYPosition - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetYPosition);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
    if (showTooltip) opacity.set(1);
  }

  function handleMouseLeave() {
    if (showTooltip) opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
    setLastY(0);
  }

  return (
    <figure
      ref={ref}
      className={`relative [perspective:800px] flex flex-col items-center justify-center ${className}`}
      style={{
        height: containerHeight,
        width: containerWidth,
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <div className="absolute top-4 text-center text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 block sm:hidden z-10 p-2 bg-white/80 dark:bg-black/80 rounded">
          Tilt effect best on desktop.
        </div>
      )}

      <motion.div
        className="relative [transform-style:preserve-3d]"
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale,
        }}
      >
        <motion.img
          src={imageSrc}
          alt={altText}
          className="absolute top-0 left-0 w-full h-full object-cover rounded-[15px] will-change-transform [transform:translateZ(0)]"
        />

        {displayOverlayContent && overlayContent && (
          <motion.div
            className="absolute inset-0 z-[2] will-change-transform [transform:translateZ(30px)] 
                       flex items-center justify-center"
          >
            {overlayContent}
          </motion.div>
        )}
      </motion.div>

      {showTooltip && captionText && (
        <motion.figcaption
          className={`pointer-events-none absolute left-0 top-0 rounded-[4px] 
                     px-[10px] py-[4px] text-[10px] 
                     opacity-0 z-[3] hidden sm:block shadow-md
                     ${tooltipClassName}`}
          style={{
            x, y, opacity,
            rotate: rotateFigcaption,
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
};