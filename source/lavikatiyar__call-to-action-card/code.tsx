"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Interface updated to use videoSrc
interface CallToActionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  videoSrc: string;
  title: React.ReactNode;
  description: React.ReactNode;
  buttonText: string;
  onButtonClick?: () => void;
}

const CallToActionCard = React.forwardRef<
  HTMLDivElement,
  CallToActionCardProps
>(
  (
    { className, videoSrc, title, description, buttonText, onButtonClick, ...props },
    ref
  ) => {
    // Animation variants for a subtle fade-in and slide-up effect
    const cardVariants = {
      hidden: { opacity: 0, y: 30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          ease: "easeInOut",
        },
      },
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "w-full max-w-md overflow-hidden rounded-xl border bg-card text-card-foreground shadow-lg",
          className
        )}
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        {...props}
      >
        {/* Video section with a hover effect and an icon */}
        <div className="group relative">
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="aspect-video w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            aria-label="Promotional video"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 right-4 rounded-full bg-black/50 p-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Pause className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* Content section */}
        <div className="space-y-4 p-6 text-center md:p-8">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
          <Button
            onClick={onButtonClick}
            className="w-full rounded-full sm:w-auto"
            size="lg"
          >
            {buttonText}
          </Button>
        </div>
      </motion.div>
    );
  }
);

CallToActionCard.displayName = "CallToActionCard";

export { CallToActionCard };