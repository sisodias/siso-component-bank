'use client';

import * as React from 'react';
import {
  motion,
  AnimatePresence,
  MotionConfig,
  type Transition,
} from 'motion/react';
import { Loader2 } from 'lucide-react';
import { cn } from "../_utils/cn";

/**
 * Props for the MorphButton component.
 */
interface MorphButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The label text to display in the button. */
  text: string;
  /** If true, replaces text with a spinner and shrinks the button width. */
  isLoading?: boolean;
  /** Optional icon to display to the left of the text. */
  icon?: React.ReactNode;
  /** Visual style variant of the button. */
  variant?: 'primary' | 'secondary' | 'ghost';
}

/**
 * A specialized button that performs a fluid width transition between
 * its standard text state and a circular loading state.
 */
const MorphButton = React.forwardRef<HTMLButtonElement, MorphButtonProps>(
  (
    {
      text,
      isLoading = false,
      icon,
      variant = 'primary',
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    // Physics: Low stiffness (150) + high damping (25) creates the signature
    // "fluid" feel with zero elastic jitter.
    const transition: Transition = {
      type: 'spring',
      stiffness: 150,
      damping: 25,
      mass: 1,
    };

    const variantStyles = {
      primary:
        'bg-primary text-primary-foreground border-primary hover:bg-primary/90 shadow-sm',
      secondary:
        'bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground shadow-sm',
      ghost:
        'bg-transparent text-foreground border-transparent hover:bg-accent hover:text-accent-foreground',
    };

    return (
      <MotionConfig transition={transition}>
        <motion.button
          ref={ref}
          layout
          className={cn(
            'relative flex h-12 items-center justify-center overflow-hidden rounded-full border font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            isLoading ? 'px-0' : 'px-8',
            variantStyles[variant],
            (props.disabled || isLoading) &&
              'opacity-50 cursor-not-allowed pointer-events-none',
            className
          )}
          onClick={(e) => !isLoading && onClick?.(e)}
          whileTap={!isLoading ? { scale: 0.98 } : undefined}
          {...(props as any)}
        >
          {/* 
            mode='popLayout' ensures the exiting element is removed from the flow immediately,
            allowing the parent container to animate its width smoothly without layout jumps.
          */}
          <AnimatePresence mode='popLayout' initial={false}>
            {isLoading ? (
              <motion.div
                key='loader'
                className='flex items-center justify-center'
                style={{ width: '3rem' }}
                initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
              >
                <Loader2 className='h-5 w-5 animate-spin' />
              </motion.div>
            ) : (
              <motion.div
                key='content'
                className='flex items-center gap-2 whitespace-nowrap'
                initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
              >
                {icon && <motion.span layout>{icon}</motion.span>}
                <motion.span layout>{text}</motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </MotionConfig>
    );
  }
);

MorphButton.displayName = 'MorphButton';

export { MorphButton };