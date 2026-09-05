import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Input } from "./input";
import clsx from "clsx";
import { Material } from "./material-1";
import { Button } from "./button-1";

const SearchIcon = () => (
  <svg
    height="16"
    strokeLinejoin="round"
    viewBox="0 0 16 16"
    width="16"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.5 6.5C1.5 3.73858 3.73858 1.5 6.5 1.5C9.26142 1.5 11.5 3.73858 11.5 6.5C11.5 9.26142 9.26142 11.5 6.5 11.5C3.73858 11.5 1.5 9.26142 1.5 6.5ZM6.5 0C2.91015 0 0 2.91015 0 6.5C0 10.0899 2.91015 13 6.5 13C8.02469 13 9.42677 12.475 10.5353 11.596L13.9697 15.0303L14.5 15.5607L15.5607 14.5L15.0303 13.9697L11.596 10.5353C12.475 9.42677 13 8.02469 13 6.5C13 2.91015 10.0899 0 6.5 0Z"
    />
  </svg>
);

const ArrowBottomIcon = ({ className }: { className?: string }) => (
  <svg
    height="16"
    strokeLinejoin="round"
    viewBox="0 0 16 16"
    width="16"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.0607 5.49999L13.5303 6.03032L8.7071 10.8535C8.31658 11.2441 7.68341 11.2441 7.29289 10.8535L2.46966 6.03032L1.93933 5.49999L2.99999 4.43933L3.53032 4.96966L7.99999 9.43933L12.4697 4.96966L13 4.43933L14.0607 5.49999Z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="16px"
    height="16px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="stroke-gray-1000"
  >
    <path
      d="M4 12.6111L8.92308 17.5L20 6.5"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CloseIcon = ({ className }: { className?: string }) => (
  <svg
    height="16"
    strokeLinejoin="round"
    viewBox="0 0 16 16"
    width="16"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.4697 13.5303L13 14.0607L14.0607 13L13.5303 12.4697L9.06065 7.99999L13.5303 3.53032L14.0607 2.99999L13 1.93933L12.4697 2.46966L7.99999 6.93933L3.53032 2.46966L2.99999 1.93933L1.93933 2.99999L2.46966 3.53032L6.93933 7.99999L2.46966 12.4697L1.93933 13L2.99999 14.0607L3.53032 13.5303L7.99999 9.06065L12.4697 13.5303Z"
    />
  </svg>
);

interface Option {
  label: string;
  value: string;
}

const ComboboxContext = createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  placeholder: string;
  inputValue: string;
  onChangeInputValue: (value: string) => void;
  value: string;
  onChangeValue: (value: string) => void;
  disabled?: boolean;
  errored?: boolean;
  size?: "small" | "medium" | "large";
  options: Option[];
  setOptions: React.Dispatch<React.SetStateAction<Option[]>>;
  inputRef?: React.RefObject<HTMLInputElement | null>;
} | null>(null);

interface ComboboxProps {
  placeholder?: string;
  value?: string | null;
  onChange?: (value: string) => void;
  disabled?: boolean;
  errored?: boolean;
  width?: number;
  size?: "small" | "medium" | "large";
  children: React.ReactNode;
}

