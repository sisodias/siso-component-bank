// components/ui/property-card.tsx
import * as React from "react";
import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import { cn } from "../_utils/cn"; // Assuming you have a cn utility from shadcn

// Define the props for the component
interface PropertyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  imageAlt?: string;
}

// Animation variants for Framer Motion
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const PropertyCard = React.forwardRef<HTMLDivElement, PropertyCardProps>(
  (
    {
      className,
      imageUrl,
      name,
      location,
      price,
      rating,
      reviews,
      imageAlt = "Property Image",
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "group w-full max-w-sm overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg",
          className
        )}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.03, y: -5 }}
        {...props}
      >
        {/* Image Section */}
        <div className="overflow-hidden">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="h-60 w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
        </div>

        {/* Content Section */}
        <div className="space-y-3 p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <motion.h3
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="text-lg font-semibold tracking-tight"
            >
              {name}
            </motion.h3>
            <motion.p
              variants={textVariants}
              initial="hidden"
              animate="visible"
              style={{ transitionDelay: '0.1s' }} // Stagger animation
              className="text-lg font-bold text-primary"
            >
              ${price}
              <span className="text-sm font-normal text-muted-foreground"> /Night</span>
            </motion.p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate="visible"
              style={{ transitionDelay: '0.2s' }} // Stagger animation
              className="flex items-center gap-1.5"
            >
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </motion.div>
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate="visible"
              style={{ transitionDelay: '0.3s' }} // Stagger animation
              className="flex items-center gap-1.5"
            >
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
              <span className="font-medium text-foreground">{rating}</span>
              <span>({reviews.toLocaleString()} Reviews)</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }
);

PropertyCard.displayName = "PropertyCard";

export { PropertyCard };