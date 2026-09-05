// components/ui/animated-integrations-card.tsx
import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Your utility for merging class names
import { Button } from "@/components/ui/button"; // Assuming a shadcn Button component

// Define the types for the component props
interface Integration {
  name: string;
  icon: string; // URL to the SVG icon
}

interface AnimatedIntegrationsCardProps {
  integrations: Integration[];
  title: React.ReactNode;
  description: string;
  mainActionLabel: string;
  statusLabel: string;
  topIcon?: React.ReactNode;
}

// Define positions for the icons on a circle
const iconPositions = [
  { top: "15%", left: "15%" },
  { top: "10%", left: "50%" },
  { top: "15%", right: "15%" },
  { top: "50%", right: "5%" },
  { top: "50%", left: "5%" },
];

export const AnimatedIntegrationsCard: React.FC<AnimatedIntegrationsCardProps> = ({
  integrations,
  title,
  description,
  mainActionLabel,
  statusLabel,
  topIcon,
}) => {
  const centralIconIndex = Math.floor(integrations.length / 2);

  return (
    <div className="relative flex w-full max-w-4xl flex-col items-center justify-center rounded-2xl p-4">
      {topIcon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border bg-background shadow-sm">
          {topIcon}
        </div>
      )}

      <h1 className="mb-12 max-w-2xl text-center text-4xl font-bold tracking-tight text-foreground md:text-5xl">
        {title}
      </h1>

      <div className="relative w-full max-w-lg">
        {/* Gradient Border Box */}
        <div
          className="absolute inset-0 -m-4 rounded-3xl"
          style={{
            background:
              "linear-gradient(120deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))",
            backgroundSize: "200% 200%",
          }}
        ></div>
        <div className="relative rounded-2xl border bg-background/80 p-8 text-center backdrop-blur-sm">
          <div className="relative mb-6 h-48">
            {/* Central Floating Icons */}
            {integrations.map((integration, index) => {
              const isCentral = index === centralIconIndex;
              const position = isCentral
                ? { top: "50%", left: "50%", x: "-50%", y: "-50%" }
                : iconPositions[index > centralIconIndex ? index - 1 : index];

              return (
                <motion.div
                  key={integration.name}
                  className={cn(
                    "absolute flex h-16 w-16 items-center justify-center rounded-2xl border bg-background shadow-lg",
                    isCentral && "h-20 w-20"
                  )}
                  style={position}
                  animate={{
                    y: [-4, 4, -4],
                    rotate: [0, index % 2 === 0 ? 2 : -2, 0],
                  }}
                  transition={{
                    duration: 2 + index * 0.4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                >
                  <img
                    src={integration.icon}
                    alt={`${integration.name} Icon`}
                    className="h-8 w-8"
                  />
                </motion.div>
              );
            })}
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            +24 Smooth
            <br />
            running interactions
          </h2>
          <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
            {description}
          </p>
          <Button variant="ghost" size="lg" className="mt-6">
            {mainActionLabel}
          </Button>
        </div>
      </div>

      {/* "CONNECTED" Pill */}
      <div className="mt-8">
        <div className="relative inline-flex items-center justify-center">
          <div
            className="absolute bottom-full mb-2 h-8 w-px bg-gradient-to-t from-orange-400 to-transparent"
            aria-hidden="true"
          ></div>
          <span
            className="rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-900"
            style={{
              background: "linear-gradient(to right, #fbbd23, #f87171)",
            }}
          >
            {statusLabel}
          </span>
        </div>
      </div>
    </div>
  );
};