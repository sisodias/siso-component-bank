import * as React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "../_utils/cn";
import { Button, type ButtonProps } from "./button";

interface PromoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  title: React.ReactNode;
  buttonText: string;
  buttonVariant?: ButtonProps["variant"];
  onButtonClick: () => void;
  onClose: () => void;
  showLoader?: boolean;
}

const PromoCard = React.forwardRef<HTMLDivElement, PromoCardProps>(
  (
    {
      className,
      label,
      title,
      buttonText,
      buttonVariant = "secondary",
      onButtonClick,
      onClose,
      showLoader = true,
      ...props
    },
    ref
  ) => {
    // CSS keyframes for the loader animation are embedded here.
    const keyframes = `
      @keyframes promo-card-loader-pulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
    `;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={cn(
          "relative w-full max-w-md overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-lg",
          className
        )}
        aria-labelledby="promo-card-title"
        role="dialog"
        aria-modal="true"
        {...props}
      >
        <style>{keyframes}</style>

        {/* SVG filter for the grainy texture. It's visually hidden but applied via CSS. */}
        <svg
          className="pointer-events-none absolute -z-10 h-0 w-0"
          aria-hidden="true"
        >
          <filter id="grainy">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
        </svg>

        {/* Grainy texture overlay */}
        <div
          className="absolute inset-0 z-0 opacity-[0.03]"
          style={{ filter: "url(#grainy)" }}
        />

        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-20 h-8 w-8 rounded-full"
          onClick={onClose}
          aria-label="Close promotion"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="relative z-10 flex h-full flex-col p-8">
          {/* Animated Loader */}
          {showLoader && (
            <div className="absolute left-6 top-6 flex items-center space-x-1">
              <span
                className="h-1.5 w-4 rounded-full bg-muted-foreground"
                style={{ animation: `promo-card-loader-pulse 1.5s infinite` }}
              />
              <span
                className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                style={{ animation: `promo-card-loader-pulse 1.5s infinite 0.2s` }}
              />
              <span
                className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                style={{ animation: `promo-card-loader-pulse 1.5s infinite 0.4s` }}
              />
            </div>
          )}

          <div className="mt-8 flex-grow">
            <p className="mb-2 text-sm font-medium text-muted-foreground">{label}</p>
            <h2
              id="promo-card-title"
              className="text-3xl font-bold tracking-tight text-foreground"
            >
              {title}
            </h2>
          </div>

          <div className="mt-8 flex-shrink-0">
            <Button
              className="w-full sm:w-auto"
              size="lg"
              variant={buttonVariant}
              onClick={onButtonClick}
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }
);

PromoCard.displayName = "PromoCard";

export { PromoCard };