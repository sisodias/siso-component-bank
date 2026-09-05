import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AnimatedCard({ className, ...props }: CardProps) {
  return (
    <div
      role="region"
      aria-labelledby="card-title"
      aria-describedby="card-description"
      className={cn(
        "relative rounded-xl w-[356px] border overflow-hidden group/animated-card dark:border-zinc-900 border-zinc-200 dark:bg-black bg-white shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: CardProps) {
  return (
    <div
      role="group"
      className={cn(
        "flex flex-col space-y-1.5 p-4 border-t dark:border-zinc-900 border-zinc-200",
        className,
      )}
      {...props}
    />
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn(
        "text-lg dark:text-white text-black font-semibold leading-none tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p
      className={cn(
        "text-sm text-neutral-500 dark:text-neutral-400",
        className,
      )}
      {...props}
    />
  );
}

export function CardVisual({ className, ...props }: CardProps) {
  return (
    <div
      className={cn("overflow-hidden w-[356px] h-[180px] ", className)}
      {...props}
    />
  );
}
