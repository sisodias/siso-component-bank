import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "./button"; // Assuming shadcn button is in this path

// Define the types for the component props for type-safety and clarity
interface ActionProps {
  text: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

interface MailboxFullStateProps {
  imageUrl: string;
  title: string;
  description: string;
  primaryAction: ActionProps;
  secondaryAction: ActionProps;
}

/**
 * A reusable component to display a "full state" or promotional message.
 * It includes an image, title, description, and two call-to-action buttons.
 * Features subtle entry animations for a polished user experience.
 */
export const MailboxFullState = ({
  imageUrl,
  title,
  description,
  primaryAction,
  secondaryAction,
}: MailboxFullStateProps) => {

  // Animation variants for the container and its children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <motion.div
      className="flex w-full max-w-md flex-col items-center justify-center rounded-lg border bg-card p-8 text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-labelledby="state-title"
    >
      {/* Image section */}
      <motion.img
        src={imageUrl}
        alt="Mailbox illustration"
        className="mb-6 h-40 w-40 object-contain"
        variants={itemVariants}
      />

      {/* Text content section */}
      <motion.h2
        id="state-title"
        className="text-2xl font-semibold text-card-foreground"
        variants={itemVariants}
      >
        {title}
      </motion.h2>

      <motion.p
        className="mt-2 text-muted-foreground"
        variants={itemVariants}
      >
        {description}
      </motion.p>

      {/* Action buttons section */}
      <motion.div
        className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center"
        variants={itemVariants}
      >
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={secondaryAction.onClick}
        >
          {secondaryAction.text}
        </Button>
        <Button
          className="w-full sm:w-auto"
          onClick={primaryAction.onClick}
        >
          {primaryAction.icon && <span className="mr-2 h-4 w-4">{primaryAction.icon}</span>}
          {primaryAction.text}
        </Button>
      </motion.div>
    </motion.div>
  );
};