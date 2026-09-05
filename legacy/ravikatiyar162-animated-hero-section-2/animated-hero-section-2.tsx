import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../_utils/cn"; // Your shadcn utility for merging class names

// Props interface for type safety and reusability
interface AnimatedGlobeHeroProps {
  titlePrefix: string;
  animatedWords: string[];
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  badgeText?: string; // Optional badge
  globeSrc: string; // Image source for the globe
  className?: string;
}

export const AnimatedGlobeHero = ({
  titlePrefix,
  animatedWords,
  subtitle,
  ctaText,
  ctaLink,
  badgeText,
  globeSrc,
  className,
}: AnimatedGlobeHeroProps) => {
  const [index, setIndex] = React.useState(0);

  // Effect to cycle through the animated words
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % animatedWords.length);
    }, 3000); // Change word every 3 seconds

    return () => clearInterval(interval);
  }, [animatedWords.length]);

  return (
    <section
      className={cn(
        "relative w-full min-h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-background p-4 md:p-8",
        className
      )}
    >
      <div className="z-10 flex flex-col items-center space-y-6 md:space-y-8 max-w-4xl mx-auto">
        {/* Optional Badge */}
        {badgeText && (
          <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium text-muted-foreground border">
            {badgeText}
          </div>
        )}

        {/* Main Heading with Animated Text */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground">
          {titlePrefix}{" "}
          <div className="inline-block relative h-[1.2em] w-[300px] md:w-[450px] lg:w-[600px] overflow-hidden align-bottom">
            <AnimatePresence>
              <motion.span
                key={animatedWords[index]}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 text-primary whitespace-nowrap"
              >
                {animatedWords[index]}
              </motion.span>
            </AnimatePresence>
            <span className="absolute bottom-0 left-0 w-full h-1 bg-primary/30 rounded-full" />
          </div>
        </h1>

        {/* Subtitle */}
        <p className="max-w-xl text-base md:text-xl text-muted-foreground">
          {subtitle}
        </p>

        {/* Call to Action Button */}
        <a
          href={ctaLink}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-8 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {ctaText}
        </a>
      </div>

      {/* Globe Image with Rotation Animation */}
      <div className="absolute -bottom-[25%] md:-bottom-[40%] lg:-bottom-[50%] -z-0 w-full max-w-screen-lg opacity-40 dark:opacity-30">
        <img
          src={globeSrc}
          alt="Rotating Earth Globe"
          className="w-full h-auto animate-globe-spin"
        />
      </div>
    </section>
  );
};

// You'll need to add the animation keyframes to your global CSS or tailwind.config.js
/*
In your globals.css:
@keyframes globe-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-globe-spin {
  animation: globe-spin 40s linear infinite;
}
*/