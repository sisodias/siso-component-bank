// components/ui/location-card.tsx
import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "./button"; // Assuming shadcn/ui Button is in this path
import { cn } from "../_utils/cn"; // Assuming shadcn/ui utility for classnames

// Define the props for the LocationCard component
interface LocationCardProps {
  city: string;
  address: string;
  imageUrl: string;
  directionsUrl: string;
  className?: string;
}

// The main LocationCard component
export const LocationCard = ({
  city,
  address,
  imageUrl,
  directionsUrl,
  className,
}: LocationCardProps) => {
  // Framer Motion hooks for creating the 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  // Create transforms for rotation based on mouse position
  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    ["10deg", "-10deg"]
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    ["-10deg", "10deg"]
  );

  // Handle mouse movement over the card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  // Reset the tilt effect when the mouse leaves
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "relative w-full h-80 rounded-xl bg-cover bg-center",
        "shadow-lg transition-shadow duration-300 hover:shadow-2xl",
        className
      )}
    >
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
          backgroundImage: `url(${imageUrl})`,
        }}
        className="absolute inset-4 grid h-[calc(100%-2rem)] w-[calc(100%-2rem)] place-content-end rounded-xl bg-cover bg-center shadow-lg"
      >
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Content */}
        <div 
          style={{ transform: "translateZ(50px)" }}
          className="p-6 text-white flex justify-between items-end w-full"
        >
          <div>
            <h3 className="text-2xl font-bold">{city}</h3>
            <p className="text-sm text-white/80">{address}</p>
          </div>
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
            <Button 
              variant="secondary"
              aria-label={`Get directions to our ${city} office`}
            >
              Get directions
            </Button>
          </a>
        </div>
      </div>
    </motion.div>
  );
};