"use client";

import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ScrollRevealTextProps {
  text: string;
  className?: string;
  highlightColor?: string;
  dimColor?: string;
}

function Word({
  word,
  range,
  progress,
  highlightColor,
  dimColor,
}: {
  word: string;
  range: [number, number];
  progress: any;
  highlightColor: string;
  dimColor: string;
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const color = useTransform(progress, range, [dimColor, highlightColor]);
  const blur = useTransform(progress, range, [3, 0]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <motion.span className="inline-block mr-[0.3em]" style={{ opacity, color, filter }}>
      {word}
    </motion.span>
  );
}

function Paragraph({
  text,
  scrollYProgress,
  startProgress,
  endProgress,
  highlightColor,
  dimColor,
  className,
}: {
  text: string;
  scrollYProgress: any;
  startProgress: number;
  endProgress: number;
  highlightColor: string;
  dimColor: string;
  className?: string;
}) {
  const words = text.split(" ");

  return (
    <p className={className}>
      {words.map((word, i) => {
        const wordStart =
          startProgress + (i / words.length) * (endProgress - startProgress);
        const wordEnd =
          startProgress +
          ((i + 1) / words.length) * (endProgress - startProgress);

        return (
          <Word
            key={`${word}-${i}`}
            word={word}
            range={[wordStart, wordEnd]}
            progress={scrollYProgress}
            highlightColor={highlightColor}
            dimColor={dimColor}
          />
        );
      })}
    </p>
  );
}

export function Component({
  text,
  className,
  highlightColor = "hsl(var(--foreground))",
  dimColor = "hsl(var(--muted-foreground))",
}: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"],
  });

  const paragraphs = text.split("\n").filter((p) => p.trim().length > 0);

  return (
    <div
      ref={containerRef}
      className={cn("w-full max-w-3xl mx-auto px-6 py-40", className)}
    >
      <div className="space-y-8">
        {paragraphs.map((para, i) => {
          const paraStart = i / paragraphs.length;
          const paraEnd = (i + 1) / paragraphs.length;

          return (
            <Paragraph
              key={i}
              text={para}
              scrollYProgress={scrollYProgress}
              startProgress={paraStart}
              endProgress={paraEnd}
              highlightColor={highlightColor}
              dimColor={dimColor}
              className="text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.2] md:leading-[1.15]"
            />
          );
        })}
      </div>
    </div>
  );
}