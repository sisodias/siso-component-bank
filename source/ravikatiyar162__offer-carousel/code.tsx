import * as React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Tag } from "lucide-react";
import { cn } from "@/lib/utils"; // Your utility for merging Tailwind classes

// Define the type for a single offer item
export interface Offer {
  id: string | number;
  imageSrc: string;
  imageAlt: string;
  tag: string;
  title: string;
  description: string;
  brandLogoSrc: string;
  brandName: string;
  promoCode?: string;
  href: string;
}

// Props for the OfferCard component
interface OfferCardProps {
  offer: Offer;
}

// The individual card component with hover animation
const OfferCard = React.forwardRef<HTMLAnchorElement, OfferCardProps>(({ offer }, ref) => (
  <motion.a
    ref={ref}
    href={offer.href}
    className="relative flex-shrink-0 w-[300px] h-[380px] rounded-2xl overflow-hidden group snap-start"
    whileHover={{ y: -8 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    style={{ perspective: "1000px" }}
  >
    {/* Background Image */}
    <img
      src={offer.imageSrc}
      alt={offer.imageAlt}
      className="absolute inset-0 w-full h-2/4 object-cover transition-transform duration-500 group-hover:scale-110"
    />
    {/* Card Content */}
    <div className="absolute bottom-0 left-0 right-0 h-2/4 bg-card p-5 flex flex-col justify-between">
      <div className="space-y-2">
        {/* Tag */}
        <div className="flex items-center text-xs text-muted-foreground">
          <Tag className="w-4 h-4 mr-2 text-primary" />
          <span>{offer.tag}</span>
        </div>
        {/* Title & Description */}
        <h3 className="text-xl font-bold text-card-foreground leading-tight">{offer.title}</h3>
        <p className="text-sm text-muted-foreground">{offer.description}</p>
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-3">
          <img src={offer.brandLogoSrc} alt={`${offer.brandName} logo`} className="w-8 h-8 rounded-full bg-muted" />
          <div>
            <p className="text-xs font-semibold text-card-foreground">{offer.brandName}</p>
            {offer.promoCode && (
              <p className="text-xs text-muted-foreground">{offer.promoCode}</p>
            )}
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground transform transition-transform duration-300 group-hover:rotate-[-45deg] group-hover:bg-primary group-hover:text-primary-foreground">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  </motion.a>
));
OfferCard.displayName = "OfferCard";

// Props for the OfferCarousel component
export interface OfferCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  offers: Offer[];
}

// The main carousel component with scroll functionality
const OfferCarousel = React.forwardRef<HTMLDivElement, OfferCarouselProps>(
  ({ offers, className, ...props }, ref) => {
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
      if (scrollContainerRef.current) {
        const { current } = scrollContainerRef;
        const scrollAmount = current.clientWidth * 0.8; // Scroll by 80% of the container width
        current.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
      }
    };

    return (
      <div ref={ref} className={cn("relative w-full group", className)} {...props}>
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute top-1/2 -translate-y-1/2 left-0 z-10 w-10 h-10 rounded-full bg-background/50 backdrop-blur-sm border border-border flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background/80 disabled:opacity-0"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        >
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
        
        {/* Right Scroll Button */}
        <button
          onClick={() => scroll("right")}
          className="absolute top-1/2 -translate-y-1/2 right-0 z-10 w-10 h-10 rounded-full bg-background/50 backdrop-blur-sm border border-border flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background/80 disabled:opacity-0"
          aria-label="Scroll Right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    );
  }
);
OfferCarousel.displayName = "OfferCarousel";

export { OfferCarousel, OfferCard };