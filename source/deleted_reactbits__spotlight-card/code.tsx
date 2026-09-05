import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
  spotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = "",
  spotlightColor
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!divRef.current) return;

    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    divRef.current.style.setProperty("--mouse-x", `${x}px`);
    divRef.current.style.setProperty("--mouse-y", `${y}px`);
    
    // Only set spotlight color if explicitly provided, otherwise rely on CSS var
    if (spotlightColor) {
      divRef.current.style.setProperty("--spotlight-override", spotlightColor);
    }
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={cn("spotlight-card relative overflow-hidden rounded-[25px] flex flex-col items-start p-8 transition-colors duration-300", className)}
    >
      <style jsx>{`
        .spotlight-card {
          /* Default Theme (matches image: dark background, light text) */
          --card-bg: hsl(0, 0%, 12%); /* #1F1F1F */
          --card-border: hsl(0, 0%, 20%); /* #333333 */
          --heading-text: hsl(0, 0%, 90%); /* #E5E5E5 */
          --paragraph-text: hsl(0, 0%, 60%); /* #999999 */
          --icon-color: hsl(0, 0%, 90%); /* #E5E5E5 */
          --button-bg: hsl(0, 0%, 10%); /* #1A1A1A */
          --button-text: hsl(0, 0%, 90%); /* #E5E5E5 */
          --spotlight-default-color: rgba(255, 255, 255, 0.15);
          
          background-color: var(--card-bg);
          border: 1px solid var(--card-border);
        }

        html.dark .spotlight-card {
          /* When HTML has 'dark' class, we apply the image-matching theme */
          --card-bg: hsl(0, 0%, 12%);
          --card-border: hsl(0, 0%, 20%);
          --heading-text: hsl(0, 0%, 90%);
          --paragraph-text: hsl(0, 0%, 60%);
          --icon-color: hsl(0, 0%, 90%);
          --button-bg: hsl(0, 0%, 10%);
          --button-text: hsl(0, 0%, 90%);
          --spotlight-default-color: rgba(255, 255, 255, 0.15);
        }

        html:not(.dark) .spotlight-card {
          /* When HTML does NOT have 'dark' class (light mode), we invert the colors */
          --card-bg: hsl(0, 0%, 95%); /* Light gray background */
          --card-border: hsl(0, 0%, 80%); /* Lighter gray border */
          --heading-text: hsl(0, 0%, 20%); /* Dark gray heading */
          --paragraph-text: hsl(0, 0%, 40%); /* Darker gray paragraph */
          --icon-color: hsl(0, 0%, 20%);
          --button-bg: hsl(0, 0%, 90%); /* Lighter gray button */
          --button-text: hsl(0, 0%, 20%); /* Darker gray button text */
          --spotlight-default-color: rgba(0, 0, 0, 0.1);
        }

        .spotlight-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            600px circle at var(--mouse-x) var(--mouse-y),
            var(--spotlight-override, var(--spotlight-default-color)),
            transparent 80%
          );
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
          z-index: 0;
        }

        .spotlight-card:hover::before {
          opacity: 1;
        }
        
        .spotlight-card > * {
          position: relative;
          z-index: 1;
        }
      `}</style>
      {children}
    </div>
  );
};