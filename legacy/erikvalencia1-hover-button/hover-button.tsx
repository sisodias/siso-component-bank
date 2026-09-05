"use client";

import { cn } from "../_utils/cn";

export const Component = () => {
  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center",
        "h-[56px] pl-6 pr-14 py-1 font-medium",
        "bg-neutral-900 text-neutral-50 overflow-hidden"
      )}
    >
      {/* Text label */}
      <span className="z-10 pr-2">Hover me</span>

      {/* Expanding background with arrow */}
      <div
        className={cn(
          "absolute right-1 flex h-12 w-12 items-center justify-end",
          "bg-neutral-700 transition-[width]",
          "group-hover:w-[calc(100%-8px)]"
        )}
      >
        <div className="mr-3.5 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-neutral-50"
            viewBox="0 0 15 15"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.15 3.15a.5.5 0 0 1 .7 0l4 4a.5.5 0 0 1 0 .7l-4 4a.5.5 0 0 1-.7-.7L11.3 8H2.5a.5.5 0 0 1 0-1h8.8L8.15 3.85a.5.5 0 0 1 0-.7Z"
            />
          </svg>
        </div>
      </div>
    </button>
  );
};
