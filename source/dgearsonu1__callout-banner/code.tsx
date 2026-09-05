import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils"; // Assumes shadcn's utility for class merging
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Note: This component requires 'framer-motion'.

// Define the available standard banner types
export type BannerType = 'success' | 'error' | 'warning' | 'info' | 'default';

// --- Internal Configuration ---

interface BannerConfig {
  icon: React.ElementType;
  /** Tailwind classes for border, background, and text (using subtle theme colors) */
  classNames: string;
}

const BANNER_MAP: Record<BannerType, BannerConfig> = {
  success: {
    icon: CheckCircle,
    // Uses subtle green on the left border for monochrome elegance
    classNames: "border-green-500 bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400",
  },
  error: {
    icon: AlertCircle,
    classNames: "border-red-500 bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400",
  },
  warning: {
    icon: AlertCircle,
    classNames: "border-yellow-500 bg-yellow-500/10 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400",
  },
  info: {
    icon: Info,
    classNames: "border-blue-500 bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  },
  default: {
    icon: Info,
    // Uses primary theme color for a prominent, yet monochrome, neutral notice
    classNames: "border-primary bg-primary/10 text-primary-foreground/90 dark:text-primary-foreground",
  },
};

// --- 📦 API (Props) Definition ---
export interface CalloutBannerProps {
  /** Unique ID for the banner instance (used for state management). */
  id: string;
  /** The title or main heading of the alert. */
  title: string;
  /** The detailed content message. */
  message: React.ReactNode;
  /** The type of banner to determine color and icon. */
  type?: BannerType;
  /** If true, the close button is visible and the banner is dismissible. */
  isDismissible?: boolean;
  /** Callback function when the banner is dismissed. */
  onDismiss?: (id: string) => void;
  /** Optional class name for the container. */
  className?: string;
}

/**
 * An animated, persistent Callout Banner for important administrative notices.
 * Uses Framer Motion for smooth top-down entry/exit and clear, theme-aware styling.
 */
const CalloutBanner: React.FC<CalloutBannerProps> = ({
  id,
  title,
  message,
  type = 'default',
  isDismissible = true,
  onDismiss,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const config = BANNER_MAP[type] || BANNER_MAP['default'];
  const IconComponent = config.icon;

  const handleDismiss = () => {
    setIsVisible(false);
    // Use a slight delay to allow the exit animation to finish
    setTimeout(() => {
        onDismiss?.(id);
    }, 300);
  };
  
  // Framer Motion variants for top-down entry/exit
  const bannerVariants = {
    hidden: { opacity: 0, height: 0, y: -20, transition: { type: 'tween', duration: 0.3 } },
    visible: { opacity: 1, height: 'auto', y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { opacity: 0, height: 0, y: -20, transition: { type: 'tween', duration: 0.3 } },
  };


  return (
    <AnimatePresence initial={false}>
        {isVisible && (
            <motion.div
                key={id}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={bannerVariants}
                className={cn(
                    "w-full rounded-lg border-l-4 p-4 shadow-sm transition-colors duration-200 overflow-hidden",
                    config.classNames,
                    className
                )}
                role={type === 'error' || type === 'warning' ? 'alert' : 'status'}
                aria-live="polite"
            >
                <div className="flex items-start">
                    {/* Status Icon */}
                    <IconComponent className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
                    
                    {/* Content */}
                    <div className="ml-3 flex-grow min-w-0">
                        <h3 className="text-base font-semibold leading-tight">{title}</h3>
                        <div className="mt-1 text-sm">{message}</div>
                    </div>

                    {/* Dismiss Button (Optional) */}
                    {isDismissible && (
                        <div className="ml-4 flex-shrink-0">
                            <Button
                                onClick={handleDismiss}
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "h-6 w-6 p-0 hover:bg-transparent", // Ensure button matches banner background
                                    "text-current opacity-70 hover:opacity-100 transition-opacity duration-150"
                                )}
                                aria-label="Dismiss banner"
                            >
                                <X className="h-4 w-4" aria-hidden="true" />
                            </Button>
                        </div>
                    )}
                </div>
            </motion.div>
        )}
    </AnimatePresence>
  );
};


const ExampleUsage = () => {
    const [messages, setMessages] = useState([
        { id: '1', type: 'error' as BannerType, title: 'Critical Security Alert', message: "Database connection failed. Please check logs immediately." },
        { id: '2', type: 'warning' as BannerType, title: 'Low Subscription Renewals', message: "Renewals dropped by 15% this week. Review retention dashboard." },
    ]);

    const handleDismiss = (id: string) => {
        setMessages(messages.filter(msg => msg.id !== id));
        console.log(`Dismissed banner: ${id}`);
    };

    const handleAddSuccess = () => {
        const newId = (Date.now()).toString();
        setMessages([
            ...messages,
            { id: newId, type: 'success', title: 'Update Deployed Successfully', message: "All services are running on the latest commit. Monitoring shows 0 errors." }
        ]);
    };
    
    const handleAddInfo = () => {
        const newId = (Date.now() + 1).toString();
        setMessages([
            ...messages,
            { id: newId, type: 'info', title: 'Maintenance Window Scheduled', message: "System maintenance will occur next Saturday from 2 AM to 4 AM UTC." }
        ]);
    };

    return (
        <div className="p-8 bg-background border rounded-lg max-w-5xl mx-auto shadow-md">
            <h3 className="text-xl font-semibold text-foreground mb-4">Persistent Callout Banner Demo</h3>

            {/* List of active banners (will stack) */}
            <div className="space-y-4 mb-6">
                {messages.map((msg) => (
                    <CalloutBanner
                        key={msg.id}
                        {...msg}
                        onDismiss={handleDismiss}
                    />
                ))}
            </div>

            <div className="flex gap-3">
                <Button onClick={handleAddSuccess} variant="secondary" size="sm">Add Success Banner</Button>
                <Button onClick={handleAddInfo} variant="outline" size="sm">Add Info Banner</Button>
                <Button onClick={() => setMessages([])} variant="destructive" size="sm">Clear All</Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
                Note: Dismissing a banner triggers a smooth transition out. New banners appear with a smooth transition in.
            </p>
        </div>
    );
};

export default ExampleUsage;