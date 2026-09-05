/* eslint-disable @next/next/no-img-element */
"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import {
  ArrowUpRightIcon,
  PaletteIcon,
  FilePlus2Icon,
  LayoutTemplateIcon,
  SearchIcon,
  PenToolIcon,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./command";
import { ShoppingBag, Equal } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "./sheet"; 

const Header = () => {
  return (
    <header className="sticky top-0 h-12 flex justify-center w-full bg-foreground">
      <div className="w-full max-w-4xl flex justify-center gap-6">
        <div className="flex w-full items-center justify-between">
          <a
            href="#"
            aria-label="home"
            className="flex gap-2 px-6 whitespace-nowrap items-center"
          >
            <img
              src="https://raw.githubusercontent.com/aliimam-in/aliimam/refs/heads/main/apps/www/public/brand/ai-logo-white.png"
              alt="Design Logo"
              height={50}
              width={50}
              className="h-7 w-7 dark:hidden block object-contain"
            />
            <img
              src="https://raw.githubusercontent.com/aliimam-in/aliimam/refs/heads/main/apps/www/public/brand/ai-logo-black.png"
              alt="Design Logo"
              height={50}
              width={50}
              className="h-7 w-7 hidden dark:block object-contain"
            />
          </a>

          <Menus />
          <Sheet>
            <div className="flex items-center px-2 gap-2">
              <Search />
              <button className="h-9 w-9 text-background hover:text-background/80 relative">
                <ShoppingBag className="h-4 w-4" />
              </button>
              <SheetTrigger asChild>
                <button className="h-9 w-9 text-background hover:text-background/80 lg:hidden">
                  <Equal className="h-5 w-5" />
                </button>
              </SheetTrigger>
            </div>
            <SheetContent
              side="right"
              className="w-[300px] bg-foreground/90 backdrop-blur-lg border-muted-foreground p-0"
            >
              <PhoneMenu />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export function Search() {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  return (
    <>
      <button className="" onClick={() => setOpen(true)}>
        <span className="flex grow items-center">
          <SearchIcon
            className="text-background hover:text-background/80 -ms-1 me-3"
            size={16}
            aria-hidden="true"
          />
        </span>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type to search components, assets, or docs..." />
        <CommandList>
          <CommandEmpty>No matches found.</CommandEmpty>
          <CommandGroup heading="Create">
            <CommandItem>
              <FilePlus2Icon
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>New project</span>
              <CommandShortcut className="justify-center">⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <LayoutTemplateIcon
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>New template</span>
              <CommandShortcut className="justify-center">⌘T</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <PenToolIcon
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>Start design</span>
              <CommandShortcut className="justify-center">⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Navigate">
            <CommandItem>
              <ArrowUpRightIcon
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>Go to workspace</span>
            </CommandItem>
            <CommandItem>
              <ArrowUpRightIcon
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>Go to assets</span>
            </CommandItem>
            <CommandItem>
              <ArrowUpRightIcon
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>Go to documentation</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Themes">
            <CommandItem>
              <PaletteIcon
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>Switch theme</span>
              <CommandShortcut>⌘⇧T</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

interface ChildrenProps {
  children: ReactNode;
}
// Navigation Menu Components
const NavigationMenu: React.FC<ChildrenProps> = ({ children }) => (
  <nav className="relative z-50 flex items-center justify-center">
    {children}
  </nav>
);
const NavigationMenuList: React.FC<ChildrenProps> = ({ children }) => (
  <ul className="flex items-center justify-center space-x-1 list-none">
    {children}
  </ul>
);
interface NavigationMenuItemProps extends ChildrenProps {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}
const NavigationMenuItem: React.FC<NavigationMenuItemProps> = ({
  children,
  onMouseEnter,
  onMouseLeave,
}) => (
  <li onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    {children}
  </li>
);
interface NavigationMenuTriggerProps extends ChildrenProps {
  isActive?: boolean;
}
const NavigationMenuTrigger: React.FC<NavigationMenuTriggerProps> = ({
  children,
  isActive = false,
}) => (
  <button
    className={`inline-flex h-10 items-center justify-center px-4 py-2 text-xs transition-colors focus:outline-none ${
      isActive ? "text-background" : "text-background/90 hover:text-background"
    }`}
  >
    {children}
  </button>
);
interface NavigationMenuContentProps extends ChildrenProps {
  isOpen?: boolean;
}
const NavigationMenuContent: React.FC<NavigationMenuContentProps> = ({
  children,
  isOpen = false,
}) => {
  const [visible, setVisible] = useState(isOpen);
  useEffect(() => {
    if (isOpen) {
      setVisible(true); // mount immediately
    } else {
      // delay unmount until after fade-out
      const timeout = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);
  if (!visible) return null;
  return (
   <div
      className={`fixed left-0 right-0 top-12 z-40 w-screen bg-foreground
        transform transition-all duration-800 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}
      `}
    >
      <div className="w-full max-w-4xl mx-auto px-8 py-12">{children}</div>
    </div>
  );
};

const PhoneMenu = () => {
  const mainNav = [
    {
      title: "Products",
      items: [
        { label: "New Arrivals", href: "#" },
        { label: "Best Sellers", href: "#" },
        { label: "Trending Now", href: "#" },
        { label: "Gift Ideas", href: "#" },
      ],
    },
    {
      title: "Services",
      items: [
        { label: "Consulting", href: "#" },
        { label: "Custom Solutions", href: "#" },
        { label: "Training & Support", href: "#" },
        { label: "Maintenance Plans", href: "#" },
      ],
    },
    {
      title: "Company",
      items: [
        { label: "About Us", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Press", href: "#" },
        { label: "Partners", href: "#" },
      ],
    },
    {
      title: "Resources",
      items: [
        { label: "Blog", href: "#" },
        { label: "Guides & Tutorials", href: "#" },
        { label: "Webinars", href: "#" },
        { label: "Documentation", href: "#" },
      ],
    },
    {
      title: "Support",
      items: [
        { label: "Help Center", href: "#" },
        { label: "Contact Support", href: "#" },
        { label: "FAQ", href: "#" },
        { label: "Community Forums", href: "#" },
      ],
    },
    {
      title: "Legal",
      items: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
      ],
    },
    {
      title: "Locations",
      items: [
        { label: "Find a Store", href: "#" },
        { label: "International Offices", href: "#" },
        { label: "Events", href: "#" },
      ],
    },
    {
      title: "Contact",
      items: [
        { label: "Email Us", href: "#" },
        { label: "Request a Call", href: "#" },
        { label: "Live Chat", href: "#" },
      ],
    },
    {
      title: "Community",
      items: [
        { label: "Forums", href: "#" },
        { label: "Ambassadors", href: "#" },
        { label: "User Stories", href: "#" },
      ],
    },
    {
      title: "Extras",
      items: [
        { label: "Gift Cards", href: "#" },
        { label: "Promotions", href: "#" },
        { label: "Newsletter", href: "#" },
      ],
    },
  ];
  return (
    <nav className="flex flex-col py-6">
      {mainNav.map((item) => (
        <div key={item.title} className="border-b border-white/10">
          <button className="w-full px-6 py-3 text-left text-white text-sm hover:bg-white/5 transition-colors">
            {item.title}
          </button>
        </div>
      ))}
    </nav>
  );
};

export function Menus() {
  type MenuName =
    | "design"
    | "dev"
    | "learning"
    | "community"
    | "resources"
    | "tools"
    | "services"
    | "company"
    | null;
  const [activeMenu, setActiveMenu] = useState<MenuName>(null);
  const handleMouseEnter = (menuName: MenuName) => setActiveMenu(menuName);
  const handleMouseLeave = () => setActiveMenu(null);
  return (
    <div className="hidden md:block">
      <NavigationMenu>
        <NavigationMenuList>
          {/* 1. Design */}
          <NavigationMenuItem
            onMouseEnter={() => handleMouseEnter("design")}
            onMouseLeave={handleMouseLeave}
          >
            <NavigationMenuTrigger isActive={activeMenu === "design"}>
              Design
            </NavigationMenuTrigger>
            <NavigationMenuContent isOpen={activeMenu === "design"}>
              <ul className="grid grid-cols-1 md:grid-cols-5 gap-6 w-full">
                <li>
                  <a href="#" className="block group">
                    <div className="mb-3 text-xl font-semibold hover:text-background text-background/80">
                      UI/UX
                    </div>
                  </a>
                  <a href="#" className="block group">
                    <div className="mb-3 text-xl font-semibold hover:text-background text-background/80">
                      Branding
                    </div>
                  </a>
                  <a href="#" className="block group">
                    <div className="mb-3 text-xl font-semibold hover:text-background text-background/80">
                      Prototypes
                    </div>
                  </a>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {/* 2. Development */}
          <NavigationMenuItem
            onMouseEnter={() => handleMouseEnter("dev")}
            onMouseLeave={handleMouseLeave}
          >
            <NavigationMenuTrigger isActive={activeMenu === "dev"}>
              Development
            </NavigationMenuTrigger>
            <NavigationMenuContent isOpen={activeMenu === "dev"}>
              <ul className="grid grid-cols-1 md:grid-cols-5 gap-6 w-full">
                <li>
                  <a href="#" className="block group">
                    <div className="mb-3 text-xl font-semibold hover:text-background text-background/80">
                      Frontend
                    </div>
                  </a>
                  <a href="#" className="block group">
                    <div className="mb-3 text-xl font-semibold hover:text-background text-background/80">
                      Backend
                    </div>
                  </a>
                  <a href="#" className="block group">
                    <div className="mb-3 text-xl font-semibold hover:text-background text-background/80">
                      DevOps
                    </div>
                  </a>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {/* 3. Learning */}
          <NavigationMenuItem
            onMouseEnter={() => handleMouseEnter("learning")}
            onMouseLeave={handleMouseLeave}
          >
            <NavigationMenuTrigger isActive={activeMenu === "learning"}>
              Learning
            </NavigationMenuTrigger>
            <NavigationMenuContent isOpen={activeMenu === "learning"}>
              <ul className="grid grid-cols-1 md:grid-cols-5 gap-6 w-full">
                <li>
                  <a href="#" className="block group">
                    <div className="mb-3 text-xl font-semibold hover:text-background text-background/80">
                      Tutorials
                    </div>
                  </a>
                  <a href="#" className="block group">
                    <div className="mb-3 text-xl font-semibold hover:text-background text-background/80">
                      Courses
                    </div>
                  </a>
                  <a href="#" className="block group">
                    <div className="mb-3 text-xl font-semibold hover:text-background text-background/80">
                      Blogs
                    </div>
                  </a>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {/* 4. Community */}
          <NavigationMenuItem
            onMouseEnter={() => handleMouseEnter("community")}
            onMouseLeave={handleMouseLeave}
          >
            <NavigationMenuTrigger isActive={activeMenu === "community"}>
              Community
            </NavigationMenuTrigger>
            <NavigationMenuContent isOpen={activeMenu === "community"}>
              <ul className="grid grid-cols-1 md:grid-cols-5 gap-6 w-full">
                <li>
                  <a href="#" className="block group">
                    <div className="mb-3 text-xl font-semibold hover:text-background text-background/80">
                      Forums
                    </div>
                  </a>
                  <a href="#" className="block group">
                    <div className="mb-3 text-xl font-semibold hover:text-background text-background/80">
                      Discord
                    </div>
                  </a>
                  <a href="#" className="block group">
                    <div className="mb-3 text-xl font-semibold hover:text-background text-background/80">
                      GitHub
                    </div>
                  </a>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {/* 5. Resources */}
          <NavigationMenuItem
            onMouseEnter={() => handleMouseEnter("resources")}
            onMouseLeave={handleMouseLeave}
          >
            <NavigationMenuTrigger isActive={activeMenu === "resources"}>
              Resources
            </NavigationMenuTrigger>
            <NavigationMenuContent isOpen={activeMenu === "resources"}>
              <ul className="grid grid-cols-1 md:grid-cols-5 gap-6 w-full">
                <li>
                  <a href="#" className="block group">
                    <div className="mb-3 text-xl font-semibold hover:text-background text-background/80">
                      Documentation
                    </div>
                  </a>
                  <a href="#" className="block group">
                    <div className="mb-3 text-xl font-semibold hover:text-background text-background/80">
                      API Reference
                    </div>
                  </a>
                  <a href="#" className="block group">
                    <div className="mb-3 text-xl font-semibold hover:text-background text-background/80">
                      Changelog
                    </div>
                  </a>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {/* 6. Tools */}
          <NavigationMenuItem
            onMouseEnter={() => handleMouseEnter("tools")}
            onMouseLeave={handleMouseLeave}
          >
            <NavigationMenuTrigger isActive={activeMenu === "tools"}>
              Tools
            </NavigationMenuTrigger>
            <NavigationMenuContent isOpen={activeMenu === "tools"}>
              <ul className="grid grid-cols-1 md:grid-cols-5 gap-6 w-full">
                <li>
                  <a href="#" className="block group">
                    <div className="mb-3 text-xl font-semibold hover:text-background text-background/80">
                      Figma
                    </div>
                  </a>
                  <a href="#" className="block group">
                    <div className="mb-3 text-xl font-semibold hover:text-background text-background/80">
                      Sketch
                    </div>
                  </a>
                  <a href="#" className="block group">
                    <div className="mb-3 text-xl font-semibold hover:text-background text-background/80">
                      Photoshop
                    </div>
                  </a>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <div className="hidden lg:flex">
            <NavigationMenuItem
              onMouseEnter={() => handleMouseEnter("services")}
              onMouseLeave={handleMouseLeave}
            >
              <NavigationMenuTrigger isActive={activeMenu === "services"}>
                Services
              </NavigationMenuTrigger>
              <NavigationMenuContent isOpen={activeMenu === "services"}>
                <ul className="grid grid-cols-1 md:grid-cols-5 gap-6 w-full">
                  <li>
                    <a href="#" className="block group">
                      <div className="mb-3 text-xl font-semibold hover:text-background text-background/80">
                        Consulting
                      </div>
                    </a>
                    <a href="#" className="block group">
                      <div className="mb-3 text-xl font-semibold hover:text-background text-background/80">
                        Workshops
                      </div>
                    </a>
                    <a href="#" className="block group">
                      <div className="mb-3 text-xl font-semibold hover:text-background text-background/80">
                        Support
                      </div>
                    </a>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem
              onMouseEnter={() => handleMouseEnter("company")}
              onMouseLeave={handleMouseLeave}
            >
              <NavigationMenuTrigger isActive={activeMenu === "company"}>
                Company
              </NavigationMenuTrigger>
              <NavigationMenuContent isOpen={activeMenu === "company"}>
                <ul className="grid grid-cols-1 md:grid-cols-5 gap-6 w-full">
                  <li>
                    <a href="#" className="block group">
                      <div className="mb-3 text-xl font-semibold hover:text-background text-background/80">
                        About Us
                      </div>
                    </a>
                    <a href="#" className="block group">
                      <div className="mb-3 text-xl font-semibold hover:text-background text-background/80">
                        Careers
                      </div>
                    </a>
                    <a href="#" className="block group">
                      <div className="mb-3 text-xl font-semibold hover:text-background text-background/80">
                        Contact
                      </div>
                    </a>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
 
export { Header };
