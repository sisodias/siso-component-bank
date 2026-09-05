import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Assuming you have a utility for classnames

// Define the props for the component
interface HeroVideoBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  videoSrc: string;
  heading: string;
  buttonText: string;
  buttonHref: string;
  videoType?: string;
}

const HeroVideoBackground = React.forwardRef<HTMLDivElement, HeroVideoBackgroundProps>(
  ({ className, videoSrc, heading, buttonText, buttonHref, videoType = "video/mp4", ...props }, ref) => {
    
    // Animation variants for the container to orchestrate children animations
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.3,
        },
      },
    };

    // Animation variants for the text elements
    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.8,
          ease: "easeOut",
        },
      },
    };
    
    // Animation variants for the button
    const buttonVariants = {
      hidden: { scale: 0.8, opacity: 0 },
      visible: {
        scale: 1,
        opacity: 1,
        transition: {
          delay: 0.5, // Delay button animation
          duration: 0.5,
          ease: [0.43, 0.13, 0.23, 0.96] // Custom ease for a playful bounce
        },
      },
       hover: {
        scale: 1.05,
        transition: { duration: 0.2 },
      },
      tap: {
        scale: 0.95,
      },
    };

    return (
      <section
        ref={ref}
        className={cn(
          "relative flex h-screen w-full flex-col items-center justify-center overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute left-0 top-0 z-0 h-full w-full object-cover"
          aria-hidden="true"
        >
          <source src={videoSrc} type={videoType} />
          Your browser does not support the video tag.
        </video>

        {/* Darkening Overlay */}
        <div className="absolute left-0 top-0 z-10 h-full w-full bg-black/50" />

        {/* Content */}
        <motion.div
          className="relative z-20 flex flex-col items-center text-center text-white px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Animated Heading */}
          <motion.h1
            className="text-4xl font-serif font-medium tracking-tight text-white sm:text-5xl md:text-7xl"
            variants={itemVariants}
          >
            {heading}
          </motion.h1>
          
          {/* Animated Button */}
          <motion.a
            href={buttonHref}
            className="mt-8 inline-flex items-center justify-center rounded-full border border-transparent bg-white px-6 py-3 text-base font-medium text-black shadow-sm transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {buttonText}
          </motion.a>
        </motion.div>
      </section>
    );
  }
);

HeroVideoBackground.displayName = "HeroVideoBackground";

export { HeroVideoBackground };