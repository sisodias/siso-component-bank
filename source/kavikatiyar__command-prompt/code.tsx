import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUp, Mic, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Interface for each suggestion chip
interface Suggestion {
  icon: React.ReactNode;
  label: string;
  className: string; // Expecting Tailwind classes for bg, text color, etc.
}

// Props interface for the main component
export interface CommandPromptProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  placeholder: string;
  suggestions: Suggestion[];
}

const CommandPrompt = React.forwardRef<HTMLDivElement, CommandPromptProps>(
  ({ className, title, placeholder, suggestions, ...props }, ref) => {

    // Animation variants for the container to orchestrate children animations
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    };

    // Animation variants for each suggestion item
    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 100,
        },
      },
    };

    return (
      <div
        className={cn("flex flex-col items-center justify-center w-full max-w-xl mx-auto p-4", className)}
        ref={ref}
        {...props}
      >
        {/* Main Title */}
        <h2 className="text-3xl font-medium text-center text-foreground mb-6">
          {title}
        </h2>
        
        {/* Animated Suggestion Chips */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {suggestions.map((item, index) => (
            <motion.button
              key={index}
              variants={itemVariants}
              className={cn(
                "flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                item.className
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Input Bar */}
        <div className="relative w-full">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
            Quick 1.5
          </span>
          <Input
            type="text"
            placeholder={placeholder}
            className="w-full h-16 pl-[110px] pr-28 rounded-full bg-background shadow-lg border focus-visible:ring-offset-0 focus-visible:ring-2"
            aria-label={placeholder}
          />
          <div className="absolute right-[68px] top-1/2 -translate-y-1/2 flex items-center gap-4">
            <Mic className="h-5 w-5 text-muted-foreground" />
            <Plus className="h-5 w-5 text-muted-foreground" />
          </div>
          <Button 
            variant="default" 
            size="icon" 
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full h-12 w-12 bg-foreground text-background hover:bg-foreground/90"
            aria-label="Submit prompt"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }
);
CommandPrompt.displayName = "CommandPrompt";

export { CommandPrompt };