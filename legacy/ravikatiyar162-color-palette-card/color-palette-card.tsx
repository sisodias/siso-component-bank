import * as React from 'react';
import { cn } from "../_utils/cn"; // Assuming shadcn's utility function

/**
 * Props for the ColorPaletteCard component.
 */
export interface ColorPaletteCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * An array of color hex codes (without the '#') to be displayed.
   * Recommended: 5 colors for optimal display.
   */
  colors: string[];
  /**
   * The text to display in the stats section of the card.
   */
  statsText: string;
  /**
   * An optional icon to display in the stats section. Defaults to a 'more options' icon.
   */
  icon?: React.ReactNode;
}

/**
 * A card component to display a color palette with interactive hover effects.
 * It is theme-adaptive and built to be reusable.
 */
const ColorPaletteCard = React.forwardRef<HTMLDivElement, ColorPaletteCardProps>(
  ({ className, colors, statsText, icon, ...props }, ref) => {
    // Default icon if one isn't provided via props
    const defaultIcon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={18}
        height={18}
        viewBox="0 0 18 18"
        className="fill-current"
        aria-hidden="true"
      >
        <path d="M4 7.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5S5.5 9.83 5.5 9 4.83 7.5 4 7.5zm10 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-5 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5S9.83 7.5 9 7.5z" />
      </svg>
    );

    return (
      <div
        ref={ref}
        className={cn(
          'h-[200px] w-[350px] rounded-xl overflow-hidden shadow-lg bg-card font-sans flex flex-col',
          className
        )}
        {...props}
      >
        {/* Color Palette Section */}
        <div className="flex h-[86%] w-full">
          {colors.map((color) => (
            <div
              key={color}
              className="group h-full flex-1 flex items-center justify-center text-white font-semibold tracking-wider transition-[flex] duration-200 ease-in-out hover:flex-[2]"
              style={{ backgroundColor: `#${color}` }}
            >
              <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {color.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="h-[14%] w-full bg-card text-muted-foreground flex items-center justify-between px-6">
          <span className="text-sm">{statsText}</span>
          {icon || defaultIcon}
        </div>
      </div>
    );
  }
);
ColorPaletteCard.displayName = 'ColorPaletteCard';

export { ColorPaletteCard };
