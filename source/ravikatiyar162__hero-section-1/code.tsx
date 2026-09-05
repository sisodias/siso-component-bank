// hero-with-typing-animation.tsx
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility from shadcn/ui

// --- REUSABLE UI COMPONENTS (Normally in components/ui/) ---

// 1. TypingAnimation Component Logic
export interface TypingAnimationProps extends React.HTMLAttributes<HTMLSpanElement> {
  staticText?: string;
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export const TypingAnimation = React.forwardRef<HTMLSpanElement, TypingAnimationProps>(
  (
    {
      className,
      staticText = "",
      words,
      typingSpeed = 150,
      deletingSpeed = 100,
      pauseDuration = 1200,
      ...props
    },
    ref,
  ) => {
    const [wordIndex, setWordIndex] = React.useState(0);
    const [text, setText] = React.useState("");
    const [isDeleting, setIsDeleting] = React.useState(false);

    React.useEffect(() => {
      if (!words || words.length === 0) return;
      const currentWord = words[wordIndex];
      const speed = isDeleting ? deletingSpeed : typingSpeed;

      const handleTyping = () => {
        if (isDeleting) {
          setText(currentWord.substring(0, text.length - 1));
        } else {
          setText(currentWord.substring(0, text.length + 1));
        }

        if (!isDeleting && text === currentWord) {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        } else if (isDeleting && text === "") {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      };

      const timeout = setTimeout(handleTyping, speed);
      return () => clearTimeout(timeout);
    }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

    return (
      <h1
        className={cn(
          "text-4xl z-30 font-bold tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl",
          className,
        )}
        ref={ref}
        {...props}
      >
        {staticText && <span>{staticText}&nbsp;</span>}
        <span
          className={cn(
            "text-white",
            "inline-block border-r-4 border-r-foreground animate-[blink-caret_0.8s_infinite_step-end]",
          )}
          aria-live="polite"
        >
          {text}
        </span>
      </h1>
    );
  },
);
TypingAnimation.displayName = "TypingAnimation";


// 2. BackgroundVideoHero Component Logic
export interface BackgroundVideoHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  videoSrc: string;
  posterSrc?: string;
  children: React.ReactNode;
}

export const BackgroundVideoHero = React.forwardRef<HTMLDivElement, BackgroundVideoHeroProps>(
  ({ className, videoSrc, posterSrc, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn("relative flex h-screen w-full items-center justify-center overflow-hidden", className)}
        {...props}
      >
        <video
          key={videoSrc}
          poster={posterSrc}
          className="absolute left-0 top-0 -z-10 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div
          className={cn(
            "absolute left-0 top-0 z-0 h-full w-full",
            "bg-[linear-gradient(to_bottom,hsl(var(--background))_5%,transparent_30%,transparent_70%,hsl(var(--background))_95%)]"
          )}
        />
        <div className="z-10 w-full px-4">
          {children}
        </div>
      </section>
    );
  }
);
BackgroundVideoHero.displayName = "BackgroundVideoHero";

