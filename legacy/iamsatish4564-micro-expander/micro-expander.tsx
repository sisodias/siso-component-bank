'use client';

import * as React from 'react';
import {
  motion,
  type HTMLMotionProps,
  type Variants,
  AnimatePresence,
} from 'motion/react';
import { Plus, Loader2 } from 'lucide-react';
import { cn } from "../_utils/cn";

/**
 * Props for the MicroExpander component.
 */
interface MicroExpanderProps
  extends Omit<HTMLMotionProps<'button'>, 'children'> {
  /** The label text to display when the button is hovered/expanded. */
  text: string;
  /** An optional custom icon. Defaults to a Plus icon if not provided. */
  icon?: React.ReactNode;
  /** The visual style variant of the button. */
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  /** If true, displays a spinner, disables interaction, and collapses the button. */
  isLoading?: boolean;
}

/**
 * A micro-interaction button that expands from a circular icon to a pill shape
 * containing text upon hover. It handles loading states by reverting to the
 * circular shape and displaying a spinner.
 */
const MicroExpander = React.forwardRef<HTMLButtonElement, MicroExpanderProps>(
  (
    {
      text,
      icon,
      variant = 'default',
      isLoading = false,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const containerVariants: Variants = {
      initial: { width: '48px' },
      hover: { width: 'auto' },
      loading: { width: '48px' },
    };

    const textVariants: Variants = {
      initial: { opacity: 0, x: -10 },
      hover: {
        opacity: 1,
        x: 0,
        transition: { delay: 0.15, duration: 0.3, ease: 'easeOut' },
      },
      exit: {
        opacity: 0,
        x: -5,
        transition: { duration: 0.1, ease: 'linear' },
      },
    };

    const variantStyles = {
      default: 'bg-primary text-primary-foreground border border-primary',
      outline:
        'bg-transparent border border-input text-foreground hover:border-primary',
      ghost:
        'bg-accent/50 border border-transparent text-accent-foreground hover:bg-accent',
      destructive:
        'bg-destructive text-destructive-foreground border border-destructive hover:bg-destructive/90',
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isLoading) return;
      onClick?.(e);
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          'relative flex h-12 items-center overflow-hidden rounded-full',
          'whitespace-nowrap font-medium text-sm uppercase tracking-wide',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          isLoading && 'cursor-not-allowed',
          variantStyles[variant],
          className
        )}
        initial='initial'
        animate={isLoading ? 'loading' : isHovered ? 'hover' : 'initial'}
        variants={containerVariants}
        transition={{ type: 'spring', stiffness: 150, damping: 20, mass: 0.8 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        onClick={handleClick}
        disabled={isLoading}
        {...props}
        aria-label={text}
      >
        <div className='grid h-12 w-12 place-items-center shrink-0 z-10'>
          <AnimatePresence mode='popLayout'>
            {isLoading ? (
              <motion.div
                key='spinner'
                initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                <Loader2 className='h-5 w-5 animate-spin' />
              </motion.div>
            ) : (
              <motion.div
                key='icon'
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                {icon || <Plus className='h-5 w-5' />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div variants={textVariants} className='pr-6 pl-1'>
          {text}
        </motion.div>
      </motion.button>
    );
  }
);

MicroExpander.displayName = 'MicroExpander';

export { MicroExpander };