import React from 'react';
import { cn } from '@/lib/utils'; // Assuming a `cn` utility for classnames

// Define the type for individual logo props
interface Logo {
  src: string;
  alt: string;
  gradient: {
    from: string;
    via: string;
    to: string;
  };
}

// Define the props for the main component
interface MarqueeLogoScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  logos: Logo[];
  speed?: 'normal' | 'slow' | 'fast';
}

/**
 * A responsive, self-contained, and infinitely scrolling marquee component.
 * It pauses on hover and uses shadcn/ui theme variables for styling.
 * This component includes its own CSS animation and does not require tailwind.config.js modifications.
 */
const MarqueeLogoScroller = React.forwardRef<HTMLDivElement, MarqueeLogoScrollerProps>(
  ({ title, description, logos, speed = 'normal', className, ...props }, ref) => {
    // Map speed prop to animation duration
    const durationMap = {
      normal: '40s',
      slow: '80s',
      fast: '5s',
    };
    const animationDuration = durationMap[speed];

    return (
      <>
        {/* The @keyframes for the marquee animation are defined directly here for robustness. */}
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
        
        <section
          ref={ref}
          aria-label={title}
          className={cn(
            'w-full bg-background text-foreground rounded-lg border overflow-hidden',
            className
          )}
          {...props}
        >
          {/* Header Section */}
          <div className="p-6 md:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 lg:gap-8 pb-6 md:pb-8 border-b">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter text-balance">
                {title}
              </h2>
              <p className="text-muted-foreground self-start lg:justify-self-end text-balance">
                {description}
              </p>
            </div>
          </div>

          {/* Marquee Section */}
          <div
            className="w-full overflow-hidden"
            style={{
              maskImage:
                'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            }}
          >
            <div 
              className="flex w-max items-center gap-4 py-4 pr-4 hover:[animation-play-state:paused] transition-all duration-300 ease-in-out" 
              style={{
                animation: `marquee ${animationDuration} linear infinite`,
              }}
            >
              {/* Render logos twice to create a seamless loop */}
              {[...logos, ...logos].map((logo, index) => (
                <div
                  key={index}
                  className="group relative h-24 w-40 shrink-0 flex items-center justify-center rounded-lg bg-secondary/70 overflow-hidden"
                >
                  {/* Gradient background revealed on hover */}
                  <div
                    style={{
                      '--from': logo.gradient.from,
                      '--via': logo.gradient.via,
                      '--to': logo.gradient.to,
                    } as React.CSSProperties}
                    className="absolute inset-0 scale-150 opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-100 bg-gradient-to-br from-[var(--from)] via-[var(--via)] to-[var(--to)]"
                  />
                  {/* Logo Image */}
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="relative h-3/4 w-auto object-contain"
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

MarqueeLogoScroller.displayName = 'MarqueeLogoScroller';

export { MarqueeLogoScroller };
