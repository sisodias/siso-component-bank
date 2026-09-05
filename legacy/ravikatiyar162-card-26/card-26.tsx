// file: components/ui/link-card.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "../_utils/cn"; // Assuming you have a utility for class names

// Props interface for type safety and clarity
interface LinkCardProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  title: string;
  description: string;
  imageUrl: string;
  href: string;
}

const LinkCard = React.forwardRef<HTMLAnchorElement, LinkCardProps>(
  ({ className, title, description, imageUrl, href, ...props }, ref) => {
    // Animation variants for framer-motion
    const cardVariants = {
      initial: { scale: 1, y: 0 },
      hover: {
        scale: 1.03,
        y: -5,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 15,
        },
      },
    };

    return (
      <motion.a
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'group relative flex h-80 w-full max-w-sm flex-col justify-between overflow-hidden',
          'rounded-2xl border bg-card p-6 text-card-foreground shadow-sm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        aria-label={`Link to ${title}`}
        {...props}
      >
        {/* Text content */}
        <div className="z-10">
          <h3 className="mb-2 font-serif text-3xl font-medium tracking-tight text-card-foreground">
            {title}
          </h3>
          <p className="max-w-[80%] text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Image container with a subtle scale effect on hover */}
        <div className="absolute bottom-0 right-0 h-48 w-48 translate x-1/4 translate y-1/4 transform">
          <motion.img
            src={imageUrl}
            alt={`${title} illustration`}
            className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-110"
          />
        </div>
      </motion.a>
    );
  }
);

LinkCard.displayName = 'LinkCard';

export { LinkCard };