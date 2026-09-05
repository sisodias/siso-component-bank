"use client"

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

type PresetType =
  | 'fade'
  | 'slide'
  | 'scale'
  | 'blur'
  | 'blur-slide'
  | 'zoom'
  | 'flip'
  | 'bounce'
  | 'rotate'
  | 'swing';

type AnimatedGroupProps = {
  children: ReactNode;
  className?: string;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
  preset?: PresetType;
};

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const presetVariants: Record<
  PresetType,
  { container: Variants; item: Variants }
> = {
  fade: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
  },
  slide: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
  },
  scale: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
  },
  blur: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: 'blur(4px)' },
      visible: { opacity: 1, filter: 'blur(0px)' },
    },
  },
  'blur-slide': {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: 'blur(4px)', y: 20 },
      visible: { opacity: 1, filter: 'blur(0px)', y: 0 },
    },
  },
  zoom: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, scale: 0.5 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring" as const, stiffness: 300, damping: 20 },
      },
    },
  },
  flip: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, rotateX: -90 },
      visible: {
        opacity: 1,
        rotateX: 0,
        transition: { type: "spring" as const, stiffness: 300, damping: 20 },
      },
    },
  },
  bounce: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: -50 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring" as const, stiffness: 400, damping: 10 },
      },
    },
  },
  rotate: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, rotate: -180 },
      visible: {
        opacity: 1,
        rotate: 0,
        transition: { type: "spring" as const, stiffness: 200, damping: 15 },
      },
    },
  },
  swing: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, rotate: -10 },
      visible: {
        opacity: 1,
        rotate: 0,
        transition: { type: "spring" as const, stiffness: 300, damping: 8 },
      },
    },
  },
};

function AnimatedGroup({
  children,
  className,
  variants,
  preset,
}: AnimatedGroupProps) {
  const selectedVariants = preset
    ? presetVariants[preset]
    : { container: defaultContainerVariants, item: defaultItemVariants };
  const containerVariants = variants?.container || selectedVariants.container;
  const itemVariants = variants?.item || selectedVariants.item;

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      className={cn(className)}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

export { AnimatedGroup };

interface AnimatedGradientBackgroundProps {
   /** 
    * Initial size of the radial gradient, defining the starting width. 
    * @default 110
    */
   startingGap?: number;

   /**
    * Enables or disables the breathing animation effect.
    * @default false
    */
   Breathing?: boolean;

   /**
    * Array of colors to use in the radial gradient.
    * Each color corresponds to a stop percentage in `gradientStops`.
    * @default ["#0A0A0A", "#2979FF", "#FF80AB", "#FF6D00", "#FFD600", "#00E676", "#3D5AFE"]
    */
   gradientColors?: string[];

   /**
    * Array of percentage stops corresponding to each color in `gradientColors`.
    * The values should range between 0 and 100.
    * @default [35, 50, 60, 70, 80, 90, 100]
    */
   gradientStops?: number[];

   /**
    * Speed of the breathing animation. 
    * Lower values result in slower animation.
    * @default 0.02
    */
   animationSpeed?: number;

   /**
    * Maximum range for the breathing animation in percentage points.
    * Determines how much the gradient "breathes" by expanding and contracting.
    * @default 5
    */
   breathingRange?: number;

   /**
    * Additional inline styles for the gradient container.
    * @default {}
    */
   containerStyle?: React.CSSProperties;

   /**
    * Additional class names for the gradient container.
    * @default ""
    */
   containerClassName?: string;


   /**
    * Additional top offset for the gradient container form the top to have a more flexible control over the gradient.
    * @default 0
    */
   topOffset?: number;
}

/**
 * AnimatedGradientBackground
 *
 * This component renders a customizable animated radial gradient background with a subtle breathing effect.
 * It uses `framer-motion` for an entrance animation and raw CSS gradients for the dynamic background.
 *
 *
 * @param {AnimatedGradientBackgroundProps} props - Props for configuring the gradient animation.
 * @returns JSX.Element
 */
const AnimatedGradientBackground: React.FC<AnimatedGradientBackgroundProps> = ({
   startingGap = 125,
   Breathing = false,
   gradientColors = [
      "#0A0A0A",
      "#2979FF",
      "#FF80AB",
      "#FF6D00",
      "#FFD600",
      "#00E676",
      "#3D5AFE"
   ],
   gradientStops = [35, 50, 60, 70, 80, 90, 100],
   animationSpeed = 0.02,
   breathingRange = 5,
   containerStyle = {},
   topOffset = 0,
   containerClassName = "",
}) => {



   // Validation: Ensure gradientStops and gradientColors lengths match
   if (gradientColors.length !== gradientStops.length) {
      throw new Error(
         `GradientColors and GradientStops must have the same length.
     Received gradientColors length: ${gradientColors.length},
     gradientStops length: ${gradientStops.length}`
      );
   }

   const containerRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      let animationFrame: number;
      let width = startingGap;
      let directionWidth = 1;

      const animateGradient = () => {
         if (width >= startingGap + breathingRange) directionWidth = -1;
         if (width <= startingGap - breathingRange) directionWidth = 1;

         if (!Breathing) directionWidth = 0;
         width += directionWidth * animationSpeed;

         const gradientStopsString = gradientStops
            .map((stop, index) => `${gradientColors[index]} ${stop}%`)
            .join(", ");

         const gradient = `radial-gradient(${width}% ${width+topOffset}% at 50% 20%, ${gradientStopsString})`;

         if (containerRef.current) {
            containerRef.current.style.background = gradient;
         }

         animationFrame = requestAnimationFrame(animateGradient);
      };

      animationFrame = requestAnimationFrame(animateGradient);

      return () => cancelAnimationFrame(animationFrame); // Cleanup animation
   }, [startingGap, Breathing, gradientColors, gradientStops, animationSpeed, breathingRange, topOffset]);

   return (
      <motion.div
         key="animated-gradient-background"
         initial={{
            opacity: 0,
            scale: 1.5,
         }}
         animate={{
            opacity: 1,
            scale: 1,
            transition: {
               duration: 2,
               ease: [0.25, 0.1, 0.25, 1], // Cubic bezier easing
             },
         }}
         className={`absolute inset-0 overflow-hidden ${containerClassName}`}
      >
         <div
            ref={containerRef}
            style={containerStyle}
            className="absolute inset-0 transition-transform"
         />
      </motion.div>
   );
};



