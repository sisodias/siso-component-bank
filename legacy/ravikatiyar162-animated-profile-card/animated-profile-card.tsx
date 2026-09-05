// components/ui/profile-card.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Bookmark, Briefcase, Clock, DollarSign, LucideIcon } from 'lucide-react';
import { cn } from "../_utils/cn"; // Assuming you have a lib/utils.ts for cn

// Define the types for the component props
export interface Tool {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface ProfileCardProps {
  name: string;
  role: string;
  avatarUrl: string;
  coverImageUrl: string;
  rating: number;
  duration: string;
  rate: string;
  tools: Tool[];
  isBookmarked?: boolean;
  onBookmark?: () => void;
  onGetInTouch?: () => void;
  className?: string;
}

// Reusable stat item component
const StatItem = ({ icon: Icon, value, label }: { icon: LucideIcon; value: string | number; label: string }) => (
  <div className="flex flex-col items-center gap-1 text-center">
    <div className="flex items-center gap-1.5">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="font-semibold text-foreground">{value}</span>
    </div>
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);

// Main ProfileCard component
export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  role,
  avatarUrl,
  coverImageUrl,
  rating,
  duration,
  rate,
  tools,
  isBookmarked = false,
  onBookmark,
  onGetInTouch,
  className,
}) => {
  // Animation variants for Framer Motion
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={cn(
        'relative w-full max-w-sm overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm',
        className
      )}
    >
      {/* Cover Image */}
      <motion.div variants={itemVariants} className="h-32 w-full">
        <img src={coverImageUrl} alt={`${name}'s cover image`} className="h-full w-full object-cover" />
      </motion.div>

      {/* Bookmark Button */}
      <motion.button
        variants={itemVariants}
        onClick={onBookmark}
        aria-label="Bookmark profile"
        className="absolute top-3 right-3 z-10 rounded-full bg-background/50 p-2 backdrop-blur-sm transition-colors hover:bg-background/75"
      >
        <Bookmark className={cn('h-5 w-5 text-foreground', isBookmarked && 'fill-current text-yellow-500')} />
      </motion.button>

      <div className="relative p-6 pt-0">
        {/* Avatar */}
        <motion.div variants={itemVariants} className="relative -mt-12 flex justify-start">
          <img
            src={avatarUrl}
            alt={name}
            className="h-20 w-20 rounded-full border-4 border-card object-cover"
          />
        </motion.div>

        <div className="mt-4">
          {/* Name & Role */}
          <motion.h3 variants={itemVariants} className="text-xl font-bold text-foreground">
            {name}
          </motion.h3>
          <motion.p variants={itemVariants} className="text-sm text-muted-foreground">
            {role}
          </motion.p>

          {/* Tools */}
          <motion.div variants={itemVariants} className="mt-4 flex items-center gap-2">
            <span className="text-sm font-medium">Tools</span>
            <div className="flex items-center gap-2">
              {tools.map((tool, index) => (
                <div key={index} className="rounded-full bg-muted p-1.5">
                  <tool.icon className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={itemVariants}
            className="mt-6 grid grid-cols-3 items-center justify-items-center gap-4 rounded-lg bg-muted/50 p-3"
          >
            <StatItem icon={Star} value={rating.toFixed(1)} label="rating" />
            <div className="h-8 w-px bg-border" />
            <StatItem icon={Clock} value={duration} label="duration" />
            <div className="h-8 w-px bg-border" />
            <StatItem icon={DollarSign} value={rate} label="rate" />
          </motion.div>

          {/* Action Button */}
          <motion.button
            variants={itemVariants}
            onClick={onGetInTouch}
            className="mt-6 w-full rounded-full bg-primary py-3 text-center font-semibold text-primary-foreground transition-transform active:scale-95"
          >
            Get in touch
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};