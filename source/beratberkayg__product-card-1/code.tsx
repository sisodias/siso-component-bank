"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
} from "lucide-react";

export interface ProductCardProps {
  name?: string;
  price?: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  discount?: number;
  freeShipping?: boolean;
}

export function ProductCard({
  name = "Premium Wool Sweater",
  price = 89.99,
  originalPrice = 129.99,
  rating = 4.8,
  reviewCount = 142,
  images = ["/logo.svg", "/logo.svg", "/logo.svg"],
  colors = ["#1e293b", "#a855f7", "#0ea5e9", "#84cc16"],
  sizes = ["XS", "S", "M", "L", "XL"],
  isNew = true,
  isBestSeller = true,
  discount = 30,
  freeShipping = true,
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddToCart = () => {
    if (isAddedToCart) return;
    setIsAddingToCart(true);
    setTimeout(() => {
      setIsAddingToCart(false);
      setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 2000);
    }, 800);
  };

  return (
    <Card className="  w-full max-w-sm overflow-hidden group bg-backgrou text-foreground shadow-xl hover:shadow-lg transition-all duration-300 rounded-md">
      {/* Image carousel */}
      <div className="relative aspect-[3/4] overflow-hidden ">
        <motion.img
          key={currentImageIndex}
          src={images[currentImageIndex]}
          alt={`${name} - View ${currentImageIndex + 1}`}
          className="object-cover w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Navigation arrows */}
        <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-sm"
            onClick={prevImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-sm"
            onClick={nextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Image indicators */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === currentImageIndex ? "bg-primary w-4" : "bg-primary/30"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(index);
              }}
            />
          ))}
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <Badge className="bg-blue-500 hover:bg-blue-500/90">New</Badge>
          )}
          {isBestSeller && (
            <Badge className="bg-amber-500 hover:bg-amber-500/90">
              Best Seller
            </Badge>
          )}
          {discount > 0 && (
            <Badge className="bg-rose-500 hover:bg-rose-500/90">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Wishlist button */}
        <Button
          variant="secondary"
          size="icon"
          className={`absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-sm ${
            isWishlisted ? "text-rose-500" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
        >
          <Heart
            className={`h-4 w-4 ${isWishlisted ? "fill-rose-500" : ""}`}
          />
        </Button>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-medium line-clamp-1">{name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span className="ml-1 text-sm font-medium">{rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                ({reviewCount} reviews)
              </span>
              {freeShipping && (
                <span className="text-xs text-emerald-600 ml-auto">
                  Free shipping
                </span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold">${price.toFixed(2)}</span>
            {originalPrice > price && (
              <span className="text-sm text-muted-foreground line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Colors & Sizes */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <div className="text-xs text-muted-foreground">Colors</div>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded-full transition-all ${
                      selectedColor === color
                        ? "ring-2 ring-primary ring-offset-2"
                        : "ring-1 ring-muted hover:ring-primary"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-xs text-muted-foreground">Sizes</div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`min-w-[2.5rem] h-8 px-2 rounded-md text-xs font-medium transition-all ${
                      selectedSize === size
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/60 hover:bg-muted"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={isAddingToCart || isAddedToCart}
        >
          {isAddingToCart ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : isAddedToCart ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
