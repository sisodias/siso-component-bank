import * as React from "react";
import { motion, useAnimation } from "framer-motion";
import { Send } from "lucide-react";
import { cn } from "../_utils/cn"; // Assuming you have a utility for classname merging

// Interface for the component props for type-safety and reusability
export interface LocationCardProps {
  imageUrl: string;
  location: string;
  country: string;
  href: string;
  className?: string;
}

const LocationCard = React.forwardRef<HTMLDivElement, LocationCardProps>(
  ({ imageUrl, location, country, href, className }, ref) => {
    const controls = useAnimation();
    const iconControls = useAnimation();

    // Animation variants for the main card container
    const cardVariants = {
      initial: { scale: 1, y: 0 },
      hover: { scale: 1.03, y: -5, transition: { type: "spring", stiffness: 400, damping: 10 } },
    };

    // Animation variants for the button's text
    const textVariants = {
      initial: { opacity: 1 },
      hover: { opacity: 0, transition: { duration: 0.1 } },
    };

    // Animation variants for the icon
    const iconVariants = {
      initial: { x: 0 },
      hover: { x: 50, transition: { type: "spring", stiffness: 300, damping: 15 } },
    };

    const handleHoverStart = () => {
      controls.start("hover");
      iconControls.start("hover");
    };

    const handleHoverEnd = () => {
      controls.start("initial");
      iconControls.start("initial");
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "w-full max-w-xs overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm",
          className
        )}
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        animate={controls}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        // Accessibility: Announce the component as a group
        role="group"
        aria-labelledby="location-title"
      >
        {/* Image Section */}
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={`A scenic view of ${location}`}
            className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>

        {/* Content Section */}
        <div className="flex items-center justify-between p-4">
          <div>
            <h3 id="location-title" className="font-semibold text-card-foreground">
              {location},
            </h3>
            <p className="text-sm text-muted-foreground">{country}</p>
          </div>
          
          {/* Animated Button */}
          <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex h-10 w-32 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-medium text-primary-foreground"
            aria-label={`Get directions to ${location}`}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              variants={textVariants}
              animate={controls}
              className="absolute"
            >
              Directions
            </motion.span>
            <motion.span
              variants={iconVariants}
              animate={controls}
              className="absolute left-4"
            >
              <Send size={16} />
            </motion.span>
          </motion.a>
        </div>
      </motion.div>
    );
  }
);

LocationCard.displayName = "LocationCard";

export { LocationCard };