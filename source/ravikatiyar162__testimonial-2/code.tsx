import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- TYPE DEFINITIONS ---
interface Testimonial {
  imgSrc: string;
  alt: string;
}

interface AnimatedTestimonialGridProps {
  testimonials: Testimonial[];
  badgeText?: string;
  title: React.ReactNode;
  description: React.ReactNode;
  ctaText: string;
  ctaHref: string;
  className?: string;
}

// --- PRE-DEFINED POSITIONS FOR THE IMAGES ---
// These positions are carefully chosen to replicate the reference image layout.
// They are responsive, with some images hidden on smaller screens.
const imagePositions = [
  // Desktop and Tablet positions
  { top: '5%', left: '15%', className: 'hidden lg:block w-24 h-24' },
  { top: '15%', left: '35%', className: 'hidden md:block w-20 h-20' },
  { top: '5%', left: '55%', className: 'hidden md:block w-16 h-16' },
  { top: '10%', right: '15%', className: 'hidden lg:block w-28 h-28' },
  { top: '25%', right: '5%', className: 'hidden md:block w-20 h-20' },
  { top: '45%', right: '10%', className: 'hidden lg:block w-24 h-24' },
  { top: '50%', left: '5%', className: 'hidden md:block w-28 h-28' },
  { bottom: '5%', left: '20%', className: 'hidden lg:block w-20 h-20' },
  { bottom: '15%', left: '45%', className: 'hidden md:block w-16 h-16' },
  { bottom: '10%', right: '30%', className: 'hidden md:block w-24 h-24' },
  { bottom: '2%', right: '15%', className: 'hidden lg:block w-20 h-20' },
   // Mobile-specific positions (simpler layout)
  { top: '10%', left: '5%', className: 'block md:hidden w-16 h-16' },
  { top: '5%', right: '10%', className: 'block md:hidden w-20 h-20' },
  { bottom: '5%', left: '10%', className: 'block md:hidden w-20 h-20' },
  { bottom: '10%', right: '5%', className: 'block md:hidden w-16 h-16' },
];


// --- ANIMATION LOGIC ---
const imageVariants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      type: 'spring', 
      stiffness: 260, 
      damping: 20,
      delay: Math.random() * 0.5,
    } 
  },
};

const floatingAnimation = () => ({
  y: [0, Math.random() * -15 - 5, 0],
  transition: {
    duration: Math.random() * 4 + 5,
    repeat: Infinity,
    repeatType: 'reverse' as const,
    ease: 'easeInOut',
  },
});

// --- COMPONENT ---
export const AnimatedTestimonialGrid = ({
  testimonials,
  badgeText = 'Testimonials',
  title,
  description,
  ctaText,
  ctaHref,
  className,
}: AnimatedTestimonialGridProps) => {

  return (
    <section
      className={cn(
        'relative w-full max-w-7xl mx-auto py-32 sm:py-40 px-4',
        className
      )}
    >
      {/* Absolutely Positioned Images */}
      {testimonials.slice(0, imagePositions.length).map((testimonial, index) => (
        <motion.div
          key={index}
          className={cn('absolute rounded-lg shadow-xl', imagePositions[index].className)}
          style={{ 
            top: imagePositions[index].top, 
            left: imagePositions[index].left,
            right: imagePositions[index].right,
            bottom: imagePositions[index].bottom,
          }}
          variants={imageVariants}
          initial="initial"
          animate="animate"
          whileHover={{ scale: 1.1, zIndex: 20 }}
          custom={index}
        >
           <motion.img
            src={testimonial.imgSrc}
            alt={testimonial.alt}
            className="w-full h-full object-cover rounded-lg"
            animate={floatingAnimation()}
          />
        </motion.div>
      ))}

      {/* Central Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {badgeText && (
          <div className="mb-4 inline-block rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
            {badgeText}
          </div>
        )}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground mb-4 max-w-3xl">
          {title}
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground mb-8">
          {description}
        </p>
        <a
          href={ctaHref}
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          {ctaText}
          <ArrowRight className="ml-2 h-5 w-5" />
        </a>
      </div>
    </section>
  );
};