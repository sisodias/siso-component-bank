import React, { RefObject, useEffect, useRef, useState, ReactNode } from "react";

// Simple utility function for combining class names
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

interface UseMousePositionRefReturn {
  current: { x: number; y: number };
}

const useMousePositionRef = (
  containerRef?: RefObject<HTMLElement | SVGElement>
): UseMousePositionRefReturn => {
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      if (containerRef && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const relativeX = x - rect.left;
        const relativeY = y - rect.top;
        positionRef.current = { x: relativeX, y: relativeY };
      } else {
        positionRef.current = { x, y };
      }
    };

    const handleMouseMove = (ev: MouseEvent) => {
      updatePosition(ev.clientX, ev.clientY);
    };

    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      updatePosition(touch.clientX, touch.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [containerRef]);

  return positionRef;
};

interface ParallaxCardGridProps {
  items?: ReactNode[];
  gap?: number;
  columns?: number;
  intensity?: number;
  className?: string;
}

interface CardItemProps {
  children: ReactNode;
  index: number;
  scrollY: number;
  mousePosition: { x: number; y: number };
  intensity: number;
  containerRef: RefObject<HTMLDivElement>;
}

const CardItem = ({ children, index, scrollY, mousePosition, intensity, containerRef }: CardItemProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const updateTransform = () => {
      if (!cardRef.current || !containerRef.current) return;
      
      // Parallax effect based on scroll position
      const scrollOffset = scrollY * intensity * 0.1;
      const parallaxY = (index % 2 === 0 ? scrollOffset : -scrollOffset) * 0.5;
      const parallaxX = (index % 3 === 0 ? scrollOffset : -scrollOffset) * 0.3;
      
      // Base scale effect for scroll animation
      const baseScale = 1 + Math.sin(scrollY * 0.01 + index) * intensity * 0.001;
      
      // Hover scale effect - bigger on hover
      const hoverScale = isHovered ? 1.05 : 1;
      
      // Combine both scale effects
      const finalScale = baseScale * hoverScale;

      setTransform({
        x: parallaxX,
        y: parallaxY,
        scale: finalScale
      });
    };

    const animationFrame = requestAnimationFrame(updateTransform);
    return () => cancelAnimationFrame(animationFrame);
  }, [scrollY, mousePosition, intensity, index, isHovered, containerRef]);

  return (
    <div
      ref={cardRef}
      className="relative transition-transform duration-200 ease-out"
      style={{
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
        transformStyle: 'preserve-3d'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-background border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        {children}
      </div>
    </div>
  );
};

export const Component = ({
  items = [],
  gap = 16,
  columns = 3,
  intensity = 1,
  className
}: ParallaxCardGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const mousePositionRef = useMousePositionRef(containerRef);

  // Default items if none provided
  const defaultItems = Array.from({ length: 12 }, (_, i) => (
    <div key={i} className="space-y-2">
      <div className="h-4 bg-muted rounded w-3/4"></div>
      <div className="h-3 bg-muted/60 rounded w-1/2"></div>
      <div className="h-20 bg-muted/40 rounded"></div>
    </div>
  ));

  const displayItems = items.length > 0 ? items : defaultItems;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    const updateScrollY = () => {
      setScrollY(window.scrollY);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollY);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("w-full", className)}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`
      }}
    >
      {displayItems.map((item, index) => {
        const props = {
          index,
          scrollY,
          mousePosition: mousePositionRef.current,
          intensity,
          containerRef,
          children: item
        };
        return <CardItem key={index} {...props} />;
      })}
    </div>
  );
};
