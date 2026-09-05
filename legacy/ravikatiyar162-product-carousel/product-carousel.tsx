// components/ui/product-carousel.tsx
import * as React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { cn } from "../_utils/cn"; // Assuming you have a `cn` utility from shadcn

// --- TYPE DEFINITIONS ---
export interface Product {
  id: string | number;
  name: string;
  quantity: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  deliveryTime: string;
  imageUrl: string;
}

interface ProductCardProps {
  product: Product;
}

interface ProductCarouselProps {
  title: string;
  products: Product[];
  viewAllHref?: string;
  className?: string;
}

// --- SUB-COMPONENTS ---

// Reusable Product Card Component
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className="group relative w-48 flex-shrink-0"
    >
      <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground transition-all duration-300 hover:shadow-md">
        {/* Image and Discount Badge */}
        <div className="relative h-40 overflow-hidden bg-muted">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
          {product.discount && (
            <div className="absolute left-2 top-2 rounded-md bg-green-200 px-2 py-0.5 text-xs font-semibold text-destructive-foreground">
              {product.discount}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col space-y-3 p-4">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{product.deliveryTime}</span>
          </div>
          <h3 className="h-10 truncate text-sm font-medium text-foreground">{product.name}</h3>
          <p className="text-xs text-muted-foreground">{product.quantity}</p>

          {/* Pricing and Add Button */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-base font-semibold text-foreground">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</span>
              )}
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="rounded-lg border border-primary bg-background px-6 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              ADD
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- MAIN COMPONENT ---
export const ProductCarousel = React.forwardRef<HTMLDivElement, ProductCarouselProps>(
  ({ title, products, viewAllHref = "#", className }, ref) => {
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const [isScrollable, setIsScrollable] = React.useState(false);
    const [isAtStart, setIsAtStart] = React.useState(true);
    const [isAtEnd, setIsAtEnd] = React.useState(false);

    // Function to handle scrolling
    const handleScroll = (direction: "left" | "right") => {
      if (scrollContainerRef.current) {
        const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
        scrollContainerRef.current.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
      }
    };
    
    // Check scroll state on mount and resize
    const checkScrollState = React.useCallback(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        
        const scrollable = el.scrollWidth > el.clientWidth;
        setIsScrollable(scrollable);
        setIsAtStart(el.scrollLeft === 0);
        setIsAtEnd(Math.abs(el.scrollWidth - el.scrollLeft - el.clientWidth) < 1);
    }, []);

    React.useEffect(() => {
        checkScrollState();
        const el = scrollContainerRef.current;
        el?.addEventListener('scroll', checkScrollState);
        window.addEventListener('resize', checkScrollState);

        return () => {
            el?.removeEventListener('scroll', checkScrollState);
            window.removeEventListener('resize', checkScrollState);
        };
    }, [checkScrollState]);


    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    };

    return (
      <section className={cn("relative w-full space-y-4 py-8", className)} ref={ref}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <a
            href={viewAllHref}
            className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            see all
          </a>
        </div>
        
        <div className="relative">
          {/* Product List */}
          <motion.div
            ref={scrollContainerRef}
            className="scrollbar-hide flex space-x-4 overflow-x-auto px-4 sm:px-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>

          {/* Navigation Controls */}
          {isScrollable && (
            <>
              {/* Left Button */}
              <button
                onClick={() => handleScroll("left")}
                disabled={isAtStart}
                aria-label="Scroll left"
                className={cn(
                  "absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-background p-2 shadow-md transition-opacity duration-300 disabled:opacity-0",
                  "hover:bg-accent focus:outline-none"
                )}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              {/* Right Button */}
              <button
                onClick={() => handleScroll("right")}
                disabled={isAtEnd}
                aria-label="Scroll right"
                className={cn(
                  "absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-background p-2 shadow-md transition-opacity duration-300 disabled:opacity-0",
                  "hover:bg-accent focus:outline-none"
                )}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      </section>
    );
  }
);

ProductCarousel.displayName = "ProductCarousel";