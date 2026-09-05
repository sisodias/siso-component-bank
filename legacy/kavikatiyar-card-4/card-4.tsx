import * as React from "react";
import { motion } from "framer-motion";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { cn } from "../_utils/cn"; // Assuming you have a `cn` utility from shadcn

// Variants for the tags/badges
const tagVariants = cva(
  "inline-block rounded-full px-3 py-1 text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
        highlight:
          "bg-lime-100 text-lime-800 dark:bg-lime-900/50 dark:text-lime-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Define the props for the component
export interface ProfileCardProps {
  /**
   * URL for the profile avatar image.
   */
  imageUrl: string;
  /**
   * The name of the person.
   */
  name: string;
  /**
   * A short descriptive string, like age or role.
   */
  subtitle: string;
  /**
   * A longer description or bio.
   */
  description: string;
  /**
   * An array of tags to display, each with text and an optional variant.
   */
  tags: {
    text: string;
    variant?: VariantProps<typeof tagVariants>["variant"];
  }[];
  /**
   * Optional additional class names for custom styling.
   */
  className?: string;
}

const ProfileCard = React.forwardRef<HTMLDivElement, ProfileCardProps>(
  ({ imageUrl, name, subtitle, description, tags, className }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
        ref={ref}
        className={cn(
          "w-full max-w-sm overflow-hidden rounded-2xl border bg-card p-6 shadow-sm",
          className
        )}
      >
        {/* Header section with avatar and name */}
        <div className="flex items-center gap-4">
          <img
            src={imageUrl}
            alt={`${name}'s profile picture`}
            className="h-16 w-16 rounded-full object-cover"
          />
          <div>
            <h3 className="text-xl font-bold text-card-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        {/* Description section */}
        <p className="mt-4 text-base text-muted-foreground line-clamp-3">
          {description}
        </p>

        {/* Tags section */}
        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span key={index} className={cn(tagVariants({ variant: tag.variant }))}>
              {tag.text}
            </span>
          ))}
        </div>
      </motion.div>
    );
  }
);

ProfileCard.displayName = "ProfileCard";

export { ProfileCard };