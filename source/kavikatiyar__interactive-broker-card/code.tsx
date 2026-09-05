import * as React from "react";
import { Star, CheckCircle2, Users } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a `cn` utility

// Define the props for the component
interface InteractiveBrokerCardProps {
  logoSrc: string;
  name: string;
  tradableAssets: string[];
  rating: number;
  ratingText: string;
  reviewsCount: string;
  accountsCount: string;
  learnMoreUrl: string;
  className?: string;
}

// Helper component for individual stats
const StatItem = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => (
  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
    <Icon className="h-3.5 w-3.5" />
    <span>{label}</span>
  </div>
);

export const InteractiveBrokerCard = ({
  logoSrc,
  name,
  tradableAssets,
  rating,
  ratingText,
  reviewsCount,
  accountsCount,
  learnMoreUrl,
  className,
}: InteractiveBrokerCardProps) => {
  return (
    <div
      className={cn(
        // THEME FIX: Using `bg-card` and `text-card-foreground` for theme adaptivity
        "relative flex w-full max-w-4xl flex-col items-center gap-8 overflow-hidden rounded-2xl border bg-card p-8 text-card-foreground md:flex-row md:gap-16 md:p-12",
        className
      )}
    >
      {/* Background radial gradient using the primary color variable */}
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-[350px] w-[350px] bg-[radial-gradient(50%_50%_at_50%_50%,hsl(var(--primary)/0.15)_0%,rgba(255,255,255,0)_100%)]" />

      {/* Left Content Section */}
      <div className="z-10 flex flex-col items-center text-center md:items-start md:text-left">
        <h2 className="text-3xl font-bold tracking-tight">{name}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tradable assets: {tradableAssets.join(", ")}
        </p>

        <div className="my-6 flex flex-wrap items-center justify-center gap-4 md:justify-start">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    // THEME FIX: Using `text-muted-foreground` for unfilled stars
                    i < Math.floor(rating)
                      ? "text-yellow-400" // Brand/status color, acceptable to be specific
                      : "text-muted-foreground/50"
                  )}
                  fill="currentColor"
                />
              ))}
            </div>
            <span className="text-xs font-medium text-foreground">
              {rating} &bull; {ratingText}
            </span>
          </div>
          <StatItem icon={CheckCircle2} label={`${reviewsCount} Reviews`} />
          <StatItem icon={Users} label={`${accountsCount} Accounts`} />
        </div>

        <a
          href={learnMoreUrl}
          className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-transparent px-6 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Learn more
        </a>
      </div>

      {/* Right 3D Logo Section */}
      <div className="z-10 flex-shrink-0 [perspective:800px]">
        <div className="group h-48 w-48 transition-transform duration-500 ease-in-out [transform-style:preserve-3d] hover:[transform:rotateY(-20deg)_rotateX(15deg)_scale(1.05)] md:h-56 md:w-56">
          {/* THEME FIX: Using semi-transparent foreground for theme-adaptive layers */}
          <div className="absolute h-full w-full rounded-3xl bg-card-foreground/10 transition-transform duration-500 ease-in-out group-hover:[transform:translateZ(-25px)]" />
          <div className="absolute h-full w-full rounded-3xl bg-card-foreground/5 transition-transform duration-500 ease-in-out group-hover:[transform:translateZ(-12px)]" />
          
          {/* Top layer with image (brand color is intentionally kept) */}
          <div className="absolute flex h-full w-full items-center justify-center rounded-3xl bg-white-600 shadow-xl transition-transform duration-500 ease-in-out [transform:translateZ(0)]">
            <img
              src={logoSrc}
              alt={`${name} logo`}
              className="h-2/3 w-2/3 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};