import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Assuming you have a `cn` utility from shadcn

// TypeScript interface for a single feature item
export interface Feature {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

// TypeScript interface for the component's props
export interface FeaturePolaroidSectionProps {
  title: React.ReactNode;
  features: Feature[];
  className?: string;
}

// Framer Motion variants for animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Stagger the animation of children
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
    }
  },
};

const polaroidVariants = {
    hover: {
        scale: 1.05,
        rotate: 0,
        transition: { type: "spring", stiffness: 300, damping: 15 }
    }
}

export const FeaturePolaroidSection = ({ title, features, className }: FeaturePolaroidSectionProps) => {
  return (
    <section className={cn("w-full py-16 sm:py-24", className)}>
      <div className="container mx-auto px-4">
        {/* Main Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          {title}
        </h2>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center"
              variants={itemVariants}
            >
              {/* Feature Text Content */}
              <h3 className="text-xl font-semibold mb-4 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground max-w-xs">{feature.description}</p>
              
              {/* Polaroid Image Container */}
              <motion.div
                className={cn(
                  "bg-background p-4 pb-10 shadow-lg rounded-sm mt-6 transform transition-transform duration-300",
                  // Alternate rotation for visual variety
                  index % 2 === 0 ? "-rotate-3" : "rotate-3"
                )}
                variants={polaroidVariants}
                whileHover="hover"
              >
                <img
                  src={feature.imageSrc}
                  alt={feature.imageAlt}
                  width={280}
                  height={280}
                  className="w-full h-auto object-cover rounded-sm aspect-square"
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};