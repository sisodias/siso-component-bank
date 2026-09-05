import React from 'react';
import { cn } from "@/lib/utils"; // Assuming you have a `cn` utility from shadcn

/**
 * Props for the FeatureCard component.
 * @param {React.ReactNode} icon - The icon element to display at the top of the card.
 * @param {string} title - The title or heading of the feature.
 * @param {string} description - The descriptive text for the feature.
 * @param {string} [className] - Optional additional class names for custom styling.
 */
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

/**
 * A responsive and theme-adaptive card component to highlight features.
 * Built with shadcn/ui principles.
 */
export const FeatureCard = ({ icon, title, description, className }: FeatureCardProps) => {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground p-8 rounded-xl border flex flex-col items-center text-center",
        "transition-all duration-300 ease-in-out",
        "hover:shadow-lg hover:-translate-y-2",
        className
      )}
    >
      {/* Icon container */}
      <div className="mb-6 bg-secondary p-4 rounded-full">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold mb-2 tracking-tight">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
};