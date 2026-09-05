"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";

type AvatarSize = "sm" | "md" | "lg";
type AvatarColor = "default" | "accent" | "success" | "warning" | "danger";
type AvatarVariant = "default" | "soft";

type AvatarContextValue = {
  color: AvatarColor;
  size: AvatarSize;
  variant: AvatarVariant;
};

const AvatarContext = React.createContext<AvatarContextValue>({
  color: "default",
  size: "md",
  variant: "default",
});

const colorClassMap: Record<AvatarColor, string> = {
  default: "text-zinc-600 dark:text-zinc-300",
  accent: "text-violet-700 dark:text-violet-300",
  success: "text-emerald-700 dark:text-emerald-300",
  warning: "text-amber-700 dark:text-amber-300",
  danger: "text-rose-700 dark:text-rose-300",
};

const softColorClassMap: Record<AvatarColor, string> = {
  default: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
  accent: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-200",
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
  danger: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface AvatarRootProps
  extends Omit<React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>, "color"> {
  color?: AvatarColor;
  size?: AvatarSize;
  variant?: AvatarVariant;
}

function AvatarRoot({
  children,
  className,
  color = "default",
  size = "md",
  variant = "default",
  ...props
}: AvatarRootProps) {
  return (
    <AvatarContext.Provider value={{ color, size, variant }}>
      <AvatarPrimitive.Root
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden bg-zinc-100 dark:bg-zinc-800",
          size === "sm" && "size-8 rounded-2xl",
          size === "md" && "size-10 rounded-3xl",
          size === "lg" && "size-12 rounded-3xl",
          variant === "soft" && "bg-transparent dark:bg-transparent",
          className,
        )}
        {...props}
      >
        {children}
      </AvatarPrimitive.Root>
    </AvatarContext.Provider>
  );
}

interface AvatarImageProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> {}

function AvatarImage({ className, ...props }: AvatarImageProps) {
  return (
    <AvatarPrimitive.Image
      className={cn(
        "absolute inset-0 aspect-square size-full object-cover opacity-100 transition-opacity duration-200 motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

interface AvatarFallbackProps
  extends Omit<React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>, "color"> {
  color?: AvatarColor;
}

function AvatarFallback({ className, color, ...props }: AvatarFallbackProps) {
  const context = React.useContext(AvatarContext);
  const resolvedColor = color ?? context.color;

  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "flex size-full items-center justify-center bg-zinc-100 text-sm font-medium dark:bg-zinc-800",
        context.size === "lg" && "text-base",
        context.variant === "soft"
          ? softColorClassMap[resolvedColor]
          : colorClassMap[resolvedColor],
        className,
      )}
      data-slot="avatar-fallback"
      {...props}
    />
  );
}

const Avatar = Object.assign(AvatarRoot, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
});

export { Avatar, AvatarRoot, AvatarImage, AvatarFallback };
export type { AvatarRootProps, AvatarImageProps, AvatarFallbackProps };
