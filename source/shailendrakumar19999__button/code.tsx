"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * ============================================
 * LIVE BUTTON COMPONENT
 * ============================================
 * Reusable live streaming button with pulse animation
 */

export interface LiveButtonData {
  text?: string;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  showIcon?: boolean;
  pulseAnimation?: boolean;
  size?: "small" | "medium" | "large";
  variant?: "red" | "green" | "blue" | "purple";
  className?: string;
}

interface LiveButtonProps {
  data: LiveButtonData;
  onClick?: () => void;
  className?: string;
}

export const LiveButton: React.FC<LiveButtonProps> = ({
  data,
  onClick,
  className,
}) => {
  const {
    text = "Now Live",
    href,
    target = "_blank",
    showIcon = true,
    pulseAnimation = true,
    size = "medium",
    variant = "red",
  } = data;

  // Size classes
  const sizeClasses = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-lg",
    large: "px-8 py-4 text-xl",
  };

  const iconSizeClasses = {
    small: "w-5 h-5",
    medium: "w-7 h-7",
    large: "w-9 h-9",
  };

  // Variant classes
  const variantClasses = {
    red: {
      button: "bg-red-600 dark:bg-red-700",
      pulse: "bg-red-500 dark:bg-red-600",
    },
    green: {
      button: "bg-green-600 dark:bg-green-700",
      pulse: "bg-green-500 dark:bg-green-600",
    },
    blue: {
      button: "bg-blue-600 dark:bg-blue-700",
      pulse: "bg-blue-500 dark:bg-blue-600",
    },
    purple: {
      button: "bg-purple-600 dark:bg-purple-700",
      pulse: "bg-purple-500 dark:bg-purple-600",
    },
  };

  const ButtonContent = () => (
    <>
      {/* Pulse Animation Background */}
      {pulseAnimation && (
        <span
          className={cn(
            "absolute inset-0 rounded-full opacity-50 animate-ping",
            variantClasses[variant].pulse
          )}
        />
      )}
      
      {/* Button Text */}
      <span className="relative z-10">{text}</span>

      {/* Live Broadcast Icon */}
      {showIcon && (
        <svg
          className={cn("ml-2 relative z-10", iconSizeClasses[size])}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          fill="currentColor"
        >
          <path d="m57.931 54.658-2.216-1.289c3.743-6.432 5.721-13.821 5.721-21.368s-1.979-14.936-5.721-21.368l2.216-1.289C61.901 16.166 64 24.001 64 32c0 7.999-2.099 15.834-6.069 22.658zm-51.862 0C2.099 47.833 0 39.998 0 32S2.099 16.167 6.069 9.342l2.216 1.289C4.542 17.065 2.564 24.454 2.564 32s1.979 14.935 5.721 21.368l-2.216 1.29zm45.32-4.895-2.215-1.292c2.897-4.963 4.428-10.659 4.428-16.471 0-5.8-1.525-11.497-4.41-16.474l2.218-1.286a35.446 35.446 0 0 1 4.755 17.759c.001 6.266-1.651 12.409-4.776 17.764zm-38.778 0C9.486 44.408 7.834 38.265 7.834 32a35.431 35.431 0 0 1 4.756-17.759l2.218 1.286a32.866 32.866 0 0 0-4.41 16.474c0 5.812 1.531 11.508 4.428 16.471l-2.215 1.291zm32.278-4.9-2.218-1.284A23.127 23.127 0 0 0 45.769 32c0-4.076-1.071-8.079-3.098-11.578l2.218-1.284A25.681 25.681 0 0 1 48.332 32a25.68 25.68 0 0 1-3.443 12.863zm-25.778 0A25.69 25.69 0 0 1 15.668 32c0-4.526 1.191-8.973 3.443-12.862l2.218 1.284A23.12 23.12 0 0 0 18.231 32c0 4.075 1.071 8.079 3.098 11.579l-2.218 1.284zm12.615-4.312c-4.716 0-8.553-3.837-8.553-8.553s3.837-8.552 8.553-8.552 8.552 3.836 8.552 8.552-3.836 8.553-8.552 8.553zm0-14.541a5.996 5.996 0 0 0-5.989 5.988 5.996 5.996 0 0 0 5.989 5.989 5.995 5.995 0 0 0 5.988-5.989 5.995 5.995 0 0 0-5.988-5.988z" />
          <circle cx="31.728" cy="31.997" r="5.987" />
        </svg>
      )}
    </>
  );

  const buttonClasses = cn(
    "relative flex items-center justify-center font-semibold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-200 text-white",
    sizeClasses[size],
    variantClasses[variant].button,
    className
  );

  // Render as link if href is provided
  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className={buttonClasses}
        onClick={onClick}
      >
        <ButtonContent />
      </a>
    );
  }

  // Render as button otherwise
  return (
    <button className={buttonClasses} onClick={onClick}>
      <ButtonContent />
    </button>
  );
};
