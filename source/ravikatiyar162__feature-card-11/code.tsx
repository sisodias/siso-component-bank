import * as React from "react"
import { cn } from "@/lib/utils"

// Define the shape of the component's props
interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  // Use a string for the image source
  imageSrc: string
  // Optional link for the "Learn more" section
  href?: string
}

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ className, title, imageSrc, href, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-start space-y-4 p-6 rounded-xl border border-input shadow-sm transition-colors duration-300",
          "bg-card text-card-foreground",
          "hover:border-primary/50", // Subtle border change on hover
          className
        )}
        {...props}
      >
        {/* The Image/Icon Section */}
        <div className="w-full h-auto flex justify-end">
          {/* We'll make the image container relative to position the image
               and ensure it takes up visual space. */}
          <div className="relative w-full h-[100px]">
             {/*  */}
            <img
              src={imageSrc}
              alt={title}
              className="absolute right-0 bottom-0 max-w-[100px] max-h-full object-contain"
            />
          </div>
        </div>
        
        {/* The Content Section */}
        <div className="flex flex-col items-start space-y-2 pt-4">
          <h3 className="text-xl font-semibold leading-snug">{title}</h3>
          
          {/* "Learn more" link styled to match the theme's text-primary */}
          <a
            href={href}
            className="text-sm text-primary transition-all duration-300 group inline-flex items-center hover:translate-x-0.5"
            onClick={(e) => {
              // Prevent navigation if href is not provided, for demo purposes
              if (!href) e.preventDefault();
            }}
          >
            Learn more
            {/* Simple arrow icon */}
            <svg
              className="ml-1 w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    )
  }
)

FeatureCard.displayName = "FeatureCard"

export { FeatureCard }

// A utility component to wrap the cards in a grid
// This is not part of the required component file, but helps in making the demo file cleaner and the grid reusable.
// For the purpose of the guidelines, I will include the grid styling in the demo.tsx, but in a real-world scenario, this would be a separate Grid component.
// I will proceed to make the FeatureGrid component in the demo file as per the requirement of having only one component in feature-card.tsx