export default function HeroSection_04() {
  const transitionVariants = {
    item: {
      hidden: {
        opacity: 0,
        filter: 'blur(12px)',
        y: 12,
      },
      visible: {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        transition: {
          type: 'spring',
          bounce: 0.3,
          duration: 1.5,
        },
      },
    },
  }

  return (
    <div className="relative w-full">
      <AnimatedGradientBackground />
      <div className="pt-4 pb-10 sm:pt-6 sm:pb-12 text-center">
        <div className="relative max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl text-white font-bold tracking-tight">
            Innovation Meets Simplicity
          </h1>
          <p className="mt-6 text-lg text-white">Discover cutting-edge solutions designed for the modern digital landscape.</p>
          <AnimatedGroup
            variants={{
              container: {
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.75,
                  },
                },
              },
            }}
            className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
            <div
              key={1}
              className="bg-foreground/10 rounded-[14px] border p-0.5">
              <Button
                asChild
                size="lg"
                className="rounded-xl px-5 text-base">
                <span className="text-nowrap">Start Building</span>
              </Button>
            </div>
            <div
              key={2}
              className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-[14px] border p-0.5">
              <Button
                asChild
                size="lg"
                className="rounded-xl px-5 text-base bg-white text-black hover:bg-black hover:text-white">
                <span className="text-nowrap">Request a demo</span>
              </Button>
            </div>
          </AnimatedGroup>
        </div>
      </div>
      <AnimatedGroup
        variants={{
          container: {
            visible: {
              transition: {
                staggerChildren: 0.05,
                delayChildren: 0.75,
              },
            },
          },
          ...transitionVariants,
        }}>
        <div className="relative -mr-56 overflow-hidden px-2 sm:mr-0">
          <div
            aria-hidden
            className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
          />
          <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-5xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
            <Image
              className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
              src="https://tailark.com/_next/image?url=%2Fmail2.png&w=3840&q=75"
              alt="app screen"
              width={2700}
              height={1440}
              unoptimized // Optional: Avoid double optimization for already optimized URLs
            />
            <Image
              className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden"
              src="https://tailark.com/_next/image?url=%2Fmail2-light.png&w=3840&q=75"
              alt="app screen"
              width={2700}
              height={1440}
              unoptimized
            />
          </div>
        </div>
      </AnimatedGroup>
    </div>
  );
};