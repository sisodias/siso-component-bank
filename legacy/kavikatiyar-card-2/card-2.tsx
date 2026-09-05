import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from "../_utils/cn"; // Assuming you have a utility for class names

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";

/**
 * Interface for each action item in the QuickLinksCard.
 * @property {React.ReactNode} icon - The icon to display for the action.
 * @property {string} label - The text label for the action button.
 * @property {() => void} onClick - The function to call when the button is clicked.
 */
export interface ActionItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

/**
 * Props for the QuickLinksCard component.
 * @property {string} title - The main title of the card.
 * @property {string} [subtitle] - An optional subtitle or description.
 * @property {ActionItem[]} actions - An array of action items to be displayed as buttons.
 * @property {string} [className] - Optional additional class names for custom styling.
 */
interface QuickLinksCardProps {
  title: string;
  subtitle?: string;
  actions: ActionItem[];
  className?: string;
}

/**
 * A card component for displaying a set of "quick links" or actions.
 * It's designed to be reusable and theme-adaptive using shadcn/ui variables.
 */
export const QuickLinksCard = ({
  title,
  subtitle,
  actions,
  className,
}: QuickLinksCardProps) => {
  return (
    <Card className={cn('w-full max-w-sm rounded-2xl', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {actions.map((action, index) => (
            <motion.button
              key={index}
              onClick={action.onClick}
              aria-label={action.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-secondary text-secondary-foreground aspect-square focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
            >
              <div className="h-6 w-6">{action.icon}</div>
              <span className="text-sm font-medium">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};