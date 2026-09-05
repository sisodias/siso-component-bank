import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { useState } from "react";

function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

interface PricingPlan {
  name: string;
  price: string;
  features: string[];
  description: string;
  buttonText: string;
  isPopular: boolean;
}

interface PricingCardProps {
  plans?: PricingPlan[];
  title?: string;
  description?: string;
}

function PricingCard({
  plans = [
    {
      name: "STARTER",
      price: "$29",
      features: [
        "Up to 5 projects",
        "Basic analytics",
        "48-hour support response",
        "Community access",
      ],
      description: "Perfect for individuals",
      buttonText: "Get Started",
      isPopular: false,
    },
    {
      name: "PROFESSIONAL",
      price: "$79",
      features: [
        "Unlimited projects",
        "Advanced analytics",
        "24-hour support response",
        "Priority support",
        "Team collaboration",
        "Custom integrations",
      ],
      description: "Ideal for growing teams",
      buttonText: "Get Started",
      isPopular: true,
    },
    {
      name: "ENTERPRISE",
      price: "$199",
      features: [
        "Everything in Professional",
        "Custom solutions",
        "Dedicated account manager",
        "1-hour support response",
        "Advanced security",
        "SLA agreement",
      ],
      description: "For large organizations",
      buttonText: "Contact Sales",
      isPopular: false,
    },
  ],
  title = "Simple, Transparent Pricing",
  description = "Choose the plan that works for you",
}: PricingCardProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="container py-20 px-4">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
          {title}
        </h2>
        <p className="text-muted-foreground text-lg">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            className="relative"
          >
            <motion.div
              animate={{
                y: hoveredIndex === index ? -8 : 0,
                scale: hoveredIndex === index ? 1.02 : 1,
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
              className={cn(
                "rounded-2xl border-2 p-8 bg-background text-center flex flex-col relative h-full",
                plan.isPopular
                  ? "border-primary shadow-lg shadow-primary/20"
                  : "border-border",
                "transition-shadow duration-300",
                hoveredIndex === index && "shadow-xl"
              )}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground py-1 px-4 rounded-full flex items-center gap-1 text-sm font-semibold">
                  <Star className="h-4 w-4 fill-current" />
                  Popular
                </div>
              )}

              <div className="flex-1 flex flex-col">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  {plan.name}
                </p>

                <div className="mb-6">
                  <span className="text-5xl font-bold tracking-tight text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground text-sm ml-2">
                    / month
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-8">
                  {plan.description}
                </p>

                <ul className="space-y-3 mb-8 text-left">
                  {plan.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + idx * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <Button
                    className={cn(
                      "w-full group relative overflow-hidden",
                      plan.isPopular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-background text-foreground hover:bg-accent"
                    )}
                    variant={plan.isPopular ? "default" : "outline"}
                  >
                    {plan.buttonText}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function PricingCardDemo() {
  return (
    <div className="min-h-screen bg-background">
      <PricingCard />
    </div>
  );
}
