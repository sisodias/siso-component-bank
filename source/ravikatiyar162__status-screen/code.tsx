"use client";

import * as React from "react";
import { motion } from "framer-motion"; // Dependency: framer-motion
import { Button } from "@/components/ui/button"; // Assumes shadcn/ui setup
import { cn } from "@/lib/utils"; // Assumes shadcn/ui setup

interface StatusScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Source URL for the company logo displayed at the top-left */
  logoSrc: string;
  /** Alt text for the company logo */
  logoAlt?: string;
  /** The main icon, e.g., a checkmark. Can be an <img> or a component. */
  icon: React.ReactNode;
  /** The main headline text */
  title: string;
  /** The supporting description text */
  description: string;
  /** The text to display before the countdown timer */
  redirectTextPrefix?: string;
  /** The number of seconds for the countdown. If provided, the timer will run. */
  redirectSeconds?: number;
  /** Callback function to execute when the countdown finishes */
  onRedirect?: () => void;
  /** Text to display on the main button */
  buttonText: string;
  /** Callback function to execute when the button is clicked */
  onButtonClick: () => void;
}

/**
 * A reusable full-screen status component for success states,
 * built with shadcn/ui principles.
 */
const StatusScreen = React.forwardRef<HTMLDivElement, StatusScreenProps>(
  (
    {
      className,
      logoSrc,
      logoAlt = "Company Logo",
      icon,
      title,
      description,
      redirectTextPrefix = "We will redirect you automatically in",
      redirectSeconds,
      onRedirect,
      buttonText,
      onButtonClick,
      ...props
    },
    ref
  ) => {
    const [countdown, setCountdown] = React.useState(redirectSeconds);

    // Effect for the countdown timer
    React.useEffect(() => {
      if (countdown === undefined || !onRedirect) return;

      if (countdown <= 0) {
        onRedirect();
        return;
      }

      // Set up the interval timer
      const timer = setTimeout(() => {
        setCountdown((prev) => (prev ? prev - 1 : 0));
      }, 1000);

      // Clean up timer on unmount
      return () => clearTimeout(timer);
    }, [countdown, onRedirect]);

    // Animation variants for framer-motion
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.15, // Stagger animation for children
        },
      },
    };

    const iconVariants = {
      hidden: { opacity: 0, scale: 0.5 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          type: "spring",
          damping: 12,
          stiffness: 100,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 100,
        },
      },
    };

    return (
      <div
        className={cn(
          "flex h-screen w-full items-center justify-center bg-screen p-6",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Logo (top-left) */}
        <motion.img
          src={logoSrc}
          alt={logoAlt}
          className="absolute left-6 top-6 h-6 w-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        />

        {/* Main content container */}
        <motion.div
          className="flex max-w-sm flex-col items-center gap-4 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Icon */}
          <motion.div variants={iconVariants}>{icon}</motion.div>

          {/* Accessible status region for screen readers */}
          <div
            role="status"
            className="flex flex-col items-center gap-2"
          >
            <motion.h1
              className="text-2xl font-bold tracking-tight text-muted-background"
              variants={itemVariants}
            >
              {title}
            </motion.h1>
            <motion.p
              className="text-muted-background"
              variants={itemVariants}
            >
              {description}
            </motion.p>
          </div>

          {/* Redirect Countdown */}
          {countdown !== undefined && (
            <motion.p
              className="text-sm text-muted-background"
              variants={itemVariants}
              aria-live="polite" // Announces countdown changes
            >
              {redirectTextPrefix} {countdown} seconds
            </motion.p>
          )}

          {/* Continue Button */}
          <motion.div variants={itemVariants} className="w-full pt-2">
            <Button
              onClick={onButtonClick}
              className="w-full"
              variant="secondary" // 'secondary' often works well for light-on-dark themes
              size="lg"
            >
              {buttonText}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }
);

StatusScreen.displayName = "StatusScreen";

export { StatusScreen };