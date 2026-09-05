import * as React from "react";
import { cn } from "../_utils/cn"; // Assuming you have a `cn` utility
import { motion } from "framer-motion";

// Interface for the component's props for type-safety and clarity
export interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  name: string;
  tagline: string;
  price: number;
  currency?: string;
  isCouponPrice?: boolean;
  originalPrice?: number;
  offerText: string;
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      className,
      imageUrl,
      name,
      tagline,
      price,
      currency = "₹",
      isCouponPrice = false,
      originalPrice,
      offerText,
      ...props
    },
    ref
  ) => {
    // Price formatter for consistent currency display
    const formatPrice = (amount: number) => {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
      })
        .format(amount)
        .replace("₹", `${currency}`);
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "group relative flex h-full w-full flex-col items-center justify-start overflow-hidden rounded-xl border bg-card p-6 text-center text-card-foreground shadow-sm transition-all duration-300 ease-in-out hover:shadow-md",
          className
        )}
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
        {...props}
      >
        {/* Product Image */}
        <div className="relative mb-4 flex h-40 w-full items-center justify-center">
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-grow flex-col items-center gap-2">
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">{tagline}</p>
        </div>

        {/* Pricing and Offers */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{formatPrice(price)}</span>
            {isCouponPrice && (
              <span className="text-xs font-medium text-primary">
                Coupon Price
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
            {originalPrice && (
              <span className="text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
            <span className="font-semibold text-yellow-600 dark:text-yellow-500">
              {offerText}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }
);

ProductCard.displayName = "ProductCard";

export { ProductCard };