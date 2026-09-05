import * as React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

import { cn } from "../_utils/cn";
import { Button } from "./button";

// Props interface for type safety and reusability
interface ProductCardProps {
  title: string;
  price: number;
  currency?: string;
  rating: number;
  reviewsCount: number;
  colors: string[];
  sizes: string[];
  initialColor: string;
  initialSize: string;
  onAddToCart: (details: { color: string; size: string }) => void;
  className?: string;
}

// Helper component for rendering star ratings
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        return (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              ratingValue <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            )}
          />
        );
      })}
    </div>
  );
};

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  currency = "$",
  rating,
  reviewsCount,
  colors,
  sizes,
  initialColor,
  initialSize,
  onAddToCart,
  className,
}) => {
  const [selectedColor, setSelectedColor] = React.useState(initialColor);
  const [selectedSize, setSelectedSize] = React.useState(initialSize);

  const handleAddToCart = () => {
    onAddToCart({ color: selectedColor, size: selectedSize });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={cn(
        "w-full max-w-sm rounded-xl border bg-card text-card-foreground shadow-lg p-6",
        className
      )}
    >
      {/* Product Header */}
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-2xl font-semibold text-primary">
          {currency}
          {price}
        </p>
      </div>

      {/* Ratings */}
      <div className="flex items-center gap-2 mb-6">
        <StarRating rating={rating} />
        <span className="text-sm text-muted-foreground">
          {rating.toFixed(1)} ({reviewsCount} reviews)
        </span>
      </div>

      {/* Color Selector */}
      <div className="mb-6">
        <label className="text-sm font-medium text-muted-foreground">
          Color
        </label>
        <div className="flex items-center gap-3 mt-2" role="radiogroup">
          {colors.map((color) => (
            <motion.button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              style={{ backgroundColor: color }}
              className={cn(
                "h-8 w-8 rounded-full border-2 transition-transform duration-200",
                selectedColor === color
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "border-transparent"
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Select color ${color}`}
              role="radio"
              aria-checked={selectedColor === color}
            />
          ))}
        </div>
      </div>

      {/* Size Selector */}
      <div className="mb-8">
        <div className="flex items-baseline justify-between mb-2">
          <label className="text-sm font-medium text-muted-foreground">
            Size
          </label>
          <a
            href="#"
            className="text-sm font-medium text-primary hover:underline"
          >
            See sizing chart
          </a>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {sizes.map((size) => (
            <Button
              key={size}
              variant={selectedSize === size ? "default" : "outline"}
              onClick={() => setSelectedSize(size)}
              className="transition-all duration-200"
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* Add to Cart Button */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button size="lg" className="w-full h-12 text-base" onClick={handleAddToCart}>
          Add to cart
        </Button>
      </motion.div>
    </motion.div>
  );
};

export { ProductCard };