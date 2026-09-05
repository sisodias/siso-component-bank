import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { MousePointer, Zap, Settings, TestTube } from "lucide-react";

const gradientButtonVariants = cva(
  [
    "gradient-button",
    "inline-flex items-center justify-center",
    "rounded-[11px] min-w-[132px] px-9 py-4",
    "text-sm leading-[19px] font-light text-white",
    "font-sans",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: "",
        variant: "gradient-button-variant",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gradientButtonVariants> {
  asChild?: boolean;
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(gradientButtonVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
GradientButton.displayName = "GradientButton";

interface AutomationFlowBuilderCardProps {
  className?: string;
}

export const AutomationFlowBuilderCard = React.forwardRef<
  HTMLDivElement,
  AutomationFlowBuilderCardProps
>(({ className, ...props }, ref) => {
  const features = [
    {
      icon: MousePointer,
      text: "Drag & drop interface",
    },
    {
      icon: Zap,
      text: "Visual flow connections",
    },
    {
      icon: Settings,
      text: "Advanced trigger configuration",
    },
    {
      icon: TestTube,
      text: "Real-time testing",
    },
  ];

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full max-w-sm mx-auto",
        "bg-black/5 dark:bg-white/5 backdrop-blur-xl",
        "border border-black/10 dark:border-white/10",
        "rounded-2xl p-8",
        "shadow-sm",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black/20 dark:focus-visible:ring-white/20",
        className
      )}
      {...props}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/5 dark:from-white/5 to-transparent rounded-2xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h2 className="text-2xl font-light text-black/90 dark:text-white/90 tracking-wide">
            Automation Flow Builder
          </h2>
          <p className="text-sm text-black/60 dark:text-white/60 leading-relaxed font-light">
            Create powerful automation workflows with our intuitive visual
            builder. Design complex processes without writing code.
          </p>
        </div>

        {/* Features checklist */}
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-shrink-0 w-1 h-1 rounded-full bg-black/40 dark:bg-white/40" />
              <div className="flex items-center gap-3 text-sm text-black/80 dark:text-white/80 font-light">
                <feature.icon
                  className="w-4 h-4 text-black/50 dark:text-white/50"
                  strokeWidth={1.5}
                />
                <span>{feature.text}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action button */}
        <div className="pt-4">
          <GradientButton className="w-full font-light">
            Enable Desktop Mode
          </GradientButton>
        </div>

        {/* Info text */}
        <p className="text-xs text-black/40 dark:text-white/40 text-center leading-relaxed font-light">
          Desktop mode provides enhanced features and better performance for
          complex workflows
        </p>
      </div>
    </div>
  );
});
AutomationFlowBuilderCard.displayName = "AutomationFlowBuilderCard";