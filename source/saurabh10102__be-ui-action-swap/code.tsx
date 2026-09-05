"use client";

import { useState, type ReactNode } from "react";

export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}

export type ActionSwapButtonSize = "sm" | "md" | "lg";
export type ActionSwapButtonVariant = "primary" | "secondary" | "ghost";
export type ActionSwapAnimation = "cascade";

export interface ActionSwapItem {
  id: string;
  label: string;
  icon?: ReactNode;
  ariaLabel?: string;
}

export interface ActionSwapButtonProps {
  items: ActionSwapItem[];
  size?: ActionSwapButtonSize;
  variant?: ActionSwapButtonVariant;
  animation?: ActionSwapAnimation;
  className?: string;
  onClick?: (item: ActionSwapItem) => void;
}

export interface ActionSwapTextProps {
  items: ActionSwapItem[];
  animation?: ActionSwapAnimation;
  className?: string;
}

export interface ActionSwapIconProps {
  items: ActionSwapItem[];
  animation?: ActionSwapAnimation;
  className?: string;
}

const sizeClasses: Record<ActionSwapButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

const variantClasses: Record<ActionSwapButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "bg-transparent text-foreground hover:bg-muted",
};

export function ActionSwapButton({
  items,
  size = "md",
  variant = "primary",
  className,
  onClick,
}: ActionSwapButtonProps) {
  const [index, setIndex] = useState(0);
  const item = items[index] ?? items[0];

  if (!item) return null;

  const handleClick = () => {
    onClick?.(item);
    setIndex((current) => (current + 1) % items.length);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={item.ariaLabel ?? item.label}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
    >
      <span
        key={`${item.id}-icon`}
        className="inline-flex shrink-0 animate-[action-swap-in_180ms_ease-out]"
      >
        {item.icon}
      </span>
      <span
        key={`${item.id}-label`}
        className="animate-[action-swap-in_180ms_ease-out]"
      >
        {item.label}
      </span>
      <style>
        {`@keyframes action-swap-in{from{opacity:0;transform:translateY(6px);filter:blur(4px)}to{opacity:1;transform:translateY(0);filter:blur(0)}}`}
      </style>
    </button>
  );
}

export function ActionSwapText({
  items,
  className,
}: ActionSwapTextProps) {
  const [index, setIndex] = useState(0);
  const item = items[index] ?? items[0];

  if (!item) return null;

  return (
    <button
      type="button"
      onClick={() => setIndex((current) => (current + 1) % items.length)}
      className={cn("inline-flex text-sm font-medium", className)}
    >
      <span key={item.id} className="animate-[action-swap-in_180ms_ease-out]">
        {item.label}
      </span>
      <style>
        {`@keyframes action-swap-in{from{opacity:0;transform:translateY(6px);filter:blur(4px)}to{opacity:1;transform:translateY(0);filter:blur(0)}}`}
      </style>
    </button>
  );
}

export function ActionSwapIcon({
  items,
  className,
}: ActionSwapIconProps) {
  const [index, setIndex] = useState(0);
  const item = items[index] ?? items[0];

  if (!item) return null;

  return (
    <button
      type="button"
      onClick={() => setIndex((current) => (current + 1) % items.length)}
      aria-label={item.ariaLabel ?? item.label}
      className={cn("inline-flex items-center justify-center", className)}
    >
      <span key={item.id} className="animate-[action-swap-in_180ms_ease-out]">
        {item.icon}
      </span>
      <style>
        {`@keyframes action-swap-in{from{opacity:0;transform:translateY(6px);filter:blur(4px)}to{opacity:1;transform:translateY(0);filter:blur(0)}}`}
      </style>
    </button>
  );
}

export type ActionSwapCascadeButtonProps = Omit<
  ActionSwapButtonProps,
  "animation"
>;

export type ActionSwapCascadeTextProps = Omit<
  ActionSwapTextProps,
  "animation"
>;

export type ActionSwapCascadeIconProps = Omit<
  ActionSwapIconProps,
  "animation"
>;

export function ActionSwapCascadeButton(
  props: ActionSwapCascadeButtonProps,
) {
  return <ActionSwapButton {...props} animation="cascade" />;
}

export function ActionSwapCascadeText(props: ActionSwapCascadeTextProps) {
  return <ActionSwapText {...props} animation="cascade" />;
}

export function ActionSwapCascadeIcon(props: ActionSwapCascadeIconProps) {
  return <ActionSwapIcon {...props} animation="cascade" />;
}