import React, { useState, ReactNode, createContext, useContext, useRef } from "react";
import clsx from "clsx";
import { Material } from "@/components/ui/material-1";
import { useClickOutside } from "@/components/ui/use-click-outside";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

const ContextMenuContext = createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  position: { x: number, y: number };
  setPosition: React.Dispatch<React.SetStateAction<{ x: number, y: number }>>;
  handleContextMenu: (event: React.MouseEvent) => void;
} | null>(null);

type ContextMenuProps = {
  children: ReactNode;
};

type ContextMenuTriggerProps = {
  children: ReactNode;
};

type ContextMenuContentProps = {
  children: ReactNode;
};

type ContextMenuItemProps = {
  onClick?: (value?: string) => void;
  value: string;
  disabled?: boolean;
  children: ReactNode;
  href?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
};

const ContextMenu = ({ children }: ContextMenuProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    if (containerRef.current) {
      const { left, top } = containerRef.current.getBoundingClientRect();
      setPosition({
        x: event.clientX - left,
        y: event.clientY - top
      });
      setIsOpen(true);
    }
  };

  return (
    <ContextMenuContext.Provider value={{ isOpen, setIsOpen, position, setPosition, handleContextMenu }}>
      <div className="relative w-fit" ref={containerRef}>{children}</div>
    </ContextMenuContext.Provider>
  );
};

const ContextMenuTrigger = ({ children }: ContextMenuTriggerProps) => {
  const context = useContext(ContextMenuContext);

  return (
    <div onContextMenu={context?.handleContextMenu}>
      {children}
    </div>
  );
};

const ContextMenuContent = ({ children }: ContextMenuContentProps) => {
  const context = useContext(ContextMenuContext);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => context?.setIsOpen(false));

  return (
    <Material
      type="menu"
      className={clsx(
        "absolute z-50 w-40",
        context?.isOpen && "opacity-100",
        !context?.isOpen && "opacity-0 pointer-events-none duration-200"
      )}
      style={{ top: context?.position.y, left: context?.position.x }}
      ref={ref}
    >
      <ul className="p-2">
        {children}
      </ul>
    </Material>
  );
};

const ContextMenuItem = ({ onClick, value, disabled, children, href, prefix, suffix }: ContextMenuItemProps) => {
  const context = useContext(ContextMenuContext);

  const _onClick = () => {
    context?.setIsOpen(false);
    if (onClick) {
      onClick(value);
    }
  };

  if (href) {
    return (
      <Link
        className={twMerge(clsx(
          "!no-underline flex items-center gap-2 cursor-pointer px-2 py-2.5 w-full rounded-md hover:bg-gray-alpha-100 active:bg-gray-alpha-100 font-sans text-sm !text-gray-1000 !fill-gray-1000",
          disabled && "!text-gray-700 !fill-gray-700 cursor-default pointer-events-none"
        ))}
        onMouseDown={(e) => e.preventDefault()}
        onClick={_onClick}
        href={href}
      >
        {prefix}
        {children}
        {suffix && <span className="ml-auto">{suffix}</span>}
      </Link>
    );
  }

  return (
    <li
      className={twMerge(clsx(
        "flex items-center gap-2 cursor-pointer px-2 py-2.5 w-full rounded-md hover:bg-gray-alpha-100 active:bg-gray-alpha-100 font-sans text-sm text-gray-1000 fill-gray-1000",
        disabled && "text-gray-700 fill-gray-700 cursor-default pointer-events-none"
      ))}
      onMouseDown={(e) => e.preventDefault()}
      onClick={_onClick}
    >
      {children}
    </li>
  );
};

ContextMenu.Trigger = ContextMenuTrigger;
ContextMenu.Content = ContextMenuContent;
ContextMenu.Item = ContextMenuItem;

export { ContextMenu };
