import React, { useState } from "react";
import { Error } from "./error";
import clsx from "clsx";

interface TextareaProps {
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  size?: "xSmall" | "small" | "mediumSmall" | "large";
  style?: React.CSSProperties;
  value?: string;
  onChange?: (value?: string) => void;
  className?: string;
  ref?: React.Ref<HTMLTextAreaElement>;
}

export const Textarea = ({
  defaultValue,
  placeholder,
  disabled,
  error,
  size,
  style,
  value,
  onChange,
  className,
  ref
}: TextareaProps) => {
  const [_value, set_value] = useState(value);

  const _onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    set_value(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <textarea
        className={clsx(
          "rounded-md resize-none font-sans bg-background-100 text-geist-foreground placeholder:text-gray-900 outline-none w-full duration-150 border border-gray-alpha-400 hover:border-gray-alpha-500 hover:ring-0",
          size === "large" ? "h-12 py-2.5 px-3 text-base" : "h-10 p-2.5 text-sm",
          disabled && "bg-gray-100 text-gray-700 placeholder:text-gray-700 placeholder:opacity-50 cursor-not-allowed",
          error ? "ring-red-300 ring-4 border-red-900 text-error" : "focus:border-gray-alpha-600 focus:shadow-focus-input",
          className
        )}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        style={style}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        value={_value}
        onChange={_onChange}
        ref={ref}
      />
      {error && <Error size={size === "large" ? "large" : "small"}>{error}</Error>}
    </div>
  );
};