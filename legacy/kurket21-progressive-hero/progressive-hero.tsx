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

// Button style variants (updated for red theme)
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-sans tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-red-700 text-white hover:bg-red-800 border border-red-800",
        secondary:
          "bg-black/70 text-red-300 border border-red-700 hover:bg-red-900/80 hover:text-white",
        outline:
          "border border-red-700 bg-transparent text-red-300 hover:bg-red-900/60 hover:text-white",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-md px-4 text-sm",
        lg: "h-12 rounded-md px-10 text-lg",
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

// DarkProjectHero: Main hero section for the VividCore landing page
function DarkProjectHero() {
  // Animated headline state
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["vivid", "progressive", "limitless"],
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
    <div className="fixed inset-0 w-full h-full min-h-screen min-w-screen z-[-1] font-sans">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="https://videos.pexels.com/video-files/18526841/uhd_30fps.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/80 z-10" />
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-screen">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col w-full">
          {/* Top Button */}
          <div>
            <Button variant="secondary" size="sm" className="gap-4 shadow-md shadow-red-900/40">
              Explore VividCore vision <MoveRight className="w-4 h-4" />
            </Button>
          </div>
          {/* Animated Headline and Description */}
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tight text-center font-extrabold text-red-400 drop-shadow-[0_2px_16px_rgba(255,0,0,0.7)] font-sans">
              <span className="text-red-500 font-extrabold">Welcome to</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {/* Animated words */}
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-extrabold text-orange-400 drop-shadow-[0_2px_16px_rgba(255,80,0,0.7)] font-sans"
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
            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-red-200 max-w-2xl text-center drop-shadow-[0_2px_8px_rgba(255,0,0,0.4)] font-sans">
              VividCore is igniting the future of computation with vibrant, progressive  technology.Join us as we shape a world where energy, speed, and creativity converge.
            </p>
          </div>
          {/* Call-to-action Button */}
          <div className="flex flex-row gap-3">
            <Button size="lg" variant="outline" className="gap-4 shadow-md shadow-red-900/40">
              Request a VividCore  <PhoneCall className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the renamed component
export { DarkProjectHero };
