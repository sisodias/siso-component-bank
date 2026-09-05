import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

// Interface for individual process card props
interface ProcessCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  className?: string;
}

// Reusable Process Card Component
const ProcessCard: React.FC<ProcessCardProps> = ({ icon: Icon, title, description, className }) => (
  <div className={cn("group relative w-full rounded-lg border bg-card p-6 transition-all cursor-pointer duration-300 hover:border-primary/60 hover:shadow-lg ", className)}>
    {/* Decorative Line - Visible on larger screens */}
    <div className="absolute -left-[1px] top-1/2 hidden h-1/2 w-px -translate-y-1/2 bg-border transition-colors group-hover:bg-primary/60 md:block" />
    <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-border transition-colors group-hover:bg-primary/60 md:hidden" />


    {/* Icon Container */}
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg duration-300 border bg-background text-primary shadow-sm transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
      <Icon className="h-6 w-6" />
    </div>

    {/* Content */}
    <div className="flex flex-col">
      <h3 className="mb-1 text-lg font-semibold text-card-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

// Interface for the main section props
interface ProcessSectionProps {
  subtitle: string;
  title: string;
  description: string;
  buttonText: string;
  items: ProcessCardProps[];
}

// Main Process Section Component
export const ProcessSection: React.FC<ProcessSectionProps> = ({
  subtitle,
  title,
  description,
  buttonText,
  items,
}) => {
  return (
    <section className="w-full bg-background py-16 md:py-24">
      <div className="container mx-auto grid grid-cols-1 gap-12 px-4 md:grid-cols-3 md:gap-8 lg:gap-16">
        {/* Left Content */}
        <div className="flex flex-col items-start justify-center text-center md:col-span-1 md:text-left">
          <span className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
            {subtitle}
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {title}
          </h2>
          <p className="mb-6 text-base text-muted-foreground">
            {description}
          </p>
          <Button size="lg" className="hover:scale-110 duration-300 transition-all cursor-pointer">
            {buttonText}
            <ArrowUpRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Right Content - Grid of Process Cards */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:col-span-2">
          {items.map((item, index) => (
            <ProcessCard key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};