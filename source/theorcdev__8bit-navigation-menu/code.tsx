"use client";

import * as React from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const navigationMenuVariants = cva("", {
  variants: {
    font: {
      normal: "",
      retro: "retro",
    },
  },
  defaultVariants: {
    font: "retro",
  },
});

type FontVariantProps = VariantProps<typeof navigationMenuVariants>;

const getFontClassName = (font: FontVariantProps["font"]) =>
  navigationMenuVariants({ font });

// Context for managing open state
const NavigationMenuContext = React.createContext<{
  openItem: string | null;
  setOpenItem: (id: string | null) => void;
}>({ openItem: null, setOpenItem: () => {} });

const NavigationMenuItemContext = React.createContext<string>("");

function NavigationMenu({
  className,
  font,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<"nav"> & {
  viewport?: boolean;
} & FontVariantProps) {
  const [openItem, setOpenItem] = React.useState<string | null>(null);

  return (
    <NavigationMenuContext.Provider value={{ openItem, setOpenItem }}>
      <nav
        data-slot="navigation-menu"
        className={cn(
          "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
          getFontClassName(font),
          className
        )}
        onMouseLeave={() => setOpenItem(null)}
        {...props}
      >
        {children}
        {viewport && <NavigationMenuViewport font={font} />}
      </nav>
    </NavigationMenuContext.Provider>
  );
}

function NavigationMenuList({
  className,
  font,
  ...props
}: React.ComponentProps<"ul"> & FontVariantProps) {
  return (
    <ul
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center space-x-1",
        getFontClassName(font),
        className
      )}
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  font,
  children,
  ...props
}: React.ComponentProps<"li"> & FontVariantProps) {
  const id = React.useId();
  return (
    <NavigationMenuItemContext.Provider value={id}>
      <li
        data-slot="navigation-menu-item"
        className={cn("static", getFontClassName(font), className)}
        {...props}
      >
        {children}
      </li>
    </NavigationMenuItemContext.Provider>
  );
}

function NavigationMenuTrigger({
  className,
  font,
  children,
  ...props
}: React.ComponentProps<"button"> & FontVariantProps) {
  const { openItem, setOpenItem } = React.useContext(NavigationMenuContext);
  const itemId = React.useContext(NavigationMenuItemContext);
  const isOpen = openItem === itemId;

  return (
    <button
      data-slot="navigation-menu-trigger"
      aria-expanded={isOpen}
      className={cn(
        "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50",
        getFontClassName(font),
        className
      )}
      onMouseEnter={() => setOpenItem(itemId)}
      onClick={() => setOpenItem(isOpen ? null : itemId)}
      {...props}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          "relative top-[1px] ml-1 size-3 transition-transform duration-300",
          isOpen ? "rotate-180" : ""
        )}
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}

function NavigationMenuContent({
  className,
  font,
  children,
  ...props
}: React.ComponentProps<"div"> & FontVariantProps) {
  const { openItem } = React.useContext(NavigationMenuContext);
  const itemId = React.useContext(NavigationMenuItemContext);
  const isOpen = openItem === itemId;

  if (!isOpen) return null;

  return (
    <div
      data-slot="navigation-menu-content"
      className={cn(
        "absolute top-full left-0 z-50 mt-3 w-auto",
        getFontClassName(font),
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "origin-top-center bg-popover text-popover-foreground relative overflow-hidden rounded-md border shadow p-2",
          "shadow-[6px_0px_0px_0px_var(--foreground),-6px_0px_0px_0px_var(--foreground),0px_-6px_0px_0px_var(--foreground),0px_6px_0px_0px_var(--foreground)]",
          "dark:shadow-[6px_0px_0px_0px_var(--ring),-6px_0px_0px_0px_var(--ring),0px_-6px_0px_0px_var(--ring),0px_6px_0px_0px_var(--ring)]"
        )}
      >
        {children}
      </div>
    </div>
  );
}

function NavigationMenuViewport({
  className,
  font,
  ...props
}: React.ComponentProps<"div"> & FontVariantProps) {
  return (
    <div
      className={cn(
        "absolute top-full left-0 isolate z-50 flex justify-center",
        getFontClassName(font),
        className
      )}
      {...props}
    />
  );
}

function NavigationMenuLink({
  className,
  font,
  asChild: _asChild,
  ...props
}: React.ComponentProps<"a"> & FontVariantProps & { asChild?: boolean }) {
  return (
    <a
      data-slot="navigation-menu-link"
      className={cn(
        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        getFontClassName(font),
        className
      )}
      {...props}
    />
  );
}

function NavigationMenuIndicator({
  className,
  font,
  ...props
}: React.ComponentProps<"div"> & FontVariantProps) {
  const { openItem } = React.useContext(NavigationMenuContext);
  if (!openItem) return null;
  return (
    <div
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        getFontClassName(font),
        className
      )}
      {...props}
    >
      <div className="bg-foreground dark:bg-ring relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
    </div>
  );
}

export function navigationMenuTriggerStyle() {
  return "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 retro";
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
};

export default NavigationMenu;
