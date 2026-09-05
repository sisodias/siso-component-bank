import React from 'react';
import { cn } from '@/lib/utils'; // Assuming you have a utility for class names.

/**
 * @typedef MasonryCardData
 * @property {string} id - A unique identifier for the card.
 * @property {string} src - The URL for the image to be displayed.
 * @property {string} alt - The alternative text for the image.
 * @property {string} content - A short text content for the card.
 * @property {string} linkHref - The URL for the link.
 * @property {string} linkText - The text for the link.
 */
export interface MasonryCardData {
  id: string;
  src: string;
  alt: string;
  content: string;
  linkHref: string;
  linkText: string;
}

/**
 * @interface MasonryGridProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 * @property {MasonryCardData[]} items - An array of data objects to render as cards.
 */
export interface MasonryGridProps extends React.HTMLAttributes<HTMLDivElement> {
  items: MasonryCardData[];
}

/**
 * A component to inject the necessary CSS for the MasonryGrid animations.
 * This avoids the need for a separate CSS file.
 * @returns {JSX.Element} A style tag with the required CSS.
 */
const MasonryGridCSS = () => (
  <style>{`
    @keyframes slide-in {
      from {
        opacity: 0;
        transform: scale(0.85) rotate(calc(var(--side, 1) * (5deg * var(--amp, 1))));
      }
      to {
        opacity: 1;
        transform: scale(1) rotate(0deg);
      }
    }

    .masonry-card-wrapper {
      /* Set transform origin based on column position */
      &:nth-of-type(2n + 1) { transform-origin: 25vw 100%; }
      &:nth-of-type(2n) { transform-origin: -25vw 100%; }

      @media (min-width: 768px) {
        &:nth-of-type(4n + 1) { transform-origin: 50vw 100%; }
        &:nth-of-type(4n + 2) { transform-origin: 25vw 100%; }
        &:nth-of-type(4n + 3) { transform-origin: -25vw 100%; }
        &:nth-of-type(4n) { transform-origin: -50vw 100%; }
      }

      @media (min-width: 1024px) {
        &:nth-of-type(6n + 1) { transform-origin: 75vw 100%; }
        &:nth-of-type(6n + 2) { transform-origin: 50vw 100%; }
        &:nth-of-type(6n + 3) { transform-origin: 25vw 100%; }
        &:nth-of-type(6n + 4) { transform-origin: -25vw 100%; }
        &:nth-of-type(6n + 5) { transform-origin: -50vw 100%; }
        &:nth-of-type(6n) { transform-origin: -75vw 100%; }
      }

      /* Animation powered by CSS Scroll-Driven Animations */
      @media (prefers-reduced-motion: no-preference) {
        animation: slide-in linear both;
        animation-timeline: view();
        animation-range: entry 0% cover 15%;
      }
    }
  `}</style>
);

/**
 * A single card component within the masonry grid.
 * @param {object} props - The component props.
 * @param {MasonryCardData} props.item - The data for the card.
 * @param {string} [props.className] - Additional class names.
 * @returns {JSX.Element} The rendered card element.
 */
const MasonryCard = ({
  item,
  className,
  ...props
}: { item: MasonryCardData } & React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('grid gap-2', className)} {...props}>
    <article className="bg-card border rounded-lg shadow-md p-3 space-y-2">
      <img
        src={item.src}
        alt={item.alt}
        height={500}
        width={500}
        className="bg-muted rounded-md aspect-square object-cover w-full"
      />
      <p className="text-sm text-muted-foreground leading-tight line-clamp-2">
        {item.content}
      </p>
      <a
        href={item.linkHref}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-primary hover:underline"
      >
        {item.linkText}
      </a>
    </article>
  </div>
);

/**
 * A responsive masonry grid that animates items into view on scroll.
 * @param {MasonryGridProps} props - The component props.
 * @returns {JSX.Element} The rendered masonry grid.
 */
const MasonryGrid = React.forwardRef<HTMLDivElement, MasonryGridProps>(
  ({ items, className, ...props }, ref) => {
    return (
      <>
        <MasonryGridCSS />
        <div
          ref={ref}
          className={cn(
            'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 p-4',
            className,
          )}
          {...props}
        >
          {items.map((item, index) => (
            <MasonryCard
              key={item.id}
              item={item}
              className="masonry-card-wrapper"
              style={
                {
                  '--side': index % 2 === 0 ? 1 : -1,
                  '--amp': Math.ceil((index % 8) / 2),
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </>
    );
  },
);

MasonryGrid.displayName = 'MasonryGrid';

export { MasonryGrid, MasonryCard };