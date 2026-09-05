import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils"; // Assuming you have a `cn` utility from shadcn/ui
import { ArrowRight } from "lucide-react";

// Interface for a single feature item
export interface Feature {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  href: string;
}

// Interface for the component props
export interface FeatureGridProps {
  features: Feature[];
  className?: string;
}

const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => (
  <a
    href={feature.href}
    className={cn(
      "group", // Group for hover effects
      "flex flex-col sm:flex-row items-start gap-6",
      "p-6 rounded-lg border",
      "bg-card text-card-foreground",
      "transition-all duration-300",
      "hover:shadow-md hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    )}
  >
    {/* Image */}
    <div className="flex-shrink-0">
      <img 
        src={feature.imageSrc} 
        alt={feature.imageAlt}
        className="h-24 w-24 object-contain"
      />
    </div>
    
    {/* Text Content & Arrow */}
    <div className="flex flex-1 flex-col justify-between h-full">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">
          {feature.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {feature.description}
        </p>
      </div>
      <div className="flex justify-end mt-4">
        <ArrowRight 
          className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" 
        />
      </div>
    </div>
  </a>
);

const FeatureGrid = React.forwardRef<
  HTMLDivElement,
  FeatureGridProps
>(({ features, className }, ref) => {
  if (!features || features.length === 0) {
    return null; // Don't render anything if there are no features
  }

  return (
    <div
      ref={ref}
      className={cn(
        "grid grid-cols-1 gap-6 lg:grid-cols-2", // Responsive grid layout
        className
      )}
    >
      {features.map((feature, index) => (
        <FeatureCard key={index} feature={feature} />
      ))}
    </div>
  );
});
FeatureGrid.displayName = "FeatureGrid";

export { FeatureGrid };