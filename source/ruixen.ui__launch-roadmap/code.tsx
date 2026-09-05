"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Stage {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  progress: number;
  duration: string;
}

interface LaunchRoadmapProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  stages: Stage[];
}

export default function LaunchRoadmap({
  title = "Journey to Product Launch",
  subtitle = "Follow the stages that take your product from idea to market success.",
  buttonText = "Get Started",
  stages,
}: LaunchRoadmapProps) {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 md:px-8 py-16">
      {/* Header */}
      <div className="text-center space-y-3 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          {title}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
      </div>

      {/* Timeline Layout */}
      <div className="relative border-l border-muted pl-6 space-y-12">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="relative"
          >
            {/* Timeline Dot */}
            <div className="absolute -left-[10px] top-2 w-4 h-4 rounded-full bg-primary border-2 border-background"></div>

            {/* Content Card */}
            <Card
              className={cn(
                "transition-colors hover:border-primary/30 bg-background border-border shadow-sm"
              )}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{stage.id}</Badge>
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                    {stage.title}
                  </Badge>
                </div>

                <h3 className="text-lg font-semibold">{stage.subtitle}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {stage.description}
                </p>

                <div className="space-y-1.5">
                  <Progress value={stage.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{stage.duration}</span>
                    <span>{stage.progress}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="flex justify-center mt-16">
        <Button size="lg">{buttonText}</Button>
      </div>
    </section>
  );
}
