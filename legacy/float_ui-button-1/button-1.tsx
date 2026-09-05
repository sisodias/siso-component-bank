import React from "react";

type ButtonSize = "sm" | "default" | "md" | "lg" | "xl";

interface IconButtonProps {
  size?: ButtonSize;
}

const sizeClasses: Record<ButtonSize, { button: string; icon: string }> = {
  sm: { button: "px-2.5 py-2.5", icon: "w-5 h-5" },
  default: { button: "px-3 py-3", icon: "w-5 h-5" },
  md: { button: "px-3.5 py-3.5", icon: "w-6 h-6" },
  lg: { button: "px-4 py-4", icon: "w-6 h-6" },
  xl: { button: "px-5 py-5", icon: "w-7 h-7" },
};

function IconButton({ size = "default" }: IconButtonProps) {
  return (
    <button
      className={`${sizeClasses[size].button} text-indigo-600 bg-indigo-50 rounded-lg duration-150 hover:bg-indigo-100 active:bg-indigo-200`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={sizeClasses[size].icon}
      >
        <path
          fillRule="evenodd"
          d="M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V18a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}

export default IconButton;
