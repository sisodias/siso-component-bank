import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MasonryGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The number of columns to display.
   * @default 3
   */
  columns?: number;
  /**
   * The gap between items in the grid, corresponding to Tailwind's spacing scale.
   * @default 4
   */
  gap?: number;
}

const MasonryGrid = React.forwardRef<HTMLDivElement, MasonryGridProps>(
  ({ className, columns = 3, gap = 4, children, ...props }, ref) => {
    // Dynamically create the style object for column layout
    const style = {
      columnCount: columns,
      columnGap: `${gap * 0.25}rem`, // Converts gap unit to rem
    };

    // Animation variants for child elements
    const cardVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          ease: "easeOut",
        },
      },
    };

    return (
      <div ref={ref} style={style} className={cn('w-full', className)} {...props}>
        {React.Children.map(children, (child) => (
          <motion.div
            className="mb-4 break-inside-avoid" // Prevents items from breaking across columns
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }} // Animate when 20% of the item is visible
          >
            {child}
          </motion.div>
        ))}
      </div>
    );
  }
);

MasonryGrid.displayName = 'MasonryGrid';

export { MasonryGrid };
