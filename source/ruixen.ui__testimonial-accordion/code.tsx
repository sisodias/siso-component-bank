"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface TestimonialItem {
  id: string;
  company: string;
  stat: string;
  logo?: string;
  content?: {
    quote?: string;
    name?: string;
    role?: string;
    avatar?: string;
  };
}

export interface TestimonialConfig {
  title?: string;
  buttonText?: string;
  testimonials: TestimonialItem[];
  autoRotate?: boolean;
  rotationDelay?: number;
  showProgress?: boolean;
  progressSpeed?: number;
  className?: string;
}

export function TestimonialAccordion({
  title = "What users say",
  buttonText = "Read testimonials",
  testimonials,
  autoRotate = true,
  rotationDelay = 7000,
  showProgress = true,
  progressSpeed = 7000,
  className,
}: TestimonialConfig) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressValues, setProgressValues] = useState<number[]>(
    Array(testimonials.length).fill(0)
  );

  const progressIntervals = useRef<NodeJS.Timeout[]>([]);

  // Clear all intervals safely
  const clearAllIntervals = () => {
    progressIntervals.current.forEach(clearInterval);
    progressIntervals.current = [];
  };

  // Handle per-item progress
  useEffect(() => {
    clearAllIntervals();

    progressIntervals.current[activeIndex] = setInterval(() => {
      setProgressValues((prev) => {
        const updated = [...prev];
        updated[activeIndex] = Math.min(100, updated[activeIndex] + 100 / (progressSpeed / 100));
        return updated;
      });
    }, 100);

    return () => clearAllIntervals();
  }, [activeIndex, progressSpeed]);

  // Auto-rotation logic
  useEffect(() => {
    if (!autoRotate) return;

    const rotation = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, rotationDelay);

    return () => clearInterval(rotation);
  }, [autoRotate, rotationDelay, testimonials.length]);

  return (
    <section className={cn("w-full w-5xl mx-auto px-4 md:px-8 py-16", className)}>
      <Card className="relative overflow-hidden rounded-2xl shadow-lg border border-muted/40 bg-gradient-to-br from-background to-muted/10">
        <CardContent className="p-6 md:p-10 space-y-6">
          <Accordion type="single" collapsible value={testimonials[activeIndex]?.id}>
            {testimonials.map((item, i) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "flex items-center justify-between py-4 transition-all",
                    activeIndex === i && "text-primary font-semibold"
                  )}
                >
                  <div className="flex items-center gap-4">
                    {item.logo ? (
                      <img
                        src={item.logo}
                        alt={item.company}
                        className="size-8 rounded bg-muted object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center size-9 rounded-lg bg-muted">
                        <span className="font-semibold">{item.company[0]}</span>
                      </div>
                    )}
                    <span className="font-medium">{item.company}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">{item.stat}</span>
                </AccordionTrigger>

                {item.content && (
                  <AccordionContent className="pt-4 transition-all duration-300 ease-in-out">
                    <div className="flex flex-col md:flex-row gap-6">
                      <Avatar className="size-20 border-2 border-primary/40">
                        {item.content.avatar && (
                          <AvatarImage src={item.content.avatar} alt={item.content.name} />
                        )}
                        <AvatarFallback>
                          {item.content.name?.charAt(0) || item.company.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="space-y-3">
                        {item.content.quote && (
                          <h3 className="font-medium text-lg leading-relaxed italic text-muted-foreground">
                            “{item.content.quote}”
                          </h3>
                        )}
                        {item.content.name && (
                          <div>
                            <p className="font-semibold text-sm">{item.content.name}</p>
                            {item.content.role && (
                              <p className="text-xs text-muted-foreground">{item.content.role}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                )}
              </AccordionItem>
            ))}
          </Accordion>

          {showProgress && (
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-4">
              <Progress
                value={progressValues[activeIndex]}
                className="h-1 rounded-full transition-all duration-200 bg-muted"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
