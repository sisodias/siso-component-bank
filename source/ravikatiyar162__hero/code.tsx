import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils'; // Assuming shadcn's utility function

// Component-specific types
export interface HeroSlide {
  title: string;
  subtitle?: string;
  status?: string;
  image: string;
  overlay?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface HeroSliderProps {
  slides: HeroSlide[];
  logo?: React.ReactNode;
  navigation?: NavigationItem[];
  ctaLink?: {
    label: string;
    href: string;
  };
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showCounter?: boolean;
  showPagination?: boolean;
  className?: string;
}

// Reusable Hero Slider Component
export const HeroSlider: React.FC<HeroSliderProps> = ({
  slides,
  logo = "H",
  navigation = [],
  ctaLink,
  autoPlay = true,
  autoPlayInterval = 5000,
  showCounter = true,
  showPagination = true,
  className = ""
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize the function to prevent re-creation on every render
  const animateToSlide = useCallback((slideIndex: number) => {
    if (isAnimating || slideIndex === currentSlide) return;
    
    setIsAnimating(true);
    setCurrentSlide(slideIndex);
    
    // Animation duration should match transition timings
    setTimeout(() => {
      setIsAnimating(false);
    }, 1200);
  }, [isAnimating, currentSlide]);
  
  // Preload images
  useEffect(() => {
    const imagePromises = slides.map(slide => new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = slide.image;
        img.onload = () => resolve();
        img.onerror = () => reject(`Failed to load image: ${slide.image}`);
      })
    );
    
    Promise.all(imagePromises)
      .catch(error => console.error(error))
      .finally(() => {
        // Add a small delay for a smoother loading transition
        setTimeout(() => setIsLoading(false), 500);
      });
  }, [slides]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isLoading) return;
    const interval = setInterval(() => {
      animateToSlide((currentSlide + 1) % slides.length);
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, slides.length, isLoading, currentSlide, animateToSlide]);

  const currentSlideData = slides[currentSlide];

  return (
    <div 
      className={cn("relative w-full h-screen bg-background text-primary-foreground overflow-hidden", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero Slider"
    >
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Header */}
      <header className="absolute top-0 left-0 w-full h-[115px] z-30">
        <div className="relative container mx-auto flex items-center justify-center h-[70px] px-4">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl font-bold">
            {logo}
          </div>
          
          <nav className="hidden md:flex space-x-9">
            {navigation.map((item) => (
              <a 
                key={item.label} 
                href={item.href} 
                className={cn(
                  "text-xs uppercase tracking-[3px] transition-colors duration-300",
                  item.active ? 'text-primary-foreground' : 'text-muted-foreground hover:text-primary-foreground'
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {ctaLink && (
            <a 
              href={ctaLink.href} 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-center text-xs uppercase tracking-[3px] pb-1.5 border-b-2 border-border hover:border-primary-foreground/80 transition-all duration-300"
            >
              {ctaLink.label}
            </a>
          )}
        </div>
      </header>

      {/* Main Slider Area */}
      <main className="relative w-full h-full">
        {/* Background Images */}
        <div className="absolute inset-0 z-0">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                currentSlide === index ? 'opacity-100' : 'opacity-0'
              )}
              style={{
                backgroundImage: `url("${slide.image}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: currentSlide === index ? 'scale(1)' : 'scale(1.05)',
                transition: 'transform 10000ms ease-out'
              }}
              aria-hidden={currentSlide !== index}
            />
          ))}
          {/* Overlay */}
          <div className={cn("absolute inset-0 z-10", currentSlideData.overlay || 'bg-gradient-to-r from-black/80 via-black/50 to-transparent')}></div>
        </div>

        {/* Content */}
        <div className="relative z-20 flex items-center h-full" aria-live="polite" aria-atomic="true">
          <div className="container mx-auto px-6 max-w-screen-lg">
            {currentSlideData.subtitle && (
              <div className="relative mb-6">
                <p className="text-muted-foreground text-[11px] md:text-[13px] uppercase tracking-[5px]">
                  {currentSlideData.subtitle}
                </p>
                <div className="absolute top-1/2 -right-14 w-11 h-px bg-border hidden md:block"></div>
              </div>
            )}
            
            <h1 className="text-3xl md:text-8xl lg:text-[110px] leading-tight font-light tracking-tight mb-8 md:mb-16">
              {currentSlideData.title.split(' ').map((word, i) => (
                <span key={i} className="inline-block overflow-hidden">
                  <span 
                    className={cn(
                      'inline-block transform transition-transform duration-700 ease-out',
                      isAnimating ? 'translate-y-full' : 'translate-y-0'
                    )}
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    {word}&nbsp;
                  </span>
                </span>
              ))}
            </h1>

            {currentSlideData.status && (
              <div className="space-y-3">
                <p className="text-muted-foreground text-[11px] md:text-[13px] uppercase tracking-[5px]">
                  Status
                </p>
                <div className="overflow-hidden">
                  <p 
                    className={cn(
                      'text-lg md:text-3xl font-light transition-all duration-700 ease-out',
                      isAnimating ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
                    )}
                    style={{ transitionDelay: '200ms' }}
                  >
                    {currentSlideData.status}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {showPagination && (
          <div className="absolute top-1/2 -translate-y-1/2 right-8 z-20">
            <div className="flex flex-col space-y-6">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => animateToSlide(index)}
                  disabled={isAnimating}
                  aria-label={`Go to slide ${index + 1}`}
                  className={cn(
                    "relative w-3 h-3 rounded-full transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background ring-offset-2",
                    currentSlide === index 
                      ? 'bg-primary-foreground scale-110' 
                      : 'bg-primary-foreground/30 hover:bg-primary-foreground/70'
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {/* Slide Counter */}
        {showCounter && (
          <div className="absolute bottom-8 left-8 text-sm z-20 text-muted-foreground">
            <span className="font-medium text-primary-foreground">
              {(currentSlide + 1).toString().padStart(2, '0')}
            </span>
            <span className="mx-2">/</span>
            <span>{slides.length.toString().padStart(2, '0')}</span>
          </div>
        )}
      </main>
    </div>
  );
};