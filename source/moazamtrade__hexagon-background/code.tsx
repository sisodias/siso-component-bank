import * as React from 'react';
import { cn } from '@/lib/utils';

export type HexagonBackgroundProps = React.HTMLAttributes<HTMLDivElement> & {
  hexagonProps?: React.HTMLAttributes<HTMLDivElement>;
  hexagonSize?: number;
  hexagonMargin?: number;
};

export function HexagonBackground({
  className,
  children,
  hexagonProps,
  hexagonSize = 75,
  hexagonMargin = 3,
  ...props
}: HexagonBackgroundProps) {
  // Derived geometry
  const hexagonWidth = hexagonSize;
  const hexagonHeight = hexagonSize * 1.1;
  const rowSpacing = hexagonSize * 0.8;
  const baseMarginTop = -36 - 0.275 * (hexagonSize - 100);
  const computedMarginTop = baseMarginTop + hexagonMargin;
  const oddRowMarginLeft = -(hexagonSize / 2);
  const evenRowMarginLeft = hexagonMargin / 2;

  const [gridDimensions, setGridDimensions] = React.useState({ rows: 0, columns: 0 });

  const updateGridDimensions = React.useCallback(() => {
    if (typeof window === 'undefined') return;
    const rows = Math.ceil(window.innerHeight / rowSpacing);
    const columns = Math.ceil(window.innerWidth / hexagonWidth) + 1;
    setGridDimensions({ rows, columns });
  }, [rowSpacing, hexagonWidth]);

  React.useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateGridDimensions);
    };

    updateGridDimensions();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', onResize, { passive: true });
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', onResize);
      }
      cancelAnimationFrame(raf);
    };
  }, [updateGridDimensions]);

  return (
    <div
      data-slot="hexagon-background"
      className={cn('relative size-full overflow-hidden bg-neutral-100 dark:bg-neutral-900', className)}
      {...props}
    >
      {/* Expose margin as CSS var for pseudo-elements */}
      <style>{`:root { --hexagon-margin: ${hexagonMargin}px; }`}</style>

      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: gridDimensions.rows }).map((_, rowIndex) => {
          const isEvenRow = (rowIndex + 1) % 2 === 0;
          const rowMarginLeft = (isEvenRow ? evenRowMarginLeft : oddRowMarginLeft) - 10;

          return (
            <div
              key={`row-${rowIndex}`}
              style={{ marginTop: computedMarginTop, marginLeft: rowMarginLeft }}
              className="inline-flex"
            >
              {Array.from({ length: gridDimensions.columns }).map((_, colIndex) => (
                <div
                  key={`hexagon-${rowIndex}-${colIndex}`}
                  {...hexagonProps}
                  style={{
                    width: hexagonWidth,
                    height: hexagonHeight,
                    marginLeft: hexagonMargin,
                    ...hexagonProps?.style,
                  }}
                  className={cn(
                    'relative',
                    // Hexagon clip-path
                    '[clip-path:polygon(50%_0%,_100%_25%,_100%_75%,_50%_100%,_0%_75%,_0%_25%)]',
                    // Outer layer (before)
                    "before:content-[''] before:absolute before:inset-0 before:w-full before:h-full before:transition-all before:duration-1000 before:opacity-100 before:bg-white dark:before:bg-neutral-950",
                    // Inner layer (after) inset by CSS var
                    "after:content-[''] after:absolute after:inset-[var(--hexagon-margin)] after:bg-white dark:after:bg-neutral-950",
                    'after:[clip-path:polygon(50%_0%,_100%_25%,_100%_75%,_50%_100%,_0%_75%,_0%_25%)]',
                    // Hover states
                    'hover:before:bg-neutral-200 dark:hover:before:bg-neutral-800 hover:before:opacity-100 hover:before:duration-0',
                    'hover:after:bg-neutral-100 dark:hover:after:bg-neutral-900 hover:after:opacity-100 hover:after:duration-0',
                    hexagonProps?.className
                  )}
                />
              ))}
            </div>
          );
        })}
      </div>

      {children}
    </div>
  );
}

export default HexagonBackground;