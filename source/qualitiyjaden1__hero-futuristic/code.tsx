"use client";
// Button component and utilities inlined for local use
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility to merge Tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Button style variants
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";

// QuantumHero: Main hero section for the quantum computing landing page
function QuantumHero() {
  // Animated headline state
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["revolutionary", "powerful", "next-gen"],
    []
  );

  // Cycle through animated headline words
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="fixed inset-0 w-full h-full min-h-screen min-w-screen z-[-1]">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="https://videos.pexels.com/video-files/3141208/3141208-uhd_2560_1440_25fps.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/70 z-10" />
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-screen">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col w-full">
          {/* Top Button */}
          <div>
            <Button variant="secondary" size="sm" className="gap-4 bg-cyan-800/80 text-cyan-100 shadow-md shadow-cyan-900/40 border-cyan-700 border hover:bg-cyan-700/90">
              Explore our quantum roadmap <MoveRight className="w-4 h-4" />
            </Button>
          </div>
          {/* Animated Headline and Description */}
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular text-cyan-300 drop-shadow-[0_2px_8px_rgba(0,80,80,0.4)]">
              <span className="text-cyan-400 font-bold">This is something</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {/* Animated words */}
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold text-cyan-500 drop-shadow-[0_2px_8px_rgba(0,80,80,0.5)]"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>
            {/* Description paragraph */}
            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-cyan-200 max-w-2xl text-center drop-shadow-[0_2px_4px_rgba(0,80,80,0.3)]">
              Managing quantum systems at scale is complex. Avoid traditional limitations by leveraging next-generation quantum chips, designed for precision, stability, and scalability. Our mission is to accelerate quantum computing by building the hardware foundation of tomorrow — faster, cooler, and more reliable.
            </p>
          </div>
          {/* Call-to-action Button */}
          <div className="flex flex-row gap-3">
            <Button size="lg" className="gap-4 bg-black/80 text-cyan-300 border-cyan-700 border shadow-cyan-900/40 shadow-md hover:bg-cyan-950/80 hover:text-cyan-100">
              Request a prototype <PhoneCall className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the renamed component
export { QuantumHero };
