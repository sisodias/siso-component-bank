"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Code2,
  Network,
  LayoutGrid,
  ShieldCheck,
} from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MeshGradient, Dithering } from "@paper-design/shaders-react";

export const Component = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  const features = [
    {
      title: "Live Sync",
      description: "Instant synchronization between all users and devices.",
      icon: Network,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Clean Codebase",
      description:
        "A modular and maintainable architecture designed for scale.",
      icon: Code2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Flexible Layouts",
      description:
        "Arrange, resize, and reflow any section with precision control.",
      icon: LayoutGrid,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Secure Infrastructure",
      description: "Enterprise-grade security baked into every layer.",
      icon: ShieldCheck,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ];

  return (
    <section className="overflow-hidden py-32">
      <div className="container flex flex-col items-center justify-center px-4">
        <p className="bg-muted px-4 py-1 text-xs uppercase">Highlights</p>
        <h2 className="relative z-20 py-2 text-center font-sans text-5xl font-semibold tracking-tighter md:py-6 lg:text-6xl">
          Minimal, Powerful, Scalable
        </h2>
        <p className="text-md text-muted-foreground mx-auto max-w-xl text-center lg:text-lg">
          Built with performance in mind and simplicity at heart.
        </p>

        <div className="relative mt-10 grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="group relative block h-full w-full p-2"
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Dithering Hover Layer */}
              <AnimatePresence mode="wait" initial={false}>
                {hovered === idx && (
                  <motion.div
                    className={cn(
                      "absolute inset-0 block h-full w-full overflow-hidden",
                      item.bgColor
                    )}
                    layoutId="hoverBackground"
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MeshGradient
                      colors={["#5200ff", "#00ffa3", "#ff7e5f", "#ffa500"]}
                      swirl={0.6}
                      distortion={0.8}
                      speed={0.15}
                      style={{ position: "absolute", inset: 0 }}
                    />
                    <Dithering
                      colors={["#ffffff", "#f2f2f2", "#e9e9e9"]}
                      intensity={0.18}
                      shape="simplex"
                      style={{ position: "absolute", inset: 0 }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <Card
                title={item.title}
                description={item.description}
                icon={item.icon}
                color={item.color}
                className="flex flex-col items-center justify-center"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Card = ({
  className,
  title,
  description,
  icon: Icon,
  color,
}: {
  className?: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) => {
  return (
    <div
      className={cn(
        "bg-muted relative z-20 flex h-full flex-col items-center justify-center gap-2 p-6 text-center",
        className
      )}
    >
      <div
        className={cn(
          "bg-background mb-4 mt-4 flex size-15 items-center justify-center p-2",
          color
        )}
      >
        <Icon />
      </div>
      <h3 className="text-lg font-medium tracking-tight">{title}</h3>
      <p className="text-muted-foreground text-center text-sm">{description}</p>

      <Button
        variant="ghost"
        className="group/btn mt-6 w-full border-none hover:opacity-50"
        asChild
      >
        <a href="#">
          Read More{" "}
          <ArrowRight className="ml-2 size-4 transition-transform group-hover/btn:translate-x-1" />
        </a>
      </Button>
    </div>
  );
};
