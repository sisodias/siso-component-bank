import * as React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Heart, Ticket } from "lucide-react";
import { cn } from "@/lib/utils"; // Your shadcn utility for classnames

// Define the type for a single destination item
export interface Destination {
  id: string;
  name: string;
  country: string;
  imageUrl: string;
  avgTicketPrice: number;
  currency?: string;
  isFavorite?: boolean;
}

// Props for the main DestinationCarousel component
interface DestinationCarouselProps {
  title: string;
  destinations: Destination[];
  viewAllHref?: string;
  className?: string;
}

/**
 * A responsive, animated carousel to display popular destinations.
 * It uses framer-motion for smooth animations on load and hover.
 */
export const DestinationCarousel = ({
  title,
  destinations,
  viewAllHref = "#",
  className,
}: DestinationCarouselProps) => {
  const [favorites, setFavorites] = React.useState<Set<string>>(
    new Set(destinations.filter(d => d.isFavorite).map(d => d.id))
  );

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavs = new Set(prev);
      if (newFavs.has(id)) {
        newFavs.delete(id);
      } else {
        newFavs.add(id);
      }
      return newFavs;
    });
  };

  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 14,
      },
    },
  };

  return (
    <section className={cn("w-full max-w-6xl mx-auto py-8", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <a
          href={viewAllHref}
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          View all
          <ChevronRight className="h-4 w-4 ml-1" />
        </a>
      </div>

      {/* Scrollable Container */}
      <div className="relative">
        <motion.div
          className="flex w-full space-x-4 overflow-x-auto pb-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {destinations.map((dest) => (
            <motion.div
              key={dest.id}
              variants={itemVariants}
              className="flex-shrink-0 w-[280px]"
            >
              <motion.div
                className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg"
                whileHover={{ y: -4 }}
              >
                <div className="relative">
                  <img
                    src={dest.imageUrl}
                    alt={`Image of ${dest.name}`}
                    width={280}
                    height={180}
                    className="h-[180px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <button
                    onClick={() => toggleFavorite(dest.id)}
                    aria-label={favorites.has(dest.id) ? "Remove from favorites" : "Add to favorites"}
                    className="absolute top-3 right-3 z-10 rounded-full bg-background/70 p-1.5 backdrop-blur-sm transition-all hover:bg-background"
                  >
                    <Heart
                      className={cn(
                        "h-5 w-5 text-foreground/80 transition-all",
                        favorites.has(dest.id) && "fill-red-500 text-red-500"
                      )}
                    />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{dest.name}</h3>
                  <p className="text-sm text-muted-foreground">{dest.country}</p>
                  <div className="mt-3 flex items-center text-sm text-muted-foreground">
                    <Ticket className="h-4 w-4 mr-2" />
                    <span>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: dest.currency || "EUR",
                      }).format(dest.avgTicketPrice)}{" "}
                      avg. ticket price
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};