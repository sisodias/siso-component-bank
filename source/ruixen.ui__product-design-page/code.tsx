"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface ExpertiseItem {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

export interface ServiceItem {
  icon: LucideIcon;
  text: string;
}

export interface ProductDesignPageProps {
  title?: string;
  description?: string;
  expertise?: ExpertiseItem[];
  services?: ServiceItem[];
  closingTitle?: string;
  closingText?: string;
  className?: string;
}

export function ProductDesignPage({
  title = "AI & ML Product Design",
  description = "We merge cutting-edge machine learning with human-centered design principles to craft intelligent, intuitive products that deliver real-world impact. Our focus is on making complex systems simple, transparent, and delightful to use.",
  expertise = [],
  services = [],
  closingTitle = "Designing for Intelligence and Clarity",
  closingText = "We collaborate with AI researchers, data scientists, and product teams to turn advanced algorithms into accessible tools that empower users and businesses alike. Every design decision balances functionality, interpretability, and trust.",
  className,
}: ProductDesignPageProps) {
  return (
    <section
      className={cn(
        "w-full max-w-5xl mx-auto px-4 md:px-8 py-16 flex flex-col items-center",
        className
      )}
    >
      {/* Header */}
      <div className="text-center mb-14">
        <Badge variant="outline" className="mb-4">
          Product Experience
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {title}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          {description}
        </p>
      </div>

      {/* Expertise Section */}
      {expertise.length > 0 && (
        <div className="w-full mb-16">
          <h2 className="text-2xl font-semibold mb-2">Core Expertise</h2>
          <p className="text-muted-foreground mb-6">
            Areas where design meets intelligence
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {expertise.map((item, index) => (
              <Card
                key={index}
                className="hover:shadow-md transition-shadow bg-card"
              >
                <CardHeader className="flex flex-row items-center gap-3">
                  <div className="flex items-center justify-center rounded-md bg-muted p-2">
                    <item.icon className="text-primary size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">
                      {item.title}
                    </CardTitle>
                    <CardDescription>{item.subtitle}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Separator className="my-10 w-full" />

      {/* Services Section */}
      {services.length > 0 && (
        <div className="w-full mb-16">
          <h2 className="text-2xl font-semibold mb-4">
            Our AI Product Design Services
          </h2>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-muted-foreground">
            {services.map((service, i) => (
              <li key={i} className="flex items-center gap-3">
                <service.icon className="size-5 text-primary" />
                {service.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Closing Section */}
      <div className="w-full mb-8">
        <h2 className="text-2xl font-semibold mb-3">{closingTitle}</h2>
        <p className="text-muted-foreground leading-relaxed">{closingText}</p>
      </div>
    </section>
  );
}
