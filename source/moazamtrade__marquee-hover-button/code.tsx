import * as React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

export type Button23Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
  className?: string;
};

export const Button23: React.FC<Button23Props> = ({
  label = "Button",
  className,
  disabled,
  ...props
}) => {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      className={clsx(
        "relative select-none outline-none",
        "inline-grid place-items-center",
        "font-black uppercase tracking-wide",
        "border overflow-hidden",
        "rounded-full px-12 py-3",
        "bg-white text-black border-neutral-200",
        "dark:bg-black dark:text-white dark:border-neutral-800",
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-white",
        "dark:focus-visible:ring-neutral-600 dark:focus-visible:ring-offset-black",
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer active:scale-[0.99]",
        "font-sans",
        className
      )}
      {...props}
    >
      <span
        className={clsx(
          "absolute inset-0 grid place-items-center",
          "transition-opacity duration-200 ease-linear",
          "group-[.btn23-hover]:opacity-0"
        )}
        data-btn23="text"
      >
        {label}
      </span>

      <span
        aria-hidden="true"
        className={clsx(
          "absolute inset-0 grid place-items-center",
          "opacity-0",
          "btn23-marquee"
        )}
        data-btn23="marquee"
      >
        {label}
      </span>
      <span
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
    </motion.button>
  );
};