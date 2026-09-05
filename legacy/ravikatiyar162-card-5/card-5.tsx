import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../_utils/cn";
import { Button, ButtonProps } from "./button";

// Define the types for the props to ensure type safety and clarity
interface Stat {
  label: string;
  value: string | number;
}

interface Action extends ButtonProps {
  label: string;
  onClick: () => void;
}

export interface ProfileCardProps {
  avatarSrc: string;
  name: string;
  handle: string;
  bio: string;
  stats: Stat[];
  actions: Action[];
  className?: string;
}

/**
 * A responsive and theme-adaptive profile card component.
 * @param avatarSrc - URL for the user's avatar image.
 * @param name - The user's full name.
 * @param handle - The user's role or username (e.g., "Photographer").
 * @param bio - A short biography of the user.
 * @param stats - An array of statistic objects { label, value }.
 * @param actions - An array of action objects { label, onClick, variant, ... }.
 * @param className - Optional additional class names for custom styling.
 */
export const ProfileCard = React.forwardRef<HTMLDivElement, ProfileCardProps>(
  ({ avatarSrc, name, handle, bio, stats, actions, className }, ref) => {
    // Animation variants for Framer Motion
    const cardVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.4,
          ease: "easeOut",
          staggerChildren: 0.1,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 },
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "max-w-sm w-full rounded-2xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-6",
          className
        )}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex items-center gap-4">
          <img
            src={avatarSrc}
            alt={name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">{name}</h2>
            <p className="text-sm text-muted-foreground">{handle}</p>
          </div>
        </motion.div>

        {/* Bio Section */}
        <motion.p variants={itemVariants} className="text-sm text-muted-foreground">
          {bio}
        </motion.p>

        {/* Stats Section */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between text-center border-t border-b py-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-lg font-bold">{stat.value}</span>
              <span className="text-xs text-muted-foreground tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Actions Section */}
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          {actions.map(({ label, ...props }, index) => (
            <Button key={index} {...props} className="flex-1">
              {label}
            </Button>
          ))}
        </motion.div>
      </motion.div>
    );
  }
);

ProfileCard.displayName = "ProfileCard";