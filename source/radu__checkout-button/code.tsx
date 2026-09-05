"use client";

import { useState } from "react";
import clsx from "clsx";
import { MoveRight } from "lucide-react";

type ButtonVariant =
  | "ghost"
  | "white"
  | "accent"
  | "secondary"
  | "highlight"
  | "primary"
  | "base";

interface ButtonCheckoutProps {
  onClick?: () => Promise<void> | void;
  extraStyles?: string;
  variant?: ButtonVariant;
  buttonText?: string;
}

const buttonVariants: Record<ButtonVariant, string> = {
  ghost: "bg-transparent text-base-content",
  white: "bg-white text-base-content",
  accent: "text-white bg-accent hover:bg-accent/95 hover:text-white/90",
  secondary: "text-secondary-content text-base bg-secondary hover:text-base-content/75 hover:bg-secondary/75",
  highlight: "text-white text-base bg-highlight hover:text-white/90 hover:bg-highlight/95",
  primary: "text-primary-content text-base bg-primary hover:text-primary-content/90 hover:bg-primary/95",
  base: "text-base !bg-base-200 rounded-[6px] text-base-content",
};

const ButtonCheckout: React.FC<ButtonCheckoutProps> = ({
  onClick,
  extraStyles = "max-w-max",
  variant = "white",
  buttonText = "Start FREE Trial",
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const baseClasses = clsx(
    buttonVariants[variant],
    "font-display font-bold flex flex-row gap-5 px-4 py-3 w-full items-center justify-center rounded-lg whitespace-nowrap border-0 text-md transition-all duration-300 ease-in-out",
    extraStyles
  );

  const handleClick = async () => {
    if (!onClick) return;
    setIsLoading(true);
    try {
      await onClick();
    } catch (error) {
      console.error("ButtonCheckout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button id="button_checkout_action" className={baseClasses} onClick={handleClick}>
      {buttonText}
      {isLoading ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        <MoveRight
          strokeWidth={2.5}
          className="w-5 h-5 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-200"
        />
      )}
    </button>
  );
};

export default ButtonCheckout;