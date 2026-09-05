import * as React from 'react';
import { cn } from '@/lib/utils'; // Make sure you have this utility from shadcn/ui

/**
 * Props for the AnimatedUnderlineHero component.
 */
interface AnimatedUnderlineHeroProps {
  headlineStart: React.ReactNode;
  headlineHighlight: string;
  headlineEnd?: React.ReactNode;
  description: React.ReactNode;
  imageSrc: string;
  imageAlt?: string;
  className?: string;
}

/**
 * A responsive hero section with a two-column layout, featuring an image
 * and a headline with a self-contained animated underline effect.
 */
export const AnimatedUnderlineHero = ({
  headlineStart,
  headlineHighlight,
  headlineEnd,
  description,
  imageSrc,
  imageAlt = 'Hero section image',
  className,
}: AnimatedUnderlineHeroProps) => {
  return (
    <>
      {/* The style tag injects the keyframe animation directly into the document. */}
      {/* This makes the component self-contained. */}
      <style>
        {`
          @keyframes draw-underline {
            to {
              stroke-dashoffset: 0;
            }
          }
        `}
      </style>
      <section className={cn('container mx-auto px-4 py-16 sm:py-24', className)}>
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-20">
          {/* Content Column */}
          <div className="order-2 flex flex-col items-start text-left md:order-1">
            <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl">
              {headlineStart}
              <span className="relative inline-block whitespace-nowrap">
                {headlineHighlight}
                <svg
                  className="absolute -bottom-1 left-0 w-full text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 422 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 9C118.953 4.09421 292.852 2.45729 419 9"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: 422,
                      strokeDashoffset: 422,
                      animation: 'draw-underline 1.2s ease-out 0.4s forwards',
                    }}
                  />
                </svg>
              </span>
              {headlineEnd}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              {description}
            </p>
          </div>

          {/* Image Column */}
          <div className="order-1 md:order-2">
            <img
              src={imageSrc}
              alt={imageAlt}
              width={500}
              height={540}
              className="h-auto w-full max-w-md mx-auto object-contain"
            />
          </div>
        </div>
      </section>
    </>
  );
};