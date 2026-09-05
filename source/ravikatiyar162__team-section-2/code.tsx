// components/ui/team-section.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assumes shadcn/ui's utility function

// Type definition for a single team member
export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

// Props interface for the TeamSection component
export interface TeamSectionProps {
  /** The subtitle displayed above the main title. */
  subtitle?: string;
  /** The main title of the section. */
  title: string;
  /** An array of team member objects. */
  members: TeamMember[];
  /** Optional additional class names for styling. */
  className?: string;
}

/**
 * A reusable component for the decorative background circles, adding visual depth.
 */
const DecorativeCircle = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'absolute rounded-full bg-primary/10 -z-0', // Using theme variables
      className,
    )}
    aria-hidden="true"
  />
);

/**
 * TeamSection component to display a list of team members with titles and animations.
 */
export const TeamSection = ({
  subtitle,
  title,
  members,
  className,
}: TeamSectionProps) => {
  // Animation variants for the main container to stagger children's animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  // Animation variants for each team member item
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, x: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { type: 'spring', damping: 12, stiffness: 100 },
    },
  };

  // Animation variants for the main text content
  const textVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden bg-background text-foreground py-20 sm:py-28', // Theme-adaptive background and text
        className,
      )}
    >
      {/* Decorative elements for visual flair */}
      <DecorativeCircle className="h-24 w-24 top-1/4 left-1/4" />
      <DecorativeCircle className="h-16 w-16 top-10 left-1/2" />
      <DecorativeCircle className="h-20 w-20 bottom-1/4 left-10" />
      <DecorativeCircle className="h-28 w-28 top-1/2 right-1/4" />

      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left Side: Team Members List */}
        <motion.div
          className="space-y-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible" // Animate when the component scrolls into view
          viewport={{ once: true, amount: 0.3 }}
        >
          {members.map((member) => (
            <motion.div
              key={member.name}
              className="flex items-center gap-4 sm:gap-6"
              variants={itemVariants}
              role="listitem"
            >
              <img
                src={member.image}
                alt={`Photo of ${member.name}`}
                className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-full border-4 border-card shadow-lg"
              />
              <div className="flex-1 bg-primary/90 text-primary-foreground rounded-full px-5 py-3 sm:px-6 sm:py-4 backdrop-blur-sm">
                <h3 className="font-bold text-base sm:text-lg">{member.name}</h3>
                <p className="text-xs sm:text-sm font-medium opacity-80">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Right Side: Title and Subtitle */}
        <motion.div
          className="text-center lg:text-left"
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {subtitle && (
            <p className="font-semibold text-primary uppercase tracking-widest mb-2">
              {subtitle}
            </p>
          )}
          <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground leading-tight">
            {title}
          </h2>
        </motion.div>
      </div>
    </section>
  );
};