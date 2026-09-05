import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Stat {
  label: string;
  value: string | number;
}

export interface PropertyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  imageAlt?: string;
  title: string;
  price: number;
  pricePeriod?: string;
  description: string;
  stats: Stat[];
  actionLabel: string;
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
    const [rotateX, setRotateX] = React.useState(0);
    const [rotateY, setRotateY] = React.useState(0);
    const cardRef = React.useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;

      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateXValue = ((y - centerY) / centerY) * -5;
      const rotateYValue = ((x - centerX) / centerX) * 5;

      setRotateX(rotateXValue);
      setRotateY(rotateYValue);
    };

    const handleMouseLeave = () => {
      setRotateX(0);
      setRotateY(0);
    };

    return (
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.2s ease-out',
        }}
        className={cn(
          "flex max-w-sm flex-col overflow-hidden rounded-xl border-2 border-border bg-card text-card-foreground shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:bg-slate-900 dark:border-slate-700 dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)]",
          className
        )}
        {...props}
      >
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={imageAlt || title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex-1">
            <h3 className="text-2xl font-bold tracking-tight dark:text-white">{title}</h3>
            <p className="mt-1 text-lg font-semibold text-foreground dark:text-gray-100">
              ${price} <span className="text-sm font-normal text-muted-foreground dark:text-gray-400">{pricePeriod}</span>
            </p>
            <p className="mt-3 text-sm text-muted-foreground dark:text-gray-300">{description}</p>
          </div>

          <div className="my-6 grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="rounded-lg bg-muted p-4 text-center shadow-sm dark:bg-slate-800 dark:shadow-md">
                <p className="text-sm font-medium text-muted-foreground dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground dark:text-white">{stat.value}</p>
              </div>
            ))}
          </div>

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