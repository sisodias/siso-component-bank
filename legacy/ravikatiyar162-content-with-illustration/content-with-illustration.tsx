import React from 'react';
import { cn } from "../_utils/cn"; // Assuming shadcn's utility function

/**
 * Props for the ContentWithIllustration component.
 * @param title - The main heading text.
 * @param highlightedText - The portion of the title to be visually highlighted.
 * @param paragraphs - An array of strings, each representing a paragraph of content.
 * @param imageSrc - URL for the main illustration.
 * @param imageAlt - Alt text for the main illustration.
 * @param iconSrc - URL for the small, animated icon.
 * @param iconAlt - Alt text for the animated icon.
 * @param className - Optional additional CSS classes.
 */
interface ContentWithIllustrationProps {
  title: string;
  highlightedText: string;
  paragraphs: string[];
  imageSrc: string;
  imageAlt?: string;
  iconSrc: string;
  iconAlt?: string;
  className?: string;
}

/**
 * A responsive component that displays text content alongside an illustration,
 * featuring a hand-drawn highlight effect on the title and an animated icon.
 */
export const ContentWithIllustration: React.FC<ContentWithIllustrationProps> = ({
  title,
  highlightedText,
  paragraphs,
  imageSrc,
  imageAlt = 'Illustration',
  iconSrc,
  iconAlt = 'Decorative Icon',
  className,
}) => {
  // Split the title to isolate the part to be highlighted
  const titleParts = title.split(new RegExp(`(${highlightedText})`, 'gi'));

  return (
    <section
      className={cn(
        'w-full max-w-6xl mx-auto px-4 py-12 md:py-20 font-sans',
        className
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Left Column: Text Content */}
        <div className="flex flex-col gap-6 text-left">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {titleParts.map((part, index) =>
              part.toLowerCase() === highlightedText.toLowerCase() ? (
                <span key={index} className="relative inline-block whitespace-nowrap">
                  {/* The hand-drawn circle SVG */}
                  <svg
                    aria-hidden="true"
                    className="absolute top-1/2 left-1/2 w-[115%] h-[160%] -translate-x-1/2 -translate-y-1/2 text-primary/80 dark:text-primary/60 pointer-events-none"
                    viewBox="0 0 200 60"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10,30 C20,5, 180,5, 190,30 C180,55, 20,55, 10,30 Z"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {part}
                </span>
              ) : (
                part
              )
            )}
          </h2>
          <div className="flex flex-col gap-4 text-base md:text-lg text-muted-foreground">
            {paragraphs.map((text, index) => (
              <p key={index}>{text}</p>
            ))}
          </div>
        </div>

        {/* Right Column: Illustration */}
        <div className="relative flex justify-center items-center h-full">
          <img
            src={iconSrc}
            alt={iconAlt}
            className="absolute top-0 right-0 md:right-10 w-16 h-16 animate-subtle-spin"
            aria-hidden="true"
          />
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full max-w-sm h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
};