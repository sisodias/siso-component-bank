import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui Button
import { cn } from '@/lib/utils'; // Assuming shadcn/ui utility

// Interface for a single testimonial item
interface Testimonial {
  imgSrc: string;
  name: string; // Used for alt text for accessibility
}

// Interface for the component's props
interface TestimonialCollageProps {
  testimonials: Testimonial[];
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  className?: string;
}

/**
 * A responsive component with text on the left and an animated, overlapping image collage on the right.
 * @param testimonials - Array of testimonial objects. The first 6-7 will be used for the collage.
 * @param title - The main heading text.
 * @param description - The paragraph text below the title.
 * @param ctaText - The text for the call-to-action button.
 * @param ctaLink - The href for the call-to-action button.
 * @param className - Additional classes for the container.
 */
export const TestimonialCollage: React.FC<TestimonialCollageProps> = ({
  testimonials,
  title = "Trusted by leaders from various industries",
  description = "Learn why professionals trust our solutions to complete their customer journeys.",
  ctaText = "Read Success Stories",
  ctaLink = "#",
  className,
}) => {
  // We'll only use a subset of testimonials for the visual collage to avoid clutter
  const collageTestimonials = testimonials.slice(0, 7);

  // Animation variants for the text content
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    }),
  };

  return (
    <section 
      className={cn("w-full py-20 lg:py-32", className)}
      aria-labelledby="testimonials-heading"
    >
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Left Side: Text Content */}
        <div className="flex flex-col items-start text-left">
          <motion.p
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={textVariants}
            className="text-sm font-semibold text-primary mb-2"
          >
            Testimonials
          </motion.p>
          <motion.h2
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={textVariants}
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4"
            id="testimonials-heading"
          >
            {title}
          </motion.h2>
          <motion.p
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={textVariants}
            className="text-muted-foreground md:text-lg mb-8"
          >
            {description}
          </motion.p>
          <motion.div
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={textVariants}
          >
            <Button asChild size="lg">
              <a href={ctaLink}>{ctaText} &rarr;</a>
            </Button>
          </motion.div>
        </div>

        {/* Right Side: Image Collage */}
        <div className="relative h-[450px] w-full">
          {collageTestimonials.map((testimonial, index) => {
            const style = collagePositions[index % collagePositions.length];
            return (
              <motion.div
                key={index}
                className="absolute rounded-xl border-2 border-background bg-card shadow-lg overflow-hidden"
                style={{
                  width: style.width,
                  height: style.height,
                  top: style.top,
                  left: style.left,
                  right: style.right,
                  bottom: style.bottom,
                  zIndex: style.zIndex,
                }}
                initial={{ opacity: 0, scale: 0.8, y: 50, rotate: style.rotate - 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0, rotate: style.rotate }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  type: 'spring',
                  stiffness: 80,
                  damping: 12,
                  delay: 0.1 * index,
                }}
                whileHover={{
                    scale: 1.05,
                    y: -10,
                    zIndex: 10,
                    boxShadow: '0 25px 50px -12px hsl(var(--foreground) / 0.25)',
                }}
              >
                <img
                  src={testimonial.imgSrc}
                  alt={`Testimonial from ${testimonial.name}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Pre-defined positions for the overlapping collage effect.
// Using a mix of percentages and defined properties for responsive layout.
const collagePositions = [
  { top: '0%', left: '15%', width: '40%', height: '45%', rotate: -8, zIndex: 2 },
  { top: '5%', right: '5%', width: '45%', height: '50%', rotate: 5, zIndex: 3 },
  { top: '40%', right: '25%', width: '30%', height: '35%', rotate: -5, zIndex: 1 },
  { bottom: '10%', left: '0%', width: '45%', height: '50%', rotate: 6, zIndex: 4 },
  { bottom: '0%', right: '0%', width: '40%', height: '45%', rotate: -10, zIndex: 2 },
  { top: '35%', left: '30%', width: '25%', height: '30%', rotate: 10, zIndex: 1 },
];