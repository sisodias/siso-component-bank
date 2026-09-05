import * as React from "react";
import { motion } from "framer-motion";
import { Star, Bookmark } from "lucide-react";

import { cn } from "../_utils/cn";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";

/**
 * Props for the FreelancerProfileCard component.
 */
interface FreelancerProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The user's full name. */
  name: string;
  /** The user's job title or role. */
  title: string;
  /** URL for the user's avatar image. */
  avatarSrc: string;
  /** URL for the card's banner image. */
  bannerSrc: string;
  /** The user's rating (e.g., 4.0). */
  rating: number;
  /** A string describing the project duration (e.g., "8 Days"). */
  duration: string;
  /** A string for the user's rate (e.g., "$40/hr"). */
  rate: string;
  /** A React node (e.g., array of icons) for the tools section. */
  tools: React.ReactNode;
  /** Optional click handler for the "Get in touch" button. */
  onGetInTouch?: () => void;
  /** Optional click handler for the bookmark icon. */
  onBookmark?: () => void;
  /** Optional additional class names. */
  className?: string;
}

// Animation variants for Framer Motion
const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  hover: {
    scale: 1.03,
    transition: { duration: 0.3 },
  },
};

const contentVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3, // Start staggering after card loads
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

/**
 * A reusable, animated profile card component.
 */
export const FreelancerProfileCard = React.forwardRef<
  HTMLDivElement,
  FreelancerProfileCardProps
>(
  (
    {
      className,
      name,
      title,
      avatarSrc,
      bannerSrc,
      rating,
      duration,
      rate,
      tools,
      onGetInTouch,
      onBookmark,
      ...props
    },
    ref
  ) => {
    const avatarName = name
      .split(" ")
      .map((n) => n[0])
      .join("");

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative w-full max-w-sm overflow-hidden rounded-2xl bg-card shadow-lg",
          className
        )}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        {...props}
      >
        {/* Banner Image */}
        <div className="h-32 w-full">
          <img
            src={bannerSrc}
            alt={`${name}'s banner`}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Bookmark Button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-4 top-4 h-9 w-9 rounded-lg bg-background/50 backdrop-blur-sm text-card-foreground/80 hover:bg-background/70"
          onClick={onBookmark}
          aria-label="Bookmark profile"
        >
          <Bookmark className="h-4 w-4" />
        </Button>

        {/* Avatar (overlaps banner) */}
        <div className="absolute left-1/2 top-32 -translate-x-1/2 -translate-y-1/2">
          <Avatar className="h-20 w-20 border-4 border-card">
            <AvatarImage src={avatarSrc} alt={name} />
            <AvatarFallback>{avatarName}</AvatarFallback>
          </Avatar>
        </div>

        {/* Content Area */}
        <motion.div
          className="px-6 pb-6 pt-12" // pt-12 to clear avatar
          variants={contentVariants}
        >
          {/* Name, Title, and Tools */}
          <motion.div
            className="mb-4 flex items-start justify-between"
            variants={itemVariants}
          >
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">
                {name}
              </h2>
              <p className="text-sm text-muted-foreground">{title}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex gap-1.5">{tools}</div>
              <span className="text-xs text-muted-foreground">Tools</span>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="my-6 flex items-center justify-around rounded-lg border border-border bg-background/30 p-4"
            variants={itemVariants}
          >
            <StatItem icon={Star} value={rating.toFixed(1)} label="rating" />
            <Divider />
            <StatItem value={duration} label="duration" />
            <Divider />
            <StatItem value={rate} label="rate" />
          </motion.div>

          {/* Action Button */}
          <motion.div variants={itemVariants}>
            <Button className="w-full" size="lg" onClick={onGetInTouch}>
              Get in touch
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }
);
FreelancerProfileCard.displayName = "FreelancerProfileCard";

// Internal StatItem component
const StatItem = ({
  icon: Icon,
  value,
  label,
}: {
  icon?: React.ElementType;
  value: string | number;
  label: string;
}) => (
  <div className="flex flex-1 flex-col items-center justify-center px-2 text-center">
    <div className="flex items-center gap-1">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      <span className="text-base font-semibold text-card-foreground">
        {value}
      </span>
    </div>
    <span className="text-xs capitalize text-muted-foreground">{label}</span>
  </div>
);

// Internal Divider component
const Divider = () => <div className="h-10 w-px bg-border" />;