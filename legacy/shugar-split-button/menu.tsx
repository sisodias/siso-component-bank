import React, { useState, useRef, useEffect, Ref, RefObject, createContext, useContext } from "react";
import { Button, ButtonProps } from "./button-1";
import { useClickOutside } from "./use-click-outside";
import clsx from "clsx";
import { Portal } from "@reach/portal";

const MenuContext = createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
} | null>(null);

export type TMenuPosition =
  "left-start"
  | "left-end"
  | "right-start"
  | "right-end"
  | "top-start"
  | "top-end"
  | "bottom-start"
  | "bottom-end";

export const MenuContainer = ({ children, position = "bottom-start" }: {
  children: React.ReactNode,
  position?: TMenuPosition
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const onMenuButtonClick = () => setOpen(!open);

  useClickOutside(containerRef, () => setOpen(false));

  return (
    <MenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block" ref={containerRef}>
        {React.Children.toArray(children).map((child) =>
          // @ts-ignore
          React.cloneElement(child as React.ReactElement, { open, onMenuButtonClick, buttonRef, position })
        )}
      </div>
    </MenuContext.Provider>
  );
};

export const MenuButton = ({ ...rest }: ButtonProps) => {
  return (
    <Button
      ref={"buttonRef" in rest ? (rest.buttonRef as Ref<HTMLButtonElement>) : undefined}
      onClick={"onMenuButtonClick" in rest ? (rest.onMenuButtonClick as (() => void)) : undefined}
      {...rest}
    >
      {rest.children}
    </Button>
  );
};

export const Menu = ({ children, width = 150, ...rest }: { children: React.ReactNode; width?: number }) => {
  const [position, setPosition] = useState<{ top?: number, right?: number, bottom?: number, left?: number }>();
  const menuRef = useRef<HTMLUListElement>(null);
  const buttonRef = "buttonRef" in rest ? (rest.buttonRef as RefObject<HTMLButtonElement>) : undefined;
  const open = "open" in rest ? rest.open : false;
  const defaultPosition = "position" in rest ? rest.position as TMenuPosition : "bottom-start";

  useEffect(() => {
    const getPosition = () => {
      if (open && buttonRef && buttonRef.current && menuRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const menuHeight = menuRef.current.offsetHeight;
        const menuWidth = menuRef.current.offsetWidth;
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const [side, align] = defaultPosition.split("-");
        let _position = {};

        switch (side) {
          case "top":
            if (buttonRect.top - menuHeight >= 0) {
              _position = { top: window.scrollY + buttonRect.top - menuHeight - 8 };
            } else if (buttonRect.bottom + menuHeight <= viewportHeight) {
              _position = { top: window.scrollY + buttonRect.top + buttonRect.height + 8 };
            } else {
              _position = { top: window.scrollY + buttonRect.top - menuHeight - 8 };
            }
            if (align === "start") {
              if (buttonRect.left + menuWidth <= viewportWidth) {
                _position = { ..._position, left: window.scrollX + buttonRect.left };
              } else {
                _position = { ..._position, left: window.scrollX + buttonRect.right - menuWidth };
              }
            } else {
              if (buttonRect.right - menuWidth >= 0) {
                _position = { ..._position, left: window.scrollX + buttonRect.right - menuWidth };
              } else {
                _position = { ..._position, left: window.scrollX + buttonRect.left };
              }
            }
            break;
          case "bottom":
            if (buttonRect.bottom + menuHeight <= viewportHeight) {
              _position = { top: window.scrollY + buttonRect.top + buttonRect.height + 8 };
            } else if (buttonRect.top - menuHeight >= 0) {
              _position = { top: window.scrollY + buttonRect.top - menuHeight - 8 };
            } else {
              _position = { top: window.scrollY + buttonRect.top + buttonRect.height + 8 };
            }
            if (align === "start") {
              if (buttonRect.left + menuWidth <= viewportWidth) {
                _position = { ..._position, left: window.scrollX + buttonRect.left };
              } else {
                _position = { ..._position, left: window.scrollX + buttonRect.right - menuWidth };
              }
            } else {
              if (buttonRect.right - menuWidth >= 0) {
                _position = { ..._position, left: window.scrollX + buttonRect.right - menuWidth };
              } else {
                _position = { ..._position, left: window.scrollX + buttonRect.left };
              }
            }
            break;
          case "left":
            if (buttonRect.left - menuWidth >= 0) {
              _position = { left: window.scrollX + buttonRect.left - menuWidth - 8 };
            } else {
              _position = { left: window.scrollX + buttonRect.width + 8 };
            }
            if (align === "start") {
              if (buttonRect.bottom + menuHeight <= viewportHeight) {
                _position = { ..._position, top: window.scrollY + buttonRect.top };
              } else if (buttonRect.top - menuHeight >= 0) {
                _position = { ..._position, top: window.scrollY + buttonRect.top + buttonRect.height - menuHeight };
              } else {
                _position = { ..._position, top: window.scrollY + buttonRect.top };
              }
            } else {
              if (buttonRect.top - menuHeight >= 0) {
                _position = { ..._position, top: window.scrollY + buttonRect.top + buttonRect.height - menuHeight };
              } else if (buttonRect.bottom + menuHeight <= viewportHeight) {
                _position = { ..._position, top: window.scrollY + buttonRect.top };
              } else {
                _position = { ..._position, top: window.scrollY + buttonRect.top + buttonRect.height - menuHeight };
              }
            }
            break;
          case "right":
            if (buttonRect.right + menuWidth <= viewportWidth) {
              _position = { left: window.scrollX + buttonRect.right + 8 };
            } else {
              _position = { left: window.scrollX + buttonRect.left - menuWidth - 8 };
            }
            if (align === "start") {
              if (buttonRect.bottom + menuHeight <= viewportHeight) {
                _position = { ..._position, top: window.scrollY + buttonRect.top };
              } else if (buttonRect.top - menuHeight >= 0) {
                _position = { ..._position, top: window.scrollY + buttonRect.top + buttonRect.height - menuHeight };
              } else {
                _position = { ..._position, top: window.scrollY + buttonRect.top };
              }
            } else {
              if (buttonRect.top - menuHeight >= 0) {
                _position = { ..._position, top: window.scrollY + buttonRect.top + buttonRect.height - menuHeight };
              } else if (buttonRect.bottom + menuHeight <= viewportHeight) {
                _position = { ..._position, top: window.scrollY + buttonRect.top };
              } else {
                _position = { ..._position, top: window.scrollY + buttonRect.top + buttonRect.height - menuHeight };
              }
            }
            break;
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
  }, [open]);

  return (
    <Portal>
      <ul
        ref={menuRef}
        className={clsx(
          "absolute z-50 m-0 p-2 shadow-menu bg-background-100 rounded-xl text-sm overflow-x-hidden grow-0 transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none duration-200"
        )}
        style={{ width, ...position }}
      >
        {children}
      </ul>
    </Portal>
  );
};

export const MenuItem = ({
  children,
  onClick,
  type = "default",
  disabled = false,
  prefix,
  suffix,
  className
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "error" | "default";
  disabled?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  className?: string;
}) => {
  const context = useContext(MenuContext);
  const _onClick = () => {
    onClick && onClick();
    context?.setOpen(false);
  };

  return (
    <li
      className={clsx(
        "flex items-center gap-2 cursor-pointer h-10 w-full px-2 rounded-md hover:bg-gray-alpha-100 active:bg-gray-alpha-100 font-sans",
        type === "error" && disabled && "text-red-600 fill-red-600 cursor-default pointer-events-none",
        type === "error" && !disabled && "text-red-900 fill-red-900",
        type === "default" && disabled && "text-gray-700 fill-gray-700 cursor-default pointer-events-none",
        type === "default" && !disabled && "text-gray-1000 fill-gray-1000",
        className
      )}
      onClick={_onClick}
    >
      {prefix}
      {children}
      {suffix && <span className="ml-auto">{suffix}</span>}
    </li>
  );
};

export const MenuLink = ({ children, href }: {
  children: React.ReactNode;
  href: string;
}) => {
  const context = useContext(MenuContext);

  return (
    <li
      className="flex items-center cursor-pointer h-10 w-full px-2 rounded-md hover:bg-gray-alpha-100 active:bg-gray-alpha-100 font-sans">
      <a
        className="text-gray-1000 h-full w-full flex items-center hover:no-underline"
        href={href}
        onClick={() => context?.setOpen(false)}
      >
        {children}
      </a>
    </li>
  );
};