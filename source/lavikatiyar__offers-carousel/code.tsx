import * as React from "react";
import { motion, useAnimation } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Gift } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// TypeScript interface for each item in the carousel
export interface CarouselItem {
  id: number | string;
  imageUrl: string;
  title: string;
  subtitle: string;
  rating: number;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
}

// Props for the main OffersCarousel component
export interface OffersCarouselProps {
  offerIcon?: React.ReactNode;
  offerTitle: string;
  offerSubtitle: string;
  ctaText: string;
  onCtaClick: () => void;
  items: CarouselItem[];
  className?: string;
}

// Sub-component for individual item cards in the carousel
const ItemCard = ({ item }: { item: CarouselItem }) => (
  <motion.div
    className="group w-64 flex-shrink-0"
    whileHover={{ y: -5 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="relative">
        <img
          src={item.imageUrl}
          alt={item.title}
          width={256}
          height={160}
          className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {item.discountPercentage && (
          <div className="absolute bottom-2 right-2 rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
            {item.discountPercentage}% OFF
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-base font-semibold leading-tight">{item.title}</h3>
          <div className="ml-2 flex flex-shrink-0 items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
            <Star className="h-3 w-3" />
            <span>{item.rating.toFixed(1)}</span>
          </div>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{item.subtitle}</p>
        <div className="mt-3 flex items-end gap-2">
          <p className="text-lg font-bold">₹{item.price.toLocaleString('en-IN')}</p>
          {item.originalPrice && (
            <p className="text-sm text-muted-foreground line-through">
              ₹{item.originalPrice.toLocaleString('en-IN')}
            </p>
          )}
        </div>
        <p className="text-xs text-muted-foreground">/ night</p>
      </div>
    </div>
  </motion.div>
);

// Main OffersCarousel component
export const OffersCarousel = React.forwardRef<HTMLDivElement, OffersCarouselProps>(
  ({ offerIcon, offerTitle, offerSubtitle, ctaText, onCtaClick, items, className }, ref) => {
    const carouselRef = React.useRef<HTMLDivElement>(null);
    const controls = useAnimation();
    const [isAtStart, setIsAtStart] = React.useState(true);
    const [isAtEnd, setIsAtEnd] = React.useState(false);

    // Function to scroll the carousel
    const scroll = (direction: "left" | "right") => {
      if (carouselRef.current) {
        const scrollAmount = carouselRef.current.clientWidth * 0.8;
        const newScrollLeft =
          carouselRef.current.scrollLeft + (direction === "right" ? scrollAmount : -scrollAmount);
        controls.start({
          x: -newScrollLeft,
          transition: { type: "spring", stiffness: 300, damping: 30 },
        });
        carouselRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" });
      }
    };
    
    // Check scroll position to enable/disable navigation buttons
    const checkScrollPosition = React.useCallback(() => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            setIsAtStart(scrollLeft < 10);
            setIsAtEnd(scrollWidth - scrollLeft - clientWidth < 10);
        }
    }, []);

    React.useEffect(() => {
        const currentCarousel = carouselRef.current;
        if (currentCarousel) {
            currentCarousel.addEventListener("scroll", checkScrollPosition);
            checkScrollPosition(); // Initial check
        }
        return () => {
            if (currentCarousel) {
                currentCarousel.removeEventListener("scroll", checkScrollPosition);
            }
        };
    }, [checkScrollPosition, items]);

    return (
      <div
        ref={ref}
        className={cn("w-full max-w-6xl rounded-2xl border bg-card p-4 shadow-sm md:p-6", className)}
      >
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
          {/* Left: Offer Section */}
          <div className="flex flex-col items-center text-center lg:col-span-3 lg:items-start lg:text-left">
            <div className="flex items-center gap-3">
              {offerIcon || <Gift className="h-6 w-6 text-primary" />}
               <p className="text-sm text-muted-foreground">Since you're flying with us!</p>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-primary">{offerTitle}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{offerSubtitle}</p>
            <Button variant="outline" className="mt-6 w-full max-w-xs lg:w-auto" onClick={onCtaClick}>
              {ctaText}
            </Button>
          </div>

          {/* Right: Carousel Section */}
          <div className="relative lg:col-span-9">
            <div ref={carouselRef} className="overflow-x-auto scrollbar-hide">
              <motion.div
                className="flex gap-4 px-1 py-2"
                animate={controls}
              >
                {items.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </motion.div>
            </div>

            {/* Navigation Buttons */}
            {!isAtStart && (
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full h-9 w-9 shadow-md z-10 hidden md:flex"
                onClick={() => scroll("left")}
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            {!isAtEnd && (
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 rounded-full h-9 w-9 shadow-md z-10 hidden md:flex"
                onClick={() => scroll("right")}
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
);
OffersCarousel.displayName = "OffersCarousel";