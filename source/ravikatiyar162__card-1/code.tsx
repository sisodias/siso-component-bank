'use client';

import * as React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

// Define the props for the ZoomImage component
interface ZoomImageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The source URL of the image. */
  src: string;
  /** The alternative text for the image, for accessibility. */
  alt: string;
  /** The scale factor to apply on zoom. Defaults to 1.2. */
  zoomScale?: number;
  /** The duration of the spring animation. Defaults to 0.3. */
  transitionDuration?: number;
  /** The border radius of the component. Defaults to 12. */
  borderRadius?: number;
}

const ZoomImage = React.forwardRef<HTMLDivElement, ZoomImageProps>(
  (
    {
      className,
      src,
      alt,
      zoomScale = 1.2,
      transitionDuration = 0.3,
      borderRadius = 12,
      ...props
    },
    ref
  ) => {
    // Motion values for mouse position, initialized to the center
    const mouseX = useMotionValue(50);
    const mouseY = useMotionValue(50);

    // Spring animation for smooth, natural transitions
    const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
    const smoothMouseX = useSpring(mouseX, springConfig);
    const smoothMouseY = useSpring(mouseY, springConfig);

    // Creates a reactive CSS transform-origin string based on mouse position
    const transformOrigin = useTransform(
      [smoothMouseX, smoothMouseY],
      ([latestX, latestY]) => `${latestX}% ${latestY}%`
    );

    // Updates mouse position percentages on mouse move
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      mouseX.set(((e.clientX - left) / width) * 100);
      mouseY.set(((e.clientY - top) / height) * 100);
    };

    // Resets mouse position to the center on mouse leave
    const handleMouseLeave = () => {
      mouseX.set(50);
      mouseY.set(50);
    };

    return (
      <motion.div
        ref={ref}
        className={cn('relative w-full h-auto overflow-hidden', className)}
        style={{ borderRadius: `${borderRadius}px` }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <motion.img
          src={src}
          alt={alt}
          className="w-full h-auto object-cover"
          style={{
            borderRadius: `${borderRadius}px`,
            transformOrigin: transformOrigin, // Apply the dynamic transform-origin
          }}
          whileHover={{ scale: zoomScale }}
          transition={{
            type: 'spring',
            duration: transitionDuration,
            bounce: 0,
          }}
        />
      </motion.div>
    );
  }
);

ZoomImage.displayName = 'ZoomImage';

export { ZoomImage };