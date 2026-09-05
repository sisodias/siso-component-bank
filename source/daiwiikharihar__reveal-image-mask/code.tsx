"use client";

import * as React from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useWillChange,
} from "framer-motion";

import { cn } from "@/lib/utils";

export interface RevealImageMaskProps
  extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  title?: string;
  caption?: string;
  shape?: "circle" | "rounded";
}

export const RevealImageMask = React.forwardRef<HTMLDivElement, RevealImageMaskProps>(
  function RevealImageMask(
    {
      className,
      src = "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
      alt = "Warm light pouring into a modern interior.",
      title = "Images should arrive with ceremony.",
      caption = "A mask that blooms from a restrained shape into a full editorial frame as the page advances.",
      shape = "circle",
      ...props
    },
    ref,
  ) {
    const localRef = React.useRef<HTMLDivElement | null>(null);
    const shouldReduceMotion = useReducedMotion();
    const willChange = useWillChange();
    const { scrollYProgress } = useScroll({
      target: localRef,
      offset: ["start 85%", "end 15%"],
    });
    const progress = useSpring(scrollYProgress, {
      stiffness: 170,
      damping: 24,
      mass: 0.95,
    });
    const radius = useTransform(progress, [0, 1], shape === "circle" ? ["16%", "75%"] : ["10%", "0%"]);
    const inset = useTransform(progress, [0, 1], ["30%", "0%"]);

    return (
      <div
        ref={(node) => {
          localRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          "rounded-[2.5rem] bg-[color:var(--color-surface)] p-4 md:p-6",
          className,
        )}
        {...props}
      >
        <div className="mb-6 space-y-3 px-2">
          <p className="text-xs uppercase tracking-[0.4em] text-foreground/45">
            Reveal image mask
          </p>
          <h3 className="max-w-3xl text-4xl font-semibold tracking-[-0.06em] text-foreground md:text-5xl">
            {title}
          </h3>
          <p className="max-w-2xl text-sm leading-7 text-foreground/65">{caption}</p>
        </div>
        <motion.div
          style={
            shouldReduceMotion
              ? undefined
              : {
                  clipPath:
                    shape === "circle"
                      ? useTransform(radius, (latest) => `circle(${latest} at 50% 50%)`)
                      : useTransform(
                          [radius, inset],
                          ([latestRadius, latestInset]) =>
                            `inset(${latestInset} round ${latestRadius})`,
                        ),
                  willChange,
                }
          }
          className="aspect-[16/10] overflow-hidden rounded-[2rem]"
        >
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        </motion.div>
      </div>
    );
  },
);
