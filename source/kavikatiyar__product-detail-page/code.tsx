// components/ui/product-detail-page.tsx
import * as React from "react";
import { ChevronRight, Star, Tag, Ruler, Users, Info, Heart, Share2, ShoppingCart, Send, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils"; // Your utility for merging tailwind classes
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define TypeScript interfaces for component props for type safety and reusability
interface BreadcrumbItem {
  label: string;
  href: string;
}

interface ProductTag {
  label: string;
  icon?: React.ElementType;
}

interface Seller {
  name: string;
  avatarUrl: string;
  rating: number;
}

interface Product {
  name: string;
  price: number;
  shippingCost: number;
  currency: string;
  images: string[];
  description: string;
  tags: ProductTag[];
}

export interface ProductDetailPageProps {
  product: Product;
  seller: Seller;
  breadcrumbs: BreadcrumbItem[];
}

// A small component for rendering rating stars
const StarRating = ({ rating, className }: { rating: number; className?: string }) => (
  <div className={cn("flex items-center gap-0.5", className)}>
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/50"
        )}
      />
    ))}
    <span className="ml-2 text-sm font-medium text-muted-foreground">{rating.toFixed(1)}</span>
  </div>
);


export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, seller, breadcrumbs }) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 bg-background text-foreground">
      {/* Breadcrumbs Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center text-sm text-muted-foreground mb-4">
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={index}>
            <a href={item.href} className="hover:text-primary transition-colors">{item.label}</a>
            {index < breadcrumbs.length - 1 && <ChevronRight className="h-4 w-4 mx-1" />}
          </React.Fragment>
        ))}
      </nav>

      <div className="flex justify-between items-center mb-6">
        <div /> {/* Spacer */}
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Favorite</span>
            </Button>
            <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Share</span>
            </Button>
        </div>
      </div>


      {/* Main content grid */}
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* Image Gallery Section */}
        <div className="flex flex-col gap-4">
           <AnimatePresence mode="wait">
             <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border"
             >
                <img
                    src={product.images[currentImageIndex]}
                    alt={`${product.name} image ${currentImageIndex + 1}`}
                    className="object-cover w-full h-full"
                />
             </motion.div>
           </AnimatePresence>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
                {product.images.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                    "h-2 w-2 rounded-full transition-colors",
                    currentImageIndex === index ? "bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    )}
                    aria-label={`View image ${index + 1}`}
                />
                ))}
            </div>
            <Button variant="outline" size="sm" className="gap-2">
                <Camera className="h-4 w-4" /> Find Similar
            </Button>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.name}</h1>
          <div className="mt-2">
            <span className="text-4xl font-bold">{product.currency}{product.price}</span>
            <span className="text-sm text-muted-foreground ml-2">
                + {product.currency}{product.shippingCost.toFixed(2)} Shipping
            </span>
          </div>

          <div className="flex gap-2 my-6">
            <Button size="lg" className="flex-1 gap-2"><ShoppingCart className="h-5 w-5"/> Buy Now</Button>
            <Button size="lg" variant="outline" className="flex-1 gap-2"><Send className="h-5 w-5"/> Contact Seller</Button>
          </div>

          {/* Tags/Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {product.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-sm font-normal py-1 px-3 gap-2">
                {tag.icon && <tag.icon className="h-4 w-4" />}
                {tag.label}
              </Badge>
            ))}
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
            <a href="#" className="text-primary font-medium hover:underline ml-2">Read more</a>
          </p>
          
          {/* Seller Information */}
          <div className="mt-8 pt-6 border-t">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={seller.avatarUrl} alt={seller.name} />
                        <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{seller.name}</p>
                        <StarRating rating={seller.rating} />
                    </div>
                </div>
                <Button variant="link" className="text-primary">
                    All listings &rarr;
                </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};