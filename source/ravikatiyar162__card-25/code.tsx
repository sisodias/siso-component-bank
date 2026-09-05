import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils"; // Your utility for merging class names

// Prop types remain the same
export interface Stat {
  icon: React.ReactNode;
  label: string;
}

export interface AnimatedHikeCardProps {
  title: string;
  images: string[];
  stats: Stat[];
  description: string;
  href: string;
  className?: string;
}

export const AnimatedHikeCard = React.forwardRef<
  HTMLAnchorElement,
  AnimatedHikeCardProps
>(({ title, images, stats, description, href, className }, ref) => {
  return (
    <a
      ref={ref}
      href={href}
      className={cn(
        "group relative block w-full max-w-sm cursor-pointer rounded-2xl border bg-card p-6 text-card-foreground shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg lg:max-w-md",
        className
      )}
      aria-label={`Learn more about ${title}`}
    >
      <div className="flex flex-col">
        {/* Card Header: Title and Arrow */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tighter">{title}</h2>
          <ArrowRight className="h-6 w-6 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
        </div>

        {/* Stacked Images with CORRECTED Hover Animation */}
        <div className="relative mb-6 h-32">
          {images.map((src, index) => (
            <div
              key={index}
              className={cn(
                "absolute h-full w-[40%] overflow-hidden rounded-lg border-2 border-background shadow-md transition-all duration-300 ease-in-out",
                // On hover, apply transforms using the CSS variables defined in `style`
                "group-hover:translate-x-[var(--tx)] group-hover:rotate-[var(--r)]"
              )}
              style={{
                // Set initial transform for the stacked look
                transform: `translateX(${index * 32}px)`,
                // Define CSS variables for the hover state transforms
                '--tx': `${index * 80}px`,
                '--r': `${index * 5 - 5}deg`,
                zIndex: images.length - index,
              }}
            >
              <img
                src={src}
                alt={`${title} view ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mb-4 flex items-center space-x-4 text-sm text-muted-foreground">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center space-x-1.5">
              {stat.icon}
              <span>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </a>
  );
});

AnimatedHikeCard.displayName = "AnimatedHikeCard";