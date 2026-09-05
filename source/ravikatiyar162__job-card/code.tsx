"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";

import { cn } from "@/lib/utils"; // Assuming shadcn's utils file is in `lib`
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Define the props interface for type safety and clear documentation.
interface JobCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The URL for the company's logo. */
  companyLogo: string;
  /** The name of the company. */
  companyName: string;
  /** A string indicating when the job was posted, e.g., "5 days ago". */
  postedAt: string;
  /** The title of the job position. */
  jobTitle: string;
  /** An array of strings for tags like "Full-Time" or "Flexible Schedule". */
  tags?: string[];
  /** The salary range for the position. */
  salaryRange: string;
  /** The location of the job. */
  location: string;
  /** A callback function for the "Apply" button click event. */
  onApply?: () => void;
  /** A callback function for the "Save" button click event. */
  onSave?: () => void;
  /** The initial saved state of the job card. */
  isInitiallySaved?: boolean;
}

const JobCard = React.forwardRef<HTMLDivElement, JobCardProps>(
  (
    {
      className,
      companyLogo,
      companyName,
      postedAt,
      jobTitle,
      tags = [],
      salaryRange,
      location,
      onApply,
      onSave,
      isInitiallySaved = false,
      ...props
    },
    ref
  ) => {
    // State to manage the saved status of the job.
    const [isSaved, setIsSaved] = React.useState(isInitiallySaved);

    const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation(); // Prevent card click if it's wrapped in a link.
      setIsSaved((prev) => !prev);
      onSave?.(); // Optional chaining to call the onSave prop if it exists.
    };

    // Animation variants for Framer Motion.
    const cardVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          ease: "easeOut",
          staggerChildren: 0.1, // Stagger the animation of child elements.
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 },
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "flex w-full max-w-sm cursor-pointer flex-col gap-8 rounded-xl border bg-card p-6 text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg",
          className
        )}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -5, scale: 1.02 }}
        {...props}
      >
        {/* Top Section: Logo, Company Info, Save Button */}
        <motion.div variants={itemVariants} className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full  bg-background">
              <img src={companyLogo} alt={`${companyName} logo`} className="h-8 w-8 object-contain" />
            </div>
            <div>
              <p className="font-medium text-foreground">{companyName}</p>
              <p className="text-xs text-muted-foreground">{postedAt}</p>
            </div>
          </div>
          <Button
            variant={isSaved ? "secondary" : "outline"}
            size="sm"
            onClick={handleSaveClick}
            aria-label={isSaved ? "Unsave job" : "Save job"}
            className="shrink-0 gap-1.5"
          >
            <Bookmark className={cn("h-4 w-4", isSaved && "fill-primary text-primary-foreground")} />
            {isSaved ? "Saved" : "Save"}
          </Button>
        </motion.div>

        {/* Middle Section: Job Title and Tags */}
        <motion.div variants={itemVariants} className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold">{jobTitle}</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Separator className="my-2" />
        </motion.div>

        {/* Bottom Section: Salary, Location, Apply Button */}
        <motion.div variants={itemVariants} className="flex items-end justify-between">
          <div>
            <p className="font-semibold">{salaryRange}</p>
            <p className="text-sm text-muted-foreground">{location}</p>
          </div>
          <Button onClick={onApply}>Apply now</Button>
        </motion.div>
      </motion.div>
    );
  }
);

JobCard.displayName = "JobCard";

export { JobCard };