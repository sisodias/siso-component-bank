import { useState } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface AccordionData {
  id: number;
  title: string;
  imageUrl: string;
}

interface AccordionItemProps {
  item: AccordionData;
  isActive: boolean;
  onMouseEnter: () => void;
}

interface LandingAccordionItemProps {
  items?: AccordionData[];
  heading?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  defaultActiveIndex?: number;
  onCtaClick?: () => void;
}

// ============================================================================
// DEFAULT DATA
// ============================================================================

const defaultAccordionItems: AccordionData[] = [
  {
    id: 1,
    title: 'Cloud Architecture',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Data Analytics',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Cybersecurity',
    imageUrl: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=2068&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'DevOps Pipeline',
    imageUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=2032&auto=format&fit=crop',
  },
  {
    id: 5,
    title: 'Machine Learning',
    imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=2070&auto=format&fit=crop',
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Combines class names conditionally
 * Similar to clsx or classnames library
 */
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Handles image loading errors with fallback
 */
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  target.onerror = null;
  target.src = 'https://placehold.co/400x450/2d3748/ffffff?text=Image+Error';
};

// ============================================================================
// GRID BACKGROUND COMPONENT
// ============================================================================

const GridBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Orthogonal Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path 
              d="M 40 0 L 0 0 0 40" 
              fill="none" 
              stroke="rgba(0, 0, 0, 0.05)" 
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20" />
    </div>
  );
};

// ============================================================================
// ACCORDION ITEM COMPONENT
// ============================================================================

const AccordionItem: React.FC<AccordionItemProps> = ({ 
  item, 
  isActive, 
  onMouseEnter 
}) => {
  return (
    <div
      className={cn(
        'relative h-[450px] rounded-2xl overflow-hidden cursor-pointer',
        'transition-all duration-[900ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
        'transform-gpu will-change-[width]',
        isActive ? 'w-[600px] shadow-2xl' : 'w-[80px] shadow-lg'
      )}
      onMouseEnter={onMouseEnter}
      role="button"
      tabIndex={0}
      aria-label={`View ${item.title}`}
      aria-pressed={isActive}
    >
      {/* Background Image */}
      <img
        src={item.imageUrl}
        alt={item.title}
        className={cn(
          'absolute inset-0 w-full h-full object-cover',
          'transition-transform duration-[900ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
          isActive ? 'scale-100' : 'scale-110'
        )}
        onError={handleImageError}
        loading="lazy"
      />
      
      {/* Dark overlay for better text readability */}
      <div 
        className={cn(
          'absolute inset-0 bg-black',
          'transition-opacity duration-[900ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
          isActive ? 'bg-opacity-40' : 'bg-opacity-50'
        )}
        aria-hidden="true"
      />

      {/* Caption Text */}
      <span
        className={cn(
          'absolute text-white text-lg font-semibold whitespace-nowrap',
          'transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
          'transform-gpu',
          isActive
            ? 'bottom-6 left-1/2 -translate-x-1/2 rotate-0 opacity-100'
            : 'w-auto text-left bottom-24 left-1/2 -translate-x-1/2 rotate-90 opacity-90'
        )}
      >
        {item.title}
      </span>
    </div>
  );
};

// ============================================================================
// MAIN LANDING ACCORDION COMPONENT
// ============================================================================

const LandingAccordionItem: React.FC<LandingAccordionItemProps> = ({
  items = defaultAccordionItems,
  heading = "Enterprise Solutions That Scale",
  description = "Transform your business with cutting-edge technology infrastructure designed for modern enterprises and rapid growth.",
  ctaText = "Schedule Demo",
  ctaHref = "#contact",
  defaultActiveIndex = 4,
  onCtaClick,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(defaultActiveIndex);

  const handleItemHover = (index: number) => {
    setActiveIndex(index);
  };

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onCtaClick) {
      e.preventDefault();
      onCtaClick();
    }
  };

  return (
    <div className="w-full relative bg-white font-sans min-h-screen">
      {/* Grid Background */}
      <GridBackground />
      
      <section className="relative container mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left Side: Text Content */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tighter">
              {heading}
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto md:mx-0">
              {description}
            </p>
            <div className="mt-8">
              <a
                href={ctaHref}
                onClick={handleCtaClick}
                className="inline-block bg-gray-900 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transform hover:scale-105"
                aria-label={ctaText}
              >
                {ctaText}
              </a>
            </div>
          </div>

          {/* Right Side: Image Accordion */}
          <div className="w-full md:w-1/2">
            <div 
              className="flex flex-row items-center justify-center gap-4 overflow-x-auto p-4"
              role="tablist"
              aria-label="AI Features"
            >
              {items.map((item, index) => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  isActive={index === activeIndex}
                  onMouseEnter={() => handleItemHover(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default LandingAccordionItem;
export { AccordionItem, GridBackground, type AccordionData, type AccordionItemProps, type LandingAccordionItemProps };

// ============================================================================
// USAGE EXAMPLES (commented out)
// ============================================================================

/*
// Example 1: Basic usage with defaults
<LandingAccordionItem />

// Example 2: Custom content
<LandingAccordionItem 
  heading="Transform Your Business with AI"
  description="Leverage cutting-edge AI technology to scale your operations."
  ctaText="Get Started"
  ctaHref="/signup"
/>

// Example 3: Custom items and click handler
const customItems = [
  {
    id: 1,
    title: 'Analytics',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
  },
  {
    id: 2,
    title: 'Automation',
    imageUrl: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800',
  },
];

<LandingAccordionItem 
  items={customItems}
  defaultActiveIndex={0}
  onCtaClick={() => console.log('CTA clicked!')}
/>

// Example 4: Different starting item
<LandingAccordionItem 
  defaultActiveIndex={0}  // First item active by default
/>
*/