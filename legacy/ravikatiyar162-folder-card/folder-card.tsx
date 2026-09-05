import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";

import { cn } from "../_utils/cn"; // Your path to shadcn's cn utility

// Defines the variants for the card's color scheme
const folderCardVariants = cva(
  "relative overflow-hidden flex flex-col justify-between rounded-xl border p-4 transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-purple-50/50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200/50 dark:border-purple-800/50",
        project: "bg-gradient-to-br from-fuchsia-50/50 to-fuchsia-100/50 dark:from-fuchsia-950/50 dark:to-fuchsia-900/50 border-fuchsia-200/50 dark:border-fuchsia-800/50",
        system: "bg-gradient-to-br from-cyan-50/50 to-cyan-100/50 dark:from-cyan-950/50 dark:to-cyan-900/50 border-cyan-200/50 dark:border-cyan-800/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Defines the props for the FolderCard component
export interface FolderCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof folderCardVariants> {
  /** The icon to be displayed in the card. */
  icon: React.ReactNode;
  /** The title or name of the folder. */
  title: string;
  /** The size of the folder, e.g., "25 MB". */
  size: string;
}

const FolderCard = React.forwardRef<HTMLDivElement, FolderCardProps>(
  ({ className, variant, icon, title, size, ...props }, ref) => {
    
    // Animation properties for framer-motion
    const cardAnimation = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: "easeOut" },
      whileHover: { scale: 1.03, y: -4, transition: { duration: 0.2 } },
    };

    return (
      <motion.div
        className={cn(folderCardVariants({ variant }), className)}
        ref={ref}
        {...cardAnimation}
        {...props}
      >
        {/* Icon container */}
        <div className="mb-6">
          {icon}
        </div>
        
        {/* Text content container */}
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-card-foreground tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {size}
          </p>
        </div>
      </motion.div>
    );
  }
);
FolderCard.displayName = "FolderCard";

export { FolderCard };