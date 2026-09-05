
"use client"

import * as React from "react"
import { cn } from "../_utils/cn"

export interface FashionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  image: string
  title: string
  description?: string
  price: string
  badge?: string
  badgeColor?: "sale" | "new" | "exclusive" | "limited"
  aspect?: "portrait" | "landscape" | "square"
  glowEffect?: boolean
}

export function AmazingCard({
  image,
  title,
  description,
  price,
  badge,
  badgeColor = "new",
  aspect = "portrait",
  glowEffect = true,
  className,
  ...props
}: FashionCardProps) {
  const [rotation, setRotation] = React.useState({ x: 0, y: 0 });
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate rotation based on mouse position
      // This creates a natural feeling 3D tilt effect
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotationX = (y - centerY) / 20;
      const rotationY = -(x - centerX) / 20;
      
      setRotation({ x: rotationX, y: rotationY });
    }
  };

  const handleMouseLeave = () => {
    // Return to neutral position when mouse leaves
    setRotation({ x: 0, y: 0 });
  };

  // Determine badge style based on type
  const badgeStyles = {
    sale: "bg-fashion-accent text-white",
    new: "bg-fashion-highlight text-fashion-charcoal",
    exclusive: "bg-fashion-charcoal text-fashion-cream",
    limited: "bg-gradient-to-r from-fashion-accent to-fashion-highlight text-white",
  };

  // Define aspect ratio classes
  const aspectClasses = {
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
    square: "aspect-square",
  };

  return (
    <div 
      className={cn("fashion-card-container group", className)}
      {...props}
    >
      <div
        ref={cardRef}
        className={cn(
          "fashion-card relative overflow-hidden rounded-xl",
          glowEffect && "animate-glow-pulse",
          "transition-all duration-300"
        )}
        style={{ 
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* The glass effect overlay */}
        <div className="fashion-card-glass absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Card main content */}
        <div className="fashion-card-content relative z-20 flex flex-col overflow-hidden rounded-xl">
          {/* Image section with parallax */}
          <div className={cn("parallax-image-container w-full", aspectClasses[aspect])}>
            <img
              src={image}
              alt={title}
              className="parallax-image w-full h-full object-cover"
            />
          </div>

          {/* Content section */}
          <div className="p-5 bg-white dark:bg-gray-900 flex flex-col space-y-2 flex-grow transition-all duration-300 group-hover:bg-opacity-80 dark:group-hover:bg-opacity-90 backdrop-blur-sm">
            <h3 className="font-serif text-lg md:text-xl font-medium leading-none tracking-tight gradient-text animate-fadeIn">
              {title}
            </h3>
            
            {description && (
              <p className="font-sans text-sm text-muted-foreground line-clamp-2 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                {description}
              </p>
            )}
            
            <div className="flex items-center justify-between mt-auto pt-3 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <p className="font-serif font-semibold text-lg md:text-xl">
                {price}
              </p>
              
              <button className="shine-effect relative rounded-full px-4 py-1.5 text-xs font-medium bg-fashion-charcoal text-white overflow-hidden hover:animate-shine transition transform duration-300 hover:scale-105">
                Shop now
              </button>
            </div>
          </div>
        </div>
        
        {/* Badge if provided */}
        {badge && (
          <div className={cn(
            "fashion-card-badge px-2.5 py-1 rounded-full text-xs font-medium capitalize animate-float",
            badgeStyles[badgeColor]
          )}>
            {badge}
          </div>
        )}
      </div>
    </div>
  );
}

// Demo component for displaying various card styles
export function FashionCardDemo() {
  return (
    <div className="p-8 bg-gradient-to-br from-fashion-cream to-fashion-beige min-h-screen">
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-fashion-charcoal mb-8 text-center">New Arrivals</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AmazingCard
          image="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
          title="Cashmere Blend Coat"
          description="Luxurious camel coat crafted from premium cashmere blend for ultimate warmth and style."
          price="$349.99"
          badge="new"
          badgeColor="new"
        />
        <AmazingCard
          image="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
          title="Designer Handbag"
          description="Elegant structured handbag with gold hardware and adjustable strap."
          price="$189.99"
          badge="sale"
          badgeColor="sale"
          aspect="square"
        />
        <AmazingCard
          image="https://images.unsplash.com/photo-1543076447-215ad9ba6923?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
          title="Leather Chelsea Boots"
          description="Classic Chelsea boots crafted from genuine leather with durable rubber sole."
          price="$129.99"
          badge="exclusive"
          badgeColor="exclusive"
        />
      </div>
    </div>
  );
}

// Export variants for examples and documentation
export { AmazingCard as FashionCard };