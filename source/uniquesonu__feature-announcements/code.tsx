import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils"; // Assumes shadcn's utility for class merging
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, X, Lightbulb, BellRing } from 'lucide-react';

// Note: This component requires 'framer-motion'.

// --- 📦 API (Props) Definition ---
export interface FeatureAnnouncementCardProps {
  /** The main title of the announcement (e.g., "New Feature: AI Insights!"). */
  title: string;
  /** The detailed description of the announcement. */
  description: string;
  /** The label for the primary call-to-action button. */
  actionLabel: string;
  /** Callback function when the primary action button is clicked. */
  onActionClick: () => void;
  /** Optional icon to display at the top of the card. */
  icon?: React.ElementType;
  /** Optional callback to dismiss the card (e.g., hide it permanently for the user). */
  onDismiss?: () => void;
  /** Optional class name for the card container. */
  className?: string;
}

/**
 * An animated card component for prominently announcing new features or important updates
 * on a dashboard. Uses Framer Motion for a smooth entry and interactive elements.
 */
const FeatureAnnouncementCard: React.FC<FeatureAnnouncementCardProps> = ({
  title,
  description,
  actionLabel,
  onActionClick,
  icon: IconComponent = Sparkles,
  onDismiss,
  className,
}) => {
  // Framer Motion variants for card entry
  const cardEntryVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25, delay: 0.1 } },
  };

  // Framer Motion variants for button hover/tap
  const buttonVariants = {
    hover: { scale: 1.02, transition: { duration: 0.15 } },
    tap: { scale: 0.98, transition: { duration: 0.1 } },
  };

  return (
    <motion.div
      variants={cardEntryVariants}
      initial="hidden"
      animate="visible"
      className={cn("w-full max-w-lg mx-auto rounded-lg", className)}
    >
      <Card className="relative p-6 overflow-hidden">
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="absolute top-3 right-3 h-8 w-8 text-muted-foreground hover:bg-muted/70"
            aria-label="Dismiss announcement"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Icon/Visual */}
          <div className="flex-shrink-0 p-3 rounded-full bg-primary/10 text-primary">
            <IconComponent className="h-8 w-8" aria-hidden="true" />
          </div>

          {/* Content */}
          <div className="flex-grow space-y-2">
            <CardTitle className="text-xl font-bold text-foreground leading-snug">
              {title}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {description}
            </CardDescription>
          </div>
        </div>

        {/* Action Button */}
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="mt-6 sm:ml-[76px]" // Align with content if icon is present
        >
          <Button onClick={onActionClick} className="w-full sm:w-auto" size="lg">
            {actionLabel}
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  );
};


const ExampleUsage = () => {
  const handleActionClick = (feature: string) => {
    alert(`Navigating to learn more about: ${feature}`);
  };

  const handleDismiss = (feature: string) => {
    alert(`Dismissing announcement for: ${feature}`);
    // In a real app, this would update user preferences in a backend/local storage
  };

  return (
    <div className="p-8 bg-background border rounded-lg max-w-2xl mx-auto shadow-md">
      <h3 className="text-xl font-semibold text-foreground mb-6">Feature Announcements</h3>
      
      <div className="space-y-6">
        {/* Example 1: New Feature */}
        <FeatureAnnouncementCard
          title="Introducing AI-Powered Analytics!"
          description="Get deeper insights with our new AI-driven reports. Understand trends and predict outcomes like never before."
          actionLabel="Explore AI Analytics"
          onActionClick={() => handleActionClick("AI Analytics")}
          icon={Lightbulb}
          onDismiss={() => handleDismiss("AI Analytics")}
        />

        {/* Example 2: Important Update */}
        <FeatureAnnouncementCard
          title="Dashboard Redesign Incoming!"
          description="We're revamping the dashboard for a cleaner look and improved user experience. Get a sneak peek now!"
          actionLabel="View Sneak Peek"
          onActionClick={() => handleActionClick("Dashboard Redesign")}
          icon={BellRing}
          // No dismiss option for critical updates
        />
      </div>
    </div>
  );
};

export default ExampleUsage;