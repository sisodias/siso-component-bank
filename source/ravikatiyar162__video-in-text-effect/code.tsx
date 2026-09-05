import * as React from "react";
import { cn } from "@/lib/utils"; // Assuming a utility for classname merging

export interface VideoTextProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The video source URL.
   */
  src: string;
  /**
   * The text or content to be displayed with the video clip.
   */
  children: React.ReactNode;
}

const VideoText = React.forwardRef<HTMLDivElement, VideoTextProps>(
  ({ src, children, className, ...props }, ref) => {
    return (
      // Use grid to stack elements and prevent overflow.
      <div
        ref={ref}
        className={cn(
          "grid place-items-center overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Both children are placed in the same grid cell to overlap. */}
        {/* This div acts as the mask. It's forced to a light theme to make the blend mode work consistently. */}
        <div
          style={{ gridArea: "1 / 1" }}
          className="flex h-full w-full items-center justify-center bg-white text-center font-extrabold text-5xl text-black md:text-7xl lg:text-9xl uppercase"
        >
          {children}
        </div>

        <video
          // The video is placed on top of the text mask and blended.
          style={{ gridArea: "1 / 1" }}
          className="h-full w-full object-cover mix-blend-screen"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }
);

VideoText.displayName = "VideoText";

export { VideoText };
