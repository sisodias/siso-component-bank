"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion, type Variants } from "framer-motion";
import * as React from "react";

import { cn } from "../_utils/cn";

// Animation variants for different interactions
const buttonVariants: Variants = {
  initial: {
    scale: 1,
    rotateX: 0,
  },
  hover: {
    scale: 1.02,
    rotateX: -2,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.98,
    rotateX: 2,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

const shimmerVariants: Variants = {
  initial: {
    x: "-100%",
  },
  animate: {
    x: "100%",
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 3,
    },
  },
};

const pulseVariants: Variants = {
  pulse: {
    boxShadow: [
      "0 0 0 0 hsl(var(--primary) / 0.4)",
      "0 0 0 20px hsl(var(--primary) / 0)",
    ],
    transition: {
      duration: 1.5,
      repeat: Infinity,
    },
  },
};

// Define component variants using cva
const animatedButtonVariants = cva(
  [
    "group relative inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium",
    "transition-all duration-200 ease-in-out",
    "outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "overflow-hidden",
    "transform-gpu cursor-pointer", // GPU acceleration for better performance
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
          "hover:shadow-xl hover:shadow-primary/30",
          "border border-primary/20",
        ],
        outline: [
          "border-2 border-input bg-background/50 backdrop-blur-sm",
          "shadow-sm hover:shadow-md",
          "hover:bg-accent hover:text-accent-foreground",
          "hover:border-primary/50",
        ],
        gradient: [
          "bg-gradient-to-r from-primary via-primary/80 to-primary",
          "bg-[length:200%_100%] animate-gradient-x",
          "text-primary-foreground shadow-lg shadow-primary/30",
          "hover:shadow-xl hover:shadow-primary/40",
          "border border-primary/30",
        ],
        ghost: [
          "bg-transparent text-foreground",
          "hover:bg-accent hover:text-accent-foreground",
          "hover:shadow-sm",
        ],
      },
      size: {
        sm: "h-8 px-3 py-1 text-xs gap-1.5 [&_svg]:size-3",
        md: "h-10 px-4 py-2 text-sm gap-2 [&_svg]:size-4",
        lg: "h-12 px-6 py-3 text-base gap-2.5 [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

/**
 * Props for the AnimatedButton component
 * @interface AnimatedButtonProps
 */
export interface AnimatedButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 
    'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'>,
    VariantProps<typeof animatedButtonVariants> {
  /** Button text content - required for accessibility */
  label: string;
  /** Icon to display on the left side of the button */
  iconLeft?: React.ReactNode;
  /** Icon to display on the right side of the button */
  iconRight?: React.ReactNode;
  /** Loading state - shows spinner and disables interaction */
  loading?: boolean;
  /** Additional CSS classes for custom styling */
  className?: string;
  /** Click handler function */
  onClick?: () => void;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  (
    {
      label,
      variant,
      size,
      iconLeft,
      iconRight,
      loading = false,
      className,
      onClick,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) return;

      // Create ripple effect
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const newRipple = { id: Date.now(), x, y };

      setRipples((prev) => [...prev, newRipple]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
      }, 600);

      onClick?.();
    };

    const isDisabled = loading || disabled;

    return (
      <motion.button
        ref={ref}
        className={cn(animatedButtonVariants({ variant, size }), className)}
        variants={buttonVariants}
        initial="initial"
        whileHover={!isDisabled ? "hover" : "initial"}
        whileTap={!isDisabled ? "tap" : "initial"}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
        disabled={isDisabled}
        aria-label={label}
        aria-busy={loading}
        {...props}
      >
        {/* Shimmer effect for gradient variant */}
        {variant === "gradient" && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            variants={shimmerVariants}
            initial="initial"
            animate={isHovered ? "animate" : "initial"}
          />
        )}

        {/* Magnetic glow effect on hover */}
        {isHovered && variant !== "ghost" && variant !== "outline" && (
          <motion.div
            className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-primary/25 to-primary/30 blur-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Content wrapper */}
        <span className="relative z-10 flex items-center gap-2">
          {/* Left icon or loading spinner */}
          {loading ? (
            <motion.svg
              className="animate-spin"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <path
                d="M12 4.75V6.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.25 12H18.75"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 17.25V18.75"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.25 12H6.75"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.5 7.5L8.56 8.56"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.44 15.44L16.5 16.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.5 7.5L15.44 8.56"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.56 15.44L7.5 16.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          ) : (
            iconLeft && (
              <motion.span
                initial={{ x: -2, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                {iconLeft}
              </motion.span>
            )
          )}

          {/* Button label */}
          <motion.span
            initial={{ y: 1, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            {label}
          </motion.span>

          {/* Right icon */}
          {!loading && iconRight && (
            <motion.span
              initial={{ x: 2, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.15 }}
            >
              {iconRight}
            </motion.span>
          )}
        </span>

        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-primary-foreground/20 pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
            initial={{
              width: 0,
              height: 0,
              x: "-50%",
              y: "-50%",
              opacity: 1,
            }}
            animate={{
              width: 120,
              height: 120,
              opacity: 0,
            }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
          />
        ))}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton, animatedButtonVariants }; 