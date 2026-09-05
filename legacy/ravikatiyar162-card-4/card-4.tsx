import * as React from "react";
import { cn } from "../_utils/cn";
import { Button } from "./button";

// Define the structure for each stat to be displayed
interface Stat {
  label: string;
  value: string | number;
}

// Define the props for the PropertyCard component
export interface PropertyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The URL of the property image. */
  imageUrl: string;
  /** An accessible label for the image. */
  imageAlt?: string;
  /** The main title or name of the property. */
  title: string;
  /** The price of the property. */
  price: number;
  /** The pricing period, e.g., "per night". */
  pricePeriod?: string;
  /** A short description of the property. */
  description: string;
  /** An array of stats to display, like rating, days, etc. */
  stats: Stat[];
  /** The label for the main action button. */
  actionLabel: string;
  /** The function to call when the action button is clicked. */
  onActionClick?: () => void;
}

const PropertyCard = React.forwardRef<HTMLDivElement, PropertyCardProps>(
  (
    {
      className,
      imageUrl,
      imageAlt,
      title,
      price,
      pricePeriod = "per night",
      description,
      stats,
      actionLabel,
      onActionClick,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex max-w-sm flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm",
          className
        )}
        {...props}
      >
        {/* Property Image */}
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={imageAlt || title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Card Content */}
        <div className="flex flex-1 flex-col p-6">
          <div className="flex-1">
            <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
            <p className="mt-1 text-lg font-semibold text-foreground">
              ${price} <span className="text-sm font-normal text-muted-foreground">{pricePeriod}</span>
            </p>
            <p className="mt-3 text-sm text-muted-foreground">{description}</p>
          </div>

          {/* Stats Section */}
          <div className="my-6 grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="rounded-lg bg-muted p-4 text-center">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <Button onClick={onActionClick} className="w-full">
            {actionLabel}
          </Button>
        </div>
      </div>
    );
  }
);
PropertyCard.displayName = "PropertyCard";

export { PropertyCard };