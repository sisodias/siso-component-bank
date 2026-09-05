// components/ui/cta-card.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../_utils/cn";
import { Button } from "./button";
import { Input } from "./input";
import { ArrowRight } from "lucide-react";

// Define the props for the CtaCard component
interface CtaCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageSrc: string;
  title: string;
  description: string;
  inputPlaceholder?: string;
  buttonText: string;
  onButtonClick?: (email: string) => void;
}

const CtaCard = React.forwardRef<HTMLDivElement, CtaCardProps>(
  (
    {
      className,
      imageSrc,
      title,
      description,
      inputPlaceholder = "Email address",
      buttonText,
      onButtonClick,
      ...props
    },
    ref
  ) => {
    const [email, setEmail] = React.useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (onButtonClick) {
        onButtonClick(email);
      }
      console.log("Email submitted:", email);
    };

    // Animation variants for Framer Motion
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.2,
          delayChildren: 0.1,
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
      <div
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden rounded-xl border bg-card text-card-foreground shadow",
          className
        )}
        {...props}
      >
        {/* Background Image */}
        <img
          src={imageSrc}
          alt="Background"
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/4" />

        {/* Content */}
        <motion.div
          className="relative z-10 grid h-full grid-cols-1 items-center gap-8 p-8 md:grid-cols-2 md:p-12 lg:p-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col items-start text-left text-white">
            <motion.h2
              className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl"
              variants={itemVariants}
            >
              {title}
            </motion.h2>
            <motion.p
              className="mt-4 max-w-xl text-lg text-neutral-200"
              variants={itemVariants}
            >
              {description}
            </motion.p>
          </div>

          <motion.div className="flex w-full max-w-md flex-col items-center justify-center" variants={itemVariants}>
            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-col gap-3 sm:flex-row"
            >
              <Input
                type="email"
                placeholder={inputPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 flex-grow border-neutral-700 bg-neutral-800/50 text-white placeholder:text-neutral-400 focus:ring-offset-background"
                aria-label={inputPlaceholder}
                required
              />
              <Button
                type="submit"
                size="lg"
                className="h-12 bg-white text-black hover:bg-neutral-200"
              >
                {buttonText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    );
  }
);

CtaCard.displayName = "CtaCard";

export { CtaCard };