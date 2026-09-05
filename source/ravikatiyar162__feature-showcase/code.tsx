import * as React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils"; // Your shadcn utility for merging class names

// Prop types for the component
interface Feature {
  title: string;
  imageSrc: string;
}

interface FeatureShowcaseProps {
  title: string;
  subtitle: string;
  mainFeature: Feature;
  features: Feature[];
  className?: string;
}

// Helper array to define the positions for the floating cards
// Values are [top, left, right] for large screens
const featurePositions = [
  ["10%", "15%", "auto"], // Healthy
  ["0%", "35%", "auto"], // Veg Mode
  ["70%", "5%", "auto"], // Plan a Party
  ["85%", "25%", "auto"], // Gift Cards
  ["5%", "auto", "30%"], // Gourmet
  ["75%", "auto", "5%"], // Food on Train
  ["0%", "auto", "10%"], // Offers
  ["35%", "auto", "15%"], // Collections
];

export function FeatureShowcase({
  title,
  subtitle,
  mainFeature,
  features,
  className,
}: FeatureShowcaseProps) {

  // Animation variants for the main container to orchestrate children animations
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for the text elements
  const textVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };
  
  // Animation for the central phone element
  const phoneVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut", delay: 0.2 } },
  };

  // Animation for each floating feature card
  const featureCardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.4 + i * 0.1,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section className={cn("w-full py-20 lg:py-24 antialiased", className)}>
      <motion.div 
        className="container mx-auto px-4 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.h2 
          className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          variants={textVariants}
        >
          {title}
        </motion.h2>
        <motion.p 
          className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground"
          variants={textVariants}
        >
          {subtitle}
        </motion.p>
      </motion.div>

      {/* Main interactive area with phone and floating cards */}
      <motion.div 
        className="relative container mx-auto mt-16 h-[600px] lg:h-[700px]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {/* Phone Mockup */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-[520px] lg:w-72 lg:h-[580px] bg-background/80 backdrop-blur-sm border-4 border-foreground/10 rounded-[40px] shadow-2xl shadow-primary/10 z-10 p-4"
          variants={phoneVariants}
        >
          <div className="w-full h-full bg-card rounded-[24px] flex flex-col items-center justify-center gap-4">
             <img src={mainFeature.imageSrc} alt={mainFeature.title} className="w-20 h-20" />
            <p className="text-lg font-medium text-foreground">{mainFeature.title}</p>
          </div>
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-6 bg-background rounded-b-xl border-b-4 border-x-4 border-foreground/10"></div>
        </motion.div>

        {/* Floating Feature Cards */}
        {features.slice(0, 8).map((feature, i) => (
          <motion.div
            key={feature.title}
            custom={i}
            variants={featureCardVariants}
            // Continuous floating animation
            animate={{
              y: [0, -8, 0],
              transition: {
                duration: 2.5 + Math.random() * 1.5,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
                delay: 0.4 + i * 0.1,
              },
            }}
            whileHover={{ scale: 1.1, y: -10 }}
            className="absolute hidden lg:block"
            style={{ 
              top: featurePositions[i][0], 
              left: featurePositions[i][1],
              right: featurePositions[i][2],
            }}
          >
            <div className="flex flex-col items-center gap-2 p-4 w-36 h-32 bg-card/60 backdrop-blur-md border border-border rounded-2xl shadow-lg">
              <img src={feature.imageSrc} alt={feature.title} className="w-16 h-16" />
              <p className="text-sm font-medium text-center text-foreground">{feature.title}</p>
            </div>
          </motion.div>
        ))}
        
        {/* Mobile View: Grid layout for feature cards */}
        <div className="lg:hidden grid grid-cols-2 sm:grid-cols-3 gap-4 pt-12">
            {features.map((feature) => (
                 <div key={feature.title} className="flex flex-col items-center gap-2 p-3 bg-card/60 backdrop-blur-md border border-border rounded-2xl shadow-lg">
                    <img src={feature.imageSrc} alt={feature.title} className="w-10 h-10" />
                    <p className="text-xs font-medium text-center text-foreground">{feature.title}</p>
                </div>
            ))}
        </div>
      </motion.div>
    </section>
  );
}