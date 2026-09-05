import * as React from "react";
import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import { cn } from "../_utils/cn"; // Assuming you have a `cn` utility for classnames

// Define the props for the component
export interface HotelCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  imageAlt: string;
  roomType: string;
  hotelName: string;
  location: string;
  rating: number;
  reviewCount: number;
  href?: string; // Optional link for the entire card
}

const HotelCard = React.forwardRef<HTMLDivElement, HotelCardProps>(
  (
    {
      className,
      imageUrl,
      imageAlt,
      roomType,
      hotelName,
      location,
      rating,
      reviewCount,
      href,
      ...props
    },
    ref
  ) => {
    // Determine the root component type: 'a' for link, 'div' otherwise
    const Component = href ? motion.a : motion.div;

    return (
      <Component
        ref={ref as any} // Type assertion needed for motion component polymorphism
        href={href}
        className={cn(
          "group flex flex-col md:flex-row overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg",
          className
        )}
        // Animation variants for framer-motion
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300 }}
        {...props}
      >
        {/* Image Section */}
        <div className="md:w-2/5 w-full h-56 md:h-auto overflow-hidden">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-col justify-center p-6 md:w-3/5 space-y-2">
          <span className="text-sm text-muted-foreground">{roomType}</span>
          <h3 className="text-2xl font-bold tracking-tight">{hotelName}</h3>
          
          {/* Location */}
          <div className="flex items-center text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
            <span>{location}</span>
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center pt-2 text-muted-foreground">
            <Star className="mr-2 h-4 w-4 fill-primary text-primary" />
            <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
            <span className="ml-1.5">({reviewCount.toLocaleString()} Reviews)</span>
          </div>
        </div>
      </Component>
    );
  }
);

HotelCard.displayName = "HotelCard";

export { HotelCard };