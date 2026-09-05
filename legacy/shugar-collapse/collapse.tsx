import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";

interface CollapseProps {
  size?: "small" | "large";
  title: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

interface CollapseGroupProps {
  multiple?: boolean;
  children: React.ReactNode;
}

const ArrowIcon = () => (
  <svg
    height="16"
    strokeLinejoin="round"
    viewBox="0 0 16 16"
    width="16"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.0607 5.49999L13.5303 6.03032L8.7071 10.8535C8.31658 11.2441 7.68341 11.2441 7.29289 10.8535L2.46966 6.03032L1.93933 5.49999L2.99999 4.43933L3.53032 4.96966L7.99999 9.43933L12.4697 4.96966L13 4.43933L14.0607 5.49999Z"
    />
  </svg>
);

const Collapse = ({ size = "large", title, children, defaultExpanded, isOpen, onToggle, className }: CollapseProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [_isOpen, set_isOpen] = useState<boolean>(defaultExpanded || false);

  useEffect(() => {
    if (isOpen !== undefined) {
      set_isOpen(isOpen);
    }
  }, [isOpen]);

  return (
    <div className={clsx("text-left border-y border-accents-2 overflow-hidden font-sans", className)}>
      <h3 className={clsx("text-gray-1000", size === "small" ? "text-base font-medium" : "text-2xl font-semibold")}>
        <button
          onClick={onToggle && isOpen !== undefined ? onToggle : () => set_isOpen(!_isOpen)}
          className="cursor-pointer w-full transition"
        >
          <span className={clsx("flex justify-between items-center w-full", size === "small" ? "py-3" : "py-6")}>
            {title}
            <span className={clsx("fill-gray-1000 flex duration-200", _isOpen && "rotate-180")}>
              <ArrowIcon />
            </span>
          </span>
        </button>
      </h3>
      <div
        ref={contentRef}
        className="transition-all ease-in-out duration-200 overflow-hidden"
        style={{ maxHeight: _isOpen ? `${contentRef?.current?.scrollHeight}px` : 0 }}
      >
        <div>{children}</div>
      </div>
    </div>
  );
};

const CollapseGroup = ({ multiple = false, children }: CollapseGroupProps) => {
  const collapses = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<CollapseProps> =>
      React.isValidElement(child) && "props" in child
  );

  const [openStates, setOpenStates] = useState(() =>
    collapses.map((child) => child.props.defaultExpanded || false)
  );

  const handleToggle = (index: number) => {
    setOpenStates((prev) =>
      multiple
        ? prev.map((state, i) => (i === index ? !state : state))
        : prev.map((state, i) => (i === index ? !state : false))
    );
  };

  return (
    <div className="border-t border-accents-2">
      {collapses.map((child, index) =>
        React.cloneElement(child, {
          isOpen: openStates[index],
          onToggle: () => handleToggle(index),
          className: "border-t-0"
        })
      )}
    </div>
  );
};

export { CollapseGroup, Collapse };
