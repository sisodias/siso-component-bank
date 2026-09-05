import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "../_utils/cn"; // Assuming you have a `cn` utility from shadcn/ui

import {
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
  X,
} from 'lucide-react';

// Define variants for the alert component using cva
const alertVariants = cva(
  'relative w-full rounded-lg border p-4 pl-12 shadow-sm transition-all overflow-hidden',
  {
    variants: {
      variant: {
        information:
          'border-blue-200/60 bg-white [--gradient-from:hsl(var(--info))] dark:border-blue-900/60 dark:bg-background',
        success:
          'border-green-200/60 bg-white [--gradient-from:hsl(var(--success))] dark:border-green-900/60 dark:bg-background',
        warning:
          'border-yellow-200/60 bg-white [--gradient-from:hsl(var(--warning))] dark:border-yellow-900/60 dark:bg-background',
        error:
          'border-red-200/60 bg-white [--gradient-from:hsl(var(--destructive))] dark:border-red-900/60 dark:bg-background',
      },
    },
    defaultVariants: {
      variant: 'information',
    },
  }
);

// Define variants for the icon container
const iconVariants = cva('absolute left-0 top-0 h-full w-10 flex items-center justify-center', {
    variants: {
      variant: {
        information: 'bg-blue-500/10 text-blue-500',
        success: 'bg-green-500/10 text-green-500',
        warning: 'bg-yellow-500/10 text-yellow-500',
        error: 'bg-red-500/10 text-red-500',
      }
    },
    defaultVariants: {
      variant: 'information'
    }
})


// Define the icons map
const ICONS = {
  information: <Info className="h-5 w-5" />,
  success: <CheckCircle2 className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  error: <XCircle className="h-5 w-5" />,
};

// Define component props
export interface GradientAlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title: string;
  description: string;
  onClose?: () => void;
}

const GradientAlert = React.forwardRef<HTMLDivElement, GradientAlertProps>(
  ({ className, variant, title, description, onClose, ...props }, ref) => {
    
    // Render nothing if no variant is provided
    if (!variant) return null;

    return (
      <motion.div
        ref={ref}
        role="alert"
        // Animation props for enter and exit
        initial={{ opacity: 0, x: 50, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {/* The subtle gradient glow */}
        <div
          className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_40px_40px,var(--gradient-from,transparent)_0%,transparent_40%)] opacity-20"
          aria-hidden="true"
        />

        {/* Icon container */}
        <div className={cn(iconVariants({variant}))}>
            {ICONS[variant]}
        </div>

        {/* Text Content */}
        <div className="flex-grow">
          <h5 className="font-medium text-foreground">{title}</h5>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Dismiss"
            className="absolute right-3 top-3 p-1 rounded-full text-muted-foreground/50 transition-colors hover:text-muted-foreground hover:bg-muted/50"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </motion.div>
    );
  }
);

GradientAlert.displayName = 'GradientAlert';

export { GradientAlert };