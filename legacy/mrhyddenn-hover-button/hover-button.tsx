// component.tsx
import * as React from "react";

export interface HoverSlatButtonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  initialText: string;
  hoverText: string;
}

const HoverSlatButton = React.forwardRef<
  HTMLDivElement,
  HoverSlatButtonProps
>(({ initialText, hoverText, className, ...props }, ref) => {
  if (initialText.length !== hoverText.length) {
    console.error("Initial and hover text must have the same length.");
    return null;
  }

  return (
    <div
      ref={ref}
      className={`group flex cursor-pointer ${className}`}
      {...props}
    >
      {initialText.split("").map((char, index) => (
        <div
          key={index}
          className="relative flex h-10 w-9 items-center justify-center overflow-hidden bg-sky-500 text-sm font-bold text-white transition-all duration-700"
        >
          <div
            className={`absolute inset-0 flex items-center justify-center bg-zinc-900 transition-transform duration-300 ${
              index % 2 === 0 ? "translate-y-full" : "-translate-y-full"
            } group-hover:translate-y-0`}
          >
            {hoverText[index]}
          </div>
          {char}
        </div>
      ))}
    </div>
  );
});

HoverSlatButton.displayName = "HoverSlatButton";

export default HoverSlatButton;