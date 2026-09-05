// components/ui/animated-feature-card.tsx

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button'; // Assuming shadcn Button component exists
import { ArrowRight } from 'lucide-react';

// Define the props for the component
interface AnimatedFeatureCardProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  Icon: React.ElementType; // Allow passing any icon component
  className?: string;
}

// Helper component for the background grid
const GridBackground = () => (
  <div className="absolute inset-0 z-0 h-full w-full bg-transparent">
    <div
      className="absolute inset-0 h-full w-full bg-cover bg-center"
      style={{
        backgroundImage:
          'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 60%, transparent 100%)',
      }}
    />
  </div>
);

export const AnimatedFeatureCard: React.FC<AnimatedFeatureCardProps> = ({
  title,
  description,
  buttonText,
  buttonHref,
  Icon,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative flex w-full max-w-lg flex-col items-center justify-center overflow-hidden rounded-2xl border bg-background p-8 text-center',
        className
      )}
    >
      {/* Title and Description */}
      <h2 className="text-xl font-bold text-foreground md:text-2xl">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground md:text-base">
        {description}
      </p>

      {/* Animated Centerpiece */}
      <div className="relative my-10 flex h-48 w-full items-center justify-center">
        <GridBackground />

        {/* Floating card element */}
        <div className="animate-float z-10 flex flex-col items-center justify-center gap-3">
          <div className="relative flex h-[70px] w-[140px] flex-col justify-between rounded-lg border bg-background p-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">Secured</span>
              {/* Pulsating Icon */}
              <div className="relative">
                <Icon className="h-5 w-5 text-green-500" />
                <span className="absolute inset-0 -z-10 h-full w-full animate-pulse rounded-full bg-green-500/50 blur-md" />
              </div>
            </div>
            <div className="mt-1 h-1.5 w-3/4 rounded-full bg-muted" />
            <div className="mt-1 h-1.5 w-1/2 rounded-full bg-muted" />
          </div>
          <span className="rounded-full border bg-background px-2 py-0.5 text-xs text-muted-foreground shadow-sm">
            Locked & Reliable
          </span>
        </div>
      </div>

      {/* Call to Action Button */}
      <Button
        variant="ghost"
        className="group mt-4 transition-transform duration-300 hover:translate-x-1"
        asChild
      >
        <a href={buttonHref}>
          {buttonText}
          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </Button>
    </div>
  );
};

// Add this animation to your globals.css or tailwind.config.js
/*
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
*/