import React, { createContext, useContext, useEffect, useState } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const RadioGroupContext = createContext<{
  value: string | undefined | null;
  onChange: (value: string) => void;
  disabled: boolean;
  required: boolean;
} | null>(null);

interface RadioGroupProps {
  label?: string;
  value: string | undefined | null;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  children?: React.ReactNode;
}

export const RadioGroup = ({
  label,
  value,
  onChange,
  disabled = false,
  required = false,
  children
}: RadioGroupProps) => {
  return (
    <RadioGroupContext.Provider value={{ value, onChange, disabled, required }}>
      {label && <span className="sr-only">{label}</span>}
      {children}
    </RadioGroupContext.Provider>
  );
};

interface RadioGroupItemProps {
  value?: string;
  children?: React.ReactNode;
}

const RadioGroupItem = ({ value, children }: RadioGroupItemProps) => {
  const context = useContext(RadioGroupContext);
  const isSelected = context?.value === value;

  return (
    <label className={twMerge(clsx(
      "flex items-center gap-2 cursor-pointer font-sans text-[13px] text-gray-1000 leading-3 group",
      context?.disabled && "cursor-not-allowed text-gray-500"
    ))}>
      <input
        type="radio"
        className="absolute w-4 h-4 opacity-0"
        checked={isSelected}
        onChange={(event) => context?.onChange(event.target.value)}
        disabled={context?.disabled}
        required={context?.required}
        name="radio-group"
        value={value}
      />
      <span
        className={twMerge(clsx(
          "w-4 h-4 bg-background-100 relative border rounded-full duration-200 after:duration-200 flex items-center justify-center after:absolute after:top-1/2 after:left-1/2 after:-translate-y-1/2 after:-translate-x-1/2 after:rounded-full after:bg-gray-1000",
          isSelected && "border-gray-1000 after:w-2 after:h-2",
          !isSelected && "border-gray-700 after:w-0 after:h-0",
          !isSelected && !context?.disabled && "group-hover:bg-gray-200 group-hover:border-gray-900",
          context?.disabled && "after:bg-gray-500 border-gray-500"
        ))}
        aria-hidden="true"
      />
      {children}
    </label>
  );
};

RadioGroup.Item = RadioGroupItem;

interface RadioProps {
  disabled?: boolean;
  required?: boolean;
  checked?: boolean;
  onChange?: (value: string) => void;
  value?: string;
}

export const Radio = ({ disabled, checked, required, onChange, value }: RadioProps) => {
  const [_checked, set_checked] = useState<boolean>(checked || false);

  useEffect(() => {
    if (typeof checked === "boolean") {
      set_checked(checked);
    }
  }, [checked]);

  const _onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <label className={twMerge(clsx(
      "flex items-center gap-2 cursor-pointer font-sans text-[13px] leading-3 group",
      disabled && "cursor-not-allowed"
    ))}>
      <input
        type="radio"
        className="absolute w-4 h-4 opacity-0"
        checked={checked}
        onChange={_onChange}
        disabled={disabled}
        required={required}
        value={value}
      />
      <span
        className={twMerge(clsx(
          "w-4 h-4 bg-background-100 relative border rounded-full duration-200 after:duration-200 flex items-center justify-center after:absolute after:top-1/2 after:left-1/2 after:-translate-y-1/2 after:-translate-x-1/2 after:rounded-full after:bg-gray-1000",
          checked && "border-gray-1000 after:w-2 after:h-2",
          !checked && "border-gray-700 after:w-0 after:h-0",
          !checked && !disabled && "group-hover:bg-gray-200 group-hover:border-gray-900",
          disabled && "after:bg-gray-500 border-gray-500"
        ))}
        aria-hidden="true"
      />
    </label>
  );
};


export const useRadio = (props: RadioProps) => {
  return { component: (<RadioGroupItem {...props} />) };
};