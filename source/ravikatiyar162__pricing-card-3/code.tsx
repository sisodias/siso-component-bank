import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Check, Info, Star } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility from shadcn

// --- TOOLTIP (A lightweight, self-contained version similar to shadcn's) ---
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;


// --- PRICING CARD COMPONENT ---

interface Feature {
  name: string;
  description?: string; // Text for the tooltip
}

interface PricingCardProps {
  planName: string;
  planDescription: string;
  price: number;
  priceFrequency: string;
  features: Feature[];
  ctaText: string;
  isPopular?: boolean;
  className?: string;
}

export const PricingCard = ({
  planName,
  planDescription,
  price,
  priceFrequency,
  features,
  ctaText,
  isPopular = false,
  className,
}: PricingCardProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const cardRef = React.useRef<HTMLDivElement>(null);

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLDivElement>) {
    if (!currentTarget) return;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // Transform mouse position to a rotation value
  const rotateX = useTransform(mouseY, [0, 350], [10, -10]);
  const rotateY = useTransform(mouseX, [0, 300], [-10, 10]);

  // Apply a spring for smooth transitions
  const springConfig = { stiffness: 300, damping: 20, mass: 1 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={() => {
        mouseX.set(cardRef.current ? cardRef.current.offsetWidth / 2 : 0);
        mouseY.set(cardRef.current ? cardRef.current.offsetHeight / 2 : 0);
      }}
      style={{
        transformStyle: "preserve-3d",
        transform: "perspective(1000px)",
        rotateX: springRotateX,
        rotateY: springRotateY,
      }}
      className={cn(
        "relative w-full max-w-sm rounded-xl border bg-card text-card-foreground shadow-lg transition-shadow hover:shadow-2xl",
        className
      )}
    >
      <div className="absolute h-full w-full rounded-xl bg-gradient-to-t from-green-500/20 to-transparent blur-2xl" style={{ transform: 'translateZ(-50px)' }} />
      <div className="relative z-10 flex flex-col h-full rounded-xl bg-card p-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{planName}</h3>
            <p className="text-sm text-muted-foreground">{planDescription}</p>
          </div>
          {isPopular && (
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Star className="h-4 w-4" />
              POPULAR
            </div>
          )}
        </div>

        {/* Features */}
        <div className="my-8 space-y-3">
          <p className="text-sm font-medium">Includes</p>
          <ul className="space-y-2">
            <TooltipProvider>
              {features.map((feature) => (
                <li key={feature.name} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">{feature.name}</span>
                  {feature.description && (
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <button className="cursor-default">
                          <Info className="h-4 w-4 text-muted-foreground/50" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{feature.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </li>
              ))}
            </TooltipProvider>
          </ul>
        </div>
        
        {/* Spacer to push content to top and bottom */}
        <div className="flex-grow" />

        {/* Price & CTA */}
        <div>
            <div className="mb-4">
              <span className="text-4xl font-bold">${price}</span>
              <span className="text-sm text-muted-foreground">/{priceFrequency}</span>
            </div>
            <button className="group relative w-full rounded-lg bg-gradient-to-t from-[#27a05f] to-[#37d383] py-3 font-semibold text-white transition-shadow hover:shadow-lg">
              {ctaText}
              <ArrowRight className="inline-block h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
        </div>
      </div>
    </motion.div>
  );
};