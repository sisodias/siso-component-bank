import * as React from "react";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class names
import { ArrowRight } from "lucide-react";

// Define the shape of a single resource item
export interface Resource {
  imageSrc: string;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
}

// Define the props for the main component
export interface ResourceGridProps {
  title: string;
  resources: Resource[];
  className?: string;
}

const ResourceGrid = React.forwardRef<
  HTMLDivElement,
  ResourceGridProps
>(({ title, resources, className, ...props }, ref) => {
  return (
    <section 
      ref={ref}
      className={cn("w-full py-12 md:py-16 lg:py-20", className)} 
      {...props}
    >
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="mb-8 text-3xl font-bold tracking-tight text-foreground md:mb-12 md:text-4xl">
          {title}
        </h2>
        
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource, index) => (
            <div key={index} className="group flex flex-col">
              {/* Image Container with Hover Effect */}
              <div className="mb-4 overflow-hidden rounded-lg">
                <img
                  src={resource.imageSrc}
                  alt={resource.title}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
              </div>

              {/* Text Content */}
              <div className="flex flex-grow flex-col">
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  {resource.title}
                </h3>
                <p className="mb-4 flex-grow text-muted-foreground">
                  {resource.description}
                </p>
                
                {/* Call-to-action Link with Hover Effect */}
                <a
                  href={resource.linkHref}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  {resource.linkText}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

ResourceGrid.displayName = "ResourceGrid";

export { ResourceGrid };