import React from 'react';
import { Button } from "./button";
import { cn } from "../_utils/cn"; // Assumes shadcn's utility for class merging
import { ArrowRight, Zap } from 'lucide-react';

// Define the type for the CTA buttons
export interface CTAButton {
  /** The text displayed on the button. */
  label: string;
  /** The action to perform when the button is clicked. */
  onClick: () => void;
  /** Whether the button should be disabled. */
  disabled?: boolean;
}

// --- 📦 API (Props) Definition ---
export interface HeroSectionProps {
  /** The main, attention-grabbing heading. */
  title: React.ReactNode;
  /** The supporting paragraph explaining the value proposition. */
  subtitle: React.ReactNode;
  /** Configuration for the primary call-to-action button. */
  primaryCta: CTAButton;
  /** Configuration for the secondary (outline/ghost) call-to-action button. */
  secondaryCta: CTAButton;
  /** Optional class name for the main container. */
  className?: string;
}

/**
 * A professional, enterprise-ready Hero Section for a landing page.
 * Features a strong headline, supporting text, and dual CTAs with a monochrome, theme-aware design.
 */
const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  className,
}) => {
  return (
    <section
      className={cn(
        "flex flex-col items-center justify-center min-h-[50vh] text-center p-4 sm:p-8 md:p-16 bg-background text-foreground",
        className
      )}
      role="region"
      aria-label="Product Hero Section"
    >
      <div className="max-w-4xl mx-auto">
        {/* Optional: Simple Feature Highlight Badge */}
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-6 text-muted-foreground bg-muted hover:bg-muted/70 transition-colors duration-150">
          <Zap className="h-3 w-3 mr-1.5 text-primary" aria-hidden="true" />
          Enterprise Grade Tools
        </div>

        {/* Primary Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tighter mb-4 text-foreground">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 font-normal">
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
          <Button
            size="lg"
            onClick={primaryCta.onClick}
            disabled={primaryCta.disabled}
            className="text-base font-semibold transition-shadow duration-200 shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label={primaryCta.label}
          >
            {primaryCta.label}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={secondaryCta.onClick}
            disabled={secondaryCta.disabled}
            className="text-base font-semibold transition-colors duration-150 hover:bg-accent hover:text-accent-foreground border-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={secondaryCta.label}
          >
            {secondaryCta.label}
          </Button>
        </div>
        
        {/* Placeholder for Trust/Social Proof (optional below CTAs) */}
        <p className="mt-8 text-xs text-muted-foreground">
            Trusted by teams at Fortune 500 companies.
        </p>
      </div>
    </section>
  );
};


// --- Example Usage Snippet ---

const ExampleUsage = () => {
  const handlePrimaryClick = () => console.log("Primary CTA clicked: Start Free Trial");
  const handleSecondaryClick = () => console.log("Secondary CTA clicked: View Documentation");

  return (
    <HeroSection
      title={
        <>
          The Modern Stack for {" "}
          <span className="text-primary/90 dark:text-primary">
            Data Orchestration
          </span>
        </>
      }
      subtitle="Seamlessly connect, process, and deploy your business data with a single, powerful, and unified platform built for scale and efficiency."
      primaryCta={{
        label: "Start Free Trial",
        onClick: handlePrimaryClick,
      }}
      secondaryCta={{
        label: "View Documentation",
        onClick: handleSecondaryClick,
      }}
      className="border-b"
    />
  );
};

export default ExampleUsage;