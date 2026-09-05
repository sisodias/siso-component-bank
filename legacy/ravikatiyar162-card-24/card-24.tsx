import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../_utils/cn"; // Assumes shadcn `cn` utility

/**
 * Props for the StatusCard component.
 */
interface StatusCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * An optional icon component to display at the top of the card.
   */
  icon?: React.ReactNode;
  /**
   * The main title of the card.
   */
  title: string;
  /**
   * The descriptive text below the title.
   */
  description: string;
  /**
   * The URL for the illustration image in the bottom-right corner.
   */
  illustration: string;
  /**
   * The alt text for the illustration image, for accessibility.
   */
  illustrationAlt?: string;
  /**
   * Optional children to render additional content, like buttons or links.
   */
  children?: React.ReactNode;
}

const StatusCard = React.forwardRef<HTMLDivElement, StatusCardProps>(
  ({ className, icon, title, description, illustration, illustrationAlt = "Decorative illustration", children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative w-full max-w-md overflow-hidden rounded-2xl border bg-card p-8 text-card-foreground shadow-sm",
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        {...props}
      >
        <div className="flex flex-col h-full">
          {/* Icon */}
          {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
          
          {/* Main Content */}
          <div className="flex-grow">
            <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
            <p className="mt-2 text-muted-foreground">{description}</p>
          </div>

          {/* Optional Children */}
          {children && <div className="mt-6">{children}</div>}
        </div>

        {/* Illustration */}
        <div className="pointer-events-none absolute -bottom-2 -right-2 w-40 h-32 -z-0">
          <img
            src={illustration}
            alt={illustrationAlt}
            className="w-full h-full object-contain"
          />
        </div>
      </motion.div>
    );
  }
);

StatusCard.displayName = "StatusCard";

export { StatusCard };