import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProductShowcaseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  images: string[];
  tag: string;
  title: string;
  buttonText: string;
}

const ProductShowcaseCard = React.forwardRef<
  HTMLDivElement,
  ProductShowcaseCardProps
>(({ className, images, tag, title, buttonText, ...props }, ref) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const imageVariants = (index: number) => ({
    hidden: { opacity: 0, scale: 0.8, rotate: 0, x: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: index === 0 ? -12 : index === 1 ? 3 : 12,
      x: index === 0 ? -48 : index === 2 ? 48 : 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
      },
    },
  });

  return (
    <motion.div
      ref={ref}
      className={cn(
        'flex flex-col items-center justify-center space-y-6 rounded-xl bg-background p-8 text-center',
        className
      )}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      <motion.div
        className="relative flex h-48 w-64 items-center justify-center"
        variants={itemVariants}
      >
        {images.map((src, index) => (
          <motion.div
            key={index}
            className="absolute h-40 w-40 rounded-lg border-4 border-background shadow-lg"
            custom={index}
            variants={imageVariants(index)}
            whileHover={{ zIndex: 10, scale: 1.1, rotate: 0, x: 0 }}
            style={{ zIndex: images.length - 1 - index }}
          >
            <img
              src={src}
              alt={`Showcase image ${index + 1}`}
              className="h-full w-full rounded-md object-cover"
            />
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        className="flex flex-col items-center space-y-4"
        variants={cardVariants}
      >
        <motion.span
          className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
          variants={itemVariants}
        >
          {tag}
        </motion.span>
        <motion.p
          className="max-w-xs text-sm text-muted-foreground"
          variants={itemVariants}
        >
          {title}
        </motion.p>
        <motion.button
          className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-sm"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {buttonText}
        </motion.button>
      </motion.div>
    </motion.div>
  );
});

ProductShowcaseCard.displayName = 'ProductShowcaseCard';

export { ProductShowcaseCard };
