"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../_utils/cn";
import { Badge } from "./badge";
import { Button } from "./button";

// Interface for component props for type-safety and clarity
interface ExpandableSkillTagsProps {
  /** The main title for the skills section. */
  title: string;
  /** An array of strings representing the skills to be displayed. */
  skills: string[];
  /** The number of skills to show before expanding. Defaults to 10. */
  initialCount?: number;
  /** Optional additional class names for custom styling. */
  className?: string;
}

/**
 * A component to display a list of skills with an expandable section.
 * Uses shadcn/ui's Badge and Button, with framer-motion for animations.
 */
export const ExpandableSkillTags = ({
  title,
  skills,
  initialCount = 10,
  className,
}: ExpandableSkillTagsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Memoize the visible and hidden skills to prevent recalculation on every render
  const visibleSkills = React.useMemo(() => skills.slice(0, initialCount), [skills, initialCount]);
  const hiddenSkills = React.useMemo(() => skills.slice(initialCount), [skills, initialCount]);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className={cn("w-full", className)}>
      <h3 className="mb-4 text-lg font-semibold text-foreground">{title}</h3>
      <motion.div
        className="flex flex-wrap gap-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Always visible skills */}
        {visibleSkills.map((skill, index) => (
          <motion.div key={`visible-${index}`} variants={itemVariants}>
            <Badge variant="secondary">{skill}</Badge>
          </motion.div>
        ))}

        {/* Conditionally rendered extra skills with animation */}
        <AnimatePresence>
          {isExpanded &&
            hiddenSkills.map((skill, index) => (
              <motion.div
                key={`hidden-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Badge variant="secondary">{skill}</Badge>
              </motion.div>
            ))}
        </AnimatePresence>
      </motion.div>

      {/* Toggle Button */}
      {skills.length > initialCount && (
        <Button
          variant="link"
          className="mt-3 px-0 text-sm"
          onClick={toggleExpansion}
          aria-expanded={isExpanded}
        >
          {isExpanded ? "View less skills" : "View all skills"}
        </Button>
      )}
    </section>
  );
};