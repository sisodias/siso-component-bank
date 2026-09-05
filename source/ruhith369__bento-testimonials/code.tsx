"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star, User, Heart, ThumbsUp } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  icon?: React.ElementType;
  span?: string;
}

interface BentoTestimonialsProps {
  testimonials?: Testimonial[];
}

export function BentoTestimonials({ testimonials }: BentoTestimonialsProps) {
  const items =
    testimonials ||
    [
      {
        name: "Aarav Mehta",
        role: "Frontend Developer",
        content:
          "The UI components are elegant, lightweight, and extremely customizable. Integrating them saved me countless hours of design work.",
        icon: Star,
        span: "col-span-1 row-span-1",
      },
      {
        name: "Sophia Raj",
        role: "Product Designer",
        content:
          "I love the attention to detail — it feels modern, yet minimal. Perfect for building consistent, aesthetic interfaces.",
        icon: Heart,
        span: "col-span-1 row-span-2",
      },
      {
        name: "Rahul Verma",
        role: "Software Engineer",
        content:
          "Simple to use and very well-structured. The dark mode adaptation works flawlessly — great job!",
        icon: ThumbsUp,
        span: "col-span-2 row-span-1",
      },
      {
        name: "Elena George",
        role: "Full-Stack Developer",
        content:
          "I’ve tried many libraries, but this one strikes the perfect balance between design and developer freedom.",
        icon: User,
        span: "col-span-1 row-span-1",
      },
      {
        name: "Jason Liu",
        role: "AI Engineer",
        content:
          "The components make the entire UI feel cohesive. Everything just fits together effortlessly.",
        icon: Quote,
        span: "col-span-1 row-span-1",
      },
    ];

  return (
    <div
      className="
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
        auto-rows-[minmax(240px,auto)]
        grid-flow-dense gap-6 w-full
      "
    >
      {items.map((item, i) => {
        const Icon = item.icon || Quote;
        return (
          <Card
            key={i}
            className={`
              ${item.span}
              bg-white dark:bg-[#0D0D0D]
              border border-gray-200 dark:border-zinc-800
              shadow-sm hover:shadow-md
              transition-all duration-300 ease-in-out
              overflow-hidden flex flex-col justify-between
            `}
          >
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="flex items-start justify-between mb-4">
                <Icon className="w-5 h-5 text-gray-900 dark:text-gray-100" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed flex-1">
                {item.content}
              </p>
              <div className="mt-5">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  {item.name}
                </h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {item.role}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
