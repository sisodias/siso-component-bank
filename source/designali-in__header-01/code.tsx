"use client"; 
import { Equal, X, Moon, Sun } from "@aliimam/icons";
import * as React from "react"; 
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";   
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const menuItems = [
  { name: "About", href: "#" },
  { name: "Components", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "Contact", href: "#" },
];

const Header = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 4);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    
      <header>
        <nav
          data-state={menuState && "active"}
          className={cn(
            "fixed z-50 w-full px-3 md:px-4 transition-colors duration-300",
            isScrolled ? "border-transparent" : "border-b"
          )}
        >
          <div
            className={cn(
              "mx-auto mt-2 transition-all duration-300",
              isScrolled &&
                "bg-[oklch(0.141 0.005 285.823)]/50 max-w-5xl rounded-2xl border backdrop-blur-xl px-3"
            )}
          >
            <div className="relative flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="flex w-full justify-between lg:w-auto">
                <a
                  href="#"
                  aria-label="home"
                  className="flex gap-2 items-center"
                >
                  <img
                    src="https://raw.githubusercontent.com/aliimam-in/aliimam/refs/heads/main/apps/www/public/brand/ai-logo-white.png"
                    alt="Your Image"
                    height={50}
                    width={50}
                    className="h-10 z-10 w-full hidden dark:block object-contain"
                  />
                  <img
                    src="https://raw.githubusercontent.com/aliimam-in/aliimam/refs/heads/main/apps/www/public/brand/ai-logo-black.png"
                    alt="Your Image"
                    height={50}
                    width={50}
                    className="h-10 z-10 w-full dark:hidden block object-contain"
                  />
                </a>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMenuState(!menuState)}
                    aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                    className="relative z-20 pr-4 block cursor-pointer p-2.5 lg:hidden"
                  >
                    <Equal className="in-data-[state=active]:rotate-180 scale-120 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto duration-200" />
                    <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-120 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                  </button>
                </div>
              </div>

              <div className="absolute inset-0 m-auto hidden lg:block size-fit">
                <Menus />
              </div>

              <div className="in-data-[state=active]:block border backdrop-blur-2xl lg:in-data-[state=active]:flex hidden w-full flex-wrap items-center justify-end space-y-8 rounded-sm p-3 shadow-3xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                <div className="lg:hidden block p-3">
                  <ul className="space-y-6 text-base">
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        <a
                          href={item.href}
                          className="text-muted-foreground hover:text-primary text-sm block duration-150"
                        >
                          <span>{item.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-2 sm:space-y-0">
                  <ModeToggle />
                  <Button
                    variant={"secondary"}
                    asChild
                    className={cn(isScrolled && "lg:hidden")}
                  >
                    <a
                      target="_blank"
                      href="https://cal.com/aliimam-in/30min"
                    >
                      <span>Book an Intro call</span>
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    
  );
};

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Docs",
    href: "#",
    description:
      "Explore our comprehensive UI design and components docs, empowering integration.",
  },  
  {
    title: "Colors",
    href: "#",
    description:
      "Vibrant, accessible color palette for intuitive, seamless UI design and components.",
  },  
  {
    title: "Blocks",
    href: "#",
    description: "Modular, flexible UI blocks for intuitive, seamless design and robust functionality.",
  },
  {
    title: "UI",
    href: "#",
    description:
      "Stunning UI component showcase for inspiring, seamless design exploration.",
  },
  {
    title: "Blogs",
    href: "#",
    description:
      "Engaging UI design blogs with insights for seamless component integration.",
  },
  {
    title: "Contact",
    href: "#",
    description:
      "Get in touch for UI design inquiries, support, and seamless collaboration opportunities.",
  },
];
export function Menus() {
  return (
    <NavigationMenu viewport={true}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(navigationMenuTriggerStyle(), "bg-transparent text-xs")}
          >
            <a href="#">About</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(navigationMenuTriggerStyle(), "bg-transparent text-xs")}
          >
            <a href="#">Templates</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(navigationMenuTriggerStyle(), "bg-transparent text-xs")}
          >
            <a href="#">Blocks</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-xs">
            Resources
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-2">
            <ul className="grid gap-3 md:grid-cols-3 max-w-xl lg:w-3xl">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(navigationMenuTriggerStyle(), "bg-transparent text-xs")}
          >
            <a href="#">Icons</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(navigationMenuTriggerStyle(), "bg-transparent text-xs")}
          >
            <a href="#">Components</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <a className="p-3" href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-xs leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
}

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <div className="flex flex-col justify-center">
      <div>
        <Toggle
          className="group bg-secondary dark:bg-secondary data-[state=on]:hover:bg-muted cursor-pointer size-9 data-[state=on]:bg-transparent"
          pressed={theme === "dark"}
          onPressedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <Moon
            size={16}
            className="shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
            aria-hidden="true"
          />
          <Sun
            size={16}
            className="absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
            aria-hidden="true"
          />
        </Toggle>
      </div>
    </div>
  );
}

export { Header };

