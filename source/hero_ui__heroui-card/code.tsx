"use client";

import * as React from "react";

type CardVariant = "transparent" | "default" | "secondary" | "tertiary";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const variantClasses: Record<CardVariant, string> = {
  transparent: "border-none bg-transparent shadow-none",
  default:
    "border border-zinc-200 bg-white shadow-[0_16px_48px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-zinc-900 dark:shadow-[0_20px_60px_rgba(0,0,0,0.28)]",
  secondary:
    "border border-zinc-200 bg-zinc-50 shadow-[0_16px_48px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-zinc-800 dark:shadow-[0_20px_60px_rgba(0,0,0,0.28)]",
  tertiary:
    "border border-zinc-300 bg-zinc-100 shadow-[0_16px_48px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-zinc-700 dark:shadow-[0_20px_60px_rgba(0,0,0,0.28)]",
};

type CardRootProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
};

function CardRoot({
  children,
  className,
  variant = "default",
  ...props
}: CardRootProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-3 overflow-visible p-4 text-zinc-950 dark:text-zinc-50",
        "rounded-[min(32px,var(--radius-3xl,32px))]",
        variantClasses[variant],
        className,
      )}
      data-slot="card"
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col", className)}
      data-slot="card-header"
      {...props}
    />
  );
}

function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-sm font-medium leading-6 text-zinc-950 dark:text-zinc-50", className)}
      data-slot="card-title"
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm leading-5 text-zinc-500 dark:text-zinc-400", className)}
      data-slot="card-description"
      {...props}
    />
  );
}

function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-1 flex-col gap-1 text-sm", className)}
      data-slot="card-content"
      {...props}
    />
  );
}

function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-row items-center", className)}
      data-slot="card-footer"
      {...props}
    />
  );
}

const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});

export { Card, CardRoot, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export type { CardRootProps, CardVariant };
