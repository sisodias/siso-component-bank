import React from 'react';
import { cn } from "@/lib/utils"; // Your shadcn utility for merging classes

// Define the properties for a single partner
export interface Partner {
  name: string;
  logoUrl: string;
}

// Define the props for the RewardPartners component
export interface RewardPartnersProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle: string;
  partners: Partner[];
}

const RewardPartners = React.forwardRef<HTMLDivElement, RewardPartnersProps>(
  ({ title, subtitle, partners, className, ...props }, ref) => {
    // Duplicate the partners array to create a seamless loop
    const allPartners = [...partners, ...partners];

    return (
      <>
        {/*
          This style block makes the component self-contained.
          It defines the scrolling animation.
        */}
        <style>
          {`
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(calc(-100% - 4rem)); }
            }
          `}
        </style>

        <section
          ref={ref}
          className={cn("w-full bg-background py-16 sm:py-20 lg:py-24", className)}
          aria-labelledby="reward-partners-title"
          {...props}
        >
          <div className="container mx-auto max-w-7xl px-4 text-center">
            {/* Main Title */}
            <h2
              id="reward-partners-title"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              {title}
            </h2>

            {/* Subtitle */}
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {subtitle}
            </p>
          </div>

          {/* Marquee Container */}
          <div
            className="group relative mt-12 w-full overflow-hidden"
            style={{
              maskImage: "linear-gradient(to right, transparent, white 10%, white 90%, transparent)",
            }}
          >
            {/* The scrolling element with animation */}
            <div className="flex animate-[scroll_40s_linear_infinite] group-hover:pause motion-reduce:animate-none">
              {allPartners.map((partner, index) => (
                <div key={index} className="flex-shrink-0 px-4">
                  {/* FIX: Removed the filter style to ensure logos are always visible */}
                  <img
                    src={partner.logoUrl}
                    alt={`${partner.name} logo`}
                    className="mx-auto h-20 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }
);

RewardPartners.displayName = "RewardPartners";

export { RewardPartners };