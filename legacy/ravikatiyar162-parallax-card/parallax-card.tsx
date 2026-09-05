// components/ui/parallax-tilt-card.tsx
import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

import { cn } from "../_utils/cn";

// --- PROPS DEFINITION ---
export interface ParallaxTiltCardProps {
  /**
   * The main title of the card.
   */
  title: string;
  /**
   * A short description displayed under the title.
   */
  description: string;
  /**
   * The URL for the primary image to be displayed prominently on the card.
   */
  imageUrl: string;
  /**
   * Optional class names for extending or overriding the component's styles.
   */
  className?: string;
}

const ParallaxTiltCard = React.forwardRef<
  HTMLDivElement,
  ParallaxTiltCardProps
>(({ title, description, imageUrl, className }, ref) => {
  // --- MOTION VALUES ---
  // Track mouse position relative to the card
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // --- SPRING ANIMATIONS ---
  // Create smooth, spring-based animations for mouse movement
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30, bounce: 0 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30, bounce: 0 });

  // --- TRANSFORMATIONS ---
  // Rotate the card based on mouse position
  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    ["17.5deg", "-17.5deg"]
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    ["-17.5deg", "17.5deg"]
  );

  // Apply parallax effect to inner elements for depth
  const translateZImage = useTransform(mouseYSpring, [-0.5, 0.5], [-25, 25]);
  const translateZContent = useTransform(mouseYSpring, [-0.5, 0.5], [25, -25]);

  // --- EVENT HANDLERS ---
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const { width, height, left, top } = rect;
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    // Normalize mouse position to a range of -0.5 to 0.5
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d", // Enable 3D transformations for children
      }}
      className={cn(
        "relative h-80 w-72 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/30",
        "dark:from-primary/20 dark:to-primary/40",
        className
      )}
    >
      <div
        style={{
          transform: "translateZ(50px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-4 grid grid-rows-2 place-content-center rounded-xl bg-card shadow-lg"
      >
        {/* Image with Parallax */}
        <motion.div
          style={{
            transform: "translateZ(40px)",
            translateY: translateZImage,
          }}
          className="relative h-full w-full"
        >
          <img
            src={imageUrl}
            alt={title}
            className="pointer-events-none absolute -top-12 left-1/2 h-[120%] w-auto -translate-x-1/2 object-contain"
          />
        </motion.div>

        {/* Text Content with Parallax */}
        <motion.div
          style={{
            transform: "translateZ(30px)",
            translateY: translateZContent,
          }}
          className="p-6 pt-0 text-center"
        >
          <h2 className="text-xl font-bold text-card-foreground">{title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </motion.div>
      </div>
    </motion.div>
  );
});
ParallaxTiltCard.displayName = "ParallaxTiltCard";

export { ParallaxTiltCard };