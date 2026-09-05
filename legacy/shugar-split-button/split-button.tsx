import React from "react";
import { Button, ButtonProps } from "./button-1";
import clsx from "clsx";
import { Menu, MenuButton, MenuContainer, MenuItem, TMenuPosition } from "./menu";

interface MenuProps {
  width?: number;
}

interface SplitButtonProps {
  buttonProps?: ButtonProps;
  menuAlignment?: TMenuPosition;
  menuButtonLabel?: string;
  menuItems?: React.ReactNode;
  menuProps?: MenuProps;
  children?: React.ReactNode;
}

const ArrowBottom = () => (
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

export const SplitButton = ({
  buttonProps,
  menuAlignment,
  menuButtonLabel,
  menuItems,
  menuProps,
  children
}: SplitButtonProps) => {
  return (
    <MenuContainer position={menuAlignment}>
      <Button
        className="rounded-r-none border-r-0 float-left focus:shadow-none"
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          buttonProps?.onClick && buttonProps?.onClick(event);
        }}
        {...buttonProps}
      >
        {children}
      </Button>
      <MenuButton
        aria-label={menuButtonLabel}
        svgOnly
        variant={buttonProps?.variant}
        type={buttonProps?.type}
        size={buttonProps?.size}
        shadow={buttonProps?.shadow}
        className={clsx(
          "rounded-l-none focus:shadow-none",
          buttonProps?.type === "secondary" && "border-l-gray-300",
          (buttonProps?.type === "error" || buttonProps?.type === "warning") && "border-l border-l-gray-300",
          (buttonProps?.type === "primary" || buttonProps?.type === undefined) && "border-l border-l-[#404040] dark:border-[#cdcdcd]"
        )}
      >
        <ArrowBottom />
      </MenuButton>
      <Menu {...menuProps}>
        {menuItems}
      </Menu>
    </MenuContainer>
  );
};

interface MenuItemProps {
  onClick?: () => void;
}

interface SplitButtonMenuItemProps {
  title?: string;
  description?: string;
  menuItemProps?: MenuItemProps;
}

export const SplitButtonMenuItem = ({ title, description, menuItemProps }: SplitButtonMenuItemProps) => {
  return (
    <MenuItem className="h-fit p-2" {...menuItemProps}>
      <span className="flex flex-col">
        <span className="text-gray-1000 text-sm font-medium">{title}</span>
        <span className="text-gray-900 text-sm">{description}</span>
      </span>
    </MenuItem>
  );
};