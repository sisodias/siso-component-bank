import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../_utils/cn";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

interface WaitlistCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  title: string;
  description: string;
  footerContent?: React.ReactNode;
}

const WaitlistCard = React.forwardRef<HTMLDivElement, WaitlistCardProps>(
  ({ className, icon, title, description, footerContent, ...props }, ref) => {
    const titleId = React.useId();

    // Animation variants for the container to stagger children
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.15, // Delay between each child animation
        },
      },
    };

    // Animation variants for each child item
    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          ease: "easeOut",
        },
      },
    };

    return (
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={containerVariants}
        ref={ref}
      >
        <Card
          className={cn("w-full max-w-md text-center", className)}
          role="region"
          aria-labelledby={titleId}
          {...props}
        >
          <CardHeader className="items-center">
            <motion.div variants={itemVariants}>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                {icon}
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardTitle id={titleId}>{title}</CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.p variants={itemVariants}>
              <CardDescription className="text-base">
                {description}
              </CardDescription>
            </motion.p>
          </CardContent>
          {footerContent && (
            <CardFooter className="flex justify-center pt-4">
              <motion.div variants={itemVariants}>{footerContent}</motion.div>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    );
  }
);

WaitlistCard.displayName = "WaitlistCard";

export { WaitlistCard };