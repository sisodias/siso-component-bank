import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";

import { cn } from "../_utils/cn"; // Your utility for merging class names
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Card, CardContent } from "./card";

// Define the shape of a single testimonial
export interface Testimonial {
  type: "user" | "quote";
  quote: string;
  name?: string;
  role?: string;
  avatarSrc?: string;
  avatarFallback?: string;
}

// Define props for the main section component
interface TestimonialSectionProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  testimonials: Testimonial[];
}

const QuoteIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="48"
    height="36"
    viewBox="0 0 48 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M14.9951 36C12.4951 36 10.2285 35.0167 8.19513 33.05C6.1618 31.0833 5.14513 28.8333 5.14513 26.3C5.14513 22.8 6.2118 19.4833 8.34513 16.35C10.4785 13.2167 13.2285 10.1 16.5951 7L21.4951 11.25C19.3618 13.1333 17.6785 14.8833 16.4451 16.5C15.2118 18.1167 14.5951 19.9833 14.5951 22.1H19.9951V36H14.9951ZM37.9951 36C35.4951 36 33.2285 35.0167 31.1951 33.05C29.1618 31.0833 28.1451 28.8333 28.1451 26.3C28.1451 22.8 29.2118 19.4833 31.3451 16.35C33.4785 13.2167 36.2285 10.1 39.5951 7L44.4951 11.25C42.3618 13.1333 40.6785 14.8833 39.4451 16.5C38.2118 18.1167 37.5951 19.9833 37.5951 22.1H42.9951V36H37.9951Z"
      fill="currentColor"
    />
  </svg>
);

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const isQuoteType = testimonial.type === 'quote';

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <Card
        className={cn(
          "h-full w-full transform-gpu transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
           // Different styling for the central quote card
          isQuoteType && "flex flex-col items-center justify-center bg-transparent shadow-none border-none text-center"
        )}
      >
        <CardContent className="flex flex-col items-start gap-4 p-6 h-full">
          {isQuoteType ? (
            <>
              <QuoteIcon className="h-9 w-12 text-muted-foreground/50" />
              <p className="text-xl font-medium leading-relaxed">
                "{testimonial.quote}"
              </p>
            </>
          ) : (
            <>
              <p className="text-muted-foreground">"{testimonial.quote}"</p>
              <div className="flex flex-row items-center gap-4 mt-auto">
                <Avatar>
                  <AvatarImage src={testimonial.avatarSrc} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.avatarFallback}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};


const TestimonialSection = React.forwardRef<
  HTMLElement,
  TestimonialSectionProps
>(({ title, testimonials, className, ...props }, ref) => {
  // Animation variants for the container and items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger the animation of children
        delayChildren: 0.1,
      },
    },
  };

  return (
    <section
      ref={ref}
      className={cn("container mx-auto py-12 md:py-24", className)}
      {...props}
    >
      <div className="flex flex-col items-center text-center gap-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">{title}</h2>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={containerVariants}
      >
        {testimonials.map((testimonial, index) => {
          // Add a special class for the middle item on large screens
          const isMiddleItem = index === Math.floor(testimonials.length / 2);
          return (
            <div key={index} className={cn(isMiddleItem && "md:col-span-2 lg:col-span-1")}>
              <TestimonialCard testimonial={testimonial} />
            </div>
          );
        })}
      </motion.div>
    </section>
  );
});

TestimonialSection.displayName = "TestimonialSection";

export { TestimonialSection };