import * as React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assuming you have a 'cn' utility from shadcn

/**
 * Props for the FeatureGrid component.
 */
interface FeatureGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The main title text. */
  title: string;
  /** The specific word in the title to be highlighted with a wavy underline. */
  highlightedText: string;
  /** The description text or element displayed below the title. */
  description: React.ReactNode;
  /** An array of strings, where each string is a feature to be displayed. */
  features: string[];
  /** Optional object for the "more features" link. */
  moreLink?: {
    href: string;
    text: string;
  };
}

// SVG for the wavy underline, encoded for use in a background-image URL.
const wavyUnderlineSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 10" preserveAspectRatio="none">
    <path d="M0,5 Q10,0 20,5 T40,5 T60,5 T80,5" stroke="hsl(var(--primary))" stroke-width="2" fill="none"/>
  </svg>
`;
const encodedWavyUnderline = `data:image/svg+xml;base64,${
  typeof window !== 'undefined' ? window.btoa(wavyUnderlineSvg) : ''
}`;

/**
 * A responsive component to highlight a list of features in a grid.
 * It includes an animated grid and a customizable heading.
 */
export const FeatureGrid = React.forwardRef<HTMLDivElement, FeatureGridProps>(
  (
    {
      title,
      highlightedText,
      description,
      features,
      moreLink,
      className,
      ...props
    },
    ref
  ) => {
    // Split title to isolate the highlighted part
    const titleParts = title.split(new RegExp(`(${highlightedText})`, 'gi'));

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.3,
          ease: 'easeOut',
        },
      },
    };

    return (
      <section
        ref={ref}
        className={cn('w-full max-w-5xl mx-auto py-12 px-4 md:px-6', className)}
        {...props}
      >
        <div className="text-center max-w-3xl mx-auto mb-12">
          {/* Main heading with wavy underline on the highlighted text */}
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            {titleParts.map((part, index) =>
              part.toLowerCase() === highlightedText.toLowerCase() ? (
                <span key={index} className="relative inline-block">
                  {part}
                  <span
                    className="absolute bottom-[-4px] md:bottom-[-8px] left-0 w-full h-[6px] md:h-[10px]"
                    style={{
                      backgroundImage: `url("${encodedWavyUnderline}")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                    }}
                  />
                </span>
              ) : (
                part
              )
            )}
          </h2>
          {/* Description paragraph */}
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
        </div>

        {/* Features grid with animation */}
        <motion.div
          className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 md:p-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            {features.map((feature, index) => (
              <motion.li key={index} className="flex items-center gap-3" variants={itemVariants}>
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-foreground">{feature}</span>
              </motion.li>
            ))}
            {/* Optional "more" link */}
            {moreLink && (
              <motion.li className="flex items-center gap-3" variants={itemVariants}>
                <span className="font-semibold text-primary">+</span>
                <a
                  href={moreLink.href}
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  {moreLink.text}
                </a>
              </motion.li>
            )}
          </ul>
        </motion.div>
      </section>
    );
  }
);

FeatureGrid.displayName = 'FeatureGrid';