export const Combobox = ({
  placeholder = "Search...",
  value,
  onChange,
  disabled = false,
  errored = false,
  width,
  size = "medium",
  children
}: ComboboxProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [_value, set_value] = useState<string>(value || "");
  const [options, setOptions] = useState<Option[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const onChangeInputValue = (value: string) => {
    setInputValue(value);
  };

  const onChangeValue = (value: string) => {
    set_value(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <ComboboxContext.Provider value={{
      isOpen,
      setIsOpen,
      placeholder,
      inputValue,
      onChangeInputValue,
      disabled,
      errored,
      size,
      value: _value,
      onChangeValue,
      options,
      setOptions,
      inputRef
    }}>
      <div
        className="relative w-full inline-block text-sm font-sans"
        style={{ width }}
      >
        {children}
      </div>
    </ComboboxContext.Provider>
  );
};

const ComboboxInput = () => {
  const context = useContext(ComboboxContext);
  const [_errored, set_errored] = useState<boolean>(context?.errored || false);

  const onFocus = () => {
    context?.setIsOpen(true);
    set_errored(false);
  };

  const onBlur = () => {
    context?.setIsOpen(false);
    const currentOption = context?.options.find((option) => option.value === context.value);
    if (currentOption) {
      context?.onChangeInputValue(currentOption.label);
    }
    set_errored(context?.errored || false);
  };

  const onCloseClick = () => {
    context?.onChangeInputValue("");
    context?.onChangeValue("");
  };

  useEffect(() => {
    const currentOption = context?.options.find((option) => option.value === context.value);
    if (currentOption) {
      context?.onChangeInputValue(currentOption.label);
    }
  }, [context?.options]);

  useEffect(() => {
    set_errored(context?.errored || false);
  }, [context?.errored]);

  return (
    <Input
      prefix={<SearchIcon />}
      prefixStyling={false}
      suffix={context?.inputValue ? (
        <Button
          variant="unstyled"
          svgOnly
          className="fill-gray-700 -mr-3"
          onClick={onCloseClick}
        >
          <CloseIcon className={clsx(context?.errored && "fill-red-900")} />
        </Button>
      ) : <ArrowBottomIcon className={clsx("duration-200", context?.isOpen && "rotate-180")} />}
      suffixStyling={context?.disabled ? "cursor-not-allowed" : "cursor-pointer"}
      placeholder={context?.placeholder}
      onFocus={onFocus}
      onBlur={onBlur}
      value={context?.inputValue}
      onChange={context?.onChangeInputValue}
      disabled={context?.disabled}
      error={_errored}
      size={context?.size}
      ref={context?.inputRef}
      className={clsx(context?.errored && "text-red-900")}
    />
  );
};

const ComboboxList = ({ children, maxWidth, emptyMessage = "No results" }: {
  children?: React.ReactNode,
  maxWidth?: number,
  emptyMessage?: string
}) => {
  const context = useContext(ComboboxContext);
  const [position, setPosition] = useState<{ top?: number, bottom?: number }>();
  const menuRef = useRef<HTMLDivElement>(null);

  const filteredChildren = React.Children.toArray(children).filter((child) => {
    if (React.isValidElement<ComboboxOptionProps>(child)) {
      return child.props.children?.toString().toLowerCase().includes(context?.inputValue?.toLowerCase() || "");
    }
    return false;
  });

  useEffect(() => {
    const options = filteredChildren
      .map((child) => {
        if (React.isValidElement<ComboboxOptionProps>(child)) {
          return {
            value: child.props.value,
            label: child.props.children?.toString() || ""
          };
        }
        return undefined;
      })
      .filter((option): option is Option => option !== undefined && option.label !== "");
    context?.setOptions(options);
  }, [children]);

  useEffect(() => {
    const getPosition = () => {
      if (context?.isOpen && context.inputRef && context.inputRef.current && menuRef.current) {
        const buttonRect = context.inputRef.current.getBoundingClientRect();
        const menuHeight = menuRef.current.offsetHeight;
        const viewportHeight = window.innerHeight;
        let _position;

        if (buttonRect.bottom + menuHeight <= viewportHeight) {
          _position = { top: buttonRect.height + 28 };
        } else if (buttonRect.top - menuHeight >= 0) {
          _position = { bottom: buttonRect.height + 28 };
        } else {
          _position = { top: buttonRect.height + 28 };
        }

        setPosition(_position);
      }
    };

    getPosition();

    window.addEventListener("resize", getPosition);
    window.addEventListener("scroll", getPosition);

    return () => {
      window.removeEventListener("resize", getPosition);
      window.removeEventListener("scroll", getPosition);
    };
  }, [context?.isOpen]);

  return (
    <Material
      ref={menuRef}
      type="menu"
      className={clsx(
        "absolute w-full z-50 left-1/2 -translate-x-1/2",
        context?.isOpen && "opacity-100",
        !context?.isOpen && "opacity-0 pointer-events-none duration-200"
      )}
      style={{ maxWidth, ...position }}
    >
      <ul className="p-2">
        {filteredChildren.length > 0 ? filteredChildren : (
          <li className={clsx(
            "flex justify-center items-center p-2 text-gray-900",
            context?.size === "large" ? "text-base" : "text-sm"
          )}>
            {emptyMessage}
          </li>
        )}
      </ul>
    </Material>
  );
};

interface ComboboxOptionProps {
  value: string;
  children: React.ReactNode;
}

const ComboboxOption = ({ value, children }: ComboboxOptionProps) => {
  const context = useContext(ComboboxContext);

  const onClick = () => {
    context?.onChangeValue(value);
    context?.onChangeInputValue(children?.toString() || "");
    context?.setIsOpen(false);
  };

  return (
    <li
      className={clsx(
        "flex justify-between items-center gap-2 cursor-pointer px-2 py-2.5 w-full rounded-md hover:bg-gray-alpha-100 active:bg-gray-alpha-100 font-sans text-gray-1000 fill-gray-1000",
        context?.size === "large" ? "text-base" : "text-sm"
      )}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {children}
      {value === context?.value && <CheckIcon />}
    </li>
  );
};

Combobox.Input = ComboboxInput;
Combobox.List = ComboboxList;
Combobox.Option = ComboboxOption;
