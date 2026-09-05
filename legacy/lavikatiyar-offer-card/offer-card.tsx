import * as React from "react";
import { cn } from "../_utils/cn"; // Assuming you have a `cn` utility from shadcn/ui
import { cva, type VariantProps } from "class-variance-authority";

// Define variants for the card using cva
const cardVariants = cva(
  "group relative flex flex-col justify-end overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg",
  {
    variants: {
      variant: {
        default: "hover:-translate-y-1 hover:scale-[1.02]",
        faded: "", // Special variant for the fade effect
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface OfferCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /**
   * The URL for the image to be displayed at the top of the card.
   */
  imageSrc: string;
  /**
   * The main title or category of the offer.
   */
  title: string;
  /**
   * The descriptive text for the offer, such as discount details.
   */
  offerText: string;
  /**
   * The URL the card should link to.
   */
  href: string;
}

const OfferCard = React.forwardRef<HTMLDivElement, OfferCardProps>(
  ({ className, variant, imageSrc, title, offerText, href, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, className }))}
        {...props}
      >
        {/* The card is a link */}
        <a href={href} className="absolute inset-0 z-10" aria-label={title}>
          <span className="sr-only">View Details</span>
        </a>

        {/* Background Image */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 flex items-center justify-center"
        >
          <img
            src={imageSrc}
            alt={`${title} illustration`}
            className="h-40 w-40 object-contain transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 mt-32">
          <h3 className="text-lg font-semibold text-card-foreground">
            {title}
          </h3>
          <p className="mt-1 text-sm font-medium text-foreground">
            {offerText}
          </p>
        </div>
      </div>
    );
  }
);
OfferCard.displayName = "OfferCard";

export { OfferCard };