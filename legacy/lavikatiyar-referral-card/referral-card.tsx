import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../_utils/cn";
import { Button } from "./button";
import { Copy, Check, Link2 } from "lucide-react";

// Interface for the step items in the "How it works" section
interface Step {
  icon: React.ReactNode;
  text: React.ReactNode;
}

// Props interface for the ReferralCard component
export interface ReferralCardProps {
  /** The text to display in the top badge. */
  badgeText: string;
  /** The main title of the card. */
  title: string;
  /** A short description under the title. */
  description: string;
  /** The URL for the image in the top-right corner. */
  imageUrl: string;
  /** An array of steps explaining how the referral works. */
  steps: Step[];
  /** The referral link to be copied. */
  referralLink: string;
  /** Optional additional class names for custom styling. */
  className?: string;
}

/**
 * A responsive and animated card component for displaying referral program information.
 * It's theme-adaptive and uses shadcn/ui variables for styling.
 */
export const ReferralCard = ({
  badgeText,
  title,
  description,
  imageUrl,
  steps,
  referralLink,
  className,
}: ReferralCardProps) => {
  const [copied, setCopied] = React.useState(false);

  // Function to handle copying the link to the clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  // Animation variants for framer-motion
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className={cn(
        "relative w-full max-w-md overflow-hidden rounded-2xl border bg-card p-6 text-card-foreground shadow-lg sm:p-8",
        className
      )}
    >
      {/* Decorative image */}
      <img
        src={imageUrl}
        alt="Referral illustration"
        className="absolute right-8 top-8 h-32 w-32 opacity-80"
      />

      <div className="relative z-10">
        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="mb-4 inline-block rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground"
        >
          {badgeText}
        </motion.div>

        {/* Header */}
        <motion.h2
          variants={itemVariants}
          className="mb-1 text-3xl font-bold tracking-tight"
        >
          {title}
        </motion.h2>
        <motion.p variants={itemVariants} className="mb-6 text-muted-foreground">
          {description}
        </motion.p>

        {/* How it works section */}
        <div className="mb-6">
          <motion.h3 variants={itemVariants} className="mb-4 font-semibold">
            How it works:
          </motion.h3>
          <motion.ul
            className="space-y-3"
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.2, delayChildren: 0.3 }}
          >
            {steps.map((step, index) => (
              <motion.li key={index} variants={itemVariants} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {step.icon}
                </span>
                <span className="text-sm text-muted-foreground">{step.text}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Invite link section */}
        <div>
          <motion.h3 variants={itemVariants} className="mb-2 font-semibold">
            Your invite link:
          </motion.h3>
          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2"
          >
            <div className="flex h-10 flex-grow items-center gap-2 rounded-md border bg-background px-3">
              <Link2 className="h-4 w-4 text-muted-foreground" />
              <p className="truncate text-sm">{referralLink}</p>
            </div>
            <Button onClick={handleCopy} className="w-full shrink-0 sm:w-auto">
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.span
                    key="copied"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" /> Copied!
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" /> Copy Link
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};